import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/about");

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
