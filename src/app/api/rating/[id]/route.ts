import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params } : { params : { id : string } },
  ): Promise<NextResponse<number>> {
  const data = await prisma.rating.findMany({
    where: {
      hackerPostId: Number(params.id),
    }
  });
  const count = data.length;
  const total = data.reduce((acc, c, _) => acc + c.rating, 0)
  const average = Math.ceil(total/count);
  return NextResponse.json(average);
}

