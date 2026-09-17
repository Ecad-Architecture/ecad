import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

interface ContactEmailLayoutProps {
  badge: string;
  children: ReactNode;
  email: string;
  name: string;
  phone: string;
  preview: string;
  submittedAt: Date;
  title: string;
}

const colors = {
  border: "#d9dfda",
  muted: "#667069",
  text: "#1d2921",
};

export function EmailField({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }

  return (
    <Section style={fieldRow}>
      <Text style={fieldLabel}>{label}</Text>
      <Text style={fieldValue}>{value}</Text>
    </Section>
  );
}

export default function ContactEmailLayout({
  badge,
  children,
  email,
  name,
  phone,
  preview,
  submittedAt,
  title,
}: ContactEmailLayoutProps) {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(submittedAt);

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>ECAD Architects</Text>
            <Text style={badgeStyle}>{badge}</Text>
            <Heading as="h1" style={heading}>
              {title}
            </Heading>
            <Text style={intro}>A new message was submitted through the ECAD website.</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={sectionHeading}>
              Contact details
            </Heading>
            <EmailField label="Name" value={name} />
            <EmailField label="Email" value={email} />
            <EmailField label="Phone" value={phone} />

            <Hr style={divider} />
            {children}

            <Section style={replyBox}>
              <Text style={replyText}>
                Replying to this email will address {name} at {email}.
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>Received {formattedDate} (West Africa Time)</Text>
            <Text style={footerText}>ECAD Architects · Lagos, Nigeria</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  color: colors.text,
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: "0",
  padding: "20px 12px",
};

const container = {
  margin: "0 auto",
  maxWidth: "620px",
};

const header = {
  padding: "0 0 20px",
};

const brand = {
  color: colors.text,
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 18px",
};

const badgeStyle = {
  color: colors.muted,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const heading = {
  color: colors.text,
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.2",
  margin: "0 0 10px",
};

const intro = {
  color: colors.muted,
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const content = { padding: "0" };

const sectionHeading = {
  color: colors.text,
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 0 14px",
};

const fieldRow = { margin: "0 0 13px" };

const fieldLabel = {
  color: colors.muted,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0 0 3px",
  textTransform: "uppercase" as const,
};

const fieldValue = {
  color: colors.text,
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderColor: colors.border,
  margin: "24px 0",
};

const replyBox = {
  borderTop: `1px solid ${colors.border}`,
  margin: "24px 0 8px",
  padding: "16px 0 0",
};

const replyText = {
  color: colors.text,
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const footer = {
  borderTop: `1px solid ${colors.border}`,
  marginTop: "20px",
  padding: "16px 0 0",
};

const footerText = {
  color: colors.muted,
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "0 0 3px",
};
