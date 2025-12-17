"use client";
import { IProduct } from "@/lib/interfaces/product";
import { getAllProducts } from "@/lib/services/product.service";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IMetadata } from "@/lib/interfaces/metadata";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "./productCard";
import { useWishlistStore } from "@/lib/store/wishList.store";
export default function Products() {
  const router = useRouter();
  const params = useSearchParams();

  // Get current values from URL
  const currentSort = params.get("sort") || "relevance";
  const currentPage = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 20);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  // Update URL when sort/limit changes
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === "relevance") {
      newParams.delete("sort");
    } else {
      newParams.set(key, value);
    }

    router.replace("?" + newParams.toString(), { scroll: false });
  };

  const [products, setProducts] = useState<IProduct[]>([]);
  const [metaData, setMetaData] = useState<IMetadata>();
  const [results, setResults] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("categories");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const changePage = (page: number) => {
    if (!metaData) return;

    if (page < 1 || page > metaData.numberOfPages!) return;

    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());

    router.replace("?" + newParams.toString(), { scroll: false });
  };
  const getPages = () => {
    if (!metaData?.numberOfPages) return [];

    const total = metaData.numberOfPages;
    const pages: (number | "dots")[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "dots", total);
      } else if (currentPage >= total - 2) {
        pages.push(1, "dots", total - 2, total - 1, total);
      } else {
        pages.push(1, "dots", currentPage, "dots", total);
      }
    }

    return pages;
  };
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getAllProducts({
          page: currentPage,
          limit,
          categories: category ? [category] : [],
          brands: brand ? [brand] : [],
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sort: currentSort !== "relevance" ? currentSort : undefined,
        });

        setProducts(productData.data);
        setMetaData(productData.metadata);
        setResults(productData.results || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, brand, minPrice, maxPrice, currentSort, currentPage, limit]);

  return (
    <div className="pt-28 ">
      <div className="flex items-center justify-between mb-6 px-2">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Products</h2>
          <p className="text-gray-600">{results} products found</p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Sort Selector */}
          <select
            className="border px-3 py-2 rounded-lg text-sm cursor-pointer bg-white shadow-sm"
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
          </select>

          {/* Limit Selector */}
          <div className="">
            <input
              type="text"
              min={1}
              max={40}
              defaultValue={20}
              className="w-10 h-8 px-2 rounded-md border border-gray-300 no-
            focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="40"
            />
            <label className="text-sm  ">
              {" "}
              /40 <strong>Limit</strong>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {loading
          ? [...Array(limit)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-2xl animate-pulse"></div>
            ))
          : products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWished={wishlistIds.includes(product._id)}
                onToggleWish={toggleWishlist}
              />
            ))}
      </div>

      {metaData && (
        <div className="pt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changePage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Pages */}
              {getPages().map((item, idx) =>
                item === "dots" ? (
                  <PaginationItem key={idx}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={item === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        changePage(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changePage(currentPage + 1);
                  }}
                  className={
                    currentPage === metaData.numberOfPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
