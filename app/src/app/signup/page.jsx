import Signup from "@/pages/auth/SignupPage";
import GuestRoute from "@/components/GuestRoute";

export const metadata = {
  title: "Sign Up - Sikbeauty",
  description: "Create an account on Sikbeauty.",
};

export default function Page() {
  return (
    <GuestRoute><Signup /></GuestRoute>
  );
}
