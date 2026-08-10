import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/sustainability");

export default function SustainabilityLayout({ children }: { children: ReactNode }) {
  return children;
}
