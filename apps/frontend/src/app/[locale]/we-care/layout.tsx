import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/we-care");

export default function WeCareLayout({ children }: { children: ReactNode }) {
  return children;
}
