"use client";

import { useState } from "react";
import { createProperty } from "../../lib/api";

export default function CreatePropertyForm() {
  const [formData, setFormData] = useState<PropertyData>({
    name: "",
    main_image_url: "",
    image_urls: [],
    description: "",
    location: "",
    price_per_night: 0,
    availability: true,
  });

  const [newImageUrl, setNewImageUrl] = useState(""); // 👈 temp för ny URL
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

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls!, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls!.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createProperty(formData);
      setSuccess("Property created!");
      setFormData({
        name: "",
        main_image_url: "",
        image_urls: [],
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
        name="main_image_url"
        placeholder="Main Picture URL (optional)"
        value={formData.main_image_url}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* 📸 Lägg till bild–URL */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Lägg till bild–URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={handleAddImageUrl}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

      {/* 🖼️ Förhandsvisa URL:er */}
      {formData.image_urls && formData.image_urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.image_urls.map((url, index) => (
            <div key={index} className="relative inline-block">
              <img
                src={url}
                alt={`bild-${index}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImageUrl(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-2 hover:bg-opacity-80"
                title="Ta bort"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        placeholder="Description of your property"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Address"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="number"
        name="price_per_night"
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
