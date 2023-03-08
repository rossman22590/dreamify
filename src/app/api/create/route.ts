import { NextRequest, NextResponse } from "next/server";
import rateLimit from "@/utils/rate-limit";

type RequestBody = {
  prompt: string;
};

// 8 requests per hour
const REQUESTS_PER_INTERVAL = 8;
const INTERVAL = 60 * 1000 * 60;
const limiter = rateLimit({ interval: INTERVAL });

/**
 * @name POST /api/create
 * @summary Generate a new image from a text prompt
 * @param request {NextRequest}
 */
export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();
  const prompt: string = body.prompt;

  if (!prompt) {
    return NextResponse.json({ detail: "Prompt is required" }, { status: 400 });
  }

  if (prompt.length >= 84) {
    return NextResponse.json(
      { detail: "Prompt must be less than 42 characters" },
      { status: 400 }
    );
  }

  // TODO: Create a cancel prediction endpoint that allows the user to cancel a prediction.
  // https://replicate.com/docs/reference/http#cancel-prediction

  const { isLimitExceeded, responseHeaders } = limiter.check(
    REQUESTS_PER_INTERVAL
  );

  const getCurrentHourPlusOne = () => {
    const date = new Date();
    const hour = date.getHours() + 1;
    const minutes = date.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${minutesFormatted} ${ampm}`;
  };

  if (isLimitExceeded) {
    return NextResponse.json(
      {
        detail: `Rate limit exceeded. Please try again later in 1 hour (around ${getCurrentHourPlusOne()}).`,
      },
      { status: 429, headers: responseHeaders }
    );
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version:
        "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    return NextResponse.json(
      { detail: error.detail },
      { status: 500, headers: responseHeaders }
    );
  }

  const prediction = await response.json();
  return NextResponse.json(
    { ...prediction },
    { status: 201, headers: responseHeaders }
  );
}
