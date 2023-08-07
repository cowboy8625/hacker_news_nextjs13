import prisma from "@/lib/prisma";
import ChallengeSiteComment from "@/lib/challenge-site-comment";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params } : { params : { id : string } },
  ): Promise<NextResponse<Array<ChallengeSiteComment>>> {
  const data = await prisma.comment.findMany({
    where: {
      hackerPostId: Number(params.id),
    },
    include: {
      user: true,
    },
  });

  const comments = data.map((c) => ({
      content: c.content,
      author: c.user?.name ?? "unknown",
  }));

  return NextResponse.json(comments);
}

