"use client"
import { Button } from '../button';
import { signOutUser } from '@/actions/auth';



const handleLogout = () => {
    signOutUser();
};

const LogoutButton = () => {
    return (
        <Button variant='outline' className="w-full" size='sm' onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;