
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<Property> = z.object({
    id: z.string(),
    description: z.string(),
    location: z.string(),
    pricePerNight: z.coerce.number(),
    availability: z.boolean()
})

export const propertyValidator = zValidator("json", schema);

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
