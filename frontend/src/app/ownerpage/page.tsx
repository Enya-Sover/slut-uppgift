"use client"

import { useEffect, useState } from "react"
import { getMyProperties } from "../../lib/api"
import Image from "next/image"

type Property = {
    id: number
    name: string
    image_url?: string
    description: string
    location: string
    price_per_night: number
    availability: boolean
} //! Att göra: Edit och delete funktionalitet

export default function OwnerPage() {
    const [properties, setProperties] = useState<Property[]>([])

    useEffect(() => {
        getMyProperties()
        .then(data => {
            setProperties(data)
        console.log(data)})
            .catch(err => console.error(err))
    }, [])
    return(
        <section>
            {properties && properties.length > 0 ? properties.map(property =>{
                return (
                    <div key={property.id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
                        <h2>{property.name}</h2>
                        {property.image_url && 
                        <Image src={property.image_url} alt={property.name} style={{maxWidth: "200px"}} />}
                        <p>{property.description}</p>
                        <p>Location: {property.location}</p>
                        <p>Price per night: ${property.price_per_night}</p>
                        <p>Available: {property.availability ? "Yes" : "No"}</p>
                    </div>
                )
            }) : <p>No properties found</p>}
        </section>
    )
}

