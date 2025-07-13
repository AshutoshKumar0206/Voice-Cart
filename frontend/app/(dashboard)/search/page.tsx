import SearchClient from "@/components/SearchClient";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="pt-24 px-6">Loading...</p>}>
      <SearchClient />
    </Suspense>
  );
}
