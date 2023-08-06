import { FormEvent, ReactNode } from 'react';
import Search from './Search';
import SigninButton from './SigninButton';
import Link from 'next/link';

interface Props {
  handleSubmit: (evt: FormEvent<HTMLFormElement>) => void;
}

export default function NavBar(
  {handleSubmit}: Props,
): ReactNode {
  return (
    <header>
      <nav className="fixed bg-gray w-full">
        <div className="flex items-center justify-center m-4">
          <Search handleSubmit={handleSubmit}/>
          <SigninButton/>
        </div>
      </nav>
    </header>
  );
}
