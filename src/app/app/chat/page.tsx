"use client";
import { useEffect, useState } from "react";

export default function ChatPage(){
  const [threadId,setThreadId]=useState(''); const [messages,setMessages]=useState<{role:string;content:string}[]>([]);
  useEffect(()=>{(async()=>{const t=await fetch('/api/ai/chat').then(r=>r.json()); setThreadId(t.threadId); setMessages(t.messages||[]);})();},[]);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Talk to BAT</h1><div className="card space-y-3">{messages.map((m,i)=><p key={i}><b>{m.role}:</b> {m.content}</p>)}<form action={async(fd)=>{fd.append('threadId',threadId);const r=await fetch('/api/ai/chat',{method:'POST',body:fd});const d=await r.json();setMessages(d.messages);}} className="flex gap-2"><input className="input" name="message" placeholder="Ask BAT..."/><button className="btn btn-primary">Send</button></form></div></div>
}
