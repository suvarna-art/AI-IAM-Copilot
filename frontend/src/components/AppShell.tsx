import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell() {
  return (
    <div className="flex min-h-screen min-w-0 bg-slate-950 text-white">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* =================================================
            ROUTED PAGE CONTENT

            Dashboard / Identities / future pages
            will render here.
        ================================================= */}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}