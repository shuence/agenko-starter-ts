import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat/chat";
import { getModelId, hasGatewayAuth } from "@/lib/ai/model";
import { DEMO_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Chat with an agent whose actions leave receipts and whose irreversible moves wait for you.",
};

export default async function ChatPage() {
  const jar = await cookies();
  const raw = jar.get(DEMO_COOKIE)?.value;
  if (!raw) redirect("/login?next=/chat");

  let email = raw;
  try {
    email = decodeURIComponent(raw);
  } catch {
    /* keep the raw value */
  }

  const consoleUrl = (
    process.env.AGENKO_CONSOLE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  return (
    <Chat
      model={getModelId()}
      consoleUrl={consoleUrl}
      configured={hasGatewayAuth()}
      user={email}
    />
  );
}
