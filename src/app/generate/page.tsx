"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/progress";
import { Download, Flower2, Loader2, Wand2, Share } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@radix-ui/react-switch";
import classNames from "classnames";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * @name PredictionStatus
 * @description The status of a prediction not related to the Replicate API
 * @type {string}
 */
type PredictionStatus = "initial" | "loading" | "error" | "succeeded";

type Scheduler = "DDIM" | "K_EULER" | "DPMSolverMultistep";

interface AdvancedPrompt {
  negativePrompt: string;
  scheduler: Scheduler;
  inferenceSteps: number;
  seed: number;
}

export default function Page() {
  const [prompt, setPrompt] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [predictionStatus, setPredictionStatus] =
    useState<PredictionStatus>("initial");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [isAdvancedPromptEnabled, setIsAdvancedPromptEnabled] = useState(false);
  const [advancedPrompt, setAdvancedPrompt] = useState<AdvancedPrompt>({
    negativePrompt: "",
    scheduler: "K_EULER",
    inferenceSteps: 50,
    seed: 0,
  });

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

  const getLatestPercentage = (logs: any): number => {
    const regex = /(\d+)%\|.*?$/gm;
    let match;
    let lastPercentage;
    while ((match = regex.exec(logs))) {
      lastPercentage = match[1];
    }
    return Number(lastPercentage);
  };

  const handleShare = async () => {
    const blob = await fetch(imageUrl).then((r) => r.blob());
    const filesArray = [
      new File([blob], `${replaceSpacesWithDashes(prompt)}.png`, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      }),
    ];
    navigator.share({
      title: `${prompt} - dreamify.art`,
      text: `${prompt} - dreamify.art`,
      files: filesArray,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prompt === "") {
      setError("Write a prompt to generate an image.");
      setPredictionStatus("error");
      setIsAlertOpen(true);
      return;
    }

    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, advancedPrompt }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      setPredictionStatus("error");
      setIsAlertOpen(true);
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
      setPercentage(getLatestPercentage(prediction.logs));
      if (response.status !== 600) {
        setError(prediction.detail);
        setPredictionStatus("error");
        setIsAlertOpen(true);
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
    <main className="px-4 py-4 min-h-[60vh] flex flex-col lg:flex-row m-auto max-w-5xl gap-x-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full m-auto lg:m-0 max-w-lg"
      >
        <div className="flex flex-col lg:flex-row gap-y-2  gap-x-2 w-full">
          <Input
            type="text"
            placeholder="Describe what you want"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={600}
            disabled={predictionStatus === "loading"}
          />
          <Button type="submit" className="text-[16px] sm:text-sm" disabled={predictionStatus === "loading"}>
            <Wand2 className="mr-2 h-5 w-5" />
            {predictionStatus === "loading" ? "Generating" : "Generate"}
          </Button>
        </div>
        <div className="mt-3 lg:mt-3">
          <Progress value={percentage} />
        </div>
        <div className="flex flex-col w-full mb-3 lg:mb-0">
          <label className="inline-flex items-center mt-3">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-slate-600 dark:text-slate-400"
              checked={isAdvancedPromptEnabled}
              onChange={() =>
                setIsAdvancedPromptEnabled(!isAdvancedPromptEnabled)
              }
            />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              Enable advanced features for prompts
            </span>
          </label>
          <div className={classNames("flex flex-col gap-x-2 gap-y-2 py-4 px-4 border dark:border-slate-900 rounded mt-3 lg:mt-4", {
            "hidden": !isAdvancedPromptEnabled,
          })}>
            <div>
              <Label htmlFor="negativePrompt">Negative Prompt: Specify things you do not want not see</Label>
              <Input type="text" id="negativePrompt" placeholder="" className="mt-2" value={advancedPrompt.negativePrompt}
                onChange={(e) => {
                  setAdvancedPrompt({
                    ...advancedPrompt,
                    negativePrompt: e.target.value,
                  });
                }}

              />
            </div>
            <div className="flex gap-x-4">
              <div>
                <Label htmlFor="inferenceSteps">Number of denoising steps (minimum: 1; maximum: 500)</Label>
                <Input type="number" id="inferenceSteps" placeholder="Inference steps" className="mt-2" value={advancedPrompt.inferenceSteps}
                  onChange={(e) => {
                    setAdvancedPrompt({
                      ...advancedPrompt,
                      inferenceSteps: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="seed">Random seed. Leave blank to randomize the seed</Label>
                <Input type="number" id="seed" placeholder="0" className="mt-2" value={advancedPrompt.seed}
                  onChange={(e) => {
                    setAdvancedPrompt({
                      ...advancedPrompt,
                      seed: Number(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2  w-full">
              <Label htmlFor="email">Scheduler</Label>
              <Select defaultValue="k_euler" onValueChange={(value: Scheduler) => {
                setAdvancedPrompt({
                  ...advancedPrompt,
                  scheduler: value,
                });
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a scheduler" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectItem value="ddim" defaultChecked>DDIM</SelectItem>
                    <SelectItem value="k_euler">K_EULER</SelectItem>
                    <SelectItem value="dpmsolvermultistep">DPMSolverMultistep</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>

      <div className="m-auto max-w-lg lg:m-0 lg:flex-1">
        <div>
          <div className="w-full relative aspect-square rounded bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center gap-y-4">
            {prediction && prediction.output ? (
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt={prompt}
                title={prompt}
                sizes="100vw"
                className="rounded-lg"
              />
            ) : (
              <>
                {(prediction && prediction.status === "processing") ||
                  (prediction && prediction.status === "starting") ? (
                  <Loader2 className="mr-2 h-12 w-12 animate-spin text-slate-700 dark:text-white" />
                ) : (
                  <Flower2 className="h-12 w-12 text-slate-700 dark:text-white" />
                )}
                <p
                  className="text-slate-700 text-center px-8 dark:text-white"
                  role="status"
                >
                  {prediction &&
                    prediction.status === "starting" &&
                    "Starting the model..."}
                  {prediction &&
                    prediction.status === "processing" &&
                    "Creating the image..."}
                  {predictionStatus === "initial" &&
                    "Here you can see the generated image..."}
                  {predictionStatus === "error" && error}
                </p>
              </>
            )}
          </div>
          {predictionStatus === "succeeded" && (
            <div>
              <div className="flex flex-col lg:flex-row gap-y-2 py-2 gap-x-2">
                <Button
                  onClick={handleDownloadImage}
                  variant={"outline"}
                  className="w-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download image
                </Button>
                <Button
                  onClick={handleShare}
                  variant={"outline"}
                  className="w-full flex sm:hidden"
                >
                  <Share className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertDialog onOpenChange={setIsAlertOpen} open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
