import { NextResponse } from "next/server";
import { db } from "@/db";
import { bloodInventory } from "@/db/schema";

export async function GET() {
  try {
    const inventory = await db.select().from(bloodInventory);
    return NextResponse.json(inventory);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
