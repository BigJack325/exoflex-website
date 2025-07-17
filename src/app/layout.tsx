import { createClient } from "@/prismicio"
import "@/app/styles/globals.css"
import Header from "@/components/Header"
import MobileNav from "@/components/MobileNav"
import Footer from "@/components/Footer"
import ShowCanvasOnHome from "@/components/ShowCanvasOnHome"
import localFont from "next/font/local"

const tomatoGrotesk = localFont({
  src: [
    { path: "/fonts/TomatoGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "/fonts/TomatoGrotesk-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "/fonts/TomatoGrotesk-SemiBoldSlanted.woff2", weight: "600", style: "italic" },
    { path: "/fonts/TomatoGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "/fonts/TomatoGrotesk-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-tomato",
  display: "swap",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = createClient()
  const settings = await client.getSingle("settings")

  return (
    <html
      lang="en"
      className={`${tomatoGrotesk.variable} scroll-smooth suppressHydrationWarning`}
    >
      <head />
      <body className="relative overflow-x-hidden max-w-full min-h-screen bg-black text-white">

        <div
          id="initial-loader"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        ></div>

        <ShowCanvasOnHome />
        <Header items={settings.data.navigation} />
        <MobileNav items={settings.data.navigation} />
        {children}
        <Footer />
      </body>
    </html>
  )
}