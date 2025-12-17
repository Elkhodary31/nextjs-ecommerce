"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/lib/store/wishList.store";

export default function WishlistHydrator() {
  const session = useSession();
  const setToken = useWishlistStore((s) => s.setToken);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  useEffect(() => {
    if (session?.data?.token) {
      setToken(session?.data?.token);
      loadWishlist();
    }
  }, [session]);

  return null;
}
