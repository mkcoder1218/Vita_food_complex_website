import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/gallery");

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}
