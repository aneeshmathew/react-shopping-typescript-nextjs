import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/server/api";
import AddToCartButton from "@/components/client/AddToCartButton";
import { formatCategoryLabel } from "@/lib/formatCategoryLabel";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) notFound();

  const product = await getProduct(productId).catch(() => null);
  if (!product) notFound();

  const stars = Math.round(product.rating.rate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-8"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="flex items-center justify-center p-12 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative w-full max-w-xs aspect-square">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 40vw"
                priority
              />
            </div>
          </div>

          <div className="p-8 md:p-10 flex flex-col">
            <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3 w-fit">
              {formatCategoryLabel(product.category)}
            </span>

            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < stars ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.rate} out of 5 ({product.rating.count} reviews)
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
              {product.description}
            </p>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${product.price.toFixed(2)}
              </p>
              <AddToCartButton product={product} variant="large" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
