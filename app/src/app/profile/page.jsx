import UserProfile from "@/views/user/UserProfile";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Your Profile - Sikbeauty",
  description: "Manage your profile.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["Individual", "Professional"]}><UserProfile /></ProtectedRoute>
  );
}
