import AdminDashboard from "@/views/admin/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Admin Dashboard - Sikbeauty",
  description: "Admin dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
  );
}
