"use client"

import { useEffect, useState } from "react";
import { getProperties } from "../lib/api";
import { mainContainer } from "../ui/ui";

type Property = {
  id: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  availability: boolean;
  owner_id?: string;
}
export default function HomePage() {
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    getProperties().then((data) => setProperties(data));
  }, [])
  return (
    <section className={`${mainContainer}`}>
      <h1>Välkommen till startsidan 👋</h1>
      <p>Det här är en Next.js-app med App Router.</p>
      <h2>Properties från backend:</h2>
      <ul>
        {properties && properties.length > 0 ? properties.map((property: Property) => (
          <div key={property.id}>
            <li >{property.name}</li>
            <li >{property.description}</li>
            <li >{property.location}</li>
            <li > Price: {property.price_per_night} SEK</li>

          </div>
        )) : <p>Loading properties...</p>}
      </ul>
    </section>
  );
}
