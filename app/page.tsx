import Link from "next/dist/client/link";




export default async function Home() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Welcome to the Auth.js</h1>
      <Link href="/signin" className="text-blue-500 hover:underline">Go to Sign In</Link>
      <Link href="/register" className="text-blue-500 hover:underline">Go to Register</Link>
    </div>
    
  );
}
