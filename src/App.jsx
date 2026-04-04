import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page imports (we'll create these next)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ads from './pages/Ads';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

// A wrapper to protect routes that require login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/ads" element={
          <PrivateRoute><Ads /></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute><Analytics /></PrivateRoute>
        } />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;