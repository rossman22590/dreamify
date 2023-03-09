import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Rocket, Wand2 } from "lucide-react";

import Sunset from "../assets/sunset.png";
import Space from "../assets/space.png";
import Flower from "../assets/flower.png";

export default function Home() {
  return (
    <main className="px-4 lg:px-0 flex justify-center flex-col items-center">
      <section className="flex justify-center flex-col items-center py-6 lg:py-12 gap-y-6 lg:gap-y-12">
        <h1 className="text-4xl lg:text-7xl font-extrabold text-center leading-snug lg:leading-tight">
          Generates an{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-200">
            image
          </span>{" "}
          <br className="hidden lg:inline-block" /> just from{" "}
          <span className="bg-black text-white dark:text-black dark:bg-white">
            [text]
          </span>
        </h1>
        <p className="lg:text-lg text-slate-800 dark:text-slate-200 text-center border dark:border-white px-8 py-1 rounded-full">
          Generated over <b>150</b> images!
        </p>
        <p className="lg:text-xl text-slate-800 dark:text-slate-200 text-center hidden">
          Powered by{" "}
          <a
            href="/"
            target="_blank"
            className="hover:underline underline-offset-4"
          >
            Stable Diffusion
          </a>{" "}
          with{" "}
          <a
            href="/"
            target="_blank"
            className="hover:underline underline-offset-4"
          >
            Replicate
          </a>
        </p>
        {/*
          Statically Typed Link 
          https://nextjs.org/blog/next-13-2#statically-typed-links
         */}
        <div className="flex flex-col w-full lg:w-auto lg:flex-row gap-x-2 gap-y-2">
          <Link href="/generate">
            <Button size={"lg"} className="text-lg w-full">
              <Wand2 className="mr-2 h-5 w-5" />
              Open generator
            </Button>
          </Link>
          {/* <Link href="/">
            <Button variant={"outline"} size={"lg"} className="text-lg w-full">
              <Cog className="mr-2 h-5 w-5" />
              How to use
            </Button>
          </Link> */}
        </div>
      </section>
      <section className="max-w-3xl">
        <div className="flex flex-col lg:flex-row gap-x-4 gap-y-4">
          <Image
            src={Sunset}
            alt="Sunset of Rio"
            title="Sunset of Rio"
            className="rounded-lg hover:md:scale-105 transition lg:h-64 lg:w-64"
          />
          <Image
            src={Space}
            alt="Space with the Earth"
            title="Space with the Earth"
            className="rounded-lg hover:md:scale-105 transition lg:h-64 lg:w-64"
          />
          <Image
            src={Flower}
            alt="Red flower"
            title="Red flower"
            className="rounded-lg hover:md:scale-105 transition lg:h-64 lg:w-64"
          />
        </div>
      </section>
    </main>
  );
}
