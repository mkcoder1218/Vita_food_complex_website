import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/terms");

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
