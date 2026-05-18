import { Suspense } from "react";
import Login from "@/views/auth/LoginPage";
import GuestRoute from "@/components/GuestRoute";

export const metadata = {
  title: "Login - Sikbeauty",
  description: "Login to Sikbeauty.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <GuestRoute>
      <Suspense fallback={<div>Chargement...</div>}>
        <Login />
      </Suspense>
    </GuestRoute>
  );
}

