import { ReactNode } from 'react';
import { HackerPost } from "@/lib/hacker-post";
import LoadingSpinner from "./LoadingSpinner";
import ArticleContent from "./ArticleContent";

interface Props {
  posts: Array<HackerPost>;
  bottomInView: boolean;
}

export default function ArticleList({
  posts,
  bottomInView,
}: Props): ReactNode {
  return (
    <div className="text-gray-400 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-800">
          {posts.map((p, i) => <ArticleContent key={i.toString()} post={p}/>)}
        </div>
      </div>
      <LoadingSpinner/>
    </div>
  );
}
