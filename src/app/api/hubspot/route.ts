import { NextRequest, NextResponse } from "next/server";

const PORTAL_ID = "242121062";
const FORM_ID   = "7ce35fdc-8cc4-4fab-957e-2f1673d31d39";
const HS_URL    = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

export async function POST(req: NextRequest) {
  const { email, firstname, lastname, message } = await req.json();

  /* Payload minimal pour HubSpot */
  const hsBody = {
    fields: [
      { name: "email",     value: email },
      { name: "firstname", value: firstname || "" },
      { name: "lastname",  value: lastname  || "" },
      { name: "message",   value: message },
    ],
    context: {
      pageUri:  req.headers.get("referer") ?? "",
      pageName: "Contact us",
    },
  };

  const resp = await fetch(HS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hsBody),
  });

  if (!resp.ok) {
    const hubErr = await resp.json();
    return NextResponse.json({ ok: false, hubspot: hubErr }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}