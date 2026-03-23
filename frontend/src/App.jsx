import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import AlertsPage from './pages/AlertsPage';
import PanicPage from './pages/PanicPage';
import AdminPage from './pages/AdminPage';
import AnomalyPage from './pages/AnomalyPage';
import BlockchainPage from './pages/BlockchainPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import useStore from './store/useStore';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/panic" element={<PanicPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/anomaly" element={<AnomalyPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
