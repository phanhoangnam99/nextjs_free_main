import accountApiRequest from "@/apiRequests/account";
import { ModeToggle } from "@/components/theme-toggle";
import ButtonLogout from "@/components/ui/button-logout";
import { handleErrorApi } from "@/lib/utils";
import { AccountResType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

type User = AccountResType["data"];

export default async function Header({ user }: { user: User | null }) {
  return (
    <div className="space-x-4 flex">
      <ul className="flex flex-row space-x-4">
        <li>
          <Link href="/products"> sản phẩm</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href="/me">
                Xin chào <strong> {user.name}</strong>
              </Link>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link href="/register">Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  );
}
