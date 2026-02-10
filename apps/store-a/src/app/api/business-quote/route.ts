import { NextResponse } from "next/server";

/**
 * Business quote form submission.
 * Replace with real email/CRM integration as needed.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Honeypot: reject if company_website is set
    if (body.company_website) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    // TODO: send email, save to CRM, etc.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
