import { Inter } from "next/font/google";
import "./globals.css";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";

/**
 * @name metadata
 * @description Metadata for the page.
 * @link https://beta.nextjs.org/docs/api-reference/file-conventions/head
 */
export const metadata = {
  title: "Dreamify",
  description:
    "A simple generator of images from AI. Using Stable Diffusion. Built on Next.js 13.2",
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
            <ImageIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl leading-normal text-center my-3 lg:my-8 font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700 select-none dark:from-white dark:to-white">
              Dreamify
            </h1>
          </Link>
        </header>
        {children}
        <footer className="bg-white md:flex dark:bg-black mt-12 border border-t-slate-600 border-transparent">
          <div className="m-auto max-w-4xl md:py-4 flex w-full flex-col md:flex-row md:justify-between">
            <div className="">
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
            <div>
              <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                  <a
                    href="https://github.com/360macky/dreamify"
                    target="_blank"
                    className="mr-4 hover:underline md:mr-6 "
                  >
                    Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/360macky/dreamify/blob/main/LICENSE"
                    target="_blank"
                    className="mr-4 hover:underline md:mr-6"
                  >
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
