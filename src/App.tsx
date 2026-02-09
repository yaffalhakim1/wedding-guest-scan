import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "./contexts/AuthContext";
import { SWRConfig } from "swr";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import GuestsPage from "./pages/GuestsPage";
import ScannerPage from "./pages/ScannerPage";
import ConfigPage from "./pages/ConfigPage";
import InvitationPage from "./pages/InvitationPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Provider>
      <AuthProvider>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            shouldRetryOnError: false,
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invitation/:guestId" element={<InvitationPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Full-Screen Scanner (No Layout) */}
              <Route path="/scan-fullscreen" element={<ScannerPage />} />
              
              {/* Dashboard Routes (With Layout) */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/guests" element={<GuestsPage />} />
                <Route path="/scan" element={<ScannerPage />} />
                <Route path="/config" element={<ConfigPage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </SWRConfig>
      </AuthProvider>
    </Provider>
  );
}

export default App;
