import { IResponse } from "@/lib/interfaces/response";
import { IProduct } from "@/lib/interfaces/product";
import { IProductFilters } from "@/lib/interfaces/filters";
import { BASE_URL } from "@/lib/constants/api";

export async function getAllProducts({
  page = 1,
  limit = 20,
  sort,
  minPrice,
  maxPrice,
  categories = [],
  brands = [],
}: IProductFilters): Promise<IResponse<IProduct>> {
  let url = `${BASE_URL}/products?limit=${limit}&page=${page}`;

  if (sort) url += `&sort=${sort}`;
  if (minPrice) url += `&price[gte]=${minPrice}`;
  if (maxPrice) url += `&price[lte]=${maxPrice}`;

  if (categories.length > 0) {
    categories.forEach((c) => {
      url += `&category[in]=${c}`;
    });
  }

  if (brands.length > 0) {
    brands.forEach((b) => {
      url += `&brand[in]=${b}`;
    });
  }
  console.log("Fetching products from URL:", url);

  const res = await fetch(url);
  const data: IResponse<IProduct> = await res.json();

  return data;
}
export async function getProductById(id: string): Promise<{ data: IProduct }> {
  const url = `${BASE_URL}/products/${id}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Product not found");

  const data: { data: IProduct } = await res.json();

  return data;
}
