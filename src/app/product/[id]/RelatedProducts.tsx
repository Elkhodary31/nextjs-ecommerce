import { getAllProducts } from "@/lib/services/product.service";
import { IProduct } from "@/lib/interfaces/product";
import RelatedProductCard from "./RelatedProductCard";
import { Tag } from "lucide-react";

export default async function RelatedProducts({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) {
  let relatedProducts: IProduct[] = [];

  try {
    const response = await getAllProducts({
      page: 1,
      limit: 10,
      categories: [categoryId],
    });
    // Filter out current product and get only 4
    relatedProducts = (response.data || [])
      .filter((p) => (p._id || p.id) !== productId)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Tag className="inline-block mr-2 fill-black" />
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <RelatedProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
