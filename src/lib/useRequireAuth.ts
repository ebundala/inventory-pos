import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getLoginUrl } from "./util/getLoginUrl";

function useRequireAuth() {
  const { data: session } = useSession();

  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!session && typeof session != "undefined") {
      
      router.replace(getLoginUrl());
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth;

