"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyById, handleBooking } from "../../../lib/api";
import * as ui from "../../../ui/ui";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property>({
    id: "",
    name: "",
    main_image_url: "",
    image_urls: [],
    description: "",
    location: "",
    price_per_night: 0,
    availability: false,
  });

  const today = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(today.getDate() + 2);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingData, setBookingData] = useState<NewBooking>({
    check_in_date: today.toISOString().split("T")[0],
    check_out_date: twoDaysLater.toISOString().split("T")[0],
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPropertyById(id).then(setProperty).catch(console.error);
    }
  }, [id]);

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
    const ok = await handleBooking(
      property?.id,
      bookingData.check_in_date,
      bookingData.check_out_date
    );
    if (ok) {
      window.location.href = "/confirmationpage";
    }
  };

  return (
    <section>
      {property ? (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <img
              src={
                property.main_image_url ||
                "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/29/3200x1600/landscape-1500478111-bed-and-breakfast-lead-index.jpg?resize=1800:*"
              }
              alt={property.name}
              width={400}
              height={250}
              className={ui.standardImageSize}
              onClick={() =>
                setSelectedImage(
                  property.main_image_url ||
                    "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/29/3200x1600/landscape-1500478111-bed-and-breakfast-lead-index.jpg?resize=1800:*"
                )
              }
            />

            <div className="grid grid-cols-3 gap-2">
              {property.image_urls &&
                property.image_urls.length > 0 &&
                property.image_urls.map((url, index) => (
                  <img
                    src={url}
                    key={index}
                    alt={`${property.name}-${index}`}
                    className= {ui.smallImageSize}
                    onClick={() => setSelectedImage(url)}
                  />
                ))}
            </div>
          </div>

          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <img
                src={selectedImage}
                alt="Förstorad bild"
                className="max-w-[90%] max-h-[90%] rounded shadow-lg"
              />
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">
            Booking for {property.name}
          </h1>
          <p>📍 {property.location}</p>
          <p>💰 {property.price_per_night} SEK/night</p>
          <p className="mb-4 font-bold">Total cost: {totalPrice} SEK</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              clickBook();
            }}
            className="flex flex-col gap-2 max-w-sm"
          >
            <label>
              Check-in
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
                className="border p-2 rounded w-full"
              />
            </label>

            <label>
              Check-out
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
                className="border p-2 rounded w-full"
              />
            </label>

            <button type="submit" className={ui.saveButton}>
              Confirm booking
            </button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
