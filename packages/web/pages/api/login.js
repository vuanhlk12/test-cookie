import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  const { userId = "demo-user" } = req.body || {};

  const token = jwt.sign({ sub: userId }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });

  const setCookie = cookie.serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // seconds
  });

  res.setHeader("Set-Cookie", setCookie);
  return res.status(200).json({ message: "Logged in", userId });
}
