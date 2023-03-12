import { NextRequest, NextResponse } from "next/server";

/**
 * @name GET /api/image/:id
 * @summary Get an image from Replicate API of Stable Diffusion by ID
 * @param _request {NextRequest}
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${id}`,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    let error = await response.json();
    return NextResponse.json({ detail: error.detail }, { status: 500 });
  }

  const prediction = await response.json();
  return NextResponse.json(prediction, { status: 200 });
}
