"use client";

import { useEffect, useState } from "react";
import { getMyProperties, deleteProperty } from "../../lib/api";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { deleteButton, editButton, saveButton } from "../../ui/ui";

type Property = {
  id: number;
  name: string;
  image_url?: string;
  description: string;
  location: string;
  price_per_night: number;
  availability: boolean;
}; //! Att göra: Edit och delete funktionalitet

export default function OwnerPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    getMyProperties()
      .then((data) => {
        setProperties(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (id: number) => {
    setEditMode(!editMode);
  };
  const handleSave = () => {};
  return (
    <section>
      {properties && properties.length > 0 ? (
        properties.map((property) => {
          return (
            <div
              key={property.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              {property.image_url && (
                <Image
                  src={property.image_url}
                  alt={property.name}
                  width={200}
                  height={200}
                />
              )}
              {editMode ? (
                <form className="flex flex-col gap-2 mt-2">
                  <input
                    type="text"
                    required
                    defaultValue={property.name}
                    className="border p-2 rounded"
                  />
                  <textarea
                    required
                    defaultValue={property.description}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    required
                    defaultValue={property.location}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    required
                    defaultValue={property.price_per_night}
                    className="border p-2 rounded"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={property.availability}
                    />
                    Available
                  </label>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      className={sa}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-lg font-bold">{property.name}</h2>
                  <p>{property.description}</p>
                  <p>Location: {property.location}</p>
                  <p>Price per night: ${property.price_per_night}</p>
                  <p>Available: {property.availability ? "Yes" : "No"}</p>
                </>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(property.id)}
                  className={editButton}
                >
                  <Edit size={18} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(property.id)}
                  disabled={loadingId === property.id}
                  className={`${deleteButton}
                    ${
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
          );
        })
      ) : (
        <p>No properties found</p>
      )}
    </section>
  );
}
