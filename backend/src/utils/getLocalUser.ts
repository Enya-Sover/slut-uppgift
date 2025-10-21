import { HTTPException } from "hono/http-exception";



export async function getLocalUser(c: any, sb: any): Promise<LocalUser> {
  const authUser = c.get("user");

  if (!authUser) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { data: localUser, error } = await sb
    .from("users")
    .select("id, name, email, is_admin")
    .eq("id", authUser.id)
    .single();

  if (error || !localUser) {
    throw new HTTPException(404, { message: "User not found" });
  }
  return localUser;
}