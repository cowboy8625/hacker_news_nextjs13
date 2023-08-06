"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const SigninButton = () => {
  const {data: session } = useSession();
  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">{session.user.name}</p>
        <button onClick={(_) => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={(_) => signIn()} className="text-green-600 ml-auto">
      Sign in
    </button>
  );
}

export default SigninButton;
