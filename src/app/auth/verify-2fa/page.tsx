"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Verify() {
  const router = useRouter();
  const [err, setErr] = useState("");
  return <main className="p-8"><form action={async(fd)=>{const r=await fetch('/api/auth/verify-2fa',{method:'POST',body:fd}); if(r.ok) router.push('/app/brain'); else setErr('Invalid code');}} className="card max-w-sm mx-auto space-y-3"><h1 className="text-2xl">Verify 2FA</h1><input className="input" name="code" placeholder="6-digit code" required maxLength={6} />{err && <p className="text-red-400 text-sm">{err}</p>}<button className="btn btn-primary">Verify</button></form></main>;
}
