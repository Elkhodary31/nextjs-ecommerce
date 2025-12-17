import { IProduct } from "./product";

export interface IWishlistAddRemove {
  status: string;
  Message: string;
  data: [];
}
export interface IWishlistResponse {
  status: string;
  count: number;
  data: IProduct[];
}
export interface IWishlistState {
  wishlistIds: string[];
  wishlistProducts: IProduct[];
  token: string | null;
  loading: boolean;
  error: string | null;
  wishListCount: number;

  setToken: (token: string | null) => void;
  loadWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}
