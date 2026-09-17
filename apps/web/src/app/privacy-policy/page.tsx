import type { Metadata } from "next";

import WorkInProgressPage from "@/components/shared/WorkInProgressPage";

export const metadata: Metadata = {
  title: "Privacy Policy | ECAD Architects",
  description:
    "The ECAD Architects privacy policy page is currently being developed.",
};

export default function PrivacyPolicyPage() {
  return <WorkInProgressPage section="Privacy Policy" />;
}
