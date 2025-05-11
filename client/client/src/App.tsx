// Main app component with routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Dashboard } from './features/dashboard/Dashboard';

// App component
export function App() {
  return (
    // Set up routing
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Root redirects to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}