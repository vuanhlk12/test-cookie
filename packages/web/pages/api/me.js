import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  const token =
    req.cookies?.auth_token ||
    req.headers.cookie
      ?.split(";")
      ?.find((c) => c.trim().startsWith("auth_token="))
      ?.split("=")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    return res
      .status(200)
      .json({ userId: payload.sub, iat: payload.iat, exp: payload.exp });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
