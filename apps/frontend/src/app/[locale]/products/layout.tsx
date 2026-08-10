import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/products");

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
