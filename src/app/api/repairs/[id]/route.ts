import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const repair = await prisma.repair.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error("Error updating repair:", error);
    return NextResponse.json(
      { error: "Failed to update repair" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.repair.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting repair:", error);
    return NextResponse.json(
      { error: "Failed to delete repair" },
      { status: 500 }
    );
  }
}