"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyById } from "../../../lib/api";
import Image from "next/image";
import { saveButton } from "../../../ui/ui";
import { handleBooking } from "../../../lib/api";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property >({
    id: "",
    name: "",
    image_url: "",
    description: "",
    location: "",
    price_per_night: 0,
    availability: false
  });
  const today = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(today.getDate() + 2);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingData, setBookingData] = useState<NewBooking>({
    check_in_date: today.toISOString().split("T")[0],
    check_out_date: twoDaysLater.toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) {
      getPropertyById(id).then(setProperty).catch(console.error);
    }
  }, [id]);
console.log("bookingData:", bookingData)
console.log("property id:", property.id)
  useEffect(() => {
    if (property) {
      const checkIn = new Date(bookingData.check_in_date);
      const checkOut = new Date(bookingData.check_out_date);

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      setTotalPrice(nights * property.price_per_night);
    }
  }, [bookingData, property]);
  const clickBook = async () => {
    const ok = await handleBooking(property?.id, bookingData.check_in_date, bookingData.check_out_date);
    if (ok){
      window.location.href = "/confirmationpage";
    }
  }

  return (
    <section>
      {property ? (
        <div>
          <img
            src={property.image_url || "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/29/3200x1600/landscape-1500478111-bed-and-breakfast-lead-index.jpg?resize=1800:*"}
            alt={property.name}
            width={400}
            height={250}
            className="rounded mb-3 object-cover"
          />
          <h1>Booking for {property.name}</h1>
          <p>📍 {property.location}</p>
          <p>💰 {property.price_per_night} SEK/night</p>
          <p>Total cost: {totalPrice} SEK</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clickBook();
            }}
          >
            <input
              type="date"
              value={bookingData.check_in_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  check_in_date: e.target.value,
                }))
              }
            />

            <input
              type="date"
              value={bookingData.check_out_date}
              min={bookingData.check_in_date}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  check_out_date: e.target.value,
                }))
              }
            />
            <button type="submit" className={saveButton}>Confirm booking</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
