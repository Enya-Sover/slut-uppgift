
import type {
    PostgrestSingleResponse,
    SupabaseClient,
  } from "@supabase/supabase-js";
  
  import { HTTPException } from "hono/http-exception";


export async function getProperties(
    sb: SupabaseClient,
    query: PropertyListQuery
  ): Promise<PaginatedListResponse<Property>> {
    const sortable = new Set(["name"]);
    const order =
      query.sort_by && sortable.has(query.sort_by) ? query.sort_by : "name";
  
    const startIndex = query.offset || 0;
    const endIndex = startIndex + (query.limit || 10) - 1;
  
    const { data, error, count } = await sb
      .from("properties")
      .select("*", { count: "exact" })
      .order(order, { ascending: true })
      .eq("availability", true)
      .range(startIndex, endIndex);
  
    if (error) {
      console.error("Supabase fetch error:", error);
      throw new HTTPException(500, { message: "Failed to fetch properties" });
    }
  
    return {
      data: data || [],
      count: count || 0,
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  }
  
  export async function createProperty(
    sb: SupabaseClient,
    property: NewProperty
  ): Promise<Property> {
    const { data, error } = await sb.from("properties").insert(property).select().single();
  
    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        const match = error.details?.match(/\((.*?)\)=/);
        const field = match ? match[1] : "field";
        throw new HTTPException(409, {
          message: `Property with this ${field} already exists`,
        });
      }
      throw new HTTPException(500, { message: "Failed to create Property" });
    }
    return data;
  }
  
  export async function getProperty(
    sb: SupabaseClient,
    id: string
  ): Promise<Property | null> {
    const { data, error } = await sb
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      console.error("Supabase fetch error:", error);
      throw new HTTPException(500, { message: "Failed to fetch property" });
    }
    return data || null;
  }
  
  export async function updateProperty(
    sb: SupabaseClient,
    id: string,
    property: Partial<NewProperty>
  ): Promise<Partial<NewProperty> | null> {
    const { ...updateBody}  = property;
    const { data, error } = await sb
      .from("properties")
      .update(updateBody)
      .eq("id", id)
      .select()
      .single();
  
    if (error) {
      console.error("Supabase update error:", error);
      if (error.code === "23505") {
        const match = error.details?.match(/\((.*?)\)=/);
        const field = match ? match[1] : "field";
        throw new HTTPException(409, {
          message: `Property with this ${field} already exists`,
        });
      }
      if (!data) {
        throw new HTTPException(404, { message: "Property not found" });
      }
      throw new HTTPException(500, { message: "Failed to update property" });
    }
    return data;
  }
  export async function getPropertyById(
    sb: SupabaseClient,
    id: string
  ): Promise<Property | null> {
    const { data, error } = await sb
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      if (error.code === "PGRST116") {
        console.error("Property not found:", error);
        return null;
      }
      console.error("Supabase fetch error:", error);
      throw new HTTPException(500, { message: "Failed to fetch property" });
    }
    return data || null;
  }
  
  export async function deleteProperty(sb: SupabaseClient, id: string): Promise<Property | null> {
    const query = sb
      .from("properties")
      .delete()
      .eq("id", id)
      .select()
      .single();
    const response: PostgrestSingleResponse<Property> = await query;
    if (!response.data) {
      throw new HTTPException(404, { message: "Property not found" });
    }
    return response.data;
  }