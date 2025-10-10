import type { SupabaseClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";

// GET all bookings med pagination / optional filter
export async function getBookings(
  sb: SupabaseClient,
  query: BookingListQuery
): Promise<PaginatedListResponse<Booking>> {
  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 10) - 1;

  let dbQuery = sb.from("bookings").select("*", { count: "exact" }).range(startIndex, endIndex);

  if (query.property_id) dbQuery = dbQuery.eq("property_id", query.property_id);
  if (query.user_id) dbQuery = dbQuery.eq("user_id", query.user_id);

  const { data, error, count } = await dbQuery;

  if (error) {
    console.error("Supabase fetch error (bookings):", error);
    throw new HTTPException(500, { message: "Failed to fetch bookings" });
  }

  return {
    data: data || [],
    count: count || 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };
}

export async function getBooking(
  sb: SupabaseClient,
  id: string
): Promise<Booking | null> {
  const { data, error } = await sb.from("bookings").select("*").eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Supabase fetch error (booking):", error);
    throw new HTTPException(500, { message: "Failed to fetch booking" });
  }

  return data || null;
}

export async function createBooking(
  sb: SupabaseClient,
  booking: NewBooking
): Promise<Booking> {
  const { data, error } = await sb.from("bookings").insert(booking).select().single();

  if (error) {
    console.error("Supabase insert error (booking):", error);
    throw new HTTPException(500, { message: "Failed to create booking" });
  }

  return data;
}

export async function updateBooking(
  sb: SupabaseClient,
  id: string,
  booking: NewBooking
): Promise<Booking | null> {
  const { data, error } = await sb.from("bookings").update(booking).eq("id", id).select().single();

  if (error) {
    console.error("Supabase update error (booking):", error);
    if (!data) throw new HTTPException(404, { message: "Booking not found" });
    throw new HTTPException(500, { message: "Failed to update booking" });
  }

  return data;
}

// DELETE booking
export async function deleteBooking(
  sb: SupabaseClient,
  id: string
): Promise<Booking | null> {
  const { data, error }: PostgrestSingleResponse<Booking> = await sb
    .from("bookings")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase delete error (booking):", error);
    if (!data) throw new HTTPException(404, { message: "Booking not found" });
    throw new HTTPException(500, { message: "Failed to delete booking" });
  }

  return data;
}
