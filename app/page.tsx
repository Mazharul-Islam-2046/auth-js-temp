import { auth, signOut } from "@/auth"


export default async function Home() {

  const session = await auth()
  

  const handleSignOut = async () => {
    await signOut()
  }
  

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      {session?.user && <h1>Welcome {session.user.name}</h1>}
      {!session?.user && <h1>Please Sign In</h1>}
      
      <button onClick={handleSignOut} className="cursor-pointer">Sign Out</button>
    </div>
    
  );
}
