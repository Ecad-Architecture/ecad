import type { Metadata } from "next";
import localFont from "next/font/local";
import CursorFollower from "@/components/layouts/CursorFollower";
import FooterReveal from "@/components/layouts/footer/FooterReveal";
import SiteFooter from "@/components/layouts/footer/SiteFooter";
import SiteHeader from "@/components/layouts/header/SiteHeader";
import PageTransition from "@/components/layouts/PageTransition";
import PageScrollbar from "@/components/layouts/PageScrollbar";
// import SiteIntro from "@/components/layouts/SiteIntro";
import ProjectTransitionProvider from "@/components/work/ProjectTransitionProvider";
import "./globals.css";

// Intro temporarily disabled; keep its preflight script alongside the component.
// const introPreflightScript = `(function(){try{var force=new URLSearchParams(window.location.search).get("intro")==="1";var seen=sessionStorage.getItem("ecad-intro-seen-v1")==="1";document.documentElement.dataset.ecadIntro=force||!seen?"active":"seen"}catch(error){document.documentElement.dataset.ecadIntro="active"}})();`;

const sohne = localFont({
  variable: "--font-sohne",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  src: [
    {
      path: "../assets/fonts/TestSohne-Leicht-BF663d89cd4952e.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohne-Buch-BF663d89cd32e6a.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohne-Kraftig-BF663d89cd37e26.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohne-Halbfett-BF663d89cd2d67b.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohne-Dreiviertelfett-BF663d89ccc5f66.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

const sohneBreit = localFont({
  variable: "--font-sohne-breit",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  src: [
    {
      path: "../assets/fonts/TestSohneBreit-Buch-BF663d89ca2ff42.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohneBreit-Kraftig-BF663d89caa6b6c.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohneBreit-Halbfett-BF663d89cacf645.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/TestSohneBreit-Dreiviertelfett-BF663d89c955618.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "ECAD Architects",
  description: "Architecture shaped by context, purpose, and people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-ecad-intro="seen"
      suppressHydrationWarning
      className={`${sohne.variable} ${sohneBreit.variable} h-full antialiased`}
    >
      <head>
        {/* <script dangerouslySetInnerHTML={{ __html: introPreflightScript }} /> */}
      </head>
      <body id="top" className="min-h-full bg-[#111111]">
        <CursorFollower />
        <PageScrollbar />
        {/* <SiteIntro /> */}

        <div
          id="ecad-app-shell"
          className="relative z-10 flex min-h-screen flex-col bg-background"
        >
          <SiteHeader />
          <ProjectTransitionProvider>
            <PageTransition>{children}</PageTransition>
          </ProjectTransitionProvider>
        </div>

        <FooterReveal>
          <SiteFooter />
        </FooterReveal>
      </body>
    </html>
  );
}
