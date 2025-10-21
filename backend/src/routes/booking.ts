import { Hono } from "hono";
import { requireAuth, adminAuth } from "../middleware/auth.js";
import * as db from "../database/booking.js";
import { HTTPException } from "hono/http-exception";
import {
  newBookingValidator,
  bookingQueryValidator,
  updateBookingValidator,
} from "../validators/bookingValidator.js";
import * as property from "../database/property.js";
import { getLocalUser } from "../utils/getLocalUser.js";

const bookingApp = new Hono();

bookingApp.get("/", requireAuth, bookingQueryValidator, async (c) => {
  const query = c.req.valid("query");
  const sb = c.get("supabase");

  
  const defaultResponse: PaginatedListResponse<Booking> = {
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

bookingApp.post("/", requireAuth, newBookingValidator, async (c) => {
  const sb = c.get("supabase");
  const localUser = await getLocalUser(c, sb);

  const body = await c.req.json<Omit<NewBooking, "total_price" | "user_id">>();

  const propertyData = await property.getProperty(sb, body.property_id);
  if (!propertyData) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  const checkIn = new Date(body.check_in_date);
  const checkOut = new Date(body.check_out_date);
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * propertyData.price_per_night;

  const bookingData: NewBooking = {
    ...body,
    total_price: totalPrice,
    user_id: localUser.id,
    owner_id: propertyData.owner_id,
  };

  const booking = await db.createBooking(sb, bookingData);
  if (!booking) {
    throw new HTTPException(400, { message: "Failed to create booking" });
  }

  return c.json(booking, 201);
});


bookingApp.get("/:id", requireAuth, async (c) => {
  const { id } = c.req.param();
  const sb = c.get("supabase");
  const booking: Booking | null = await db.getBooking(sb, id);

  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json(booking);
});
bookingApp.put("/:id", requireAuth, newBookingValidator, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const localUser = await getLocalUser(c, sb);

  const body = await c.req.json<Omit<Booking, "id" | "user_id" | "total_price">>();

  const propertyData = await property.getProperty(sb, body.property_id);
  if (!propertyData) {
    throw new HTTPException(404, { message: "Property not found" });
  }

  const checkIn = new Date(body.check_in_date);
  const checkOut = new Date(body.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * propertyData.price_per_night;

  const bookingData: NewBooking = {
    ...body,
    user_id: localUser.id,
    total_price: totalPrice,
  };
  const booking = await db.updateBooking(sb, id, bookingData);
  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json(booking, 200);
});


bookingApp.patch("/:id",requireAuth, updateBookingValidator, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const body: Booking = await c.req.json();
  const existingBooking = await db.getBooking(sb, id);
  if (!existingBooking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  const propertyData = await property.getProperty(sb, existingBooking.property_id);
  if (!propertyData) {
    throw new HTTPException(404, { message: "Property not found" });
  }
  const checkIn = body.check_in_date
    ? new Date(body.check_in_date)
    : new Date(existingBooking.check_in_date);
  const checkOut = body.check_out_date
    ? new Date(body.check_out_date)
    : new Date(existingBooking.check_out_date);
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * propertyData.price_per_night;

  const bookingData = {
    ...existingBooking,
    ...body,
    total_price: totalPrice,
    check_in_date: checkIn.toISOString().split("T")[0],
    check_out_date: checkOut.toISOString().split("T")[0],
  };
  const booking = await db.updateBooking(sb, id, bookingData);
  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json(booking, 200);
});

bookingApp.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const sb = c.get("supabase");
  const deleted: Booking | null = await db.deleteBooking(sb, id);

  if (!deleted) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  return c.json({ message: "Booking deleted successfully" }, 200);
});

export default bookingApp;
