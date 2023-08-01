import Image from 'next/image'

export default async function Home() {
  const posts = await getTop();
  console.log(posts);
  return (
    <ul>{
      posts.map((post, idx) =>
      <li key={ idx }>
        <div>
          <a target='_blanks' href={post.url}>
          <h1>{post.title}</h1>
          </a>
          <p>{post.by}</p>
          <iframe src={post.url}></iframe>
        </div>
      </li>)
    }</ul>
  )
}

async function getPost(id: Number): Promise<HackerPost> {
  const url = `http://localhost:3000/api/${id}`;
  const response = await fetch(url);
  const post = await response.json();
  return post;
}

async function getTop(): Promise<Array<HackerPost>> {
  const url = `http://localhost:3000/api`;
  const response = await fetch(url);
  const ids = await response.json();
  let hackerPostList = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const post = await getPost(id);
    hackerPostList.push(post);
  }
  return hackerPostList;
}

interface HackerPost {
  by : String;
  descendants : Number;
  id : Number;
  kids : Array<Number>;
  score : Number;
  time : Number;
  title : String;
  type : String;
  url : String;
  text?: String;
 }
