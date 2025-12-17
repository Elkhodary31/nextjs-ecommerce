"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import {
  CircleUser,
  Heart,
  Search,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllCategories } from "@/lib/services/category.service";
import { getAllSubcategories } from "@/lib/services/subcategory.service";
import { ICategory } from "@/lib/interfaces/category";
import { ISubcategory } from "@/lib/interfaces/subcategory";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/lib/store/wishList.store";
import { useCart } from "@/context/CartProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubcategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();
  const session = useSession();
  const wishListCount = useWishlistStore((state) => state.wishListCount);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);
  const { cartCount } = useCart();
  useEffect(() => {
    loadWishlist();
  }, [session?.data?.token]);

  useEffect(() => {
    (async () => {
      const catRes = await getAllCategories();
      const subRes = await getAllSubcategories();
      setCategories(catRes.data);
      setSubCategories(subRes.data);
    })();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY > 30) setActiveCategory(null);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* hide navbar in login & register pages */}
      {!["/login", "/register"].includes(pathname) && (
        <nav
          className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ${
            scrolled ? "py-2 shadow-md" : "pt-4"
          }`}
        >
          <div className="my-container flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 " />
              <Link href="/" className="text-2xl font-bold">
                Techne<span className="text-red-500">Store</span>
              </Link>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-11 rounded-full"
              />
            </div>

            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/products">Products</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact">Contact Us</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/cart" className="relative">
                      <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-green-500 hover:fill-green-500 transition" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-green-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Cart</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/wishlist" className="relative ">
                      <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 hover:fill-red-500 transition " />
                      {wishListCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                          {wishListCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Wishlist</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <TooltipTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer group">
                            <CircleUser className="w-6 h-6 transition  group-hover:fill-blue-600 group-hover:text-white" />
                            <span className="font-medium transition group-hover:text-blue-600">
                              {session?.data?.user?.name}
                            </span>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>Account</TooltipContent>
                      </Tooltip>
                    </TooltipTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Account</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {!scrolled && categories.length > 0 && (
            <div className="bg-gray-100 border-t mt-3 py-1">
              <div className="my-container flex justify-between gap-3 py-2 overflow-x-auto">
                {categories.map((category) => {
                  const relatedSubs = subCategories.filter(
                    (sub) => sub.category === category._id
                  );

                  return (
                    <div
                      key={category._id}
                      onMouseEnter={() => setActiveCategory(category._id)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <Link
                        href={`/products?categories=${category._id}`}
                        className="px-4 py-1.5 bg-white rounded-full border hover:bg-gray-50"
                      >
                        {category.name}
                      </Link>

                      {activeCategory === category._id &&
                        relatedSubs.length > 0 && (
                          <div
                            className="
                              fixed top-[110px] left-0 w-screen h-[70vh]
                              bg-white border-t shadow-lg z-40
                            "
                          >
                            <div className="my-container p-6">
                              <h3 className="font-semibold text-xl mb-4">
                                {category.name}
                              </h3>

                              <div className="grid grid-cols-3 gap-3 overflow-y-auto h-full">
                                {relatedSubs.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/products?categories=${category._id}&sub=${sub._id}`}
                                    onClick={() => setActiveCategory(null)}
                                    className="
                                      px-4 py-3 rounded
                                      hover:bg-gray-100 transition
                                    "
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
}
