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
  const [ editBoxState, setEditBoxState ] = useState<boolean>(false)
  const {data: session }  = useSession();

  async function getPostComments() {
    const req = await fetch(`http://localhost:3000/api/comment/${postId}`);
    const data = await req.json();

    setComments(data);
    setLoading(false);
  }

  async function onDelete(evt: FormEvent<HTMLFormElement>) {
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

  function onOpenEditBox(evt: Event) {
    evt.preventDefault();
    setEditBoxState(true);
  }

  async function onEdit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!session || !session.user) {
      alert("you need to signin before you can do this action");
      return;
    }
    const data = new FormData(evt.target as HTMLFormElement | undefined);
    const commentId = data.get("commentId");
    const content = document.getElementById("content")?.value ?? "";

    const req = await fetch("http://localhost:3000/api/comment", {
      method: "PATCH",
      headers: {
        "authorization": session.user.accessToken,
      },
      body: JSON.stringify({
        authorId: session.user?.id,
        commentId: commentId,
        authorId: session.user?.id,
        comment: content,
      }),
    });
    setLoading(!loading);
    setEditBoxState(false);
  }

  useEffect(() => {getPostComments()},[loading, reload]);

  function formatTime(timeNumber: number): string {
    const d = new Date(timeNumber);
    const time = d.toLocaleTimeString();
    const date = d.toDateString();
    return `${date} @ ${time}`;
  }

  return (
    <div className="gap-4">
      {
        comments.map((c: ChallengeSiteComment) =>
            <div key={c.id} className="flex flex-row gap-4 py-4">
              <label className="bard-b">{formatTime(c.dateCreated)}</label>
              <label className="board-b">{c.author}</label>
              {
                editBoxState ?
                <textarea className="text-black" id="content" name="content" defaultValue={c.content}>
                </textarea> :
                <p className="bg-gray outline rounded p-4">{c.content}</p>
              }
              {
                (session?.user && session.user.id === Number(c.authorId)) ?
                <div>
                  {
                    editBoxState ?
                    <div>
                      <form onSubmit={onEdit}>
                        <input hidden name="commentId" defaultValue={c.id.toString()}/>
                        <input type="submit" value="submit update"/>
                      </form>
                      <button onClick={() => {setEditBoxState(false);}}>cancel</button>
                    </div> :
                    <button onClick={onOpenEditBox}>edit</button>
                  }
                  <form onSubmit={onDelete}>
                    <input hidden name="commentId" defaultValue={c.id.toString()}/>
                    <input type="submit" value="delete"/>
                  </form>
                </div> :
                <div></div>
              }
            </div>
        )
      }
    </div>
  );
}
