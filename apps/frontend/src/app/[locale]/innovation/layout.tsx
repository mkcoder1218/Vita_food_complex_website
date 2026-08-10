import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/innovation");

export default function InnovationLayout({ children }: { children: ReactNode }) {
  return children;
}
