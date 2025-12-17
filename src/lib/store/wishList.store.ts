import { create } from "zustand";
import {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} from "../services/wishList.service";
import { IProduct } from "../interfaces/product";
import { IWishlistState } from "../interfaces/wishlist";

const LOCAL_KEY = "wishlist_guide_ids";

export const useWishlistStore = create<IWishlistState>((set, get) => ({
  wishlistIds: [],
  wishlistProducts: [],
  wishListCount: 0,
  token: null,
  loading: false,
  error: null,

  setToken: (token) => {
    set({ token });
  },

  loadWishlist: async () => {
    const { token } = get();

    // ---------- GUEST ----------
    if (!token) {
      const raw = localStorage.getItem(LOCAL_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      set({
        wishlistIds: ids,
        wishlistProducts: [],
        wishListCount: ids.length,
      });
      return;
    }

    // ---------- LOGGED-IN ----------
    try {
      set({ loading: true, error: null });

      const res = await getWishList(token);
      const products = res.data || [];
      const count = res.count || 0;
      const ids = products.map((p: IProduct) => p._id || p.id);

      set({
        wishlistProducts: products,
        wishlistIds: ids,
        wishListCount: count ?? ids.length,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to load wishlist" });
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    const { token, wishlistIds } = get();
    // ---------- GUEST ----------
    if (!token) {
      console.log("I am here", token);
      const exists = wishlistIds.includes(productId);
      const updated = exists
        ? wishlistIds.filter((id) => id !== productId)
        : [...wishlistIds, productId];

      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      set({ wishlistIds: updated, wishListCount: updated.length });
      return;
    }

    // ---------- LOGGED-IN ----------
    try {
      set({ loading: true, error: null });

      console.log("I am here");
      const exists = wishlistIds.includes(productId);

      if (exists) {
        await removeFromWishlist(productId, token);
      } else {
        await addToWishlist(productId, token);
      }

      await get().loadWishlist();
    } catch (err: any) {
      set({ error: err.message || "Wishlist operation failed" });
    } finally {
      set({ loading: false });
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.includes(productId);
  },
}));
