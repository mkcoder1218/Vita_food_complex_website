import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/faqs");

export default function FaqsLayout({ children }: { children: ReactNode }) {
  return children;
}
