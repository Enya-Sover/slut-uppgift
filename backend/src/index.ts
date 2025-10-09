import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'
import { authApp } from "./routes/auth.js";
import userApp from "./routes/user.js";


import dotenv from 'dotenv';
dotenv.config();

// import courseApp  from './routes/course.js'
// import studentApp from "./routes/student.js";
import { optionalAuth } from "./middleware/auth.js";



const app = new Hono({
  strict: false
});

const serverStartTime = Date.now()
app.use("*", optionalAuth)
app.route("/auth", authApp)

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route('/users', userApp)


app.get("/health/", (c) => {
  const now = Date.now()
  const uptimeSeconds = Math.floor((now - serverStartTime) / 1000)

  return c.json({
    status: "ok",
    message: "Service is healthy",
    uptime: uptimeSeconds,
    startedAt: new Date(serverStartTime).toISOString(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
