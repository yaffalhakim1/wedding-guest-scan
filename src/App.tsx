import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import GuestsPage from "@/pages/GuestsPage";
import InvitationPage from "@/pages/InvitationPage";
import ScannerPage from "@/pages/ScannerPage";
import ConfigPage from "@/pages/ConfigPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Route>
        <Route path="/invitation/:guestId" element={<InvitationPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
