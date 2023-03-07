"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Wand2 } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * @name PredictionStatus
 * @description The status of a prediction
 * @type {string}
 * initial: Default status
 * starting: The prediction has been sent to the server
 */
type PredictionStatus =
  | "initial"
  | "starting"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled";

export default function Page() {
  const [prompt, setPrompt] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [predictionStatus, setPredictionStatus] =
    useState<PredictionStatus>("initial");

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
    a.setAttribute("download", "generated-image.png");
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
      console.log(prediction);
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

      {(prediction && prediction.status === "starting") ||
        (prediction && prediction.status === "processing" && (
          <div className="m-auto max-w-lg pt-8 flex justify-center">
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-blue-500 dark:text-white" />
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
              <div className="flex py-2">
                <Button onClick={handleDownloadImage} className="w-full">
                  Download image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
