import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params } : { params : { id : string } },
  ): Promise<number> {
  const data = await prisma.rating.findMany({
    where: {
      hackerPostId: Number(params.id),
    }
  });
  const i = data.reduce((acc, c, _) => acc + c.rating, 0)
  return new Response(JSON.stringify(i));
}

