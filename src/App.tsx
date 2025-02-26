import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LeadPage from "./components/leads/LeadPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gray-50">
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leads" element={<Home />} />
            <Route path="/leads/:id" element={<LeadPage />} />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Suspense>
  );
}

export default App;
