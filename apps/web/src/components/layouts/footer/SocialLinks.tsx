interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

const socialLinks: readonly SocialLink[] = [
  {
    href: "https://www.facebook.com/p/ECAD-Architects-LTD-100066676953399/",
    label: "Facebook",
    icon: "/footer-facebook.svg",
  },
  {
    href: "https://www.instagram.com/ecadarchitects",
    label: "Instagram",
    icon: "/footer-instagram.svg",
  },
  {
    href: "https://ng.linkedin.com/company/ecad-architects-ltd",
    label: "LinkedIn",
    icon: "/footer-linkedin.svg",
  },
];


export default function SocialLinks({
  tone = "green",
}: {
  tone?: "green" | "white";
}) {
  return (
    <ul
      aria-label="Social media"
      className="flex list-none items-center gap-[clamp(1.25rem,2.4vw,2rem)]"
    >
      {socialLinks.map(({ href, icon, label }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`block wide-screen-footer-icons transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
              tone === "white"
                ? "text-white hover:text-[#1A7B34] focus-visible:outline-white"
                : "text-[#1A7B34] hover:text-[#8D908D] focus-visible:outline-[#1A7B34]"
            }`}
          >
            <span
              aria-hidden="true"
              className="block size-4.75 bg-current md:size-6.25"
              style={{
                maskImage: `url("${icon}")`,
                maskPosition: "center",
                maskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskImage: `url("${icon}")`,
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
              }}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
