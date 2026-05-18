import { Suspense } from "react";
import NotFound from "@/views/NotFound";

export const metadata = {
  title: "Page Not Found - Sikbeauty",
};

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NotFound />
    </Suspense>
  );
}

