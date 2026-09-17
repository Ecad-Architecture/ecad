import {
  ContactEmailConfigurationError,
  ContactEmailDeliveryError,
  sendContactEmail,
} from "@/lib/contact/sendContactEmail.server";
import { MAX_REQUEST_BYTES } from "@/lib/contact/constants";
import type { ContactApiResponse } from "@/lib/contact/types";
import { validateContactForm } from "@/lib/contact/validation";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MINIMUM_FORM_FILL_MS = 800;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// This limits bursts within a single application instance. Production should
// additionally enforce a durable limit at the hosting edge/WAF.
const rateLimitEntries = new Map<string, RateLimitEntry>();

function json(body: ContactApiResponse, status: number, extraHeaders?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(identifier: string) {
  const now = Date.now();

  if (rateLimitEntries.size > 1_000) {
    for (const [key, entry] of rateLimitEntries) {
      if (entry.resetAt <= now) {
        rateLimitEntries.delete(key);
      }
    }
  }

  const existing = rateLimitEntries.get(identifier);
  if (!existing || existing.resetAt <= now) {
    rateLimitEntries.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  existing.count += 1;
  if (existing.count <= RATE_LIMIT_MAX_REQUESTS) {
    return null;
  }

  return Math.max(1, Math.ceil((existing.resetAt - now) / 1_000));
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json(
      { ok: false, code: "VALIDATION_ERROR", message: "Invalid request origin." },
      403,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "The contact form request is invalid.",
      },
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "The attachments are too large to submit.",
      },
      413,
    );
  }

  const retryAfter = checkRateLimit(getClientIdentifier(request));
  if (retryAfter) {
    return json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many submissions. Please wait a few minutes and try again.",
      },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "The contact form request could not be read.",
      },
      400,
    );
  }

  // Return success for obvious bots so the endpoint does not teach them how
  // the trap works, while avoiding an outbound email.
  if (String(formData.get("website") ?? "").trim()) {
    return json({ ok: true }, 200);
  }

  const startedAt = Number(formData.get("formStartedAt"));
  if (
    Number.isFinite(startedAt) &&
    startedAt > 0 &&
    Date.now() - startedAt < MINIMUM_FORM_FILL_MS
  ) {
    return json({ ok: true }, 200);
  }

  const validation = validateContactForm(formData);
  if (!validation.success) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Please review the highlighted form details.",
        fieldErrors: validation.fieldErrors,
      },
      400,
    );
  }

  try {
    await sendContactEmail(validation.data);
    return json({ ok: true }, 200);
  } catch (error) {
    if (error instanceof ContactEmailConfigurationError) {
      console.error("[contact] Email delivery is not configured.");
      return json(
        {
          ok: false,
          code: "CONFIGURATION_ERROR",
          message: "Email delivery is temporarily unavailable. Please contact ECAD directly.",
        },
        503,
      );
    }

    if (error instanceof ContactEmailDeliveryError) {
      console.error("[contact] Sendlib delivery failed.", { status: error.status });

      if (error.status === 429) {
        return json(
          {
            ok: false,
            code: "RATE_LIMITED",
            message: "Email delivery is busy right now. Please wait and try again.",
          },
          429,
        );
      }
    } else {
      console.error("[contact] Unexpected email delivery failure.");
    }

    return json(
      {
        ok: false,
        code: "DELIVERY_FAILED",
        message: "We couldn't send your message right now. Please try again.",
      },
      502,
    );
  }
}
