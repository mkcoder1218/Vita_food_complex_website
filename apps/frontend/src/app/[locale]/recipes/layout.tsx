import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/recipes");

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return children;
}
