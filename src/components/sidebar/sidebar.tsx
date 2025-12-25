"use client";

import { getAllCategories } from "@/lib/services/category.service";
import { getAllBrands } from "@/lib/services/brand.service";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ICategory } from "@/lib/interfaces/category";
import { IBrand } from "@/lib/interfaces/brand";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [scrolled, setScrolled] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
    brands: true,
  });

  const params = useSearchParams();
  const router = useRouter();

  const updateURLParams = (key: string, values: string[]) => {
    const newParams = new URLSearchParams(params.toString());
    if (values.length > 0) newParams.set(key, values.join(","));
    else newParams.delete(key);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const clearFilter = (key: "categories" | "brands" | "price") => {
    const newParams = new URLSearchParams(params.toString());

    if (key === "categories") {
      setSelectedCategories([]);
      newParams.delete("categories");
    }

    if (key === "brands") {
      setSelectedBrands([]);
      newParams.delete("brands");
    }

    if (key === "price") {
      setMinPrice(0);
      setMaxPrice(5000);
      newParams.delete("minPrice");
      newParams.delete("maxPrice");
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("sidebarOpenSections", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpenSections");
    if (saved) setOpenSections(JSON.parse(saved));

    const catParam = params.get("categories");
    const brandParam = params.get("brands");
    const minParam = params.get("minPrice");
    const maxParam = params.get("maxPrice");

    setSelectedCategories(catParam ? catParam.split(",") : []);
    setSelectedBrands(brandParam ? brandParam.split(",") : []);
    if (minParam) setMinPrice(Number(minParam));
    if (maxParam) setMaxPrice(Number(maxParam));
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingBrands(true);
        const [c, b] = await Promise.all([
          getAllCategories(),
          getAllBrands(1, 100),
        ]);
        setCategories(c.data);
        setBrands(b.data);
      } finally {
        setLoadingCategories(false);
        setLoadingBrands(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const scrollHandler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <aside
      className={`p-4 h-full sticky top-20 overflow-y-auto bg-white shadow-sm transition-all duration-300 ${
        scrolled ? "pt-14" : "pt-32"
      }`}
    >
      {/* PRICE */}
      <div className="border-b border-gray-200 group hover:bg-gray-100 transition-all rounded-md">
        <div
          role="button"
          onClick={() => toggleSection("price")}
          className="flex justify-between items-center w-full px-2 py-2 font-semibold cursor-pointer"
        >
          <span>Price</span>

          <div className="flex items-center gap-2">
            {(params.get("minPrice") || params.get("maxPrice")) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter("price");
                }}
                className="text-xs px-2 py-0.5 border border-gray-400 rounded-md hover:bg-gray-300 transition-all"
              >
                clear
              </button>
            )}

            <ChevronDown
              className={`transition-transform duration-300 ${
                openSections.price ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>

      <ul
        className={`transition-all duration-300 overflow-hidden ${
          openSections.price
            ? "max-h-64 opacity-100 mt-2"
            : "max-h-0 opacity-0 -mt-2"
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice === 0 ? "" : minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value || 0))}
            className="w-20 border border-gray-300 rounded-md p-1 text-sm focus:border-black"
          />

          <span>to</span>

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-md p-1 text-sm focus:border-black"
          />

          <button
            className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 transition-all"
            onClick={() => {
              const newParams = new URLSearchParams(params.toString());
              newParams.set("minPrice", minPrice.toString());
              newParams.set("maxPrice", maxPrice.toString());
              router.replace(`?${newParams.toString()}`, { scroll: false });
            }}
          >
            Apply
          </button>
        </div>

        <input
          type="range"
          min={minPrice}
          max="100000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full mt-4 accent-black"
        />

        <span className="text-xs text-gray-500 mt-1 block">
          Up to: {maxPrice} EGP
        </span>
      </ul>

      {/* CATEGORIES */}
      <div className="border-b border-gray-200 group hover:bg-gray-100 transition-all rounded-md mt-4">
        <div
          role="button"
          onClick={() => toggleSection("categories")}
          className="flex justify-between items-center w-full px-2 py-2 font-semibold cursor-pointer"
        >
          <span>Categories</span>

          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter("categories");
                }}
                className="text-xs px-2 py-0.5 border border-gray-400 rounded-md hover:bg-gray-300 transition-all"
              >
                clear
              </button>
            )}

            <ChevronDown
              className={`transition-transform duration-300 ${
                openSections.categories ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>

      <ul
        className={`transition-all duration-300 overflow-hidden ${
          openSections.categories
            ? "max-h-64 opacity-100 mt-2"
            : "max-h-0 opacity-0 -mt-2"
        }`}
      >
        {loadingCategories
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))
          : categories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => {
                    const updated = selectedCategories.includes(cat._id)
                      ? selectedCategories.filter((c) => c !== cat._id)
                      : [...selectedCategories, cat._id];
                    setSelectedCategories(updated);
                    updateURLParams("categories", updated);
                  }}
                  className="w-4 h-4"
                />
                {cat.name}
              </label>
            ))}
      </ul>

      {/* BRANDS */}
      <div className="border-b border-gray-200 group hover:bg-gray-100 transition-all rounded-md mt-4">
        <div
          role="button"
          onClick={() => toggleSection("brands")}
          className="flex justify-between items-center w-full px-2 py-2 font-semibold cursor-pointer"
        >
          <span>Brands</span>

          <div className="flex items-center gap-2">
            {selectedBrands.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter("brands");
                }}
                className="text-xs px-2 py-0.5 border border-gray-400 rounded-md hover:bg-gray-300 transition-all"
              >
                clear
              </button>
            )}

            <ChevronDown
              className={`transition-transform duration-300 ${
                openSections.brands ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>

      <ul
        className={`transition-all duration-300 overflow-hidden ${
          openSections.brands
            ? "max-h-72 opacity-100 mt-2 overflow-y-auto"
            : "max-h-0 opacity-0 -mt-2"
        }`}
      >
        {loadingBrands
          ? [...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            ))
          : brands.map((brand) => (
              <label
                key={brand._id}
                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand._id)}
                  onChange={() => {
                    const updated = selectedBrands.includes(brand._id)
                      ? selectedBrands.filter((b) => b !== brand._id)
                      : [...selectedBrands, brand._id];
                    setSelectedBrands(updated);
                    updateURLParams("brands", updated);
                  }}
                  className="w-4 h-4"
                />
                {brand.name}
              </label>
            ))}
      </ul>

      {openSections.brands && (
        <Link
          href="/brands"
          className="flex items-center justify-center gap-1 mx-auto mt-3 text-sm font-medium bg-blue-50 px-4 py-1.5 rounded-md transition-all hover:bg-gray-600 hover:text-white active:scale-95"
        >
          <Plus className="w-4 h-4" />
          View All Brands
        </Link>
      )}
    </aside>
  );
}
