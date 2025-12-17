import { create } from "zustand";
import {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} from "../services/wishList.service";
import { IProduct } from "../interfaces/product";
import { IWishlistState } from "../interfaces/wishlist";
import toast from "react-hot-toast";

const LOCAL_KEY = "wishlist_guide_ids";

export const useWishlistStore = create<IWishlistState>((set, get) => ({
  wishlistIds: [],
  wishlistProducts: [],
  wishListCount: 0,
  token: null,
  loading: false,
  error: null,

  setToken: (token) => set({ token }),

  loadWishlist: async () => {
    const { token } = get();

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

    try {
      set({ loading: true });
      const res = await getWishList(token);
      const products = res.data || [];
      const ids = products.map((p: IProduct) => p._id || p.id);

      set({
        wishlistProducts: products,
        wishlistIds: ids,
        wishListCount: ids.length,
      });
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId: string, opts?: { silent?: boolean }) => {
    const { token, wishlistIds, wishlistProducts } = get();
    const exists = wishlistIds.includes(productId);
    const prevState = get();

    // ---------- GUEST ----------
    if (!token) {
      const updated = exists
        ? wishlistIds.filter((id) => id !== productId)
        : [...wishlistIds, productId];

      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

      set({
        wishlistIds: updated,
        wishListCount: updated.length,
      });

      if (!opts?.silent) {
        toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      }
      return;
    }

    // ---------- LOGGED-IN (OPTIMISTIC) ----------
    set({
      wishlistIds: exists
        ? wishlistIds.filter((id) => id !== productId)
        : [...wishlistIds, productId],
      wishlistProducts: exists
        ? wishlistProducts.filter((p) => p._id !== productId)
        : wishlistProducts,
      wishListCount: exists ? wishlistIds.length - 1 : wishlistIds.length + 1,
    });

    try {
      exists
        ? await removeFromWishlist(productId, token)
        : await addToWishlist(productId, token);

      if (!opts?.silent) {
        toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      }
    } catch {
      set(prevState);
      if (!opts?.silent) toast.error("Something went wrong");
    }
  },

  clearWishlist: async () => {
    const { token, wishlistIds } = get();
    const prevState = get();

    if (!wishlistIds.length) return;

    set({
      wishlistIds: [],
      wishlistProducts: [],
      wishListCount: 0,
    });

    if (!token) {
      localStorage.removeItem(LOCAL_KEY);
      toast.success("Wishlist cleared");
      return;
    }

    try {
      await Promise.all(wishlistIds.map((id) => removeFromWishlist(id, token)));
      toast.success("Wishlist cleared");
    } catch {
      set(prevState);
      toast.error("Failed to clear wishlist");
    }
  },

  isInWishlist: (id: string) => get().wishlistIds.includes(id),
}));
