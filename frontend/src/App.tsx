import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./auth/AuthContext";

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
import PermissionDrift from "./pages/PermissionDrift";
import Login from "./pages/Login";


function ProtectedApplication() {
  const {
    isAuthenticated,
    restoringSession,
  } = useAuth();


  if (restoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b16] text-slate-400">
        Restoring secure session...
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return (
    <AppShell>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/identities"
          element={<Identities />}
        />

        <Route
          path="/access-control"
          element={<AccessControl />}
        />

        <Route
          path="/privileged-access"
          element={<PrivilegedAccess />}
        />

        <Route
          path="/access-reviews"
          element={<AccessReview />}
        />

        <Route
          path="/risk-intelligence"
          element={<RiskIntelligence />}
        />

        <Route
          path="/permission-drift"
          element={<PermissionDrift />}
        />

        <Route
          path="/activity"
          element={<Activity />}
        />

        <Route
          path="/roles"
          element={<Roles />}
        />

        <Route
          path="/copilot"
          element={<AICopilot />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </AppShell>
  );
}


function ApplicationRoutes() {
  const {
    isAuthenticated,
    restoringSession,
  } = useAuth();


  if (restoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b16] text-slate-400">
        Restoring secure session...
      </div>
    );
  }


  return (
    <Routes>

      <Route
        path="/login"
        element={
          isAuthenticated
            ? (
              <Navigate
                to="/"
                replace
              />
            )
            : (
              <Login />
            )
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedApplication />
        }
      />

    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <ApplicationRoutes />

      </AuthProvider>

    </BrowserRouter>
  );
}