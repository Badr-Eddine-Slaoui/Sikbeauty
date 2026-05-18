import PaymentSuccess from "@/views/payment/PaymentSuccess";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Payment Success - Sikbeauty",
  description: "Payment successful.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><PaymentSuccess /></ProtectedRoute>
  );
}
