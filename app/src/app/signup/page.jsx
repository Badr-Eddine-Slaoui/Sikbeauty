import Signup from "@/views/auth/SignupPage";
import GuestRoute from "@/components/GuestRoute";

export const metadata = {
  title: "Sign Up - Sikbeauty",
  description: "Create an account on Sikbeauty.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <GuestRoute><Signup /></GuestRoute>
  );
}
