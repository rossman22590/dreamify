"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Download, Flower2, Loader2, Wand2 } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * @name PredictionStatus
 * @description The status of a prediction not related to the Replicate API
 * @type {string}
 */
type PredictionStatus =
  | "initial"
  | "loading"
  | "error"
  | "succeeded";

export default function Page() {
  const [prompt, setPrompt] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [predictionStatus, setPredictionStatus] =
    useState<PredictionStatus>("initial");

  const replaceSpacesWithDashes = (str: string) => {
    return str.replace(/\s+/g, "-").toLowerCase();
  };

  /**
   * @name handleDownloadImage
   * @description Download the generated image from imageUrl
   */
  const handleDownloadImage = async () => {
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    const blob = await fetch(imageUrl).then((r) => r.blob());
    a.href = window.URL.createObjectURL(blob);
    a.setAttribute("download", `${replaceSpacesWithDashes(prompt)}.png`);
    a.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prompt === "") {
      window.alert("Please enter a prompt");
      return;
    }

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
      setPredictionStatus("error");
      return;
    }
    setPrediction(prediction);
    setPredictionStatus("loading");

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
        setPredictionStatus("error");
        return;
      }
      if (prediction.status === "succeeded") {
        setImageUrl(prediction.output[prediction.output.length - 1]);
        setPredictionStatus("succeeded");
      }
      setPrediction(prediction);
    }
  };

  return (
    <main className="px-4 min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-y-2 m-auto max-w-lg gap-x-2"
      >
        <Input
          type={"text"}
          placeholder={"Enter a prompt to display an image"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={42}
        />
        <Button type="submit">
          <Wand2 className="mr-2 h-5 w-5" />
          Generate
        </Button>
      </form>

      <div className="m-auto max-w-lg mt-3 lg:mt-6">
        <div>
          <div className="w-full relative aspect-square rounded bg-slate-100 flex flex-col justify-center items-center gap-y-4">
            {prediction && prediction.output ? (
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
                className="rounded-lg"
              />
            ) : (
              <>
                {(prediction && prediction.status === "processing") || (prediction && prediction.status === "starting") ? (
                  <Loader2 className="mr-2 h-12 w-12 animate-spin text-slate-700 dark:text-white" />
                ) : (
                  <Flower2 className="h-12 w-12 text-slate-700" />
                )}
                <p className="text-slate-700" role="status">
                  {prediction && prediction.status === "starting" && "Starting the model..."}
                  {prediction && prediction.status === "processing" && "Creating the image..."}
                  {predictionStatus === "initial" && "Here you can see the generated image..." }
                  {predictionStatus === "error" && error}
                </p>
              </>
            )}
          </div>
          <div>
            <div className="flex py-2">
              <Button
                onClick={handleDownloadImage}
                variant={"outline"}
                className="w-full"
              >
                <Download className="mr-2 h-5 w-5" />
                Download image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
