import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  const accessToken = request.headers.get("authorization");
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }

  const body: RequestBody = await request.json();


  const user = await prisma.user.findFirst({
    where: {
      id: Number(body.authorId),
    },
    include: {
      ratings: true,
    }
  });
  const data = user.ratings
      .filter(r => r.hackerPostId == Number(body.hackerPostId));
  if (data.length == 0) {
    const _ = await prisma.rating.create({
      data: {
        hackerPostId: Number(body.hackerPostId),
        rating: Number(body.rating),
        userId: Number(body.authorId),
      }
    });
    return new Response(JSON.stringify(null));
  }
  const rating = await prisma.rating.update({
    where: {
      id: data[0].id,
    },
    data: { rating: Number(body.rating) },
  });

  if (rating) {
    return new Response(JSON.stringify({rating, body}));
  }
  return new Response(JSON.stringify(null));
}
