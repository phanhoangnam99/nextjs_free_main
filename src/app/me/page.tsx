import envConfig from "@/config";
import React from "react";
import { cookies } from "next/headers";
import Profile from "@/app/me/profile";
import accountApiRequest from "@/apiRequests/account";
import ProfileForm from "@/app/me/profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ho so nguoi dung",
};

export default async function MePage() {
  const cookieStore = cookies();

  const sessionToken = cookieStore.get("sessionToken");

  const result = await accountApiRequest.me(sessionToken?.value ?? "");

  return (
    <div>
      <h1>profile</h1>
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
