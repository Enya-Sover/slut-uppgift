"use client";

import { useState } from "react";
import { createProperty } from "../../lib/api";



export default function CreatePropertyForm() {
  const [formData, setFormData] = useState<PropertyData>({
    name: "",
    image_url: "",
    description: "",
    location: "",
    price_per_night: 0,
    availability: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createProperty(formData);
      setSuccess("Property skapad!");

      setFormData({
        name: "",
        image_url: "",
        description: "",
        location: "",
        price_per_night: 0,
        availability: true,
      });
    } catch (err: any) {
      setError(err.message || "Något gick fel");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4"
    >
      <h2 className="text-xl font-bold">Create new property</h2>

      <input
        type="text"
        placeholder="Name of your property"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        name="image_url"
        placeholder="Picture-URL (optional)"
        value={formData.image_url}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Description of your property"
        name= "description"
        value={formData.description}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Address"
        name= "location"
        value={formData.location}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        name= "price_per_night"
        placeholder="Pris per natt"
        value={formData.price_per_night}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="availability"
          checked={formData.availability}
          onChange={handleChange}
        />
        Availability
      </label>

      <button
        type="submit"
        className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Create property
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
    </form>
  );
}
