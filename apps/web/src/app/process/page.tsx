import type { Metadata } from "next";

import WorkInProgressPage from "@/components/shared/WorkInProgressPage";

export const metadata: Metadata = {
  title: "Process",
  description: "The ECAD Architects process page is currently being developed.",
};

export default function ProcessPage() {
  return <WorkInProgressPage section="Process" />;
}
