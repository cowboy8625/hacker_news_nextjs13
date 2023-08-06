"use client";

// TODO: Make seaerch bar look like a line _____________ rather then a box.

import { useEffect, useState, FormEvent, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { HackerPost } from "@/lib/hacker-post";
import NavBar from "./NavBar";
import Rate from "./Rate";
import LoadingSpinner from "./LoadingSpinner";
import ArticleList from "./ArticleList";

const topPostList = getTopPost();

export default function HackerTopPost(): ReactNode {
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
    if (item.value===null) return;
    setPosts(posts.concat([item.value]));
  }

  useEffect(() => {
    if (!bottomInView) return;
    stateFunctionCallBack();
  });

  return (
    <div>
      <NavBar handleSubmit={handleSubmit}/>
      {pageContent(posts, loading, bottomInView)}
      <hr ref={bottomRef}/>
    </div>
  );
}

function pageContent(
  posts: Array<HackerPost>,
  loading: boolean,
  bottomInView: boolean,
): ReactNode {
  const hasContent = posts.length > 0 || loading;
  if (hasContent) {
    return (<ArticleList posts={posts} bottomInView={bottomInView}/>);
  }
  return (<LoadingSpinner/>);
}

async function* getTopPost(): AsyncGenerator<HackerPost, null, boolean> {
  const url = `http://localhost:3000/api`;
  const response = await fetch(url);
  const ids = await response.json();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const post = await getPost(id);
    if (!post) {
      continue;
    }
    yield post;
  }
  return null;
}

async function getPost(id: Number): Promise<HackerPost | null> {
  const url = `http://localhost:3000/api/${id}`;
  const response = await fetch(url);
  if (!response) {
    return null;
  }
  const post = await response.json();
  return post;
}

