import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
export default function Home() {
  const { user } = useUser();
  console.log("User:", user);

  return (
    <div>
      <h1> This is a home page</h1>
      <div>
        <Link href="/api/auth/login">Login</Link>
      </div>
    </div>
  );
}
