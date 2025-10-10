import { Hono } from "hono";
import { requireAuth, adminAuth } from "../middleware/auth.js";
import * as db from "../database/booking.js";
import { HTTPException } from "hono/http-exception";
import { newBookingValidator, bookingQueryValidator } from "../validators/bookingValidator.js";

const bookingApp = new Hono();

bookingApp.get("/", bookingQueryValidator, async (c) => {
  const query = c.req.valid("query");
  const sb = c.get("supabase");

  const defaultResponse = {
    data: [],
    count: 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };

  const response = await db.getBookings(sb, query);
  return c.json({
    ...defaultResponse,
    ...response,
  });
});

bookingApp.post("/", newBookingValidator, async (c) => {
  const sb = c.get("supabase");
  const body = await c.req.json();
  const booking = await db.createBooking(sb, body);

  if (!booking) {
    throw new HTTPException(400, { message: "Failed to create booking" });
  }

  return c.json(booking, 201);
});

bookingApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  const sb = c.get("supabase");
  const booking = await db.getBooking(sb, id);

  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json(booking);
});

bookingApp.put("/:id", newBookingValidator, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const body = await c.req.json();
  const booking = await db.updateBooking(sb, id, body);

  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json(booking, 200);
});

bookingApp.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const deleted = await db.deleteBooking(sb, id);

  if (!deleted) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json({ message: "Booking deleted successfully" }, 200);
});

export default bookingApp;
