export type ContactFormType = "practice" | "project";

export interface ContactAttachment {
  fieldName: string;
  filename: string;
  type: string;
  size: number;
  file: File;
}

interface SharedContactFields {
  formType: ContactFormType;
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  submittedAt: Date;
  attachments: ContactAttachment[];
}

export interface ProjectContactSubmission extends SharedContactFields {
  formType: "project";
  organization: string;
  projectType: string;
}

export interface PracticeContactSubmission extends SharedContactFields {
  formType: "practice";
  discipline: string;
  position: string;
}

export type ContactSubmission =
  | ProjectContactSubmission
  | PracticeContactSubmission;

export interface ContactApiResponse {
  ok: boolean;
  code?: "CONFIGURATION_ERROR" | "DELIVERY_FAILED" | "RATE_LIMITED" | "VALIDATION_ERROR";
  message?: string;
  fieldErrors?: Record<string, string>;
}

