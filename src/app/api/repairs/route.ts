import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - All repairs
export async function GET() {
  try {
    const repairs = await prisma.repair.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(repairs);
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return NextResponse.json(
      { error: "Failed to fetch repairs" },
      { status: 500 }
    );
  }
}

// POST - Create new repair
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      contactNumber,
      deviceType,
      deviceModel,
      problemDesc,
      repairCost,
      technicianCost,
      profit,
    } = body;

    const repair = await prisma.repair.create({
      data: {
        customerName,
        contactNumber,
        deviceType,
        deviceModel,
        problemDesc,
        repairCost: parseFloat(repairCost),
        technicianCost: parseFloat(technicianCost),
        profit: parseFloat(profit),
      },
    });

    return NextResponse.json(repair, { status: 201 });
  } catch (error) {
    console.error("Error creating repair:", error);
    return NextResponse.json(
      { error: "Failed to create repair" },
      { status: 500 }
    );
  }
}