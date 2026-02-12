import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <Suspense fallback={<main className="p-8"><div className="card max-w-md mx-auto">Loading...</div></main>}>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
