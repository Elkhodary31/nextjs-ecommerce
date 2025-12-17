import { ICategory } from "../interfaces/category";
import { IResponse } from "./../interfaces/response";
export async function getAllCategories() {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories`
  );
  const data: IResponse<ICategory> = await response.json();

  console.log("FETCHING CATEGORIES...");
  console.log("get all categories", data);

  return data;
}

export async function getCategory({ id: { id: string } }) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${id}`
  );
  const data: IResponse<ICategory> = await response.json();
  return data;
}
