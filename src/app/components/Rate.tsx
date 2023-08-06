'use client';
import { ReactNode, useMemo, useState, PropsWithChildren } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface Props extends PropsWithChildren<any>{
  onRating?: (_:number)=>void;
  count?: number;
  rating?: number;
  color?: {
    filled?: string;
    unfilled?: string;
  },
}

export default function Rate({
  onRating = (_:number)=>{},
  count = 5,
  rating = 0,
  color = {
    filled : "#f5eb3b",
    unfilled : "#DCDCDC",
  }
} : Props): ReactNode {
  const [hoverRating, setHoverRating] = useState(0);

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
          onClick={() => onRating(idx)}
          style={{ color: getColor(idx) }}
          onMouseEnter={() => setHoverRating(idx)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  }, [count, rating, hoverRating]);

  return <div>{starRating}</div>;
}

