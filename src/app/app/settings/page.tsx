"use client";

export default function SettingsPage(){
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Settings</h1>
    <div className="card space-y-2"><h2 className="font-medium">Profile</h2><input className="input" defaultValue="Demo User"/><input className="input" defaultValue="demo@bat.ai" readOnly/></div>
    <div className="card space-y-2"><h2 className="font-medium">Workspace</h2><input className="input" defaultValue="Demo Workspace"/><input className="input" defaultValue="Africa/Cairo"/></div>
    <div className="card space-y-2"><h2 className="font-medium">Security</h2><input className="input" type="password" placeholder="New password"/><button className="btn">Enable / Disable 2FA</button></div>
  </div>
}
