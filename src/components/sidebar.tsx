import Link from "next/link";

const items = [
  ["Brain", "/app/brain"],
  ["Chat", "/app/chat"],
  ["Content", "/app/content"],
  ["Calendar", "/app/calendar"],
  ["Library", "/app/library"],
  ["Settings", "/app/settings"]
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border p-4 space-y-4">
      <div>
        <p className="text-xs text-zinc-400">Workspace</p>
        <select className="input mt-2"><option>Default Workspace</option></select>
      </div>
      <nav className="space-y-2">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="block btn">{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
