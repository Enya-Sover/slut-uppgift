"use client";

import { useEffect, useState } from "react";
import { getBookings, getPropertyById, deleteBooking } from "../../lib/api";
import * as ui from "../../ui/ui";


export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingsWithProperties() {
      try {
        const data = await getBookings();
        const bookingsData = data.data || [];

        const bookingsWithProperties = await Promise.all(
          bookingsData.map(async (booking: BookingWithProperty) => {
            try {
              const property = await getPropertyById(booking.property_id);
              return { ...booking, property };
            } catch (err) {
              console.error(`Kunde inte hämta property ${booking.property_id}`, err);
              return booking;
            }
          })
        );

        setBookings(bookingsWithProperties);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookingsWithProperties();
  }, []);

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete booking, det kanske jag fixar i framtiden");
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className={ui.mainTitle}>My Bookings</h1>

      {loading && <p>Loading your bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {bookings.length === 0 && !loading && (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}

      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold mb-1">
              {booking.property?.name || "Unknown property"}
            </h2>
            <p className="text-gray-700">
              📍 {booking.property?.location || "No location"}
            </p>
            <p className="text-gray-700">
              🏡 Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              🚪 Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
            </p>
            {booking.total_price && (
              <p className="text-gray-900 font-medium mt-2">
                💰 Total: {booking.total_price} SEK
              </p>
                
            )}
            <button  className={`${ui.deleteButton} ${ "bg-red-500 hover:bg-red-600"
                }`} onClick={() => handleDeleteBooking(booking.id)}> Delete Booking</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
