import { Hono } from "hono";
import { userQueryValidator, newUserValidator, userValidator, updateUserValidator } from "../validators/userValidator.js";
import { requireAuth, adminAuth } from "../middleware/auth.js";
import * as db from "../database/user.js";
import { HTTPException } from "hono/http-exception";

const userApp = new Hono();


userApp.get("/", userQueryValidator, async (c) => {
    const query = c.req.valid("query");
    const sb = c.get("supabase");
  
    let defaultResponse: PaginatedListResponse<User> = {
      data: [],
      count: 0,
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  
    const response = await db.getUsers(sb, query);
    return c.json({
      ...defaultResponse,
      ...response
    });
  });
  
  userApp.post("/", async (c)=> {
    //Logik är flyttad till auth.ts för att hantera både auth och usertabell creation samtidigt
  })
  
  userApp.get("/:email", requireAuth, adminAuth, async (c) => {
    const { email } = c.req.param()
    const sb = c.get("supabase")
    const user = await db.getUser(sb, email)
    if(!user){
      throw new HTTPException(404, {message: "User not found"})
    }
    return c.json(user)
  
  })
  
  userApp.put("/:id", requireAuth, adminAuth, newUserValidator, async (c) => {
    const id = c.req.param("id");
    const sb = c.get("supabase");
    const body = await c.req.json();
  
    const user = await db.updateUser(sb, id, body);
  
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
  
    return c.json({message: "User updated successfully", user}, 200);
  });
  
  
  userApp.patch("/:id", requireAuth, updateUserValidator, async (c) => {
    const id = c.req.param("id");
    const sb = c.get("supabase");
    const body = await c.req.json();
  
    const { is_admin, created_at, ...updateData }: Partial<User> = body;
  
    if (body.email || body.password) {
      const { data, error } = await sb.auth.updateUser({
        email: body.email,
        password: body.password,
      });
  
      if (error) {
        console.error("Supabase Auth update error:", error);
        throw new HTTPException(400, { message: "Failed to update authentication info" });
      }
      if(!data){
        throw new HTTPException(404, { message: "Auth user not found" });
      }
    }
  
    const user = await db.updateUser(sb, id, updateData);
  
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
  
    return c.json({ message: "User updated successfully", user }, 200);
  });
  
  
  
  userApp.delete("/:id", requireAuth, adminAuth, async (c) => {
    const id = c.req.param("id");
    const sb = c.get("supabase")
    const deleted = await db.deleteUser(sb, id);
  
    if (!deleted) {
      throw new HTTPException(404, { message: "User not found" });
    }
  
    return c.json({ message: "User deleted successfully" }, 200);
  })

export default userApp;