import { ReactNode, useState } from "react";
import { HackerPost } from "@/lib/hacker-post";
import { toTitleCase, timeToDate } from "@/lib/util";
import Rate from "./Rate";

interface Props {
  post: HackerPost;
}

export default function ArticleContent({
  post: {
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
  },
  ...props
}: Props): ReactNode {
  const [rating, setRating] = useState(0);

  function setRateCallBack(rate: number) {
    setRating(rate);
  }

  return (
    <div className="py-8 flex flex-wrap md:flex-nowrap">
      <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
        <span className="font-semibold title-font text-white">{toTitleCase(type)}</span>
        <span className="mt-1 text-gray-500 text-sm">{timeToDate(time)}</span>
      </div>
      <div className="md:flex-grow">
        <a href={`/article/${id}`}>
          <h2 className="text-2xl font-medium text-white title-font mb-2">{title}</h2>
        </a>
        {renderImage(image)}
        <p className="leading-relaxed">{text}</p>
        <div className="flex align-center gap-4">
          <Rate postId={id} rating={rating} onRating={setRateCallBack} />
          <a className="hover:animate-bounce text-indigo-400 inline-flex items-center" href={url}>Learn More
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
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

