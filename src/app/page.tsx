import { getAllBrands } from "@/lib/services/brand.service";
import { getAllCategories } from "@/lib/services/category.service";
import { getAllProducts } from "@/lib/services/product.service";
import BrandCarousel from "@/components/home/BrandCarousel";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import ProductCarousel from "@/components/home/ProductCarousel";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import HeroCarousel from "@/components/home/HeroCarousel";
import FlashSale from "@/components/home/FlashSale";

export default async function Home() {
  const [brandsRes, categoriesRes, productsRes, flashSaleRes] = await Promise.all([
    getAllBrands(1, 36),
    getAllCategories(),
    getAllProducts({ page: 1, limit: 18 }),
    getAllProducts({ page: 1, limit: 6, sort: "-sold" }),
  ]);

  const brands = brandsRes.data;
  const categories = categoriesRes.data;
  const products = productsRes.data;
  const flashSaleProducts = flashSaleRes.data;

  const heroImages = [
    "/images/home/1.png",
    "/images/home/2.jpg",
    "/images/home/3.png",
    "/images/home/header.jpg",
  ];

  return (
    <div className="my-container pt-20 lg:pt-28">
      {/* Hero Carousel */}
      <HeroCarousel images={heroImages} />

      {/* Service Features */}
      <ServiceFeatures />

      {/* Flash Sale */}
      <FlashSale products={flashSaleProducts} />

      {/* Carousels */}
      <BrandCarousel brands={brands} title="Top Brands" />
      <CategoryCarousel categories={categories} title="Popular Categories" />
      <ProductCarousel products={products} title="Featured Products" />
    </div>
  );
}
