export const MAX_ATTACHMENT_BYTES = 1_000_000;
export const MAX_ATTACHMENT_COUNT = 5;
export const MAX_REQUEST_BYTES = 6_000_000;

export const ATTACHMENT_INPUT_NAMES = [
  "project-file",
  "practice-portfolio",
  "practice-cv",
] as const;

export type AttachmentInputName = (typeof ATTACHMENT_INPUT_NAMES)[number];

export const PROJECT_FILE_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp";
export const PRACTICE_FILE_ACCEPT = ".pdf,.doc,.docx";

export const PROJECT_FILE_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

export const PRACTICE_FILE_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export const ALLOWED_MIME_TYPES_BY_EXTENSION: Record<string, Set<string>> = {
  pdf: new Set(["application/pdf"]),
  doc: new Set(["application/msword"]),
  docx: new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
  jpg: new Set(["image/jpeg"]),
  jpeg: new Set(["image/jpeg"]),
  png: new Set(["image/png"]),
  webp: new Set(["image/webp"]),
};

export const CONTACT_FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  organization: 160,
  projectType: 120,
  discipline: 120,
  position: 120,
  location: 200,
  message: 5_000,
} as const;

export function formatBytes(bytes: number) {
  if (bytes < 1_000) {
    return `${bytes} B`;
  }

  return `${(bytes / 1_000).toFixed(bytes < 100_000 ? 1 : 0)} KB`;
}

export function getFileExtension(filename: string) {
  const extension = filename.split(".").pop();
  return extension?.toLowerCase() ?? "";
}

