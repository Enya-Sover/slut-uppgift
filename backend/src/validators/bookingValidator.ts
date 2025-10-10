
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<NewBooking> = z.object({
check_in_date: z.string(),
check_out_date: z.string(),
total_price: z.number().min(0, "Total price cannot be negative"),
user_id: z.string(),
property_id: z.string(),
})

export const newBookingValidator = zValidator("json", schema);

const bookingSchema: z.ZodType<Booking> = z.object({
    id: z.string(),
    created_at: z.string(),
    check_in_date: z.string(),
    check_out_date: z.string(),
    total_price: z.number().min(0, "Total price cannot be negative"),
    user_id: z.string(),
    property_id: z.string(),
})
export const bookingValidator = zValidator("json", bookingSchema);

const querySchema: z.ZodType<BookingListQuery> = z.object({
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
    property_id: z.string().optional(),
    user_id: z.string().optional(),
  
  });

  export const bookingQueryValidator = zValidator("query", querySchema);