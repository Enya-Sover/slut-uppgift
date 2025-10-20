import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { newUserValidator } from "../validators/userValidator.js";
import * as db from "../database/user.js";
import { getLocalUser } from "../utils/getLocalUser.js";

export const authApp = new Hono();

authApp.post("/register", newUserValidator, async (c) => {
  const { name, email, password } = await c.req.json();
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new HTTPException(400, { message: error.message });
  }

  const newUser: NewUser = {
    id: data.user!.id, 
    name,
    email
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

authApp.get("/me", async (c) => {
  const sb = c.get("supabase");
  const localUser = await getLocalUser(c, sb);
  return c.json(localUser, 200);
});