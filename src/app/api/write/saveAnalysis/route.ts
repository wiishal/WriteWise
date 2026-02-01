import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/error/error";
import { handleApiError } from "@/lib/error/handleApiError";
import { saveAnalysisConstant } from "@/validation/writeConstants";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId || "" },
    });

    if (!user) {
      throw new AppError("Unauthorized! sign in", 401, "UNAUTHORIZED");
    }
    const analysis = await req.json();

    if (!analysis) {
      throw new AppError("Error while getting Body", 401, "INVALID_INPUT");
    }
    const { success } = saveAnalysisConstant.safeParse(analysis);
    if (!success) {
      throw new AppError(
        "Field to save analysis are incomplete",
        401,
        "INVALID_INPUT",
      );
    }

    const saveAnalysis = await prisma.writingAnalysis.create({
      data: { userId: user.id, ...analysis },
    });

    return NextResponse.json(
      {
        success: true,
        message: "saved!",
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
