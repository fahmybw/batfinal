"use client";
import { useState } from "react";

export default function CalendarPage(){
  const [items,setItems]=useState<any[]>([]);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Content Calendar</h1>
    <form action={async(fd)=>{const r=await fetch('/api/ai/calendar',{method:'POST',body:fd});const d=await r.json();setItems(d.items||[]);}} className="card grid md:grid-cols-2 gap-3">
      <input className="input" name="goal" placeholder="Goal" defaultValue="lead generation"/>
      <input className="input" name="channels" placeholder="TIKTOK,LINKEDIN"/>
      <input className="input" name="dateRange" placeholder="2026-01-01..2026-01-07"/>
      <input className="input" name="frequency" placeholder="daily"/>
      <textarea className="input md:col-span-2" name="context" placeholder="Brand voice and audience"/>
      <button className="btn btn-primary md:col-span-2">Generate calendar</button>
    </form>
    <div className="card space-y-2">{items.map(i=><div key={i.id} className="border-b border-border py-2 text-sm">{i.date} · {i.channel} · {i.brief}</div>)}</div>
  </div>;
}
