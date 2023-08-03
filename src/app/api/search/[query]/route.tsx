import {
  NextResponse,
  HackerPost,
} from "./../../share"

export async function GET(
  request: Request,
  { params } : { params : { query : string } },
) : Promise<NextResponse<Array<HackerPost>>> {
  const url = `https://hn.algolia.com/api/v1/search?query=${params.query}`;
  const response = await fetch(url);
  const { hits } = await response.json();
  console.log(hits);
  const posts = hits.map((post: Record<string, unknown>) => ({
    by : post.author,
    descendants: "",
    id : post.objectId,
    kids : [],
    score : 0,
    time : 0,
    title : post.title,
    type : "story",
    url : post.url,
  }));
  return NextResponse.json(posts);
}
