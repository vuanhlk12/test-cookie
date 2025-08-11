import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.WEB_ORIGIN || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// In BFF mode, Next.js handles auth cookies/signature via pages/api.
// This Express server can be kept for other microservices or disabled.

app.get("/health", (_req, res) => {
  res.json({ ok: true, note: "Auth handled by Next.js BFF" });
});

// Demo login: accepts a userId in body, returns a signed token cookie
app.post("/api/login", (req, res) => {
  const { userId = "demo-user" } = req.body || {};
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = signPayload({ sub: userId, iat: issuedAt });

  // Set cookie with proper security flags
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.json({ message: "Logged in", userId });
});

// Demo verify endpoint to read cookie and verify signature
app.get("/api/me", (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    res.json({ userId: payload.sub, iat: payload.iat, exp: payload.exp });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Demo logout: clear the cookie
app.post("/api/logout", (_req, res) => {
  res.clearCookie("auth_token", { path: "/" });
  res.json({ message: "Logged out" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
