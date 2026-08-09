import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppShell from "./components/AppShell";

import Dashboard from "./pages/Dashboard";
import Identities from "./pages/Identities";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            APPLICATION SHELL
        ================================================= */}

        <Route element={<AppShell />}>

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

          {/* Unknown routes */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;