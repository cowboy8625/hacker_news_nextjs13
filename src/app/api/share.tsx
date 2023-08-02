import { NextResponse } from 'next/server'
export { NextResponse } from 'next/server'

export const hackerURL = "https://hacker-news.firebaseio.com/v0";
export const postPath = "item";

export async function getPost(url:string): Promise<NextResponse<HackerPost>> {
  const response = await fetch(url);
  const data = await response.json();
  return NextResponse.json(data);
}

export async function getTop(): Promise<Array<Number>> {
  const url = `${hackerURL}/topstories.json`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
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
  text?: string;
 }
