'use client';

import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  console.log('data =>', session);
  return (
    <main className='min-h-screen w-full bg-gray-200 flex justify-center items-center'>
      <div className='min-h-[50vh] min-w-[50vw] p-5 bg-gray-300'>
        <button
          className='bg-blue-500 text-white p-2 rounded-md'
          onClick={() =>
            signIn('google', {
              redirect: false,
            })
          }
        >
          Sign in With google
        </button>
        <button
          className='bg-yellow-500 text-white p-2 rounded-md'
          onClick={() =>
            signIn('credentials', {
              redirect: false,
            })
          }
        >
          Sign in With credentials
        </button>
      </div>
    </main>
  );
}
