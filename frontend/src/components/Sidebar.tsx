import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  KeyRound,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Identities" },
  { icon: ShieldCheck, label: "Access Control" },
  { icon: KeyRound, label: "Roles" },
  { icon: Bot, label: "AI Copilot" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-400">
          IdentityForge AI
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Enterprise Identity Intelligence
        </p>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 hover:bg-slate-800 transition"
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 text-xs text-slate-500">
        Version 1.0
      </div>
    </aside>
  );
}