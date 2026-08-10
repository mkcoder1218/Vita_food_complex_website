import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/become-distributor");

export default function BecomeDistributorLayout({ children }: { children: ReactNode }) {
  return children;
}
