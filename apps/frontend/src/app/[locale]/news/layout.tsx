import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/news");

export default function NewsLayout({ children }: { children: ReactNode }) {
  return children;
}
