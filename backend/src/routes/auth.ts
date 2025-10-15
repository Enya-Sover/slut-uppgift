import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { newUserValidator } from "../validators/userValidator.js";
import * as db from "../database/user.js";

export const authApp = new Hono();

authApp.post("/register", newUserValidator, async (c) => {
  const { name, email, password } = await c.req.json();
  const supabase = c.get("supabase");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    console.log("error", error);
    throw new HTTPException(400, { message: error?.message || "Registration failed" });

  }
  const newUser: NewUser = {
    name,
    email,
    password
  };
  const user = await db.createUser(supabase, newUser);

  return c.json({ authUser: data.user, user }, 201);
});

authApp.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const supabase = c.get("supabase");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    throw new HTTPException(400, { message: "Invalid credentials" });
  }

  return c.json(data.user, 200);
});

//! Test från chatGPT - fungerar inte med cookies. ska lägga upp frontend först
// import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
// authApp.post("/login", async (c) => {
//   const { email, password } = await c.req.json();
//   const supabase = c.get("supabase");
//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error || !data.user || !data.session) {
//     throw new HTTPException(400, { message: "Invalid credentials" });
//   }

//   // Cookies för cross-origin (3000 ↔ 3001)
//   const cookieBase = {
//     httpOnly: true,
//     sameSite: 'None' as const,
//     secure: false,     // SÄTT false lokalt (http). I prod: true.
//     path: '/'
//   };

//   setCookie(c, 'sb-access-token', data.session.access_token, {
//     ...cookieBase,
//     maxAge: 10000000 // sekunder
//   });

//   setCookie(c, 'sb-refresh-token', data.session.refresh_token, {
//     ...cookieBase,
//     maxAge: 60 * 60 * 24 * 30, // t.ex. 30 dagar
//   });

//   // skicka tillbaka lite info om användaren om du vill
//   return c.json({ user: data.user }, 200);
// });

authApp.post("/logout", async (c) => {
  const supabase = c.get("supabase");
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Logout unsuccessful" }, 400),
    });
  }
  

  return c.json({ message: "Logout successfully" }, 200);
});
