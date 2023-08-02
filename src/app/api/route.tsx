import {
  getTop,
  NextResponse,
} from "./share"

export async function GET(): Promise<NextResponse<Array<Number>>> {
  const ids = await getTop();
  return NextResponse.json(ids.slice(0, 10));
}

export async function POST(req: Request) {
  const search = await req.formData();
  console.log('body: ', search.get("search"));
}
