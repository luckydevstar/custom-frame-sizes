import { NextResponse } from "next/server";

/**
 * Accepts payloads from `/business` (program quote form) and `/business/quote` (short form).
 * Honeypot `company_website` from the main page: silent success without persisting when filled.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    const honeypot = record.company_website;
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.info("[business-quote]", JSON.stringify(body));
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
