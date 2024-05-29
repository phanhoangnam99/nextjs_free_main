import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
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
    const res = await authApiRequest.slideSessionFromNextServerToServer(
      sessionToken.value
    );

    const newExpiresAt = new Date(res.payload.data.expiresAt).toUTCString();

    return Response.json(res.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken.value}; Path=/; HttpOnly; Expires=${newExpiresAt}; SameSite=Lax; Secure`,
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
