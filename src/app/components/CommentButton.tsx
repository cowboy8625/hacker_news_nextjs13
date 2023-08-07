import { FormEvent, ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Props {
  postId: number;
  onCommentSubmit: (_:void)=>void;
}

export default function CommentButton({postId, onCommentSubmit}: Props): ReactNode {
  const [state, setState] = useState(false);
  const {data: session }  = useSession();

  async function onSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!session || !session.user) {
      alert("you need to signin before you can do this action");
      return;
    }
    const data = new FormData(evt.target as HTMLFormElement | undefined);
    const comment = data.get("comment");
    const req = await fetch("http://localhost:3000/api/comment", {
      method: "POST",
      headers: {
        "authorization": session.user.accessToken,
      },
      body: JSON.stringify({
        authorId: session.user.id,
        hackerPostId: postId,
        comment: comment,
      }),
    });
    onCommentSubmit();
    setState(false);
  }

  if (state) {
    return (
      <form onSubmit={onSubmit}>
        <textarea className="text-black" name="comment" rows={4} cols={50}>
        </textarea>
        <input type="submit"/>
      </form>
    );
  }
  return (
    <button onClick={() => setState(true)} className="gap=4">add comment</button>
  );
}
