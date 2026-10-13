import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Contact endpoint: validates the input, filters obvious spam, then stores the message in the
// Supabase table public.contact_submissions.

const LIMITS = { name: 120, phone: 40, subject: 200, message: 4000 } as const;
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field or submit instantly; answer quietly.
  if (clean(body.website, 200) || Number(body.elapsed) < 2500) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const phone = clean(body.phone, LIMITS.phone);
  const subject = clean(body.subject, LIMITS.subject);
  const message = clean(body.message, LIMITS.message);
  if (!name || !subject || message.length < 2) {
    return NextResponse.json({ error: "Please fill in your name, a subject and a message." }, { status: 400 });
  }
  if (phone && !/^[+()\d\s.-]{5,40}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const { error } = await supabase().from("contact_submissions").insert({
    name,
    phone: phone || null,
    subject,
    message,
    source_page: req.headers.get("referer")?.slice(0, 500) ?? null,
    ip_address: /^[\d.:a-fA-F]+$/.test(ip) ? ip : null,
    user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
  });
  if (error) {
    console.error("contact insert failed", error);
    return NextResponse.json({ error: "Your message could not be sent. Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
