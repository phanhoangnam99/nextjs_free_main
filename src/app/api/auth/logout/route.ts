import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    return Response.json(
      {
        message: "buoc dang xuat thanh cong",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }

  const cookieStore = cookies();

  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken) {
    return Response.json(
      {
        message: "khong nhan duoc sesssion token",
      },
      { status: 401 }
    );
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    );

    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "loi khong xac dinh" }, { status: 500 });
    }
  }
}
