
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<NewBooking> = z.object({
check_in_date: z.string("Check-in date is required"),
check_out_date: z.string("Check-out date is required"),
total_price: z.number().min(0, "Total price cannot be negative"),
user_id: z.string("User ID is required"),
property_id: z.string("Property ID is required"),
}) 

export const newBookingValidator = zValidator("json", schema);

const bookingSchema: z.ZodType<Booking> = z.object({
    id: z.string("ID is required"),
    created_at: z.string("Creation date is required"),
    check_in_date: z.string("Check-in date is required"),
    check_out_date: z.string("Check-out date is required"),
    total_price: z.number().min(0, "Total price cannot be negative"),
    user_id: z.string("User ID is required"),
    property_id: z.string("Property ID is required"),
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

  export const updateBookingValidator = zValidator(
    "json",
    z.object({
      check_in_date: z.string().optional(),
      check_out_date: z.string().optional(),
      total_price: z.coerce.number().optional(),
      user_id: z.string().optional(),
      property_id: z.string().optional(),
    })
  );