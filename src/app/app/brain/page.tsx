"use client";

import { useEffect, useState } from "react";

type Source = { id: string; name: string; type: string };

export default function BrainPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [runs, setRuns] = useState<{id:string;status:string;log:string}[]>([]);
  async function load(){
    const s = await fetch('/api/brain/sources').then(r=>r.json());
    const w = await fetch('/api/brain/workflows').then(r=>r.json());
    setSources(s.sources||[]); setRuns(w.runs||[]);
  }
  useEffect(()=>{load();},[]);
  return <div className="space-y-6"><h1 className="text-3xl font-semibold">BAT Brain</h1>
    <form action={async(fd)=>{await fetch('/api/brain/sources',{method:'POST',body:fd}); load();}} className="card grid md:grid-cols-4 gap-3"><input className="input" name="name" placeholder="Source name" required/><select className="input" name="type"><option>URL</option><option>NOTE</option><option>FILE</option></select><input className="input" name="content" placeholder="URL or note content" required/><button className="btn btn-primary">Add Source</button></form>
    <div className="card"><h2 className="font-medium mb-3">Data Sources</h2>{sources.map(s=><div key={s.id} className="py-2 border-b border-border text-sm">{s.name} · {s.type}</div>)}</div>
    <form action={async(fd)=>{await fetch('/api/brain/workflows',{method:'POST',body:fd}); load();}} className="card grid md:grid-cols-5 gap-3"><input className="input" name="name" placeholder="Workflow" required/><select className="input" name="scheduleType"><option>MANUAL</option><option>DAILY</option><option>WEEKLY</option></select><input className="input" name="sourceIds" placeholder="sourceId,sourceId"/><button className="btn" formAction="/api/brain/workflows-run">Run now</button><button className="btn btn-primary">Create Workflow</button></form>
    <div className="card"><h2 className="font-medium mb-3">Workflow runs</h2>{runs.map(r=><div key={r.id} className="py-2 text-sm border-b border-border">{r.status}: {r.log}</div>)}</div>
  </div>;
}
