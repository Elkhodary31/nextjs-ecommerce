"use client";

import { useState, useEffect } from "react";
import { getAllBrands } from "@/lib/services/brand.service";
import { IBrand } from "@/lib/interfaces/brand";
import { IMetadata } from "@/lib/interfaces/metadata";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BrandsPage() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [metadata, setMetadata] = useState<IMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const router = useRouter();

  const currentPage = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 40);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getAllBrands(currentPage, limit);
        setBrands(response.data);
        setMetadata(response.metadata || null);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [currentPage, limit]);

  const changePage = (page: number) => {
    if (!metadata) return;
    if (page < 1 || page > metadata.numberOfPages!) return;

    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());
    router.replace("?" + newParams.toString(), { scroll: false });
  };

  const getPages = () => {
    if (!metadata?.numberOfPages) return [];

    const total = metadata.numberOfPages;
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Brands</h1>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading
            ? [...Array(limit)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="p-3 bg-gray-50 border-t">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            : brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/products?brands=${brand._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-500"
                >
                  <div className="aspect-square relative bg-white p-4">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 border-t">
                    <h3 className="text-center font-semibold text-sm group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>

        {/* Pagination */}
        {metadata && metadata.numberOfPages! > 1 && (
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
                      currentPage === metadata.numberOfPages
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
    </div>
  );
}
