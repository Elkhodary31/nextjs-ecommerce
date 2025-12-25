export interface IOrderProduct {
  title?: string;
  imageCover?: string;
  ratingsAverage?: number;
  brand?: { name?: string };
}

export interface IOrderCartItem {
  _id?: string;
  count?: number;
  price?: number;
  product?: IOrderProduct;
}

export interface IOrderUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface IOrder {
  _id: string;
  id?: number | string;
  status?: string;
  totalOrderPrice?: number;
  paymentMethodType?: string;
  createdAt?: string;
  updatedAt?: string;
  shippingAddress?: {
    details?: string;
    city?: string;
    phone?: string;
  };
  isPaid?: boolean;
  isDelivered?: boolean;
  taxPrice?: number;
  shippingPrice?: number;
  cartItems?: IOrderCartItem[];
  user?: IOrderUser;
}
