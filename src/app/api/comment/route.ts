import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

export async function POST(
  request: Request
): Promise<Response> {
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

  const comment = await prisma.comment.update({
    data: {
      hackerPostId: Number(body.hackerPostId),
      content: body.comment,
      userId: Number(body.authorId),
    }
  });

  return new Response(
      JSON.stringify({
        success: "created comment",
        hackerPostId: body.hackerPostId,
        commentId: comment.id,
      }),
      {
        status: 202,
      }
    );
}

// to delete a comment send comment ID
export async function DELETE(
  request: Request
): Promise<Response> {
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

  const comment = await prisma.comment.delete({
    where: {
      id: Number(body.commentId),
    }
  });
  return new Response(
      JSON.stringify({
        success: `deleted comment id: ${body.hackerPostId}`,
        hackerPostId: body.hackerPostId,
        commentId: body.commentId,
      }),
      {
        status: 202,
      }
    );
}

export async function PATCH(
  request: Request
): Promise<Response> {
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

  const comment = await prisma.comment.update({
    where: {
      id: Number(body.commentId),
    },
    data: {
      content: body.comment,
    }
  });

  return new Response(
      JSON.stringify({
        success: `updated comment id: ${body.hackerPostId}`,
        hackerPostId: body.hackerPostId,
        commentId: body.commentId,
      }),
      {
        status: 202,
      }
    );
}
