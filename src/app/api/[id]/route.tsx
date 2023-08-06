import {
  stat,
  readFile,
  writeFile
} from 'node:fs/promises';
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
) : Promise<NextResponse<HackerPost | null>> {
  const path = `./cache/${params.id}`;
  try {
    await stat(path);
    const data = await readFile(path);
    return NextResponse.json(JSON.parse(data.toString()));
  } catch(e) {
    const url = `${hackerURL}/${postPath}/${params.id}.json`;
    try {
      const data = await getPost(url);
      await writeFile(path, JSON.stringify(data));
      return NextResponse.json(data);
    } catch(e) {
      return NextResponse.json(null)
    }
  }
}
