import { Bell, Search, UserCircle2 } from "lucide-react";
import LiveClock from "./LiveClock";
import StatusBadge from "./StatusBadge";

export default function Header() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900/70 backdrop-blur-xl px-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-slate-400 text-sm">
          Enterprise Identity Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-5">

    <StatusBadge />

    <LiveClock />

    <Search
      className="text-slate-400 hover:text-white cursor-pointer transition"
    />

    <Bell
      className="text-slate-400 hover:text-white cursor-pointer transition"
    />

    <UserCircle2
      size={34}
      className="text-cyan-400"
    />

</div>
    </header>
  );
}