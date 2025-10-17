"use client";

import { useEffect, useState } from "react";
import { getProperties } from "../lib/api";
import { mainContainer, mainTitle, standardDescription } from "../ui/ui";
import Link from "next/link";
import Image from "next/image";
import { standardImageSize } from "../ui/ui";
import { Images } from "lucide-react";


export default function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties().then((data) => setProperties(data));
  }, []);
  return (
    <section>
      <h1 className={`${mainTitle}`}>Welcome to Davids bed and breakfast</h1>
      <p className={`${standardDescription}`}>Popular stays in sweden {`>`}</p>
      <div className="flex flex-row gap-4">
        {properties && properties.length > 0 ? (
          properties.map((property: Property) => (
            <div key={property.id} className="flex flex-col">

              <Link href={`/booking/${property.id}`}>
                <img
                  src={`${property.image_url}`}
                  alt={property.name || "Fastighetsbild"}
                  width={400}
                  height={300}
                  className={standardImageSize}
                  />{" "}
                  </Link>
              <span>{property.name}</span>
              <span>{property.location}</span>
              <span> Price: {property.price_per_night} SEK</span>
            </div>
          ))
        ) : (
          <p>Loading properties...</p>
        )}
      </div>
    </section>
  );
}
