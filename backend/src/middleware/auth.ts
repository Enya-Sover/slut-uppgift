import type { Context, Next } from "hono"
import { setCookie } from "hono/cookie"
import { createServerClient, parseCookieHeader } from "@supabase/ssr"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js"
import { HTTPException } from "hono/http-exception"

//Skapar en global interface
declare module "hono" {
    interface ContextVariableMap {
      supabase: SupabaseClient
      user: User | null
    }
  }


function createSupabaseForRequest(c: Context) {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(c.req.header("Cookie") ?? "").map(
            ({ name, value }) => ({ name, value: value ?? "" })
          )
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(c, name, value, {
              ...options,
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              path: "/",
            })
          })
        },
      },
    })
  }

  //Lägger till supabase i clienten
  export async function withSupabase(c: Context, next: Next) {
    if (!c.get("supabase")) {
      const sb = createSupabaseForRequest(c)
      c.set("supabase", sb)
  
      const { data: { user }, error } = await sb.auth.getUser()
      c.set("user", error ? null : user)
    }
    return next()
  }

  //Publika saker på hemsidan (man behöver inte vara authenticated för att se detta)
  export async function optionalAuth(c: Context, next: Next) {
    return withSupabase(c, next)
  }
  //Här måste man bara authenticated
  export async function requireAuth(c: Context, next: Next) {
    await withSupabase(c, async () => {})
    const user = c.get("user")
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }
    return next() 
  }


  export async function adminAuth(c: Context, next: Next) {
    const supabase = c.get("supabase")
    const authUser = c.get("user")
  
    if (!authUser) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }
  
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single()

    if (error || !user) {
      console.error(error)
      throw new HTTPException(404, { message: "User not found in local table" })
    }
  
    if (!user.is_admin) {
      throw new HTTPException(403, { message: "Access denied: admin only" })
    }
  
    return next()
  }
  
  