'use client';

import { ReactNode, useMemo, useEffect, useState, PropsWithChildren } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

interface Props extends PropsWithChildren<any>{
  postId: number;
  onRating?: (_:number)=>void;
  count?: number;
  rating?: number;
  color?: {
    filled?: string;
    unfilled?: string;
  },
}

export default function Rate({
  postId,
  onRating = (_:number)=>{},
  count = 5,
  rating = 0,
  color = {
    filled : "#f5eb3b",
    unfilled : "#DCDCDC",
  }
} : Props): ReactNode {
  const [hoverRating, setHoverRating] = useState(0);
  const {data: session } = useSession();

  async function updateOnLoad() {
    const res = await fetch(`http://localhost:3000/api/rating/${postId}`);
    const data = await res.json();
    onRating(data);
  }

  useEffect(() => {updateOnLoad()}, [onRating]);

  async function updateOnRating(idx: number) {
    if (!session) {
      alert("you need to signin before you can do this action");
      return;
    }
    const res = await fetch("http://localhost:3000/api/rating", {
      method: "POST",
      headers: {
        "authorization": session.user.accessToken,
      },
      body: JSON.stringify({
        authorId: session.user.id,
        rating: idx,
        hackerPostId: postId,
      }),
    });
    onRating(idx);
  }

  const getColor = (index: number) => {
    if (hoverRating >= index) {
      return color.filled;
    } else if (!hoverRating && rating >= index) {
      return color.filled;
    }

    return color.unfilled;
  };

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <FontAwesomeIcon
          key={idx}
          className="cursor-pointer"
          icon={faStar}
          onClick={() => updateOnRating(idx)}
          style={{ color: getColor(idx) }}
          onMouseEnter={() => setHoverRating(idx)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  }, [count, rating, hoverRating]);

  return <div>{starRating}</div>;
}

