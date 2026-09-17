import "server-only";

import { render, toPlainText } from "react-email";

import PracticeApplicationEmail from "@/emails/PracticeApplicationEmail";
import ProjectEnquiryEmail from "@/emails/ProjectEnquiryEmail";
import type { ContactSubmission } from "./types";

const SENDLIB_ENDPOINT = "https://sendlib.samueltuoyo.com/api/send";
const SEND_TIMEOUT_MS = 15_000;

interface SendlibAttachment {
  filename: string;
  content: string;
  type: string;
}

export class ContactEmailConfigurationError extends Error {}

export class ContactEmailDeliveryError extends Error {
  constructor(public readonly status: number | null) {
    super("Sendlib could not deliver the contact email.");
  }
}

function readEmailConfiguration() {
  const apiKey = process.env.SENDLIB_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL_TO?.trim();

  if (!apiKey || !from || !to) {
    throw new ContactEmailConfigurationError(
      "The contact email environment variables are incomplete.",
    );
  }

  return { apiKey, from, to };
}

async function encodeAttachments(submission: ContactSubmission) {
  return Promise.all(
    submission.attachments.map<Promise<SendlibAttachment>>(async (attachment) => {
      // Read request-backed Files before doing any template rendering or network
      // work. This prevents sending an email whose body lists an unreadable file.
      const content = Buffer.from(await attachment.file.arrayBuffer());

      if (content.byteLength === 0 || content.byteLength !== attachment.size) {
        throw new ContactEmailDeliveryError(null);
      }

      return {
        filename: attachment.filename,
        content: content.toString("base64"),
        type: attachment.type,
      };
    }),
  );
}

export async function sendContactEmail(submission: ContactSubmission) {
  const { apiKey, from, to } = readEmailConfiguration();
  // Capture multipart file bytes immediately while the incoming request is
  // active; React Email only needs the attachment metadata for its summary.
  const attachments = await encodeAttachments(submission);
  const template =
    submission.formType === "project" ? (
      <ProjectEnquiryEmail {...submission} />
    ) : (
      <PracticeApplicationEmail {...submission} />
    );
  const html = await render(template);
  const text = toPlainText(html);
  const subject =
    submission.formType === "project"
      ? `New project enquiry from ${submission.name}`
      : `New practice application from ${submission.name}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  try {
    const response = await fetch(SENDLIB_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        replyTo: submission.email,
        subject,
        html,
        text,
        ...(attachments.length > 0 ? { attachments } : {}),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ContactEmailDeliveryError(response.status);
    }
  } catch (error) {
    if (error instanceof ContactEmailDeliveryError) {
      throw error;
    }

    throw new ContactEmailDeliveryError(null);
  } finally {
    clearTimeout(timeout);
  }
}
