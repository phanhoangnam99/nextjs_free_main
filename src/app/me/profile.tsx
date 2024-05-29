"use client";

import accountApiRequest from "@/apiRequests/account";
import envConfig from "@/config";
import { clientSessionToken } from "@/lib/http";
import React, { useEffect } from "react";

export default function Profile() {




  useEffect(() => {
    const fetchRequest = async () => {
      const result = await accountApiRequest.meClient();
      console.log(result);



    };
    fetchRequest();
  }, []);





  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
