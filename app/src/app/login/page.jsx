import Login from "@/pages/auth/LoginPage";
import GuestRoute from "@/components/GuestRoute";

export const metadata = {
  title: "Login - Sikbeauty",
  description: "Login to Sikbeauty.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <GuestRoute><Login /></GuestRoute>
  );
}
