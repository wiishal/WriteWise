import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { AppError } from "@/lib/error/error";
import { handleApiError } from "@/lib/error/handleApiError";

//fetch email tasks based on level
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const level = Number(searchParams.get("level") ?? "1");
  
  if (Number.isNaN(level)) {
    throw new AppError("Invalid level parameter", 400, "INVALID_QUERY_PARAM");
  }

  try {
    const tasks = await prisma.emailTask.findMany({
      where: {
        level: level,
      },
    });
    return NextResponse.json({ success: true, tasks }, { status: 200 });

  } catch (error) {

    return handleApiError(error);
  }

}
