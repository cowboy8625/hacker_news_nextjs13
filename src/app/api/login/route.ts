import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {

  const body: RequestBody = await request.json();

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    }
  })

  console.log("login: ", body);
  if(user && (await bcrypt.compare(body.password, user.password))) {
    console.log(user);
    const {password, ...userWithoutPass} = user;
    return new Response(JSON.stringify(userWithoutPass));
  }

  return new Response(JSON.stringify(null));
}
