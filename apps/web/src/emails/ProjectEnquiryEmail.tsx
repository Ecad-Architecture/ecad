import { Heading, Hr, Text } from "react-email";

import ContactEmailLayout, {
  EmailField,
} from "./components/ContactEmailLayout";
import type { ProjectContactSubmission } from "@/lib/contact/types";

export default function ProjectEnquiryEmail(
  submission: ProjectContactSubmission,
) {
  return (
    <ContactEmailLayout
      badge="Start a project"
      email={submission.email}
      name={submission.name}
      phone={submission.phone}
      preview={`New project enquiry from ${submission.name}`}
      submittedAt={submission.submittedAt}
      title="New project enquiry"
    >
      <Heading as="h2" style={sectionHeading}>
        Project details
      </Heading>
      <EmailField label="Organization" value={submission.organization} />
      <EmailField label="Project type" value={submission.projectType} />
      <EmailField label="Location" value={submission.location} />

      {submission.message ? (
        <>
          <Hr style={divider} />
          <Heading as="h2" style={sectionHeading}>
            Message
          </Heading>
          <Text style={message}>{submission.message}</Text>
        </>
      ) : null}
    </ContactEmailLayout>
  );
}

const sectionHeading = {
  color: "#1d2921",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 0 14px",
};

const divider = { borderColor: "#d9dfda", margin: "24px 0" };

const message = {
  color: "#1d2921",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
