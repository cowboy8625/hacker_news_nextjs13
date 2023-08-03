'use client'

import { useEffect, useState, FormEvent, ReactNode } from 'react';
import Image from 'next/image';

export default function MainPage(): ReactNode {
  const [posts, setPosts] = useState<Array<HackerPost>>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setLoading(true);
    const data = new FormData(evt.target as HTMLFormElement | undefined);
    const searchItem = data.get("search");
    const url = `http://localhost:3000/api/search/${searchItem}`;
    const response = await fetch(url);
    const posts = await response.json();
    setPosts(posts);
  }

  async function stateFunctionCallBack() {
    setPosts(await getTop());
  }
  useEffect(() => {
    stateFunctionCallBack()
  }, [])

  return pageContent(posts, loading);
}

function pageContent(posts: Array<HackerPost>, loading: boolean): ReactNode {
  const hasContent = posts.length > 0 && !loading;
  return hasContent ?  postsContent(posts) : noContent();
}

function noContent(): ReactNode {
  return (
    <div>
      <h1>
        No Results Found
      </h1>
    </div>
  );
}

function postsContent(posts: Array<HackerPost>): ReactNode {
  return (
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-800">
        {posts.map(showPostContent)}
        </div>
      </div>
    </section>
  );
}

function showPostContent(post:HackerPost, idx: number): ReactNode {
  return (
    <div key={idx.toString()} className="py-8 flex flex-wrap md:flex-nowrap">
      <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
        <span className="font-semibold title-font text-white">{toTitleCase(post.type)}</span>
        <span className="mt-1 text-gray-500 text-sm">{timeToDate(post.time)}</span>
      </div>
      <div className="md:flex-grow">
        <h2 className="text-2xl font-medium text-white title-font mb-2">{post.title}</h2>
        <img src={post.image}/>
        <p className="leading-relaxed">{post.text}</p>
        <a className="text-indigo-400 inline-flex items-center mt-4" href={post.url}>Learn More
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

function timeToDate(time: number) : string {
  const date = new Date(time*1000);
  const options: Record<string, unknown> = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

async function getTop(): Promise<Array<HackerPost>> {
  const url = `http://localhost:3000/api`;
  const response = await fetch(url);
  const ids = await response.json();
  let hackerPostList = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const post = await getPost(id);
    hackerPostList.push(post);
  }
  return hackerPostList;
}

async function getPost(id: Number): Promise<HackerPost> {
  const url = `http://localhost:3000/api/${id}`;
  const response = await fetch(url);
  const post = await response.json();
  return post;
}

interface HackerPost {
  by : string;
  descendants : number;
  id : number;
  kids : Array<number>;
  score : number;
  time : number;
  title : string;
  type : string;
  url : string;
  text? : string;
  image? : string;
 }

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
