import { productApiRequest } from "@/apiRequests/product";
import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import envConfig from "@/config";
import { baseOpenGraph } from "@/app/shared-metadata";
const getDetail = cache(productApiRequest.getDetail);

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data

  const { payload } = await getDetail(Number(id));

  const product = payload.data;

  const url = envConfig.NEXT_PUBLIC_URL + `/products/` + product.id;

  return {
    openGraph: {
      ...baseOpenGraph,
      title: product.name,
      description: product.description,
      url: url,

      siteName: "Productic Company",
      images: [
        {
          url: product.image, // Must be an absolute URL
        },
      ],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductDetail({ params, searchParams }: Props) {
  const { id } = params;
  let product = null;
  try {
    const { payload } = await getDetail(Number(id));

    product = payload.data;
  } catch (error) {}

  return (
    <div>
      {!product && <div>khong tim thay san pham</div>}
      {product && (
        <div>
          <Image
            alt={product.name}
            src={product.image}
            width={180}
            height={180}
            className="w-32 h-32 object-cover"
          />
          <h3>{product.name}</h3>
          <h3>{product.price}</h3>
        </div>
      )}
    </div>
  );
}
