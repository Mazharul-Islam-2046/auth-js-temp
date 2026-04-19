'use client';
import { BsGoogle } from 'react-icons/bs';
import { Button } from '../button';
import { googleAuthenticate } from '@/actions/google-login';

const GoogleLogin = () => {
  return (
    <Button onClick={() => googleAuthenticate()} variant={"outline"} className='flex flex-row items-center gap-3 w-full'>
        <BsGoogle />Google Sign In
    </Button>
  )
}

export default GoogleLogin;