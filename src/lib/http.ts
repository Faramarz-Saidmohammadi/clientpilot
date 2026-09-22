import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorResponse(error: unknown, fallback = "Request failed") {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
