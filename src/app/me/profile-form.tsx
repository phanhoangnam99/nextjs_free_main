"use client";
import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import envConfig from "@/config";
import { createKey } from "next/dist/shared/lib/router/router";
import { useToast } from "@/components/ui/use-toast";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";

type Profile = AccountResType["data"];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name,
    },
  });

  async function onSubmit(values: UpdateMeBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await accountApiRequest.updateMe(values);

      toast({
        description: result.payload.message,
      });

      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full max-w-[600px]"
          noValidate
        >
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="Email"
              type="email"
              value={profile.email}
              readOnly
            />
          </FormControl>
          <FormMessage />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className=" w-full !mt-8">
            Cập nhật
          </Button>
        </form>
      </Form>
    </>
  );
}
