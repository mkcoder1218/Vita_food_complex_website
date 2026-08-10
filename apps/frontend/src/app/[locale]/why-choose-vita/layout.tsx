import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/why-choose-vita");

export default function WhyChooseVitaLayout({ children }: { children: ReactNode }) {
  return children;
}
