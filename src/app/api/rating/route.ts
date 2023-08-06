import prisma from "@/lib/prisma";

export async function POST(request: Request) {

  const body: RequestBody = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    }
  })

  return new Response(JSON.stringify(body));
}
