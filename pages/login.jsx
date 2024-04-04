import { signIn } from 'next-auth/react';
import React from 'react';

const Login = () => {
    return (
        <div className='flex flex-col items-center min-h-screen w-full justify-center bg-black'>
        <img className='w-52 m-5' src='https://links.papareact.com/9xl' alt=''/>
        <button className='bg-[#18D860] text-white p-5 rounded-full' onClick={() => signIn('spotify', { callbackUrl: "/"})}>Login with Spotify</button>
    </div>
    );
}

export default Login;
