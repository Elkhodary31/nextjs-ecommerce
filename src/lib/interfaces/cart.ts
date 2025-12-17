import { IProduct } from "./product";

export interface ICartProduct {
  count: number;
  _id: string;
  product: IProduct | string;
  price: number;
}

export interface ICart {
  _id: string;
  cartOwner: string;
  products: ICartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface ICartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId: string;
  data: ICart;
}

export interface ICartErrorResponse {
  statusMsg: string;
  message: string;
}

export interface IClearCartResponse {
  message: string;
}
