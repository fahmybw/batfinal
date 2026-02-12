"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", body: formData });
    if (!res.ok) return setError((await res.json()).error || "Failed");
    router.push(mode === "sign-in" ? "/auth/verify-2fa" : "/auth/sign-in");
  }

  return (
    <form action={onSubmit} className="card max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-semibold">{mode === "sign-in" ? "Welcome back" : "Create account"}</h1>
      <input className="input" name="name" placeholder="Name" required={mode === "sign-up"} />
      <input className="input" name="email" placeholder="Email" type="email" required />
      <input className="input" name="password" placeholder="Password" type="password" required />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button className="btn btn-primary w-full" type="submit">Continue</button>
    </form>
  );
}
