import PaymentFailed from "@/pages/payment/PaymentFailed";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Payment Cancelled - Sikbeauty",
  description: "Payment was cancelled.",
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><PaymentFailed /></ProtectedRoute>
  );
}
