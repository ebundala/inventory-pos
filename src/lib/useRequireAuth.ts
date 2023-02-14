import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function useRequireAuth() {
  const { data: session } = useSession();

  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!session && typeof session != "undefined") {
      const url = new URL(process.env.NEXT_PUBLIC_HOST!)
      router.replace(`${url.protocol}//app.${url.host}/login`);
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth;
