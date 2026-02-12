"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [msg, setMsg] = useState("");
  return <main className="p-8"><form action={async (fd)=>{const r=await fetch('/api/auth/forgot-password',{method:'POST',body:fd}); setMsg(r.ok?'If found, reset link sent.':'Failed');}} className="card max-w-md mx-auto space-y-3"><h1 className="text-2xl">Forgot password</h1><input name="email" type="email" className="input" placeholder="Email" required /><button className="btn btn-primary">Send reset link</button>{msg && <p className="text-sm text-zinc-400">{msg}</p>}</form></main>;
}
