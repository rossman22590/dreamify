import { Inter } from "next/font/google";
import "./globals.css";

/**
 * @name metadata
 * @description Metadata for the page.
 * @link https://beta.nextjs.org/docs/api-reference/file-conventions/head
 */
export const metadata = {
  title: "Dreamify",
  description: "A simple generator of images from AI. Using Stable Diffusion. Built on Next.js 13.2",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
