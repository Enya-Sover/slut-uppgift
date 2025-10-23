
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<NewProperty> = z.object({
    name: z.string("Name is required"),
    main_image_url: z.string().optional(),
    image_urls: z.string().array().optional(),
    description: z.string("Description is required"),
    location: z.string("Location is required"),
    price_per_night: z.coerce.number("Price per night must be a number").min(0, "Price per night cannot be negative"),
    availability: z.coerce.boolean("Availability must is required"),
    owner_id: z.string("Owner ID is required").optional()
})

export const newPropertyValidator = zValidator("json", schema);

const propertySchema: z.ZodType<Property> = z.object({
    id: z.coerce.string(),
    name: z.string("Name is required"),
    description: z.string("Description is required"),
    location: z.string("Location is required"),
    price_per_night: z.coerce.number("Price per night must be a number").min(0, "Price per night cannot be negative"),
    availability: z.coerce.boolean("Availability must is required"),
    created_at: z.string(),
    owner_id: z.string()
});
export const propertyValidator = zValidator("json", propertySchema);

const querySchema: z.ZodType<PropertyListQuery> = z.object({
    limit: z.coerce
      .number()
      .int()
      .min(10, "Limit must be at least 10")
      .max(50, "Limit cannot exceed 50")
      .default(10),
    offset: z.coerce
      .number()
      .int()
      .min(0, "Offset cannot be negative")
      .default(0),
    q: z.string().optional(),
    sort_by: z.enum(["name"]).default("name").optional()
  
  });

  export const propertyQueryValidator = zValidator("query", querySchema);

  export const updatePropertyValidator = zValidator(
    "json",
    z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      location: z.string().optional(),
      price_per_night: z.coerce.number().optional(),
      availability: z.coerce.boolean().optional(),
    })
    );