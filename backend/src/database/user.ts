import type {
  PostgrestSingleResponse,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase.js";
import { HTTPException } from "hono/http-exception";

export async function getUsers(
  sb: SupabaseClient,
  query: UserListQuery
): Promise<PaginatedListResponse<User>> {
  const sortable = new Set(["name"]);
  const order =
    query.sort_by && sortable.has(query.sort_by) ? query.sort_by : "name";

  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 10) - 1;

  const { data, error, count } = await sb
    .from("users")
    .select("*", { count: "exact" })
    .order(order, { ascending: true })
    .range(startIndex, endIndex);

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new HTTPException(500, { message: "Failed to fetch users" });
  }

  return {
    data: data || [],
    count: count || 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };
}

export async function createUser(
  sb: SupabaseClient,
  user: NewUser
): Promise<User> {
  const { data, error } = await sb.from("users").insert(user).select().single();

  if (error) {
    console.error("Supabase insert error:", error);
    if (error.code === "23505") {
      const match = error.details?.match(/\((.*?)\)=/);
      const field = match ? match[1] : "field";
      throw new HTTPException(409, {
        message: `User with this ${field} already exists`,
      });
    }
    throw new HTTPException(500, { message: "Failed to create User" });
  }
  return data;
}

export async function getUser(
  sb: SupabaseClient,
  email: string
): Promise<User | null> {
  const { data, error } = await sb
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    console.error("Supabase fetch error:", error);
    throw new HTTPException(500, { message: "Failed to fetch user" });
  }
  return data || null;
}

export async function updateUser(
  sb: SupabaseClient,
  _id: string,
  user: User
): Promise<User | null> {
  const {id, ...updateBody}  = user;
  const { data, error } = await sb
    .from("users")
    .update(updateBody)
    .eq("id", _id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    if (error.code === "23505") {
      const match = error.details?.match(/\((.*?)\)=/);
      const field = match ? match[1] : "field";
      throw new HTTPException(409, {
        message: `User with this ${field} already exists`,
      });
    }
    if (!data) {
      throw new HTTPException(404, { message: "User not found" });
    }
    throw new HTTPException(500, { message: "Failed to update user" });
  }
  return data;
}


export async function deleteUser(sb: SupabaseClient, id: string): Promise<User | null> {
  const query = sb
    .from("users")
    .delete()
    .eq("id", id)
    .select()
    .single();
  const response: PostgrestSingleResponse<User> = await query;
  if (!response.data) {
    throw new HTTPException(404, { message: "User not found" });
  }
  return response.data;
}