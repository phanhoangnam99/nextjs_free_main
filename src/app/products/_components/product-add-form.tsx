"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
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
  CreateProductBody,
  CreateProductBodyType,
  ProductResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { productApiRequest } from "@/apiRequests/product";

type Product = ProductResType["data"];

export default function ProductAddForm({ product }: { product?: Product }) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      description: product?.description ?? "",
      image: product?.image ?? "",
      name: product?.name ?? "",
      price: product?.price ?? 0,
    },
  });

  const image = form.watch("image");

  const createProduct = async (values: CreateProductBodyType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;
      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      });

      toast({
        description: result.payload.message,
      });
      router.push("/products");

      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (_values: UpdateProductBodyType) => {
    if (!product) return;
    setLoading(true);

    let values = _values;

    try {
      if (file) {
        console.log("sacsdjfodsnfgodgndogsdokfdmskfsmdkf");
        const formData = new FormData();
        formData.append("file", file as Blob);
        const uploadImageResult = await productApiRequest.uploadImage(formData);
        const imageUrl = uploadImageResult.payload.data;

        values = {
          ...values,
          image: imageUrl,
        };
      }

      const result = await productApiRequest.update(product.id, values);

      toast({
        description: result.payload.message,
      });

      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  async function onSubmit(values: CreateProductBodyType) {
    if (loading) return;

    if (product) {
      await updateProduct(values);
  
    } else {
      await createProduct(values);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}
          className="space-y-2 w-full max-w-[600px]"
          noValidate
        >
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input placeholder="Giá" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFile(file);
                        field.onChange("http://localhost:3000/" + file.name);
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {(file || image) && (
            <div>
              <Image
                src={file ? URL.createObjectURL(file) : image}
                width={128}
                height={128}
                alt="preview"
                className="w-32 h-32 object-cover"
              />
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => {
                  setFile(null);
                  form.setValue("image", "");
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                size={"sm"}
              >
                Xoá hình ảnh
              </Button>
            </div>
          )}
          <Button type="submit" className=" w-full !mt-8">
            {product ? "Cập nhật sản phẩm" : " Thêm sản phẩm"}
          </Button>
        </form>
      </Form>
    </>
  );
}
