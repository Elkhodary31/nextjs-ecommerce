import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/product.service";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";
import WishlistButton from "./WishlistButton";
import QuantitySelector from "./QuantitySelector";
import RelatedProducts from "./RelatedProducts";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let product;
  try {
    const res = await getProductById(id);
    product = res.data;
  } catch (e) {
    return notFound();
  }

  const rounded = Math.round(product.ratingsAverage || 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Images */}
            <div>
              <ImageGallery
                images={
                  product.images?.length ? product.images : [product.imageCover]
                }
                cover={product.imageCover}
                title={product.title}
              />
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-sm">
                {product.brand?.name && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {product.brand.name}
                  </span>
                )}
                {product.category?.name && (
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < rounded
                          ? "w-5 h-5 text-yellow-400 fill-yellow-400"
                          : "w-5 h-5 text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.ratingsAverage?.toFixed?.(1) ?? "0.0"} (
                  {product.ratingsQuantity ?? 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.price} EGP
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-y border-gray-200 py-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.quantity}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.sold}
                  </p>
                </div>
              </div>

              {/* Actions - placeholders for wiring to cart/wishlist */}
              <div className="flex gap-3">
                <QuantitySelector max={product.quantity} />
                <Button className="flex-1 h-11 cursor-pointer transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]">
                  <ShoppingCart className="w-5 h-5 mr-2 cursor-pointer " /> Add
                  to Cart
                </Button>
                <WishlistButton productId={product._id} />
              </div>

              {/* Subcategories */}
              {product.subcategory?.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Subcategories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.subcategory.map((s) => (
                      <span
                        key={s._id}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          categoryId={product.category._id}
          productId={product._id || product.id}
        />
      </div>
    </div>
  );
}
