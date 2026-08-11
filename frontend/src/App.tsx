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
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Roles from "./pages/Roles";
import PrivilegedAccess from "./pages/PrivilegedAccess";
import AICopilot from "./components/AICopilot";

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
          
          {/*Privileged Access8*/}
          <Route
            path="/privileged-access"
            element={<PrivilegedAccess />}
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