"use client";

import { useCartStore } from "@/lib/client/store";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const [ordered, setOrdered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    clearCart();
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12">
          <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Order placed!
          </h1>
          <p className="text-slate-400 mb-6">
            Thank you for your purchase. Your order is being processed.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <Link
          href="/"
          className="text-sm text-indigo-400 hover:underline flex items-center gap-1"
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
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-16 text-center">
          <svg
            className="w-16 h-16 text-slate-700 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-slate-400 mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex gap-5"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="relative w-24 h-24 flex-shrink-0 bg-slate-800/50 rounded-xl overflow-hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm font-semibold text-slate-100 hover:text-indigo-400 line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </Link>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                      aria-label="Remove"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 capitalize mt-0.5">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="inline-flex items-center justify-center w-8 h-7 text-sm font-semibold text-slate-100 bg-slate-900 border border-slate-700 rounded-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-base font-bold text-white">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-24">
              <h2 className="text-base font-bold text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm text-slate-400"
                  >
                    <span className="truncate mr-2">
                      {product.title.substring(0, 30)}
                      {product.title.length > 30 ? "…" : ""} × {quantity}
                    </span>
                    <span className="flex-shrink-0 font-medium text-slate-300">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4 mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400 mb-3">
                  <span>Shipping</span>
                  <span className="text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Place Order
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-sm text-slate-500 hover:text-red-400 transition-colors py-2"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
