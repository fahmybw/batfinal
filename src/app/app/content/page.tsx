"use client";
import { useState } from "react";

export default function ContentPage(){
  const [payload,setPayload]=useState<string>('');
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Create Content</h1>
  <form action={async(fd)=>{const r=await fetch('/api/ai/content',{method:'POST',body:fd});const d=await r.json();setPayload(JSON.stringify(d.version?.payload,null,2));}} className="card grid md:grid-cols-3 gap-3">
    <select className="input" name="channel"><option>TIKTOK</option><option>INSTAGRAM</option><option>YOUTUBE</option><option>LINKEDIN</option><option>X</option></select>
    <input className="input" name="purpose" placeholder="Purpose" defaultValue="awareness"/>
    <input className="input" name="postType" placeholder="Post type" defaultValue="short video"/>
    <input className="input" name="tone" placeholder="Tone" defaultValue="calm expert"/>
    <input className="input" name="constraints" placeholder="Constraints"/>
    <button className="btn btn-primary">Generate</button>
  </form>
  <pre className="card whitespace-pre-wrap text-xs">{payload || 'No content generated yet.'}</pre>
  </div>
}
