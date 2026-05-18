import CartPage from "@/views/cart/CartPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Your Cart - Sikbeauty",
  description: "View your shopping cart.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><CartPage /></ProtectedRoute>
  );
}
