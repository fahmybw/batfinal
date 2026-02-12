import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignIn() {
  return <main className="p-8 space-y-4"><AuthForm mode="sign-in" /><p className="text-center text-sm text-zinc-400"><Link href="/auth/forgot-password">Forgot password?</Link></p></main>;
}
