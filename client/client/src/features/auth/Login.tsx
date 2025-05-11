// Login and registration component
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Login component
export function Login() {
  // State for form inputs
  const [form, setForm] = useState({ email: '', password: '' });
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State to toggle login/register mode
  const [isRegister, setIsRegister] = useState(false);
  // Navigation hook
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Choose endpoint based on mode
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      // Send request to server
      const response = await axios.post(endpoint, form);
      if (!isRegister) {
        // Store token and set Authorization header
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = Bearer ${response.data.token};
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Switch to login after registration
        setIsRegister(false);
        setError('Registered! Please log in.');
      }
    } catch (err: any) {
      // Display error
      setError(err.response?.data?.error || (isRegister ? 'Registration failed' : 'Login failed'));
    }
  };

  return (
    // Form container
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold">{isRegister ? 'Register' : 'Login'}</h2>
      <div className="space-y-2">
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          aria-label="Email"
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          aria-label="Password"
        />
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        {/* Toggle login/register */}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-blue-500 underline"
        >
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
        {/* Error message */}
        {error && <p className="text-red-600" role="alert">{error}</p>}
      </div>
    </div>
  );
}