# ECAD Contact Email Integration Plan

## Goal

Connect the two forms on the ECAD contact page to [Sendlib](https://sendlib.samueltuoyo.com/docs) so that:

- A **Start a Project** submission sends a branded project-enquiry email to ECAD.
- A **Join the Practice** submission sends a branded application email to ECAD.
- The visitor's email address becomes the email's `replyTo` address.
- Uploaded files are processed in the browser, validated again on the server, and forwarded as Sendlib attachments.
- The user receives clear loading, success, error, and attachment-size feedback.
- The Sendlib API key and ECAD recipient address never enter browser code.

The current contact page is [`src/app/contact/page.tsx`](./src/app/contact/page.tsx), but the interactive forms and current no-op submission handler are in [`src/components/contact/ContactForms.tsx`](./src/components/contact/ContactForms.tsx). The page component should remain a Server Component; most of the UI work belongs in `ContactForms.tsx`, with sending handled by a new server-only Route Handler.

## Important sender decision

Sendlib's `from` value must be a Gmail or Google Workspace account that has been connected to Sendlib. The visitor's submitted address must **not** be used as `from`. Instead, use:

| Sendlib field | Value |
| --- | --- |
| `from` | The connected sender: `"ECAD Website" <ecadarchitecture.tech@gmail.com>` |
| `to` | ECAD's configured destination inbox: `tilewa.olatoyee@gmail.com` |
| `replyTo` | The visitor's submitted email address |

This keeps the sender authorized while making the Reply button in ECAD's inbox address the visitor. See [Sendlib Basic Send](https://sendlib.samueltuoyo.com/docs/send) and [Connecting Gmail](https://sendlib.samueltuoyo.com/docs/gmail).

## Assumptions to confirm before implementation

1. `tilewa.olatoyee@gmail.com` is the confirmed destination inbox.
2. `ecadarchitecture.tech@gmail.com` will be connected to Sendlib as the authorized sender.
3. “Minimum of 5” in the request means **a maximum of five attachments**. This matches Sendlib's Free-plan limit. The current forms only expose one project attachment or two practice attachments, but the backend should still enforce the provider-wide maximum of five.
4. The 1 MB rule applies to **each final processed attachment**, not the combined request. For an additional safety margin, compression should target about 900–950 KB and server validation should enforce an exact 1 MB ceiling.
5. This integration sends notifications to ECAD only. An automatic acknowledgement to the visitor is out of scope for the initial version because it would double Sendlib usage and requires separate content and consent decisions.

## Proposed architecture

```text
ContactForms.tsx
    |
    | 1. Validate fields
    | 2. Process selected attachments in the browser
    | 3. Submit multipart/form-data
    v
POST /api/contact
    |
    | 4. Revalidate fields and attachments
    | 5. Render the matching React Email template to HTML + text
    | 6. Convert attachments to base64
    v
POST https://sendlib.samueltuoyo.com/api/send
    |
    v
ECAD inbox
```

The browser must never call Sendlib directly. All Sendlib requests go through the Next.js server endpoint.

## Phase 1: Sendlib account and environment setup

1. Sign in to the Sendlib dashboard.
2. Follow [Sendlib's Gmail connection guide](https://sendlib.samueltuoyo.com/docs/gmail) to authorize the ECAD Google Workspace mailbox.
3. Generate an API key using the [Sendlib API Keys guide](https://sendlib.samueltuoyo.com/docs/keys).
4. Put the values in `apps/web/.env.local` for local development and in the hosting provider's encrypted environment settings for production:

```env
SENDLIB_API_KEY=
CONTACT_EMAIL_FROM="ECAD Website <ecadarchitecture.tech@gmail.com>"
CONTACT_EMAIL_TO=tilewa.olatoyee@gmail.com
```

The API key must not be committed, logged, placed in a `NEXT_PUBLIC_*` variable, or returned in an API response. The repo already ignores `.env*` files.

Sendlib API references:

- [Introduction](https://sendlib.samueltuoyo.com/docs)
- [Quick Start](https://sendlib.samueltuoyo.com/docs/quickstart)
- [API Keys](https://sendlib.samueltuoyo.com/docs/keys)
- [Basic Send](https://sendlib.samueltuoyo.com/docs/send)
- [Limits and Quotas](https://sendlib.samueltuoyo.com/docs/limits)

## Phase 2: Dependencies and file structure

Use the current unified [`react-email`](https://react.email/docs/introduction) package for components and rendering. Current React Email versions export components, `render`, and `toPlainText` from that package; see the [React Email update guide](https://react.email/docs/getting-started/updating-react-email) and [render utility](https://react.email/docs/utilities/render).

Proposed additions:

```text
apps/web/src/
|-- app/api/contact/route.ts
|-- emails/
|   |-- components/ContactEmailLayout.tsx
|   |-- ProjectEnquiryEmail.tsx
|   `-- PracticeApplicationEmail.tsx
|-- lib/contact/
|   |-- constants.ts
|   |-- types.ts
|   |-- validation.ts
|   |-- attachments.client.ts
|   `-- sendContactEmail.server.ts
`-- components/contact/ContactForms.tsx
```

Expected dependency work:

```bash
npm install react-email browser-image-compression
```

- [`react-email`](https://react.email/) builds and renders the email templates.
- [`browser-image-compression`](https://github.com/Donaldcwl/browser-image-compression) can resize and compress JPG, PNG, and WebP uploads before submission.
- Do not add a ZIP library by default. ZIP-wrapping PDFs and DOCX files gives little benefit, makes applications less convenient to review, and can make mail security filters more suspicious of the attachment.

The exact package versions should be locked by `apps/web/package-lock.json` when implementation begins.

## Phase 3: Custom React Email templates

React Email components produce email-compatible markup, and its render utility turns a template into the HTML string required by Sendlib. It can also derive a plain-text fallback. See [React Email integrations](https://react.email/docs/integrations/overview), [rendering HTML and plain text](https://react.email/docs/utilities/render), and the [component documentation](https://react.email/docs/components/html).

### Shared layout: `ContactEmailLayout.tsx`

Create a restrained shared layout containing:

- ECAD wordmark or text header.
- A short inbox preview using React Email's `Preview` component.
- A clear title and submission-type badge.
- Reusable label/value rows.
- A highlighted visitor contact section.
- Submission timestamp.
- A note explaining that Reply will address the visitor.
- A simple ECAD footer.

Use email-safe inline styles and a light HTML structure. Sendlib recommends plain text or light HTML for deliverability, so the email should avoid large imagery, remote background assets, excessive links, and complex promotional styling. See [Sendlib's deliverability guidance](https://sendlib.samueltuoyo.com/docs/send#best-practices-for-deliverability).

### Template 1: `ProjectEnquiryEmail.tsx`

Subject:

```text
Website project enquiry — {visitor name}
```

Preview text:

```text
New project enquiry from {visitor name}
```

Template fields:

- Name
- Email
- Phone
- Organization
- Project type
- Location
- Message
- Attachment names and sizes
- Submission timestamp

The template should visually prioritize project type, organization, location, and the visitor's reply details.

### Template 2: `PracticeApplicationEmail.tsx`

Subject:

```text
Website practice application — {visitor name}
```

Preview text:

```text
New practice application from {visitor name}
```

Template fields:

- Name
- Email
- Phone
- Discipline
- Position
- Location
- Message
- Portfolio filename and size
- CV filename and size
- Submission timestamp

The template should visually prioritize discipline, position, portfolio, CV, and the applicant's reply details.

### Rendering flow

The server helper will:

1. Select a template from the validated `formType`; never accept a template path or arbitrary component name from the client.
2. Render it to HTML with `render()`.
3. Produce the plain-text fallback with `toPlainText()`.
4. Pass both `html` and `text` to Sendlib.

Templates must render only already-validated strings. React escapes normal JSX text, but URLs, filenames, and any manually generated markup must still be treated as untrusted input. No `dangerouslySetInnerHTML` should be used.

## Phase 4: Attachment processing and compression

### Can every attachment be compressed?

Every selected file can pass through a client-side **processing pipeline**, but not every supported format can be meaningfully or safely compressed:

- **JPG, PNG, and WebP:** yes. Resize oversized dimensions and use lossy/lossless browser compression to target approximately 900–950 KB.
- **PDF:** sometimes. Many PDFs already contain compressed streams, and dependable browser-side PDF recompression can be CPU-heavy or reduce portfolio quality. Re-saving a PDF does not guarantee a smaller result.
- **DOCX:** usually no meaningful gain. DOCX is already a ZIP-based compressed format.
- **DOC:** reliable in-browser recompression is not practical without transforming the document, which risks changing formatting.

Therefore, the safe plan is:

1. Automatically compress supported image files when selected.
2. Preserve PDF, DOC, and DOCX files as-is.
3. Validate the final result for every file.
4. If any final file is over 1 MB, show an inline warning and block submission until the user replaces or manually reduces it.

This meets the 1 MB Sendlib constraint without silently damaging architectural portfolios or CVs. A later, separately tested PDF-compression feature can be added, but it must still treat the 1 MB result as a validation rule rather than promising that every PDF can be made small enough.

### Browser-side selection flow

When a file is added:

1. Validate the file count, extension, MIME type, and original size.
2. For supported images, run compression in the browser, preferably in a Web Worker when the library supports it.
3. Replace the selected upload in component state with the processed `File` while retaining a display-safe original filename.
4. Show the original and processed sizes when compression changed the file.
5. Validate the processed file against the 1 MB maximum.
6. Keep the submit button disabled while processing or while any file is invalid.
7. Allow the user to remove and replace each attachment.

Compression should happen on file selection, not after the user presses Submit, so validation feedback is immediate.

### User-facing warning and feedback

Display this note beside each upload area before selection:

> Attachments must be 1 MB or less per file. You may attach up to 5 files. Images will be compressed automatically where possible; PDFs and documents may need to be reduced before upload.

For the current UI, also show form-specific accepted formats:

- **Start a Project:** PDF, DOC, DOCX, JPG, PNG, or WebP; currently one file.
- **Join the Practice:** PDF, DOC, or DOCX; one portfolio and one CV.

Suggested attachment states:

- `Preparing attachment…`
- `Compressed from 2.4 MB to 920 KB`
- `Ready — 780 KB`
- `This file is larger than 1 MB. Please reduce it or choose another file.`
- `You can attach no more than 5 files.`

The warning and errors should be associated with the file input through `aria-describedby`, and changing status should be announced through an `aria-live="polite"` region.

### Server-side attachment rules

Client-side processing is only a convenience; the Route Handler remains authoritative. It must enforce:

- Maximum of five attachments per request.
- Maximum of 1 MB per decoded file on the Free plan.
- A conservative total request-size ceiling.
- Form-specific extension and MIME allowlists.
- Non-empty files only.
- Sanitized filenames with path components and control characters removed.
- A MIME-versus-extension consistency check where practical.
- Base64 conversion only after validation.

Sendlib accepts attachment objects containing `filename`, base64 `content`, and an optional MIME `type`. Its current Free limit is five files at 1 MB per file, while Pro allows twenty files at 10 MB per file; Gmail also enforces a total cap. See [Sendlib request payload limits](https://sendlib.samueltuoyo.com/docs/limits#request-payload-limits) and [Sendlib attachment parameters](https://sendlib.samueltuoyo.com/docs/send#request-body-parameters).

## Phase 5: Server endpoint

Create `src/app/api/contact/route.ts` with a `POST` handler that accepts `multipart/form-data`.

Processing order:

1. Reject unsupported content types.
2. Parse `request.formData()`.
3. Check anti-spam fields before expensive attachment work.
4. Normalize and validate `formType`, contact fields, and message lengths.
5. Validate attachment count, size, names, and types again.
6. Render the appropriate React Email template.
7. Convert accepted attachments to Sendlib's base64 structure.
8. Call `https://sendlib.samueltuoyo.com/api/send` with a timeout.
9. Map Sendlib failures to safe application responses.
10. Return a small JSON result.

Example Sendlib request shape:

```json
{
  "from": "ECAD Website <ecadarchitecture.tech@gmail.com>",
  "to": "tilewa.olatoyee@gmail.com",
  "replyTo": "visitor@example.com",
  "subject": "Website project enquiry — Visitor Name",
  "html": "<!doctype html>...",
  "text": "New project enquiry...",
  "attachments": [
    {
      "filename": "project-brief.pdf",
      "content": "BASE64_CONTENT",
      "type": "application/pdf"
    }
  ]
}
```

Authenticate with `Authorization: Bearer ${SENDLIB_API_KEY}` as documented in [Sendlib Basic Send](https://sendlib.samueltuoyo.com/docs/send).

### API response contract

Suggested success response:

```json
{ "ok": true }
```

Suggested validation response:

```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "practice-cv": "The CV must be 1 MB or less."
  }
}
```

Suggested provider failure response:

```json
{
  "ok": false,
  "code": "DELIVERY_FAILED",
  "message": "We couldn't send your message right now. Please try again."
}
```

Do not pass Sendlib's raw response, credentials, internal IDs, or stack traces to the browser.

## Phase 6: Form integration

Update [`src/components/contact/ContactForms.tsx`](./src/components/contact/ContactForms.tsx):

1. Replace `stopSubmission` with an async submit handler.
2. Include the active form type as `formType` in `FormData`.
3. Submit to `/api/contact` without manually setting `Content-Type`; the browser must create the multipart boundary.
4. Track `idle`, `processing-attachments`, `submitting`, `success`, and `error` states.
5. Disable Submit during attachment processing, while invalid attachments exist, and while sending.
6. Prevent double submissions.
7. Render field-specific server errors and a form-level error.
8. Preserve inputs and attachments after failure.
9. Reset inputs and processed-attachment state only after success.
10. Keep the correct form open and focus the success/error message after completion.

Suggested success copy:

> Thank you. Your enquiry has been sent to ECAD Architects. We’ll be in touch.

Suggested temporary failure copy:

> We couldn’t send your message right now. Please try again, or email info@ecadarchitects.com directly.

The Submit button should visibly change to `Sending…` and expose `aria-disabled`/`disabled` while work is in progress.

## Phase 7: Validation rules

### Shared fields

- `name`: required, trimmed, reasonable maximum length.
- `email`: required, normalized, syntactically valid, and safe for use as `replyTo`.
- `phone`: optional, trimmed, reasonable maximum length.
- `location`: optional, trimmed, reasonable maximum length.
- `message`: optional, trimmed, with a defined maximum length.
- Reject header-control characters in values used for email headers.

### Project fields

- `organization`: optional.
- `projectType`: optional.
- `project-file`: optional, one file in the current UI.

### Practice fields

- `discipline`: optional unless ECAD decides it is required.
- `position`: optional unless ECAD decides it is required.
- `practice-portfolio`: optional or required according to ECAD hiring policy.
- `practice-cv`: optional or required according to ECAD hiring policy.

Use one shared validation definition or shared primitives so client messages and server rules do not drift. The server must still perform all checks independently.

## Phase 8: Abuse prevention, security, and resilience

- Add a visually hidden honeypot field that legitimate users leave empty.
- Add a minimum-fill-time signal to cheaply reject obvious automated submissions, without treating it as the only defense.
- Apply a conservative per-IP rate limit at the deployment edge/WAF or through a durable rate-limit store. Do not depend on process memory in a serverless deployment.
- Consider Turnstile or another CAPTCHA only if actual spam warrants it.
- Escape or safely render all visitor content.
- Never use visitor input as `from`, `to`, `cc`, or `bcc`.
- Add a timeout and abort signal to the Sendlib fetch.
- Handle `400`/`401` as configuration or request errors, `429` as temporary throttling, and `5xx`/network errors as temporary delivery failures.
- Do not automatically retry a send in the request handler, because an ambiguous timeout can otherwise create duplicate messages.
- Do not log full messages, email bodies, base64 attachments, or the API key.
- Ensure temporary attachment buffers are request-scoped and are not persisted by the app.
- Add `Cache-Control: no-store` to API responses.

Sendlib currently documents a Free API rate limit of 30 send requests per minute per API key. Free Google Workspace sending is listed as up to 1,000 messages per day and 3,500 per month. These provider limits do not replace protection on ECAD's public endpoint. See [Limits and Quotas](https://sendlib.samueltuoyo.com/docs/limits).

## Phase 9: Testing and verification

### Template tests

- Render both templates with complete data.
- Render both templates with every optional field absent.
- Verify HTML and plain-text outputs are non-empty.
- Verify untrusted text is escaped.
- Preview in Gmail desktop/mobile and at least one Outlook client if available.
- Confirm the designs remain readable with remote images disabled.

### Attachment tests

- Small valid image that needs no compression.
- Oversized image successfully compressed below 1 MB.
- Image that cannot reach the target without unacceptable dimensions/quality and is rejected.
- PDF below and above 1 MB.
- DOC/DOCX below and above 1 MB.
- Empty file.
- Disallowed executable or renamed file.
- More than five files sent directly to the API, bypassing the UI.
- Confirm server size checks cannot be bypassed by modifying client state.

### End-to-end tests

1. Submit both form types without attachments.
2. Submit every accepted attachment type.
3. Confirm the correct template and subject are selected.
4. Confirm every submitted field appears correctly.
5. Confirm attachment names, content, and MIME types survive delivery.
6. Confirm clicking Reply addresses the visitor.
7. Confirm duplicate clicks create only one client request.
8. Confirm validation, Sendlib authentication failure, throttling, timeout, and provider outage states are understandable.
9. Confirm a successful form resets and a failed form preserves the user's work.
10. Run `npm run lint` and `npm run build` from `apps/web`.

## Acceptance criteria

- Both contact forms deliver successfully through Sendlib.
- Only a connected ECAD account is used as `from`.
- The visitor is set as `replyTo`.
- Project and practice submissions use distinct custom React Email templates.
- Each email includes an HTML body and plain-text fallback.
- Images are compressed on selection when useful.
- Every file is processed and validated, but PDFs/DOC/DOCX are not destructively transformed merely to claim universal compression.
- The UI clearly warns that files must be 1 MB or less and no more than five may be attached.
- Files over 1 MB after processing cannot be submitted.
- The Route Handler independently enforces all field and attachment constraints.
- The API key and recipient configuration remain server-only.
- Users receive accessible progress, success, and failure feedback.
- Provider errors do not leak sensitive implementation details.

## Recommended implementation order

1. Confirm the sender mailbox, destination mailbox, and whether CV/portfolio uploads are required.
2. Connect the mailbox and configure Sendlib credentials.
3. Add React Email and create the shared layout plus both templates.
4. Add shared types and server validation.
5. Implement the Sendlib server helper.
6. Implement `/api/contact` without attachments and verify both email templates.
7. Add server-side attachment validation and base64 encoding.
8. Add browser-side attachment processing, image compression, warnings, and accessibility states.
9. Wire the forms to the endpoint and complete success/error UX.
10. Test limits, abuse cases, Gmail/Outlook rendering, lint, and production build before deployment.

## Reference links

### Sendlib

- [Documentation home](https://sendlib.samueltuoyo.com/docs)
- [Quick Start](https://sendlib.samueltuoyo.com/docs/quickstart)
- [Connecting Gmail](https://sendlib.samueltuoyo.com/docs/gmail)
- [API Keys](https://sendlib.samueltuoyo.com/docs/keys)
- [Basic Send and request parameters](https://sendlib.samueltuoyo.com/docs/send)
- [Limits and Quotas](https://sendlib.samueltuoyo.com/docs/limits)

### React Email

- [React Email home](https://react.email/)
- [Introduction](https://react.email/docs/introduction)
- [Integration overview](https://react.email/docs/integrations/overview)
- [Render HTML and plain text](https://react.email/docs/utilities/render)
- [HTML component](https://react.email/docs/components/html)
- [Section component](https://react.email/docs/components/section)
- [Heading component](https://react.email/docs/components/heading)
- [Text component](https://react.email/docs/components/text)
- [Updating React Email](https://react.email/docs/getting-started/updating-react-email)

### Attachment processing

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [MDN: File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
