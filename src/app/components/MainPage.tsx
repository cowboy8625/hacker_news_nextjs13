'use client'

// TODO: incremental post/search rendering
// TODO: Make seaerch bar look like a line _____________ rather then a box.

import { useEffect, useState, FormEvent, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
// import Image from 'next/legicy/image';
const topPostList = getTopPost();

export default function MainPage(): ReactNode {
  const { ref: topRef, inView: topInView, entry: e1 } = useInView();
  const { ref: bottomRef, inView: bottomInView, entry: e2 } = useInView();
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
    const item = await topPostList.next();
    if (item.done===null) return;
    setPosts(posts.concat([item.value]));
  }

  useEffect(() => {
    if (!bottomInView) return;
    stateFunctionCallBack();
  });

  return (
    <div>
      {searchBox(handleSubmit)}
      {pageContent(posts, loading, bottomInView)}
      <hr ref={bottomRef}/>
    </div>
    );
}

function searchBox(callback: (evt: FormEvent<HTMLFormElement>) => void): ReactNode {
  return (
      <div className='flex items-center justify-center py-4'>
        <form action="/api" method="post" onSubmit={ callback }>
          <input className='text-black' type="text" placeholder="search" name="search"/>
        </form>
      </div>
  );
}

function pageContent(
  posts: Array<HackerPost>,
  loading: boolean,
  bottomInView: boolean,
): ReactNode {
  const hasContent = posts.length > 0 || loading;
  return hasContent ?  postsContent(posts, bottomInView) : loadingContentAnimation();
}

function loadingContentAnimation(): ReactNode {
  return (
    <div className='flex items-center justify-center py-4'>
      <button type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled={true}>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </button>
    </div>
  );
}

function postsContent(
  posts: Array<HackerPost>,
  bottomInView: boolean,
): ReactNode {
  return (
    <div className="text-gray-400 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-800">
          {posts.map((p, i) => showPostContent(p,i))}
        </div>
      </div>
      {loadingContentAnimation()}
    </div>
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
        {renderImage(post.image)}
        <p className="leading-relaxed">{post.text}</p>
        <a className="hover:animate-bounce text-indigo-400 inline-flex items-center mt-4" href={post.url}>Learn More
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

function renderImage(url: string | undefined): ReactNode {
  const imageTag = <img
    src={url}
    width={200}
    height={200}
    alt={""}
    />;
  const hasImage = url === undefined;
  return hasImage ? (<div></div>) : (imageTag);
}

function timeToDate(time: number) : string {
  const date = new Date(time*1000);
  const options: Record<string, unknown> = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

async function* getTopPost(): AsyncGenerator<HackerPost, null, boolean> {
  const url = `http://localhost:3000/api`;
  const response = await fetch(url);
  const ids = await response.json();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    yield await getPost(id);
  }
  return null;
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


function range(start: number, end: number): Array<number> {
  let result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
