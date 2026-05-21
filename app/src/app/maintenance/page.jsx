import { Suspense } from "react";
import Maintenance from "@/views/Maintenance";

export const metadata = {
  title: "Maintenance en cours - Sikbeauty",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Maintenance />
    </Suspense>
  );
}
