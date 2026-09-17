import imageCompression from "browser-image-compression";

import {
  ALLOWED_MIME_TYPES_BY_EXTENSION,
  getFileExtension,
  MAX_ATTACHMENT_BYTES,
  PRACTICE_FILE_EXTENSIONS,
  PROJECT_FILE_EXTENSIONS,
  type AttachmentInputName,
} from "./constants";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const COMPRESSION_TARGET_MB = 0.9;

export interface ProcessedAttachment {
  file: File;
  originalSize: number;
  wasCompressed: boolean;
}

function isAllowedForInput(inputName: AttachmentInputName, extension: string) {
  return inputName === "project-file"
    ? PROJECT_FILE_EXTENSIONS.has(extension)
    : PRACTICE_FILE_EXTENSIONS.has(extension);
}

export async function processAttachment(
  inputName: AttachmentInputName,
  file: File,
): Promise<ProcessedAttachment> {
  const extension = getFileExtension(file.name);

  if (!isAllowedForInput(inputName, extension)) {
    throw new Error("This file type is not supported.");
  }

  const expectedMimeTypes = ALLOWED_MIME_TYPES_BY_EXTENSION[extension];
  if (file.type && expectedMimeTypes && !expectedMimeTypes.has(file.type)) {
    throw new Error("The file type does not match its extension.");
  }

  if (file.size === 0) {
    throw new Error("This file is empty. Please choose another file.");
  }

  let processedFile = file;

  if (IMAGE_EXTENSIONS.has(extension) && file.size > COMPRESSION_TARGET_MB * 1_000_000) {
    const compressed = await imageCompression(file, {
      maxSizeMB: COMPRESSION_TARGET_MB,
      maxWidthOrHeight: 2_400,
      useWebWorker: true,
      preserveExif: false,
      initialQuality: 0.9,
    });

    if (compressed.size < file.size) {
      processedFile = new File([compressed], file.name, {
        type: compressed.type || file.type,
        lastModified: file.lastModified,
      });
    }
  }

  if (processedFile.size > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      "This file is larger than 1 MB. Please reduce it or choose another file.",
    );
  }

  return {
    file: processedFile,
    originalSize: file.size,
    wasCompressed: processedFile.size < file.size,
  };
}
