"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import Head from "next/head";
import { Loader2 } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (prompt === "") {
      window.alert("Please enter a prompt");
      return;
    }

    e.preventDefault();
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    // Poll for prediction status
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/image/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  return (
    <main className="px-4">
      <Head>
        <title>Dreamify</title>
      </Head>
      <h1 className="text-5xl leading-normal text-center my-8 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700 select-none dark:from-white dark:to-white">
        Dreamify
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-y-2 m-auto max-w-lg gap-x-2"
      >
        <input
          type="text"
          placeholder="Enter a prompt to display an image"
          className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="active:scale-95 inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:hover:bg-blue-800 dark:hover:text-blue-100 disabled:opacity-50 dark:focus:ring-blue-400 disabled:pointer-events-none dark:focus:ring-offset-blue-900 data-[state=open]:bg-blue-100 dark:data-[state=open]:bg-blue-800 bg-blue-700 text-white hover:bg-blue-700 dark:bg-blue-50 dark:text-blue-900 px-2 py-2 lg:px-4"
        >
          Dream
        </button>
      </form>

      {(prediction && prediction.status === "starting") ||
        (prediction && prediction.status === "processing" && (
          <div className="m-auto max-w-lg pt-8 flex justify-center">
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-blue-500" />
          </div>
        ))}

      <div className="m-auto max-w-lg mt-3 lg:mt-6 text-center">
        {error && <p className="text-red-400 dark:text-red-300">{error}</p>}
      </div>

      {prediction && (
        <div className="m-auto max-w-lg mt-3 lg:mt-6">
          {prediction.output && (
            <div>
              <div className="w-full relative aspect-square rounded">
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes="100vw"
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
