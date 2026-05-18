import CheckoutPage from "@/views/checkout/CheckoutPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Checkout - Sikbeauty",
  description: "Checkout securely.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><CheckoutPage /></ProtectedRoute>
  );
}
