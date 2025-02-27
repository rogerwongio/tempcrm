import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import DashboardPage from "./components/dashboard/DashboardPage";
import LeadPage from "./components/leads/LeadPage";
import LeadEditPage from "./components/leads/LeadEditPage";
import LeadCreatePage from "./components/leads/LeadCreatePage";
import ProposalStagePage from "./components/leads/ProposalStagePage";

import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadPage />} />
          <Route path="/proposals" element={<ProposalStagePage />} />
          <Route path="/leads/new" element={<LeadCreatePage />} />
          <Route path="/leads/:id" element={<LeadPage />} />
          <Route path="/leads/:id/edit" element={<LeadEditPage />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
