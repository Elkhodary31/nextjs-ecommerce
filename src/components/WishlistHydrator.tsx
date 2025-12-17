"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/lib/store/wishList.store";

export default function WishlistHydrator() {
  const session = useSession();
  console.log("Data ", session);
  const setToken = useWishlistStore((s) => s.setToken);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  useEffect(() => {
    console.log("session");
    console.log("session", session?.data?.token);
    if (session?.data?.token) {
      setToken(session?.data?.token);
      loadWishlist();
    }
  }, [session]);

  return null;
}
