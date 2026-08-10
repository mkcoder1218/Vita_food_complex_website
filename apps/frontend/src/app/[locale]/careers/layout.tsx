import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/careers");

export default function CareersLayout({ children }: { children: ReactNode }) {
  return children;
}
