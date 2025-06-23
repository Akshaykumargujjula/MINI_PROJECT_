import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full mb-2 p-2 border rounded" required disabled={loading} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" required disabled={loading} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="w-full mb-2 p-2 border rounded" required disabled={loading} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
      <div className="mt-4 text-center">
        <a href="/login" className="text-blue-600">Already have an account? Login</a>
      </div>
    </div>
  );
}

export default Signup;
