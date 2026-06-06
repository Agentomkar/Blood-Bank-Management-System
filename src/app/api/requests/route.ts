import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bloodRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(bloodRequests)
      .orderBy(desc(bloodRequests.requestedAt));
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRequest = await db
      .insert(bloodRequests)
      .values({
        patientName: body.patientName,
        hospitalName: body.hospitalName,
        bloodGroup: body.bloodGroup,
        unitsNeeded: parseInt(body.unitsNeeded),
        urgency: body.urgency || "normal",
        contactPhone: body.contactPhone,
        notes: body.notes,
      })
      .returning();

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
