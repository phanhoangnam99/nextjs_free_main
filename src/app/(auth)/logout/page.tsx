"use client";

import authApiRequest from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const sessionToken = searchParams.get("sessionToken");


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (sessionToken === clientSessionToken.value) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => router.push(`/login?redirectFrom=${pathname}`));
    }

    return () => {
      controller.abort();
    };
  }, [router, sessionToken, pathname]);
  return <div>page</div>;
}
