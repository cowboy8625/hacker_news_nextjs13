import {
  getTop,
  NextResponse,
} from "./share"

export async function GET(): Promise<NextResponse<Array<Number>>> {
  const ids = await getTop();
  return NextResponse.json(ids.slice(0, 10));
}
