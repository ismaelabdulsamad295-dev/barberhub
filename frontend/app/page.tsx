'use client';

import { useState } from 'react';

const API = 'http://localhost:3000';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Logging in...');
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(res.ok ? 'Login successful' : `Error: ${data.message}`);
  }

  return (
    <main className="mx-auto mt-20 max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">BarberHub Login</h1>
      <form onSubmit={login} className="flex flex-col gap-3">
        <input
          className="rounded border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="rounded bg-black p-2 text-white" type="submit">
          Log in
        </button>
      </form>
      <p className="mt-4">{message}</p>
    </main>
  );
}
