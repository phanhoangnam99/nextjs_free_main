import { ImageResType } from "./../../../server/src/schemaValidations/product.schema";
import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";

export const productApiRequest = {
  getList: () =>
    http.get<ProductListResType>("/products", { cache: "no-store" }),

  getDetail: (id: number) =>
    http.get<ProductResType>(`/products/${id}`, { cache: "no-store" }),

  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body, { cache: "no-store" }),

  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),

  delete: (id: number) => http.delete<MessageResType>(`/products/${id}`),

  uploadImage: (body: FormData) =>
    http.post<ImageResType>("/media/upload", body),
};
