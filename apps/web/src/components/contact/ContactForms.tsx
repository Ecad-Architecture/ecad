"use client";

import type { FormEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { processAttachment } from "@/lib/contact/attachments.client";
import {
  ATTACHMENT_INPUT_NAMES,
  CONTACT_FIELD_LIMITS,
  formatBytes,
  PRACTICE_FILE_ACCEPT,
  PROJECT_FILE_ACCEPT,
  type AttachmentInputName,
} from "@/lib/contact/constants";
import type {
  ContactApiResponse,
  ContactFormType,
} from "@/lib/contact/types";

interface ContactFormsProps {
  initialForm?: ContactFormType | null;
}

const formOptions = [
  { id: "project" as const, label: "Start A Project" },
  { id: "practice" as const, label: "Join The Practice" },
];

const contactRows = [
  { label: "Phone Number", value: "01 461 2213" },
  { label: "Email", value: "info@ecadarchitects.com" },
  { label: "Address", value: "62 Awolowo Road, Lagos, Lagos State 101233, NG" },
] as const;

const socialLinks = [
  {
    href: "https://www.facebook.com/p/ECAD-Architects-LTD-100066676953399/",
    icon: "/contact-facebook.svg",
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/ecadarchitects",
    icon: "/contact-instagram.svg",
    label: "Instagram",
  },
  {
    href: "https://ng.linkedin.com/company/ecad-architects-ltd",
    icon: "/contact-linkedin.svg",
    label: "LinkedIn",
  },
] as const;

const fieldClassName =
  "wide-screen-caption h-10 w-full border-b border-[#1D2921] bg-transparent px-2 text-[0.78rem] text-[#1D2921] outline-none placeholder:text-[#1D2921]/60 focus:border-[#14843b]";

type SubmissionStatus = "error" | "idle" | "submitting" | "success";

interface AttachmentState {
  file?: File;
  message: string;
  status: "error" | "processing" | "ready";
}

function FileUpload({
  accept,
  attachment,
  descriptionId,
  disabled,
  id,
  label,
  onRemove,
  onSelect,
}: {
  accept: string;
  attachment?: AttachmentState;
  descriptionId: string;
  disabled: boolean;
  id: string;
  label: string;
  onRemove: () => void;
  onSelect: (file: File | null) => void;
}) {
  const statusId = `${id}-status`;

  return (
    <div className="min-w-0">
      <input
        id={id}
        name={id}
        type="file"
        accept={accept}
        disabled={disabled}
        aria-describedby={`${descriptionId} ${statusId}`}
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0] ?? null;
          event.currentTarget.value = "";
          onSelect(file);
        }}
      />
      <label
        htmlFor={id}
        aria-disabled={disabled}
        className={`wide-screen-caption inline-flex min-h-10 items-center rounded-[6px] border border-[#1D2921] px-5 text-[0.72rem] font-semibold transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1D2921] ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-[#1A7B34] hover:text-white"
        }`}
      >
        {label}
      </label>

      <div id={statusId} aria-live="polite" className="mt-2 max-w-64">
        {attachment ? (
          <div className="flex items-start gap-3">
            <p
              className={`wide-screen-caption min-w-0 text-[0.68rem] leading-relaxed ${
                attachment.status === "error" ? "text-red-700" : "text-[#1D2921]/70"
              }`}
            >
              {attachment.message}
            </p>
            {attachment.status !== "processing" ? (
              <button
                type="button"
                onClick={onRemove}
                className="wide-screen-caption shrink-0 text-[0.65rem] font-semibold underline underline-offset-2"
              >
                Remove
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AttachmentNotice({ id, formats }: { id: string; formats: string }) {
  return (
    <p
      id={id}
      className="wide-screen-caption mt-3 max-w-xl text-[0.67rem] leading-relaxed text-[#1D2921]/65"
    >
      Attachments must be 1 MB or less per file. You may attach up to 5 files.
      Images will be compressed automatically where possible; PDFs and documents
      may need to be reduced before upload. Accepted formats: {formats}.
    </p>
  );
}

function ContactDetails() {
  return (
    <div className="mt-[clamp(3rem,7svh,5rem)]">
      <div className="space-y-4">
        {contactRows.map((row) => (
          <details key={row.label} className="group max-w-md">
            <summary className="wide-screen-label flex w-fit cursor-pointer list-none items-center gap-4 text-[0.86rem] font-semibold leading-none outline-none focus-visible:ring-2 focus-visible:ring-[#14843b] focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="inline-flex size-5 items-center justify-center text-[1.5rem] font-light transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
              <span>{row.label}</span>
            </summary>
            <p className="wide-screen-label ml-9 mt-3 text-[0.78rem] leading-[1.35] text-[#1D2921]/75">
              {row.value}
            </p>
          </details>
        ))}
      </div>

      <ul aria-label="Social media" className="mt-5 flex items-center gap-7">
        {socialLinks.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="block size-[17px] text-[#1D2921] transition-colors hover:text-[#1A7B34] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D2921]"
            >
              <span
                aria-hidden="true"
                className="block size-[17px] bg-current"
                style={{
                  maskImage: `url("${social.icon}")`,
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  WebkitMaskImage: `url("${social.icon}")`,
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                }}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FormFieldsProps {
  attachments: Partial<Record<AttachmentInputName, AttachmentState>>;
  disabled: boolean;
  onAttachmentRemove: (inputName: AttachmentInputName) => void;
  onAttachmentSelect: (inputName: AttachmentInputName, file: File | null) => void;
  submitting: boolean;
}

function ProjectForm({
  attachments,
  disabled,
  onAttachmentRemove,
  onAttachmentSelect,
  submitting,
}: FormFieldsProps) {
  const requirementsId = "project-attachment-requirements";

  return (
    <>
      <div className="grid gap-x-9 gap-y-2 sm:grid-cols-2">
        <input
          required
          name="name"
          autoComplete="name"
          maxLength={CONTACT_FIELD_LIMITS.name}
          placeholder="Enter Your Name"
          className={`${fieldClassName} sm:col-span-2`}
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          maxLength={CONTACT_FIELD_LIMITS.email}
          placeholder="Enter Your Email Address"
          className={fieldClassName}
        />
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={CONTACT_FIELD_LIMITS.phone}
          placeholder="Enter Your Phone Number"
          className={fieldClassName}
        />
        <input
          name="organization"
          autoComplete="organization"
          maxLength={CONTACT_FIELD_LIMITS.organization}
          placeholder="Enter Your Organization"
          className={fieldClassName}
        />
        <input
          name="projectType"
          maxLength={CONTACT_FIELD_LIMITS.projectType}
          placeholder="Enter Project Type"
          className={fieldClassName}
        />
        <input
          name="location"
          autoComplete="address-level2"
          maxLength={CONTACT_FIELD_LIMITS.location}
          placeholder="Enter Your Location"
          className={`${fieldClassName} sm:col-span-2`}
        />
        <textarea
          name="message"
          maxLength={CONTACT_FIELD_LIMITS.message}
          placeholder="Message"
          className="wide-screen-label min-h-28 resize-y border-b border-[#1D2921] bg-transparent px-2 py-4 text-[0.78rem] text-[#1D2921] outline-none placeholder:text-[#1D2921]/60 focus:border-[#14843b] sm:col-span-2"
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
        <div>
          <FileUpload
            id="project-file"
            label="Upload A File"
            accept={PROJECT_FILE_ACCEPT}
            attachment={attachments["project-file"]}
            descriptionId={requirementsId}
            disabled={disabled}
            onRemove={() => onAttachmentRemove("project-file")}
            onSelect={(file) => onAttachmentSelect("project-file", file)}
          />
          <AttachmentNotice
            id={requirementsId}
            formats="PDF, DOC, DOCX, JPG, PNG, or WebP"
          />
        </div>
        <SubmitButton disabled={disabled} submitting={submitting} />
      </div>
    </>
  );
}

function PracticeForm({
  attachments,
  disabled,
  onAttachmentRemove,
  onAttachmentSelect,
  submitting,
}: FormFieldsProps) {
  const requirementsId = "practice-attachment-requirements";

  return (
    <>
      <div className="grid gap-x-9 gap-y-2 sm:grid-cols-2">
        <input
          required
          name="name"
          autoComplete="name"
          maxLength={CONTACT_FIELD_LIMITS.name}
          placeholder="Enter Your Name"
          className={`${fieldClassName} sm:col-span-2`}
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          maxLength={CONTACT_FIELD_LIMITS.email}
          placeholder="Enter Your Email Address"
          className={fieldClassName}
        />
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={CONTACT_FIELD_LIMITS.phone}
          placeholder="Enter Your Phone Number"
          className={fieldClassName}
        />
        <input
          name="discipline"
          maxLength={CONTACT_FIELD_LIMITS.discipline}
          placeholder="Enter Your Discipline"
          className={fieldClassName}
        />
        <input
          name="position"
          maxLength={CONTACT_FIELD_LIMITS.position}
          placeholder="Enter Position"
          className={fieldClassName}
        />
        <input
          name="location"
          autoComplete="address-level2"
          maxLength={CONTACT_FIELD_LIMITS.location}
          placeholder="Enter Your Location"
          className={`${fieldClassName} sm:col-span-2`}
        />
        <textarea
          name="message"
          maxLength={CONTACT_FIELD_LIMITS.message}
          placeholder="Message"
          className="wide-screen-label min-h-28 resize-y border-b border-[#1D2921] bg-transparent px-2 py-4 text-[0.78rem] text-[#1D2921] outline-none placeholder:text-[#1D2921]/60 focus:border-[#14843b] sm:col-span-2"
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap gap-4">
            <FileUpload
              id="practice-portfolio"
              label="Upload Portfolio"
              accept={PRACTICE_FILE_ACCEPT}
              attachment={attachments["practice-portfolio"]}
              descriptionId={requirementsId}
              disabled={disabled}
              onRemove={() => onAttachmentRemove("practice-portfolio")}
              onSelect={(file) => onAttachmentSelect("practice-portfolio", file)}
            />
            <FileUpload
              id="practice-cv"
              label="Upload CV"
              accept={PRACTICE_FILE_ACCEPT}
              attachment={attachments["practice-cv"]}
              descriptionId={requirementsId}
              disabled={disabled}
              onRemove={() => onAttachmentRemove("practice-cv")}
              onSelect={(file) => onAttachmentSelect("practice-cv", file)}
            />
          </div>
          <AttachmentNotice id={requirementsId} formats="PDF, DOC, or DOCX" />
        </div>
        <SubmitButton disabled={disabled} submitting={submitting} />
      </div>
    </>
  );
}

function SubmitButton({
  disabled,
  submitting,
}: {
  disabled: boolean;
  submitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="wide-screen-caption group inline-flex min-h-10 items-center gap-12 rounded-[6px] bg-[#14843b] px-5 text-[0.72rem] font-semibold text-white transition-colors hover:bg-[#106d31] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14843b] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-[#14843b]"
    >
      {submitting ? "Sending…" : "Submit"}
      <Image
        src="/work-project-arrow.svg"
        alt=""
        width={12}
        height={12}
        aria-hidden="true"
        className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

export default function ContactForms({
  initialForm = null,
}: ContactFormsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const statusMessageRef = useRef<HTMLDivElement>(null);
  const formStartedAtRef = useRef(Date.now());
  const attachmentTokensRef = useRef<Partial<Record<AttachmentInputName, number>>>({});
  const [activeForm, setActiveForm] =
    useState<ContactFormType | null>(initialForm);
  const [blurHeight, setBlurHeight] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<
    Partial<Record<AttachmentInputName, AttachmentState>>
  >({});
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    formStartedAtRef.current = Date.now();
    attachmentTokensRef.current = {};
    setAttachments({});
    setSubmissionStatus("idle");
    setStatusMessage("");
    setFieldErrors({});
  }, [activeForm]);

  useEffect(() => {
    if (submissionStatus === "error" || submissionStatus === "success") {
      statusMessageRef.current?.focus();
    }
  }, [submissionStatus]);

  useLayoutEffect(() => {
    const options = optionsRef.current;
    const footer = document.getElementById("footer-reveal");

    if (!options || !footer) {
      return;
    }

    const updateHeroHeight = () => {
      const availableHeight =
        document.documentElement.clientHeight -
        options.getBoundingClientRect().height -
        footer.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        "--contact-hero-height",
        `${Math.max(0, Math.floor(availableHeight))}px`,
      );
    };

    updateHeroHeight();

    const resizeObserver = new ResizeObserver(updateHeroHeight);
    resizeObserver.observe(options);
    resizeObserver.observe(footer);
    window.addEventListener("resize", updateHeroHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeroHeight);
      document.documentElement.style.removeProperty("--contact-hero-height");
    };
  }, []);

  useLayoutEffect(() => {
    if (!activeForm) {
      return;
    }

    const panel = formPanelRef.current;
    const content = formContentRef.current;

    if (!panel || !content) {
      return;
    }

    const updateBlurHeight = () => {
      setBlurHeight(
        Math.ceil(
          content.getBoundingClientRect().bottom -
            panel.getBoundingClientRect().top,
        ),
      );
    };

    updateBlurHeight();

    const resizeObserver = new ResizeObserver(updateBlurHeight);
    resizeObserver.observe(panel);
    resizeObserver.observe(content);
    window.addEventListener("resize", updateBlurHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBlurHeight);
    };
  }, [activeForm]);

  const selectForm = (form: ContactFormType) => {
    const willOpen = activeForm !== form;
    setActiveForm(willOpen ? form : null);

    if (willOpen) {
      window.requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const onAttachmentRemove = (inputName: AttachmentInputName) => {
    attachmentTokensRef.current[inputName] =
      (attachmentTokensRef.current[inputName] ?? 0) + 1;
    setAttachments((current) => {
      const next = { ...current };
      delete next[inputName];
      return next;
    });
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[inputName];
      delete next.attachments;
      return next;
    });
    setSubmissionStatus("idle");
    setStatusMessage("");
  };

  const onAttachmentSelect = async (
    inputName: AttachmentInputName,
    file: File | null,
  ) => {
    const token = (attachmentTokensRef.current[inputName] ?? 0) + 1;
    attachmentTokensRef.current[inputName] = token;

    if (!file) {
      onAttachmentRemove(inputName);
      return;
    }

    setSubmissionStatus("idle");
    setStatusMessage("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[inputName];
      delete next.attachments;
      return next;
    });
    setAttachments((current) => ({
      ...current,
      [inputName]: {
        status: "processing",
        message: `Preparing ${file.name}…`,
      },
    }));

    try {
      const processed = await processAttachment(inputName, file);
      if (attachmentTokensRef.current[inputName] !== token) {
        return;
      }

      const message = processed.wasCompressed
        ? `${processed.file.name} compressed from ${formatBytes(processed.originalSize)} to ${formatBytes(processed.file.size)}.`
        : `${processed.file.name} ready — ${formatBytes(processed.file.size)}.`;

      setAttachments((current) => ({
        ...current,
        [inputName]: {
          file: processed.file,
          message,
          status: "ready",
        },
      }));
    } catch (error) {
      if (attachmentTokensRef.current[inputName] !== token) {
        return;
      }

      setAttachments((current) => ({
        ...current,
        [inputName]: {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "We couldn't prepare this file. Please choose another file.",
        },
      }));
    }
  };

  const hasAttachmentProblem = Object.values(attachments).some(
    (attachment) =>
      attachment?.status === "processing" || attachment?.status === "error",
  );
  const isSubmitting = submissionStatus === "submitting";
  const isFormDisabled = hasAttachmentProblem || isSubmitting;

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeForm || isFormDisabled) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("formType", activeForm);
    formData.set("formStartedAt", String(formStartedAtRef.current));

    for (const inputName of ATTACHMENT_INPUT_NAMES) {
      formData.delete(inputName);
      const attachment = attachments[inputName];
      if (attachment?.status === "ready" && attachment.file) {
        formData.append(inputName, attachment.file, attachment.file.name);
      }
    }

    setSubmissionStatus("submitting");
    setStatusMessage("Sending your message…");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || !result?.ok) {
        setFieldErrors(result?.fieldErrors ?? {});
        setSubmissionStatus("error");
        setStatusMessage(
          result?.message ??
            "We couldn't send your message right now. Please try again, or email info@ecadarchitects.com directly.",
        );
        return;
      }

      form.reset();
      attachmentTokensRef.current = {};
      setAttachments({});
      setSubmissionStatus("success");
      setStatusMessage(
        "Thank you. Your enquiry has been sent to ECAD Architects. We’ll be in touch.",
      );
      formStartedAtRef.current = Date.now();
    } catch {
      setSubmissionStatus("error");
      setStatusMessage(
        "We couldn't send your message right now. Please try again, or email info@ecadarchitects.com directly.",
      );
    }
  };

  return (
    <section
      id="contact-form"
      ref={sectionRef}
      data-expanded={activeForm ? "true" : "false"}
      className="scroll-mt-[72px]"
    >
      <div
        ref={optionsRef}
        className="wide-screen-gutter bg-[#202120] px-[clamp(1.5rem,6.8vw,7rem)] py-[clamp(2rem,4.5svh,3.5rem)] text-white"
      >
        <div className="grid max-w-[46rem] gap-6 sm:grid-cols-2 sm:gap-10">
          {formOptions.map((option) => {
            const isActive = activeForm === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-expanded={isActive}
                aria-controls="contact-form-panel"
                onClick={() => selectForm(option.id)}
                className={`wide-screen-body-sm group flex min-h-12 items-center gap-[clamp(2rem,4vw,4rem)] text-left text-[clamp(0.78rem,1vw,0.92rem)] font-medium tracking-[-0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive ? "text-[#14843b]" : "text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex origin-center text-[1.5rem] font-light leading-none transition-transform duration-200 ${
                    isActive ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false}>
      {activeForm ? (
        <motion.div
          key="contact-form-panel"
          className="overflow-hidden"
          initial={false}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.65, ease: [0.42, 0, 0.58, 1] },
            opacity: { duration: 0.35, ease: "easeOut" },
          }}
        >
        <div
          ref={formPanelRef}
          id="contact-form-panel"
          className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-white text-[#1D2921]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full overflow-hidden lg:w-[53%]"
          >
            <div
              className="absolute inset-0 bg-[#bcd5c5] opacity-[0.07]"
              style={{
                maskImage: "url('/fingerprint-pattern-mask.png')",
                maskPosition: "center",
                maskRepeat: "repeat",
                maskSize: "clamp(280px, 30vw, 440px) auto",
                WebkitMaskImage: "url('/fingerprint-pattern-mask.png')",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "repeat",
                WebkitMaskSize: "clamp(280px, 30vw, 440px) auto",
              }}
            />
            <div className="absolute inset-y-0 right-0 hidden w-[24%] bg-linear-to-r from-transparent to-white lg:block" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[clamp(27rem,47vw,36rem)] w-[29%] overflow-hidden lg:block"
            style={blurHeight ? { height: `${blurHeight}px` } : undefined}
          >
            <Image
              src="/contact-form-blur.png"
              alt=""
              fill
              sizes="29vw"
              className="object-cover object-center"
            />
          </div>

          <div className="wide-screen-gutter relative z-10 px-[clamp(1.5rem,6.4vw,6rem)] pb-[clamp(4rem,9svh,7rem)] pt-[clamp(3rem,7svh,5.5rem)]">
            <div className="grid items-start gap-[clamp(3rem,7vw,8rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
              <div ref={formContentRef} className="min-w-0">
                <div className="w-full max-w-[44rem] overflow-hidden lg:max-w-none">
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={activeForm}
                      aria-label={
                        activeForm === "project"
                          ? "Start a project"
                          : "Join the practice"
                      }
                      initial={{ opacity: 0, x: 64 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{
                        duration: 0.75,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onSubmit={submitContactForm}
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-[9999px]"
                      >
                        <label htmlFor={`${activeForm}-website`}>Website</label>
                        <input
                          id={`${activeForm}-website`}
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {activeForm === "project" ? (
                        <ProjectForm
                          attachments={attachments}
                          disabled={isFormDisabled}
                          onAttachmentRemove={onAttachmentRemove}
                          onAttachmentSelect={onAttachmentSelect}
                          submitting={isSubmitting}
                        />
                      ) : (
                        <PracticeForm
                          attachments={attachments}
                          disabled={isFormDisabled}
                          onAttachmentRemove={onAttachmentRemove}
                          onAttachmentSelect={onAttachmentSelect}
                          submitting={isSubmitting}
                        />
                      )}

                      <div
                        ref={statusMessageRef}
                        tabIndex={-1}
                        role={submissionStatus === "error" ? "alert" : "status"}
                        aria-live={submissionStatus === "error" ? "assertive" : "polite"}
                        className={`mt-6 rounded-[6px] text-[0.76rem] leading-relaxed outline-none ${
                          statusMessage
                            ? submissionStatus === "success"
                              ? "bg-[#eaf6ed] px-4 py-3 text-[#106d31]"
                              : submissionStatus === "error"
                                ? "bg-red-50 px-4 py-3 text-red-800"
                                : "text-[#1D2921]/70"
                            : ""
                        }`}
                      >
                        {statusMessage ? <p>{statusMessage}</p> : null}
                        {Object.keys(fieldErrors).length > 0 ? (
                          <ul className="mt-2 list-disc space-y-1 pl-5">
                            {Object.entries(fieldErrors).map(([field, message]) => (
                              <li key={field}>{message}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </motion.form>
                  </AnimatePresence>
                </div>

                <ContactDetails />
              </div>

              <div className="relative aspect-[1.26] w-full max-w-[38rem] justify-self-end overflow-hidden rounded-[6px] shadow-[0_12px_35px_rgba(29,41,33,0.08)]">
                <Image
                  src="/contact-meeting.png"
                  alt="ECAD team members collaborating during a meeting"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </section>
  );
}
