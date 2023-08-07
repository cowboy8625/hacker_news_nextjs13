import { ReactNode, useState, useEffect } from "react";
import ChallengeSiteComment from "@/lib/challenge-site-comment";

interface Props {
  postId: number
  reload: boolean,
}

export default function Comments({postId, reload}: Props): ReactNode {
  const [ comments, setComments ] = useState<Array<ChallengeSiteComment>>([])
  const [ loading, setLoading ] = useState<boolean>(true)

  async function getPostComments() {
    const req = await fetch(`http://localhost:3000/api/comment/${postId}`);
    const data = await req.json();

    setComments(data);
    setLoading(false);
  }

  useEffect(() => {getPostComments()},[loading, reload]);

  return (
    <div className="gap-4">
      {
        comments.map((c: ChallengeSiteComment, i: number) =>
            <div key={i} className="flex flex-row gap-4">
              <label className="board-b">{c.author}</label>
              <p className="bg-gray outline rounded gap-4 p-3">{c.content}</p>
            </div>
        )
      }
    </div>
  );
}
