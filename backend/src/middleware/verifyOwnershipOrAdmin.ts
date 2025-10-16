import { HTTPException } from "hono/http-exception";
import { getLocalUser } from "../utils/getLocalUser.js";
import type { Context, Next } from "hono";


export async function verifyOwnershipOrAdmin(c: Context, next: Next) {
  const sb = c.get("supabase");
  const id = c.req.param("id");

  const localUser = await getLocalUser(c, sb);
  const { data: property, error } = await sb
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  if (property.owner_id !== localUser.id && !localUser.is_admin) {
    throw new HTTPException(403, { message: "You are not allowed to modify this property" });
  }

  c.set("property", property);

  return await next();
}
