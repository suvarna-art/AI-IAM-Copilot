import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0b1224]/95 px-6 backdrop-blur">
      
      {/* Page identity */}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="truncate text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-3">

        {/* System status */}
        <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          System Healthy
        </div>

        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
        >
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
        >
          <Bell size={20} />
        </button>

        {/* Profile */}
        <button
          type="button"
          aria-label="Profile"
          className="rounded-xl p-2 text-cyan-400 transition hover:bg-slate-800/70"
        >
          <UserCircle size={28} />
        </button>

      </div>
    </header>
  );
}