
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