import type { Metadata } from "next";
import { TechMap } from "@/components/techmap/TechMap";

export const metadata: Metadata = { title: "Tech flow map" };

export default function TechMapPage() {
  return (
    <div className="layout page-map">
      <main className="main" id="main">
        <TechMap />
      </main>
    </div>
  );
}
