import Link from "next/link";

export default function Landing() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 space-y-16">
      <section className="space-y-4 text-center">
        <h1 className="text-5xl font-semibold">BAT — Your AI Social Media Agency</h1>
        <p className="text-zinc-400">Intake, memory, content, calendar, and scheduling in one focused workspace.</p>
        <div className="flex gap-3 justify-center">
          <Link className="btn btn-primary" href="/auth/sign-up">Start free</Link>
          <Link className="btn" href="/auth/sign-in">Sign in</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        {['BAT Brain','Talk to BAT','Create + Schedule'].map((t)=><div key={t} className="card"><h3 className="font-medium">{t}</h3><p className="text-sm text-zinc-400 mt-2">Built for lean agency teams.</p></div>)}
      </section>
      <section className="card"><h2 className="text-2xl">How it works</h2><ol className="list-decimal ml-5 mt-3 text-zinc-300"><li>Ingest brand context.</li><li>Generate drafts with memory.</li><li>Approve and auto-schedule.</li></ol></section>
      <section className="grid md:grid-cols-2 gap-4"><div className="card">Social proof placeholder</div><div className="card">Pricing placeholder</div></section>
      <section className="card"><h3 className="font-medium">FAQ</h3><p className="text-zinc-400 mt-2">Supports mock AI fallback and adapter-based posting.</p></section>
    </main>
  );
}
