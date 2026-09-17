import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

interface HomeBrandMarkProps {
  logo: StaticImageData | string;
}

export default function HomeBrandMark({ logo }: HomeBrandMarkProps) {
  return (
    <span className="wide-screen-home-brand-slot hidden md:contents">
      <Link
        href="/"
        aria-label="ECAD Design Architects home"
        className="absolute left-1/2 top-1/2 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#238A42]"
      >
        <Image
          src={logo}
          alt=""
          width={96}
          height={23}
          className="wide-screen-home-logo h-auto w-[80px]"
          preload
          unoptimized
        />
      </Link>
    </span>
  );
}
