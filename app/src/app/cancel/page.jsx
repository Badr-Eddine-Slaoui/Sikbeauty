import PaymentFailed from "@/views/payment/PaymentFailed";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Payment Cancelled - Sikbeauty",
  description: "Payment was cancelled.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><PaymentFailed /></ProtectedRoute>
  );
}
