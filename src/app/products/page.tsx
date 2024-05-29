import { productApiRequest } from "@/apiRequests/product";
import DeleteProduct from "@/app/products/_components/delete-product";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProductType = {
  name: string;
  price: number;
  description: string;
  image: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
};



export const metadata: Metadata = {
  title: "danh sach san pham ec ec",
};

export default async function ProductListPage() {
  const cookieStore = cookies();

  const sessionToken = cookieStore.get("sessionToken");

  const isAuthenticated = Boolean(sessionToken);

  const { payload } = await productApiRequest.getList();

  const productList = payload.data;

  return (
    <div>
      <h1>Product List</h1>
      <div className="space-y-5">
        {isAuthenticated && (
          <Link href={"/products/add"}>
            <Button variant={"secondary"}>Thêm sản phẩm</Button>
          </Link>
        )}
        {productList.map((product: ProductType) => (
          <div key={product.id} className="flex space-x-4">
            <Link href={`/products/${product.id}`}>
              <Image
                alt={product.name}
                src={product.image}
                width={180}
                height={180}
                className="w-32 h-32 object-cover"
              />
            </Link>

            <h3>{product.name}</h3>
            <h3>{product.price}</h3>
            {isAuthenticated && (
              <div className="flex space-x-2">
                <Link href={`products/${product.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <DeleteProduct product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
