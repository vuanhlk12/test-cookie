import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function getServerSideProps({ res, query }) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  const userId = query.userId || "demo-user";

  const token = jwt.sign({ sub: userId }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // seconds
    })
  );

  return {
    props: {
      userId,
    },
  };
}

export default function SSRSetCookiePage({ userId }) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>SSR Set-Cookie</h1>
      <p>
        Cookie auth_token has been set on initial page load for user:{" "}
        <b>{userId}</b>
      </p>
      <p>
        Go back to <a href="/">Home</a> and click "Me" to verify.
      </p>
    </div>
  );
}
