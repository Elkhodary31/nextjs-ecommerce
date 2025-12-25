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
  Menu,
  X,
  LogOut,
  User,
  ShoppingBag as OrderIcon,
  ChevronDown,
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
import { useSession, signOut } from "next-auth/react";
import { useWishlistStore } from "@/lib/store/wishList.store";
import { useCart } from "@/context/CartProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubcategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const wishListCount = useWishlistStore((state) => state.wishListCount);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);
  const { cartCount } = useCart();
  const isAuthenticated = !!session.data?.user;

  const isActive = (path: string) => {
    // Extract just the path without query parameters
    const currentPath = pathname.split("?")[0];
    return currentPath === path || (path === "/" && currentPath === "/");
  };

  useEffect(() => {
    loadWishlist();
  }, [session?.data, loadWishlist]);

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if clicking outside the account button/menu
      if (!target.closest(".account-menu-wrapper")) {
        setOpenAccountMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
          <div className="my-container flex items-center justify-between gap-2 md:gap-6 w-full">
            {/* Logo */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <ShoppingBag className="w-5 md:w-7 h-5 md:h-7" />
              <Link
                href="/"
                className="text-sm md:text-2xl font-bold whitespace-nowrap"
              >
                Techne<span className="text-red-500">Store</span>
              </Link>
            </div>

            {/* Search - hide on small screens */}
            <div className="relative flex-1 max-w-xs md:max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 rounded-full text-sm"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 md:gap-8">
              <NavigationMenu>
                <NavigationMenuList className="gap-4 md:gap-6">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/"
                        className={`text-sm md:text-base transition-colors ${
                          isActive("/")
                            ? "text-blue-600 font-semibold"
                            : "hover:text-blue-600"
                        }`}
                      >
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products"
                        className={`text-sm md:text-base transition-colors ${
                          isActive("/products")
                            ? "text-blue-600 font-semibold"
                            : "hover:text-blue-600"
                        }`}
                      >
                        Products
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/about"
                        className={`text-sm md:text-base transition-colors ${
                          isActive("/about")
                            ? "text-blue-600 font-semibold"
                            : "hover:text-blue-600"
                        }`}
                      >
                        About
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/contact"
                        className={`text-sm md:text-base transition-colors ${
                          isActive("/contact")
                            ? "text-blue-600 font-semibold"
                            : "hover:text-blue-600"
                        }`}
                      >
                        Contact Us
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <TooltipProvider>
                {/* Cart */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={
                        isAuthenticated ? "/cart" : "/login?callbackUrl=/cart"
                      }
                      className="relative group"
                    >
                      <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 cursor-pointer transition-all group-hover:text-green-500 group-hover:fill-green-500" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-110 font-semibold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Cart</TooltipContent>
                </Tooltip>

                {/* Wishlist */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/wishlist" className="relative group">
                      <Heart className="w-5 md:w-6 h-5 md:h-6 cursor-pointer transition-all group-hover:text-red-500 group-hover:fill-red-500" />
                      {wishListCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-110 font-semibold">
                          {wishListCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Wishlist</TooltipContent>
                </Tooltip>

                {/* Account/Login */}
                {isAuthenticated ? (
                  <div className="relative account-menu-wrapper">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAccountMenu(!openAccountMenu);
                      }}
                      className="flex items-center gap-1 md:gap-2 cursor-pointer group transition-all duration-300 hover:text-blue-600 px-2"
                    >
                      <CircleUser className="w-5 md:w-6 h-5 md:h-6 transition-all duration-300 group-hover:fill-blue-600 group-hover:text-white" />
                      <span className="hidden md:inline text-sm font-medium transition-colors duration-300 group-hover:text-blue-600">
                        {session?.data?.user?.name || "Account"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 hidden md:inline ${
                          openAccountMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {openAccountMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 animate-slide-down">
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 transition-colors rounded-t-lg text-sm duration-200 group"
                          onClick={() => setOpenAccountMenu(false)}
                        >
                          <User className="w-4 h-4 flex-shrink-0 transition-colors duration-200 group-hover:text-blue-600" />
                          <span className="transition-colors duration-200 group-hover:text-blue-600">
                            My Account
                          </span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 transition-colors border-t text-sm duration-200 group"
                          onClick={() => setOpenAccountMenu(false)}
                        >
                          <OrderIcon className="w-4 h-4 flex-shrink-0 transition-colors duration-200 group-hover:text-blue-600" />
                          <span className="transition-colors duration-200 group-hover:text-blue-600">
                            My Orders
                          </span>
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors border-t text-red-600 hover:text-red-700 rounded-b-lg text-sm duration-200 group"
                          onClick={async () => {
                            setOpenAccountMenu(false);
                            await signOut({ callbackUrl: "/" });
                          }}
                        >
                          <LogOut className="w-4 h-4 flex-shrink-0 transition-colors duration-200 group-hover:text-red-700" />
                          <span className="transition-colors duration-200">
                            Logout
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1 md:gap-2 cursor-pointer group transition-all duration-300 hover:text-blue-600 px-2"
                  >
                    <CircleUser className="w-5 md:w-6 h-5 md:h-6 transition-all duration-300 group-hover:fill-blue-600 group-hover:text-white" />
                    <span className="hidden md:inline text-sm font-medium transition-colors duration-300 group-hover:text-blue-600">
                      Login
                    </span>
                  </Link>
                )}
              </TooltipProvider>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t mt-3 py-2 bg-gray-50">
              <div className="my-container flex flex-col gap-1 py-2">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/products")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/about")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/contact")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Search */}
          {!scrolled && (
            <div className="lg:hidden relative mt-3 mx-4 mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9 rounded-full text-sm"
              />
            </div>
          )}

          {!scrolled && categories.length > 0 && (
            <div className="hidden lg:block bg-gray-100 border-t mt-3 py-1">
              <div className="my-container  lg:flex lg:justify-between gap-3 py-2 max-h-32 lg:max-h-none overflow-y-auto lg:overflow-x-auto lg:overflow-y-visible grid grid-cols-2 sm:grid-cols-3">
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
                        className="px-4 py-1.5 bg-white rounded-full border hover:bg-gray-50 transition-colors block text-center whitespace-nowrap"
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
