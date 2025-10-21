"use client";

import Link from "next/link";
import * as ui from "../../ui/ui";
import * as api from "../../lib/api";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingResponse | null>(null);

  useEffect(() => {
    api
      .getBookings()
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);
  console.log("bookings", bookings);

  return (
    <>
      <div className={ui.mainTitle}>Here are you bookings</div>
      {bookings ? (
        <>
          <div>Upcomming bookings:</div>
          {bookings.data.map((booking) => (
            <div key={booking.id}>
              <p>Booking ID: {booking.id}</p>
              <p>Check-in: {booking.check_in_date}</p>
              <p>Check-out: {booking.check_out_date}</p>
            </div>
          ))}
          <span>{}</span>
        </>
      ) : (
        <div>No bookings found.</div>
      )}
    </>
  );
}
