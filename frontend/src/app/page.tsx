"use client";

import { useEffect, useState } from "react";
import { getProperties } from "../lib/api";
import { mainContainer, mainTitle, standardDescription } from "../ui/ui";
import Image from "next/image";
import { Link } from "react-router-dom";

type Property = {
  id: string;
  image_url: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  availability: boolean;
  owner_id?: string;
};
export default function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties().then((data) => setProperties(data));
  }, []);
  return (
    <section>
      <h1 className={`${mainTitle}`}>Welcome to Davids bed and breakfast</h1>
      <p className={`${standardDescription}`}>Popular stays in sweden {`>`}</p>
      <div className="flex flex-row">
        {properties && properties.length > 0 ? (
          properties.map((property: Property) => (
            <div key={property.id} className="">
              {/* <Link to={`/booking/${property.id}`}> */}
                <Image
                  src={`${property.image_url}`}
                  alt={property.name || "Fastighetsbild"}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />{" "}
              {/* </Link> */}
              <span>{property.name}</span>
              <span>{property.description}</span>
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
