import {
  ALLOWED_MIME_TYPES_BY_EXTENSION,
  ATTACHMENT_INPUT_NAMES,
  CONTACT_FIELD_LIMITS,
  getFileExtension,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENT_COUNT,
  PRACTICE_FILE_EXTENSIONS,
  PROJECT_FILE_EXTENSIONS,
  type AttachmentInputName,
} from "./constants";
import type {
  ContactAttachment,
  ContactFormType,
  ContactSubmission,
} from "./types";

interface ValidationSuccess {
  success: true;
  data: ContactSubmission;
}

interface ValidationFailure {
  success: false;
  fieldErrors: Record<string, string>;
}

export type ContactValidationResult = ValidationSuccess | ValidationFailure;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADER_CONTROL_PATTERN = /[\r\n]/;

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateText(
  formData: FormData,
  name: keyof typeof CONTACT_FIELD_LIMITS,
  fieldErrors: Record<string, string>,
  options: { required?: boolean; label: string },
) {
  const value = readText(formData, name);

  if (options.required && !value) {
    fieldErrors[name] = `${options.label} is required.`;
  } else if (value.length > CONTACT_FIELD_LIMITS[name]) {
    fieldErrors[name] = `${options.label} is too long.`;
  }

  return value;
}

function sanitizeFilename(filename: string) {
  const withoutPath = filename.replace(/^.*[\\/]/, "");
  const sanitized = withoutPath
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[^a-zA-Z0-9._()\- ]/g, "_")
    .trim();

  return (sanitized || "attachment").slice(0, 180);
}

function allowedExtensionsFor(
  formType: ContactFormType,
  inputName: AttachmentInputName,
) {
  if (formType === "project" && inputName === "project-file") {
    return PROJECT_FILE_EXTENSIONS;
  }

  if (
    formType === "practice" &&
    (inputName === "practice-portfolio" || inputName === "practice-cv")
  ) {
    return PRACTICE_FILE_EXTENSIONS;
  }

  return null;
}

function validateAttachments(
  formData: FormData,
  formType: ContactFormType,
  fieldErrors: Record<string, string>,
) {
  const attachments: ContactAttachment[] = [];

  for (const fieldName of ATTACHMENT_INPUT_NAMES) {
    const allowedExtensions = allowedExtensionsFor(formType, fieldName);
    const values = formData.getAll(fieldName);

    for (const value of values) {
      if (!(value instanceof File) || value.size === 0) {
        continue;
      }

      if (!allowedExtensions) {
        fieldErrors[fieldName] = "This attachment does not belong to the selected form.";
        continue;
      }

      if (value.size > MAX_ATTACHMENT_BYTES) {
        fieldErrors[fieldName] = "This attachment must be 1 MB or less.";
        continue;
      }

      const filename = sanitizeFilename(value.name);
      const extension = getFileExtension(filename);

      if (!allowedExtensions.has(extension)) {
        fieldErrors[fieldName] = "This file type is not supported.";
        continue;
      }

      const expectedMimeTypes = ALLOWED_MIME_TYPES_BY_EXTENSION[extension];
      if (value.type && expectedMimeTypes && !expectedMimeTypes.has(value.type)) {
        fieldErrors[fieldName] = "The file type does not match its extension.";
        continue;
      }

      attachments.push({
        fieldName,
        filename,
        type: value.type || [...(expectedMimeTypes ?? [])][0] || "application/octet-stream",
        size: value.size,
        file: value,
      });
    }
  }

  if (attachments.length > MAX_ATTACHMENT_COUNT) {
    fieldErrors.attachments = `You can attach no more than ${MAX_ATTACHMENT_COUNT} files.`;
  }

  return attachments;
}

export function validateContactForm(formData: FormData): ContactValidationResult {
  const fieldErrors: Record<string, string> = {};
  const formTypeValue = readText(formData, "formType");

  if (formTypeValue !== "project" && formTypeValue !== "practice") {
    return {
      success: false,
      fieldErrors: { formType: "Choose a valid contact form." },
    };
  }

  const formType = formTypeValue;
  const name = validateText(formData, "name", fieldErrors, {
    required: true,
    label: "Name",
  });
  const email = validateText(formData, "email", fieldErrors, {
    required: true,
    label: "Email",
  }).toLowerCase();
  const phone = validateText(formData, "phone", fieldErrors, {
    label: "Phone number",
  });
  const location = validateText(formData, "location", fieldErrors, {
    label: "Location",
  });
  const message = validateText(formData, "message", fieldErrors, {
    label: "Message",
  });

  if (email && (!EMAIL_PATTERN.test(email) || HEADER_CONTROL_PATTERN.test(email))) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (HEADER_CONTROL_PATTERN.test(name)) {
    fieldErrors.name = "Enter a valid name.";
  }

  const attachments = validateAttachments(formData, formType, fieldErrors);

  if (formType === "project") {
    const organization = validateText(formData, "organization", fieldErrors, {
      label: "Organization",
    });
    const projectType = validateText(formData, "projectType", fieldErrors, {
      label: "Project type",
    });

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, fieldErrors };
    }

    return {
      success: true,
      data: {
        formType,
        name,
        email,
        phone,
        organization,
        projectType,
        location,
        message,
        submittedAt: new Date(),
        attachments,
      },
    };
  }

  const discipline = validateText(formData, "discipline", fieldErrors, {
    label: "Discipline",
  });
  const position = validateText(formData, "position", fieldErrors, {
    label: "Position",
  });

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      formType,
      name,
      email,
      phone,
      discipline,
      position,
      location,
      message,
      submittedAt: new Date(),
      attachments,
    },
  };
}

