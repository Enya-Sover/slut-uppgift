"use client";

import { useEffect, useState } from "react";
import { getMyProperties, deleteProperty, editProperty } from "../../lib/api";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import * as ui from "../../ui/ui";
import Link from "next/link";


export default function OwnerPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

 useEffect(() => {
    getMyProperties()
      .then(setProperties)
      .catch((err) => console.error(err));
  }, []);
  const [formData, setFormData] = useState<Property>({
    id: "",
    name: "",
    main_image_url: "https://hips.hearstapps.com/clv.h-cdn.co/assets/17/29/3200x1600/landscape-1500478111-bed-and-breakfast-lead-index.jpg?resize=1800:*",
    image_urls: [],
    description: "",
    location: "",
    price_per_night: 0,
    availability: true,
  });

  const handleEdit = (property: Property) => {
    setFormData(property);
    setEditingId(property.id);
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [target.name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value,
    }));
  };
  

  const handleSave = async (id: string) => {
    const updated = await editProperty(id, formData);
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setEditingId(null);
  };

  return (
    <section className="max-w-3xl mx-auto p-4">
      {properties.length > 0 ? (
        properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            {property.main_image_url && (
              <img
                src={property.main_image_url}
                alt={property.name}
                width={400}
                height={250}
                className="rounded mb-3 object-cover"
              />
            )}

            {editingId === property.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(property.id);
                }}
                className="flex flex-col gap-2"
              >
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="price_per_night"
                  type="number"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <label className="flex items-center gap-2">
                  <input
                    name="availability"
                    type="checkbox"
                    checked={formData.availability}
                    onChange={handleChange}
                  />
                  Available
                </label>

                <div className="flex gap-3 mt-2">
                  <button type="submit" className={ui.saveButton}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold">{property.name}</h2>
                <p className="text-gray-700">{property.description}</p>
                <p className="text-gray-600">📍 {property.location}</p>
                <p className="text-gray-600">
                  💰 ${property.price_per_night} / night
                </p>
                <p className="text-gray-600">
                  🏡 {property.availability ? "Available" : "Unavailable"}
                </p>
              </>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(property)}
                className={ui.editButton}
              >
                <Edit size={18} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(property.id)}
                disabled={loadingId === property.id}
                className={`${ui.deleteButton} ${
                  loadingId === property.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <Trash2 size={18} />
                {loadingId === property.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">You have no properties listed, go to 
        <Link href="/property"> <button className={ui.homeButton}> Create new property</button></Link> to create a listing</p>
      )}
    </section>
  );
}
