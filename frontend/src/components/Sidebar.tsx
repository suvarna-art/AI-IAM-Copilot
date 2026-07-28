import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  KeyRound,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Identities" },
  { icon: ShieldCheck, label: "Access Control" },
  { icon: KeyRound, label: "Roles" },
  { icon: Bot, label: "AI Copilot" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          IdentityForge AI
        </h1>

        <p className="text-slate-500 text-sm mt-2">
          Enterprise Identity Intelligence
        </p>
      </div>

      <nav className="flex-1 p-4">

        {menu.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-4 rounded-xl px-5 py-3 mb-2 transition-all duration-300
            ${
              active
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}

      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Security Score
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            94%
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Excellent security posture
          </p>
        </div>
      </div>

    </aside>
  );
}