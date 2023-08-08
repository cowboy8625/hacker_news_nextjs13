import { ReactNode, FormEvent, useState, useEffect } from "react";
import ChallengeSiteComment from "@/lib/challenge-site-comment";
import { useSession } from "next-auth/react";

interface Props {
  postId: number
  reload: boolean,
}

export default function Comments({postId, reload}: Props): ReactNode {
  const [ comments, setComments ] = useState<Array<ChallengeSiteComment>>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const {data: session }  = useSession();

  async function getPostComments() {
    const req = await fetch(`http://localhost:3000/api/comment/${postId}`);
    const data = await req.json();

    setComments(data);
    setLoading(false);
  }

  async function onSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!session || !session.user) {
      alert("you need to signin before you can do this action");
      return;
    }
    const data = new FormData(evt.target as HTMLFormElement | undefined);
    const commentId = data.get("commentId");
    const req = await fetch("http://localhost:3000/api/comment", {
      method: "DELETE",
      headers: {
        "authorization": session.user.accessToken,
      },
      body: JSON.stringify({
        authorId: session.user?.id,
        commentId: commentId,
      }),
    });
    setLoading(!loading);
  }

  useEffect(() => {getPostComments()},[loading, reload]);

  return (
    <div className="gap-4">
      {
        comments.map((c: ChallengeSiteComment) =>
            <div key={c.id} className="flex flex-row gap-4">
              <label className="board-b">{c.author}</label>
              <p className="bg-gray outline rounded gap-4 p-3">{c.content}</p>
              {
              (session?.user && session.user.id === Number(c.authorId)) ?
              <form onSubmit={onSubmit}>
                <input hidden name="commentId" defaultValue={c.id.toString()}/>
                <input type="submit" value="delete"/>
              </form> :
              <div></div>
              }
            </div>
        )
      }
    </div>
  );
}
