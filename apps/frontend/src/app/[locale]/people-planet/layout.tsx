import type { ReactNode } from "react";
import { createStaticMetadata } from "@/lib/seo";

export const generateMetadata = createStaticMetadata("/people-planet");

export default function PeoplePlanetLayout({ children }: { children: ReactNode }) {
  return children;
}
