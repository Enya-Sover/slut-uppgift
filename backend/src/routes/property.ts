import { Hono } from "hono";
import { requireAuth, adminAuth } from "../middleware/auth.js";
import * as db from "../database/property.js";
import { HTTPException } from "hono/http-exception";
import { newPropertyValidator, propertyQueryValidator, propertyValidator, updatePropertyValidator } from "../validators/propertyValidator.js";

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
      ...response
    });
  });


propertyApp.post("/", async (c)=> {
    const sb = c.get("supabase");
    const body = await c.req.json();
    const property = await db.createProperty(sb, body);
    if(!property){
        throw new HTTPException(400, {message: "Failed to create property"})
        }
    return c.json(property, 201);
})

propertyApp.get("/:id", requireAuth, async (c) => {
  const { id } = c.req.param()
  const sb = c.get("supabase")
  const property = await db.getProperty(sb, id)
  if(!property){
    throw new HTTPException(404, {message: "Property not found"})
  }
  return c.json(property)

})

propertyApp.put("/:id", requireAuth, newPropertyValidator, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase")
  const body = await c.req.json();
  const property = await db.updateProperty(sb, id, body);

  if (!property) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  return c.json(property, 200);
});

propertyApp.patch("/:id", requireAuth, updatePropertyValidator, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase")
  const body = await c.req.json();
  const property = await db.updateProperty(sb, id, body);

  if (!property) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  return c.json(property, 200);
});

propertyApp.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase")
  const deleted = await db.deleteProperty(sb, id);

  if (!deleted) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  return c.json({ message: "Property deleted successfully" }, 200);
})

export default propertyApp