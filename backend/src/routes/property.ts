import { Hono } from "hono";
import { requireAuth, adminAuth } from "../middleware/auth.js";
import * as db from "../database/property.js";
import { HTTPException } from "hono/http-exception";
import {
  newPropertyValidator,
  propertyQueryValidator,
  propertyValidator,
  updatePropertyValidator,
} from "../validators/propertyValidator.js";
import { getLocalUser } from "../utils/getLocalUser.js";
import { verifyOwnershipOrAdmin } from "../middleware/verifyOwnershipOrAdmin.js";
const propertyApp = new Hono();

propertyApp.get("/", propertyQueryValidator, async (c) => {
  const query = c.req.valid("query");
  const sb = c.get("supabase");

  let defaultResponse: PaginatedListResponse<Property> = {
    data: [],
    count: 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };

  const response = await db.getProperties(sb, query);
  return c.json({
    ...defaultResponse,
    ...response,
  });
});

propertyApp.get("/mine", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const localUser: LocalUser = await getLocalUser(c, sb);

  const { data: properties, error: propertyError } = await sb
    .from("properties")
    .select("*")
    .eq("owner_id", localUser.id);

  if (propertyError) {
    throw new HTTPException(500, { message: "Failed to fetch properties" });
  }

  return c.json(properties, 200);
});

propertyApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const property: Property | null = await db.getPropertyById(sb, id);

  if (!property) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  return c.json(property, 200);
});

propertyApp.post("/", requireAuth, async (c) => {
  const sb = c.get("supabase");
  const body: Property = await c.req.json();
  if (body.image_url === "" || !body.image_url) {
    body.image_url =
      "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/29/3200x1600/landscape-1500478111-bed-and-breakfast-lead-index.jpg?resize=1800:*";
  }

  const property = await db.createProperty(sb, body);

  if (!property) {
    throw new HTTPException(400, { message: "Failed to create property" });
  }

  return c.json(property, 201);
});

propertyApp.put(
  "/:id",
  requireAuth,
  newPropertyValidator,
  verifyOwnershipOrAdmin,
  async (c) => {
    const sb = c.get("supabase");
    const id = c.req.param("id");
    const body: NewProperty = await c.req.json();
    const updatedProperty = await db.updateProperty(sb, id, body);
    return c.json(updatedProperty, 200);
  }
);

propertyApp.patch(
  "/:id",
  requireAuth,
  updatePropertyValidator,
  verifyOwnershipOrAdmin,
  async (c) => {
    const id = c.req.param("id");
    const sb = c.get("supabase");
    const body: Partial<NewProperty> = await c.req.json();
    const updated = await db.updateProperty(sb, id, body);
    if (!updated) {
      throw new HTTPException(400, { message: "Failed to update property" });
    }
    return c.json(updated, 200);
  }
);

propertyApp.delete("/:id", requireAuth, verifyOwnershipOrAdmin, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const deleted = await db.deleteProperty(sb, id);

  if (!deleted) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  return c.json({ message: "Property deleted successfully" }, 200);
});

export default propertyApp;
