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


  const body = await request.json();

  const comment = await prisma.comment.create({
    data: {
      hackerPostId: Number(body.hackerPostId),
      content: body.comment,
      userId: Number(body.authorId),
    }
  });
  return new Response(JSON.stringify(null));
}
