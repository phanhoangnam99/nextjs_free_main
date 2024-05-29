import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/app/app-provider";
import { cookies } from "next/headers";
import SlideSession from "@/components/ui/slide-session";
import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { revalidatePath } from "next/cache";

const inter = Inter({ subsets: ["vietnamese"] });


export const metadata: Metadata = {
  title: {
    template: "%s | Acme",
    default: "Acme", // a default is required when creating a template
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();

  const sessionToken = cookieStore.get("sessionToken");

  let user: AccountResType["data"] | null = null;

  if (sessionToken) {
    const result = await accountApiRequest.me(sessionToken.value);
    user = result.payload.data;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.className}`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider user={user} initialSessionToken={sessionToken?.value}>
            <Header user={user} />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
