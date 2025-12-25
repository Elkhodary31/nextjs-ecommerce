import { ICategory } from "../interfaces/category";
import { IResponse } from "./../interfaces/response";
import { BASE_URL } from "../constants/api";

export async function getAllCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  const data: IResponse<ICategory> = await response.json();

  console.log("FETCHING CATEGORIES...");
  console.log("get all categories", data);

  return data;
}

export async function getCategory(id: string) {
  const response = await fetch(`${BASE_URL}/categories/${id}`);
  const data: IResponse<ICategory> = await response.json();
  return data;
}
