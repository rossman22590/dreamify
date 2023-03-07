import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Wand2 } from "lucide-react";
import { Cog } from "lucide-react";

export default function Home() {
  return (
    <main className="px-4 lg:px-0 flex justify-center flex-col items-center">
      <div className="flex justify-center flex-col items-center py-12 gap-y-6">
        <h1 className="text-7xl font-extrabold text-center">
          Describe your dream,
          <br />
          generate an image
        </h1>
        <p className="text-xl text-slate-800 dark:text-slate-200">
          Powered by <span>Stable Diffusion</span> with <span>Replicate</span>
        </p>
        {/*
          Statically Typed Link 
          https://nextjs.org/blog/next-13-2#statically-typed-links
         */}
        <div className="flex flex-row gap-x-2">
          <Link href="/generate">
            <Button size={"lg"} className="text-lg">
              <Wand2 className="mr-2 h-5 w-5" />
              Open generator
            </Button>
          </Link>
          <Link href="/">
            <Button variant={"outline"} size={"lg"} className="text-lg">
              <Cog className="mr-2 h-5 w-5" />
              How to use
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
