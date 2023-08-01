import {
  hackerURL,
  postPath,
  getPost,
  HackerPost,
  NextResponse,
} from "../share"


export async function GET(
  request: Request,
  { params } : { params : { id : string } },
) : Promise<NextResponse<HackerPost>> {
  const url = `${hackerURL}/${postPath}/${params.id}.json`;
  return await getPost(url);
}
