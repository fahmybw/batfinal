"use client";

import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  return (
    <main className="p-8">
      <form
        action={async (fd) => {
          fd.append("token", token);
          const r = await fetch("/api/auth/reset-password", { method: "POST", body: fd });
          if (r.ok) router.push("/auth/sign-in");
        }}
        className="card max-w-md mx-auto space-y-3"
      >
        <h1 className="text-2xl">Reset password</h1>
        <input className="input" name="password" type="password" required placeholder="New password" />
        <button className="btn btn-primary">Reset</button>
      </form>
    </main>
  );
}
