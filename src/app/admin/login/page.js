'use client';

import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [keyRequired, setKeyRequired] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/login')
      .then((res) => res.json())
      .then((data) => setKeyRequired(Boolean(data.keyRequired)))
      .catch(() => setKeyRequired(false));
  }, []);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = '/admin';
        return;
      }
      setMessage(data.message || 'Login nahi hua');
    } catch {
      setMessage('Network error, dobara try karo');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto border border-border rounded-xl p-6 bg-background">
      <h1 className="text-xl font-bold mb-1">Admin login</h1>
      <p className="text-sm text-muted-foreground mb-5">Apna authorised email daalo.</p>

      <form onSubmit={login} className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
        />
        {keyRequired && (
          <input
            type="password"
            required
            autoComplete="current-password"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Access key"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm font-semibold"
        >
          {loading ? 'Check ho raha hai...' : 'Login karo'}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
}