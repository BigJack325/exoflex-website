import { createClient } from "@/prismicio";
import Image from "next/image";
import { PrismicRichText, PrismicLink } from "@prismicio/react";
import React from "react";
import type { Content } from "@prismicio/client";
import { Metadata } from "next";

type MemberDocument = Content.MemberDocument;

export const generateMetadata = async (): Promise<Metadata> => {
  const client = createClient();
  const page = await client.getSingle("team_page");

  return {
    title: page.data.meta_title || "Our Team - ExoFlex",
    description: page.data.meta_description || "Meet the passionate team behind ExoFlex.",
    openGraph: {
      title: page.data.meta_title || "Default Title",
      description: page.data.meta_description || undefined,
      images: page.data.meta_image?.url
        ? [{ url: page.data.meta_image.url }]
        : [],
    }
  };
};

export default async function TeamPage() {
  const client = createClient();

  const team = await client.getAllByType<MemberDocument>("member", {
    orderings: [{ field: "my.member.order", direction: "asc" }],
  });

  if (team.length === 0) {
    return (
      <p className="px-6 py-24 text-center text-gray-400">
        L’équipe sera ajoutée sous peu…
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 pt-30 sm:px-6 lg:px-8">
      <h1 className="mb-16 text-center text-5xl font-extrabold tracking-tight">
        Our Team
      </h1>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => {
          const {
            first_name,
            last_name,
            avatar,
            linkedin_link,
            bio,
            role,
          } = member.data;

          const Card = () => (
            <article
              className="relative flex flex-col items-center rounded-2xl
                         bg-white/8 p-8 text-center shadow-lg backdrop-blur-lg
                         transition-transform duration-300
                         hover:-translate-y-2 focus-visible:-translate-y-2
                         hover:shadow-[0_0_40px_10px_rgba(34,197,94,0.45)]
                         focus-visible:shadow-[0_0_40px_10px_rgba(34,197,94,0.45)]"
            >
              <div className="relative mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-[#107df4]">
                {avatar?.url ? (
                  <Image
                    src={avatar.url}
                    alt={avatar.alt ?? `${first_name} ${last_name}` ?? "Photo membre"}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-gray-700" />
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {first_name || last_name
                  ? `${first_name} ${last_name}`
                  : "(Nom)"}
              </h2>

              {role && (
                <p className="mt-1 text-sm uppercase tracking-widest text-primary-400">
                  {role}
                </p>
              )}

              {bio && (
                <PrismicRichText
                  field={bio}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="mt-4 text-sm leading-relaxed text-gray-300">
                        {children}
                      </p>
                    ),
                  }}
                />
              )}
            </article>
          );

          return linkedin_link ? (
            <PrismicLink
              key={member.id}
              field={linkedin_link}
              className="block focus:outline-none focus-visible:ring"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card />
            </PrismicLink>
          ) : (
            <div key={member.id}>
              <Card />
            </div>
          );
        })}
      </div>
    </main>
  );
}