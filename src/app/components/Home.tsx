'use client'

import { useEffect, useState, FormEvent, ReactNode } from 'react';


export default function Home() {
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

  return (
  <div className="grid grid-cols-1 grid-rows-12 gap-5 content-center">
    <div>
      <form action="/api" method="post" onSubmit={ handleSubmit }>
        <input className='text-black' type="text" placeholder="search" name="search"/>
      </form>
    </div>
    {
      posts.length == 0 && loading ?
      <div>
        <h1>
          No Results Found
        </h1>
      </div> :
      <div>
        <ul>
        {
          posts.map((post, idx) =>
          <li key={ idx }>
            <div>
              <a target='_blanks' href={post.url}>
                <h3>{post.title}</h3>
              </a>
                <iframe src={post.url}></iframe>
                <p>{ post.score.toString() }</p>
                <p>{ post.by }</p>
            </div>
          </li>)
        }
        </ul>
      </div>
    }
  </div>
  )
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
