"use client";

import { useCartStore } from "@/lib/client/store";
import type { Product } from "@/types";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "large";
}

export default function AddToCartButton({
  product,
  variant = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const base =
    "w-full font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2";
  const sizes =
    variant === "large" ? "px-8 py-3 text-base" : "px-4 py-2 text-sm";
  const colors = added
    ? "bg-green-500 text-white"
    : "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95";

  return (
    <button onClick={handleAdd} className={`${base} ${sizes} ${colors}`}>
      {added ? (
        <>
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Added!
        </>
      ) : (
        <>
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
