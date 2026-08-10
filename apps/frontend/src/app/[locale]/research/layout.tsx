import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/research");

export default function ResearchLayout({ children }: { children: ReactNode }) {
  return children;
}
