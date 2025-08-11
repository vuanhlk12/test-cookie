import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: "demo-user" }),
      });
      if (!res.ok) throw new Error("Login failed");
      await res.json();
      await me();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function me() {
    setError("");
    try {
      const res = await fetch(`/api/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unauthenticated");
      const data = await res.json();
      setUser(data);
    } catch (e) {
      setUser(null);
      setError(e.message);
    }
  }

  async function logout() {
    setError("");
    try {
      const res = await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      await res.json();
      setUser(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Demo Cookie Auth (Next.js BFF)</h1>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={login} disabled={loading}>
          Login
        </button>
        <button onClick={me} disabled={loading}>
          Me
        </button>
        <button onClick={logout} disabled={loading}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <pre style={{ marginTop: 16, background: "#f5f5f5", padding: 12 }}>
        {JSON.stringify(user, null, 2)}
      </pre>

      <p style={{ marginTop: 16 }}>
        Flow: Next.js API routes act as BFF. Login sets httpOnly cookie with
        JWT, Me verifies, Logout clears cookie.
      </p>
    </div>
  );
}
