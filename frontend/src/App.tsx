import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppShell from "./components/AppShell";

import Dashboard from "./pages/Dashboard";
import Identities from "./pages/Identities";
import AccessControl from "./pages/AccessControl";

<Route
  path="/access-control"
  element={<AccessControl />}
/>

function Roles() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white">
        Roles
      </h1>

      <p className="text-sm text-slate-400">
        Enterprise role and permission management.
      </p>
    </div>
  );
}

function AICopilot() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white">
        AI Copilot
      </h1>

      <p className="text-sm text-slate-400">
        Intelligent IAM analysis and governance assistance.
      </p>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white">
        Analytics
      </h1>

      <p className="text-sm text-slate-400">
        Enterprise identity security analytics and insights.
      </p>
    </div>
  );
}

function Settings() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white">
        Settings
      </h1>

      <p className="text-sm text-slate-400">
        Application and security configuration.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <AppShell>

        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Identity Management */}
          <Route
            path="/identities"
            element={<Identities />}
          />

          {/* Access Control */}
          <Route
            path="/access-control"
            element={<AccessControl />}
          />

          {/* Roles */}
          <Route
            path="/roles"
            element={<Roles />}
          />

          {/* AI Copilot */}
          <Route
            path="/copilot"
            element={<AICopilot />}
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </AppShell>

    </BrowserRouter>
  );
}