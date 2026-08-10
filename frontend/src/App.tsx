import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppShell from "./components/AppShell";

import Dashboard from "./pages/Dashboard";
import Identities from "./pages/Identities";
import AccessControl from "./pages/AccessControl";
import AccessReview from "./pages/AccessReview";
import RiskIntelligence from "./pages/RiskIntelligence";
import Activity from "./pages/Activity";

import AICopilot from "./components/AICopilot";

function Roles() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Roles
      </h1>

      <p className="mt-1 text-sm text-slate-400">
        Enterprise role and permission management.
      </p>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Analytics
      </h1>

      <p className="mt-1 text-sm text-slate-400">
        Enterprise identity security analytics and insights.
      </p>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Settings
      </h1>

      <p className="mt-1 text-sm text-slate-400">
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

          {/* Identities */}
          <Route
            path="/identities"
            element={<Identities />}
          />

          {/* Access Control */}
          <Route
            path="/access-control"
            element={<AccessControl />}
          />

          {/* Access Reviews */}
          <Route
            path="/access-reviews"
            element={<AccessReview />}
          />

          {/* Risk Intelligence */}
          <Route
            path="/risk-intelligence"
            element={<RiskIntelligence />}
          />

          {/* Activity */}
          <Route
            path="/activity"
            element={<Activity />}
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