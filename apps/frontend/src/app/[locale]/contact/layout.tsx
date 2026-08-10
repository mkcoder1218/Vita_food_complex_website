import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/contact");

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
