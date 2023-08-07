"use client";

import { ReactNode, useState, useEffect } from "react";
import { HackerPost } from "@/lib/hacker-post";
import LoadingSpinner from "./../../components/LoadingSpinner";
import Rate from "./../../components/Rate";
import CommentButton from "./../../components/CommentButton";
import Comments from "./../../components/Comments";
import { toTitleCase, timeToDate } from "@/lib/util";

export default function Page(
  {params}: {params : {article: string}}
  ): ReactNode {

  const [ post, setPost ] = useState<HackerPost | undefined>();
  const [rating, setRating] = useState(0);
  const [reload, setReload] = useState(false);

  function setRateCallBack(rate: number) {
    setRating(rate);
  }

  async function loadArticlePage() {
    const data = await fetch(`http://localhost:3000/api/${params.article}`);
    const post = await data.json();
    setPost(post)
  }

  useEffect(() => {loadArticlePage()}, []);
  if (!post) {
    return (<><LoadingSpinner/></>);
  }

  const {
    by,
    descendants,
    id,
    kids,
    score,
    time,
    title,
    type,
    url,
    text="",
    image=undefined,
  } = post;

  return (
    <div className="flex justify-center">
      <div>
      <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 gap-4">
        <span className="font-semibold title-font text-white">{toTitleCase(type)}</span>
        <span className="mt-1 text-gray-500 text-sm">{timeToDate(time)}</span>
      </div>
        <h2 className="text-2xl font-medium text-white title-font mb-2">{title}</h2>
        {renderImage(image)}
        <p>{text}</p>
        <div className="flex align-center gap-4">
          <Rate postId={id} rating={rating} onRating={setRateCallBack} />
          <a className="hover:animate-bounce text-indigo-400 inline-flex items-center" href={url}>Learn More
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
        <CommentButton postId={id} onCommentSubmit={() => setReload(!reload)}/>
        <Comments postId={id} reload={reload}/>
      </div>
    </div>
  );
}

// TODO: Move this into a component
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
