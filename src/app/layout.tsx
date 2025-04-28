// src/app/layout.tsx
import { createClient } from "@/prismicio";
import "@/app/styles/globals.css";
import Header          from "@/components/Header";
import MobileNav       from "@/components/MobileNav";
import Footer          from "@/components/Footer";
import ShowCanvasOnHome from "@/components/ShowCanvasOnHome";
import localFont       from "next/font/local";

const alpino = localFont({
  src: "/fonts/Alpino-Variable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-alpino",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client   = createClient();
  const settings = await client.getSingle("settings");

  return (
    <html
      lang="en"
      className={`${alpino.variable} scroll-smooth suppressHydrationWarning`}
    >
      <head />
      <body className="relative overflow-x-hidden max-w-full min-h-screen bg-black text-white">
        <div
          id="initial-loader"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
        </div>
        <ShowCanvasOnHome />

        <Header items={settings.data.navigation} />
        <MobileNav items={settings.data.navigation} />
        {children}
        <Footer />
      </body>
    </html>
  );
}