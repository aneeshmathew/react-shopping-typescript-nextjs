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
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden hover:border-indigo-500/40 transition-colors group">
      <Link href={`/products/${product.id}`} className="block p-6 flex-shrink-0">
        <div className="relative h-48 mb-4 rounded-xl bg-slate-800/40 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <span className="inline-block text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full mb-2">
          {formatCategoryLabel(product.category)}
        </span>
        <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs text-slate-400">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>
        <p className="text-lg font-bold text-white">
          ${product.price.toFixed(2)}
        </p>
      </Link>

      <div className="px-6 pb-6 mt-auto">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
