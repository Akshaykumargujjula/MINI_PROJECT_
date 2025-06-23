import { useEffect, useState } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch {
        setError('Network error');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {user ? (
        <div>
          <p className="mb-2">
            Welcome,{' '}
            <span className="font-semibold">{user.username}</span>!
          </p>
          <p>Email: {user.email}</p>
          {/* TODO: Add bookmarks, quick access, and more */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
