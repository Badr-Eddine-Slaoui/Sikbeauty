import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Admin Dashboard - Sikbeauty",
  description: "Admin dashboard.",
};

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
  );
}
