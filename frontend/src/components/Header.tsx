import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-slate-400 text-sm">
          Enterprise Identity Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Search className="text-slate-400 cursor-pointer hover:text-white transition" />

        <Bell className="text-slate-400 cursor-pointer hover:text-white transition" />

        <UserCircle2
          className="text-blue-400"
          size={34}
        />
      </div>
    </header>
  );
}