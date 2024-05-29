"use client";

import { Button } from "@/components/ui/button";
import { ProductResType } from "@/schemaValidations/product.schema";
import React, { useRef } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { productApiRequest } from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Product = ProductResType["data"];

export default function DeleteProduct({ product }: { product: Product }) {
  const { toast } = useToast();

  const router = useRouter();

  const deleteProduct = async () => {
    try {
      const result = await productApiRequest.delete(product.id);

      toast({ description: result.payload.message });
router.refresh()
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"}>Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc muốn xoá sản phẩm không ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm &rdquo;{product.name}&rdquo; sẽ bị xoá vĩnh viên
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
