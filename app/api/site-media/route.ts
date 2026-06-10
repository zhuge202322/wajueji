import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const socialKeys = ["social_fb", "social_ins", "social_ws", "social_tk"];

export async function GET() {
  const rows = await prisma.siteMedia.findMany({
    where: { key: { in: socialKeys } },
    select: { key: true, url: true }
  });

  const map = Object.fromEntries(socialKeys.map((key) => [key, ""]));
  for (const row of rows) {
    map[row.key] = row.url;
  }

  return NextResponse.json(map);
}
