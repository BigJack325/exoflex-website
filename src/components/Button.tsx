import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";

type Props = {
  buttonLink: LinkField;
  buttonText: string | null;
  className?: string;
};

export default function Button({ buttonLink, buttonText, className }: Props) {
  return (
    <PrismicNextLink
      field={buttonLink}
      className={clsx(
        "rounded-xl border border-white text-center font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-blue-600",
        "px-4 py-3 text-base sm:px-5 sm:py-4 sm:text-lg md:text-xl lg:text-2xl",
        className
      )}
    >
      {buttonText}
    </PrismicNextLink>
  );
}