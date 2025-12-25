import { IBrand } from "../interfaces/brand";
import { IResponse } from "./../interfaces/response";
import { BASE_URL } from "../constants/api";

export async function getAllBrands(page: number = 1, limit: number = 40) {
  const response = await fetch(`${BASE_URL}/brands?page=${page}&limit=${limit}`);
  const data: IResponse<IBrand> = await response.json();
  return data;
}

export async function getBrand(id: string) {
  const response = await fetch(`${BASE_URL}/brands/${id}`);
  const data: IResponse<IBrand> = await response.json();
  return data;
}
