import { getProducts } from "@/lib/server/api";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ id: String(p.id) }));
  } catch (err) {
    console.error(
      "generateStaticParams: failed to fetch products, falling back to on-demand rendering",
      err
    );
    return [];
  }
}

export { default } from "@/components/server/ProductDetail";
