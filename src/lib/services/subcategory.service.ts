import { get } from "http";
import { IResponse } from "../interfaces/response";
import { ISubcategory } from "../interfaces/subcategory";
import { BASE_URL } from "../constants/api";

export async function getAllSubcategories() {
  const response = await fetch(`${BASE_URL}/subcategories`);
  console.log("FETCHING SUBCATEGORIES...");
  const data: IResponse<ISubcategory> = await response.json();
  console.log("get all subcategories", data);
  return data;
}
export async function getSubcategory(id: string) {
  const response = await fetch(`${BASE_URL}/subcategories/${id}`);
  const data: { data: ISubcategory } = await response.json();
  return data;
}

export async function getSubcategoriesByCategory(categoryId: string) {
  const response = await fetch(
    `${BASE_URL}/categories/${categoryId}/subcategories`
  );
  const data: IResponse<ISubcategory> = await response.json();
  return data;
}
