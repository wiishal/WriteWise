import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/handleApiError";
import { prisma } from "@/prisma";
import { AppError } from "@/lib/error/error";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId || "" },
    });

    if (!user) {
      throw new AppError("Unauthorized! sign in", 401, "UNAUTHORIZED");
    }

    const progressStats = await prisma.writingAnalysis.aggregate({
      where: { userId: user.id },
      _avg: {
        clarityScore: true,
        structureScore: true,
        grammarScore: true,
      },
      _count: true,
    });

    
    return NextResponse.json(
      {
        success: true,
        progress: {
          totalWritings: progressStats._count,
          clarityAvg: Math.round(progressStats._avg.clarityScore ?? 0),
          structureAvg: Math.round(progressStats._avg.structureScore ?? 0),
          grammarAvg: Math.round(progressStats._avg.grammarScore ?? 0),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
