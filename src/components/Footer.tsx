"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { SiLinkedin, SiFacebook } from "react-icons/si";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          once: true,
        },
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power3.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, [pathname]);

  const portalId = "242121062";
  const formId = "7f2e89c4-6118-4a5f-869a-30b857f831c1";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      const rsp = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [{ name: "email", value: email }],
            context: { pageUri: window.location.href, pageName: document.title },
          }),
        }
      );

      if (!rsp.ok) {
        console.error("HubSpot error:", await rsp.json());
        return;
      }

      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <footer
      ref={footerRef}
      className="bg-black px-4 pt-16 pb-10 text-white sm:px-6 md:px-12"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-12 md:flex-row md:justify-between">
        <div className="w-full space-y-6 md:w-1/2">
          <Image src="/images/logo.png" alt="ExoFlex logo" width={120} height={40} className="hidden sm:block" />

          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/exoflex/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#107df4]"
            >
              <SiLinkedin className="h-6 w-6" />
            </a>
            <a
              href="https://www.facebook.com/exoflex66"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#107df4]"
            >
              <SiFacebook className="h-6 w-6" />
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex max-w-md flex-col overflow-hidden rounded-full bg-white sm:flex-row sm:items-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-2 text-sm text-black placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="bg-[#107df4] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e6bd3] sm:rounded-r-full sm:text-base"
            >
              {submitted ? "THANK YOU!" : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="w-full space-y-2 text-sm text-white/80 md:w-1/2 md:text-right">
          <div>
            <p className="text-base font-semibold text-white">Address</p>
            <p>1672 Rue de l’Islet, Quebec City, Quebec, G2K 2G6, Canada</p>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-base font-semibold text-white">Contact</p>
            <p>(514) 512-7890</p>
            <p>
              <a
                href="mailto:info@exoflex.ca"
                className="text-white underline transition hover:text-[#107df4]"
              >
                info@exoflex.ca
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-2 px-4 text-center text-xs text-white/50 sm:px-0">
        <p>
          Copyright © {new Date().getFullYear()} ExoFlex Inc. – All rights reserved.
        </p>
        <p>
          The information provided by ExoFlex Inc. has not been evaluated by Health Canada, the FDA, or any other regulatory agency.
        </p>
      </div>
    </footer>
  );
}
