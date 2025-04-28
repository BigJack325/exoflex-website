import ContactForm from "@/components/ContactForm";
import { createClient } from "@/prismicio";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const client = createClient();
  const page = await client.getSingle("contact_page");

  return {
    title: page.data.meta_title || "Contact Us",
    description: page.data.meta_description || "Get in touch with us.",
    openGraph: {
      title: page.data.meta_title || "Contact Us",
      description: page.data.meta_description || "Get in touch with us.",
      images: page.data.meta_image?.url ? [{ url: page.data.meta_image.url }] : [],
    }
  };
};
export default function ContactPage() {
  return (
    <main className="mx-auto z-10 max-w-3xl px-4 py-6 pt-30">
      <h1 className="mb-12 text-center text-5xl font-extrabold text-white">
        Contact&nbsp;us
      </h1>
      <ContactForm />
    </main>
  );
}