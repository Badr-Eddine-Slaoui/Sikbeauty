import OrderDetails from "@/views/orders/OrderDetails";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Order Details - Sikbeauty",
  description: "View order details.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><OrderDetails /></ProtectedRoute>
  );
}
