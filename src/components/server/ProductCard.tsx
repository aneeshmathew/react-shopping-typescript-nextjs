import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import AddToCartButton from "@/components/client/AddToCartButton";
import { formatCategoryLabel } from "@/lib/formatCategoryLabel";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/products/${product.id}`} className="block p-6 flex-shrink-0">
        <div className="relative h-48 mb-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
          {formatCategoryLabel(product.category)}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs text-gray-500">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>
        <p className="text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </Link>

      <div className="px-6 pb-6 mt-auto">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
