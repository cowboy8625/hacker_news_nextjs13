import { NextResponse } from 'next/server'
import ogs from 'open-graph-scraper';
export { NextResponse } from 'next/server'

export const hackerURL = "https://hacker-news.firebaseio.com/v0";
export const postPath = "item";

export async function getPost(url:string): Promise<HackerPost> {
  const response = await fetch(url);
  let data = await response.json();
  const { type, description, image } = await getOGData(data.url);
  data['type'] = type ?? data['type'];
  data['text'] = description ?? data['text'];
  data['image'] = image;
  return data;
}

export async function getTop(): Promise<Array<Number>> {
  const url = `${hackerURL}/topstories.json`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getOGData(url: string): Promise<OgData> {
  try {
    const data = await ogs({url});
    const { error, html, result, response } = data;
    const imageList = result.ogImage;
    if (imageList === undefined) {
      return {};
    }
    if (imageList.length > 0) {
      return {
        type: result.ogType,
        description: result.ogDescription,
        image: imageList[0].url
      };
    }
    return {};
  } catch(e) {
    return {};
  }
}

export interface HackerPost {
  by : string;
  descendants : Number;
  id : Number;
  kids : Array<Number>;
  score : Number;
  time : Number;
  title : string;
  type : string;
  url : string;
  text? : string;
  image? : string;
 }

interface OgData {
  type?: string;
  description?: string;
  image?: string;
}
