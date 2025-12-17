"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CartToast from "@/components/CartToast";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/services/cart.service";
import { ICart, ICartProduct } from "@/lib/interfaces/cart";

interface CartContextType {
  cart: ICart | null;
  cartCount: number;
  loading: boolean;
  addItemToCart: (
    productId: string,
    opts?: { showToast?: boolean }
  ) => Promise<void>;
  updateItemQuantity: (productId: string, count: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearUserCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(false);
  const token = (session as any)?.token;

  const cartCount = cart?.products?.length || 0;

  // Load cart on mount/token change
  useEffect(() => {
    if (token) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [token]);

  const refreshCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getCart(token);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (
    productId: string,
    opts?: { showToast?: boolean }
  ) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    try {
      const response = await addToCart(productId, token);

      // Fetch a fresh cart to ensure populated products (some endpoints return product as string id)
      let fullCart = response.data;
      try {
        const refreshed = await getCart(token);
        fullCart = refreshed.data;
      } catch (e) {
        console.warn("[CartProvider] getCart after add failed; using add response", e);
      }

      setCart(fullCart);

      if (opts?.showToast !== false) {
        // Show a custom cart toast with items and quantity controls
        toast.custom(
          (t) => (
            <div
              className={
                t.visible ? "animate-in fade-in-0" : "animate-out fade-out-0"
              }
            >
              <CartToast
                cart={fullCart}
                onUpdateQuantity={(id, count) => updateItemQuantity(id, count)}
                onClose={() => toast.dismiss(t.id)}
              />
            </div>
          ),
          { duration: 5000, position: "bottom-right" }
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const updateItemQuantity = async (productId: string, count: number) => {
    if (!token) return;

    const prevCart = cart;

    // Optimistic update
    if (cart) {
      const updated = {
        ...cart,
        products: cart.products.map((p) => {
          const pid =
            typeof p.product === "object"
              ? p.product._id || (p.product as any).id
              : p.product;
          return pid === productId ? { ...p, count } : p;
        }),
        totalCartPrice: cart.products.reduce((sum, p) => {
          const pid =
            typeof p.product === "object"
              ? p.product._id || (p.product as any).id
              : p.product;
          const itemCount = pid === productId ? count : p.count;
          return sum + p.price * itemCount;
        }, 0),
      };
      setCart(updated);
    }

    try {
      const response = await updateCartItemQuantity(productId, count, token);
      setCart(response.data);
      toast.success("Quantity updated");
    } catch (error: any) {
      setCart(prevCart);
      toast.error(error.message || "Failed to update");
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;

    const prevCart = cart;

    // Optimistic update
    if (cart) {
      setCart({
        ...cart,
        products: cart.products.filter((p) => {
          const pid =
            typeof p.product === "object"
              ? p.product._id || (p.product as any).id
              : p.product;
          return pid !== productId;
        }),
      });
    }

    try {
      const response = await removeCartItem(productId, token);
      setCart(response.data);
      toast.success("Item removed");
    } catch (error: any) {
      setCart(prevCart);
      toast.error(error.message || "Failed to remove item");
    }
  };

  const clearUserCart = async () => {
    if (!token) return;

    const prevCart = cart;
    setCart(null);

    try {
      await clearCart(token);
      toast.success("Cart cleared");
    } catch (error: any) {
      setCart(prevCart);
      toast.error(error.message || "Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addItemToCart,
        updateItemQuantity,
        removeItem,
        clearUserCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
