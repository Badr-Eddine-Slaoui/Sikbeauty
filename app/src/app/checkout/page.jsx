import CheckoutPage from "@/pages/checkout/CheckoutPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Checkout - Sikbeauty",
  description: "Checkout securely.",
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><CheckoutPage /></ProtectedRoute>
  );
}
