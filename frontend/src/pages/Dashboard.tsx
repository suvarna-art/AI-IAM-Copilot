import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 text-white">
          <h1 className="text-4xl font-bold">
            Welcome back 👋
          </h1>

          <p className="text-slate-400 mt-3">
            Monitor identities, analyze access risks and
            secure your enterprise using AI.
          </p>
        </main>
      </div>
    </div>
  );
}