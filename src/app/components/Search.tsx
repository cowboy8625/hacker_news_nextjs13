import { FormEvent, ReactNode } from 'react';

interface Props {
  handleSubmit: (evt: FormEvent<HTMLFormElement>) => void;
}

export default function Search(
  {handleSubmit}: Props,
): ReactNode {
  return (
      <form action="/api" method="post" onSubmit={ handleSubmit }>
        <input className='text-black' type="text" placeholder="search" name="search"/>
      </form>
  );
}
