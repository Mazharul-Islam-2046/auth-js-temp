import { auth } from "@/auth"


export default async function Home() {

  const session = await auth()

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {session?.user && <h1>Welcome {session.user.name}</h1>}
      {!session?.user && <h1>Please Sign In</h1>}
    </div>
    
  );
}
