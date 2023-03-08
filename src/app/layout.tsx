import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo.png";
import { Github, Twitter } from "lucide-react";
import { Analytics } from '@vercel/analytics/react';

/**
 * @name metadata
 * @description Metadata for the page.
 * @link https://beta.nextjs.org/docs/api-reference/file-conventions/head
 */
export const metadata = {
  title: "Dreamify",
  description:
    "A simple generator of images with AI. Using Stable Diffusion. Built on Next.js 13.2",
  keywords: ["stable-diffusion", "machine-learning"],
  generator: "Next.js",
  openGraph: {
    siteName: "Dreamify - A simple generator of images with AI.",
    images: [
      {
        url: "https://dreamify-art.vercel.app/cover.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://dreamify-art.vercel.app/cover_lg.png",
        width: 1800,
        height: 1600,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://dreamify-art.vercel.app/cover_lg.png",
        width: 1800,
        height: 1600,
      }
    ]
  }
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header className="flex flex-row items-center gap-x-4 justify-center">
          <Link href="/" className="flex flex-row items-center gap-x-4">
            <Image
              src={Logo}
              alt="Dreamify logo"
              className="h-12 w-12 select-none"
            />
            <h1 className="text-4xl leading-normal text-center my-3 lg:my-8 font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700 select-none dark:from-white dark:to-white">
              Dreamify
            </h1>
          </Link>
        </header>
        {children}
        <footer className="bg-white md:flex dark:bg-black mt-12 border border-t-slate-600 border-transparent">
          <div className="m-auto max-w-4xl md:py-4 flex w-full flex-col justify-center md:flex-row md:justify-between">
            <div className="flex justify-center items-center mt-3 md:mt-0">
              <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © 2023 Dreamify. Created by{" "}
                <a
                  href="https://github.com/360macky"
                  target="_blank"
                  className="hover:underline underline-offset-4"
                >
                  Marcelo Arias
                </a>
              </span>
            </div>
            <div className="flex justify-center">
              <ul className="flex flex-wrap justify-center my-3 md:my-0 items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 gap-x-2">
                <li className="flex justify-center">
                  <a
                    href="https://github.com/360macky/dreamify"
                    target="_blank"
                    className="hover:underline underline-offset-4"
                  >
                    <Github className="hover:text-white" />
                  </a>
                </li>
                <li className="flex justify-center">
                  <a
                    href="https://twitter.com/360macky/status/1633454258660995072"
                    target="_blank"
                    className="hover:underline underline-offset-4"
                  >
                    <Twitter className="hover:text-white" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
