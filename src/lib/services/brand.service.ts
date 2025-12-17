import { IBrand } from "../interfaces/brand";
import { IResponse } from "./../interfaces/response";

export async function getAllBrands() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
  const data: IResponse<IBrand> = await response.json();
  return data;
}

export async function getBrand(id: string) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/brands/${id}`
  );
  const data: IResponse<IBrand> = await response.json();
  return data;
}
