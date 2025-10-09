
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<Booking> = z.object({
id: z.string(),
createdAt: z.string(),
checkInDate: z.string(),
checkOutDate: z.string(),
totalPrice: z.number(),
user_id: z.string(),
property_id: z.string()
})

export const bookingValidator = zValidator("json", schema);