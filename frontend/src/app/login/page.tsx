"use client";

import { useState } from "react";
import { handleLogin } from "../../lib/api";
import { mainContainer, mainTitle } from "../../ui/ui";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const approved = await handleLogin(formData);
    
      if (approved) {
        setFormData({ email: "", password: "" });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Could not login user", error);
      setError("Wrong email or password");
      
    }
  };
  return (
    <section>
      <h1 className={mainTitle}>Login page</h1>
      <form
        onSubmit={loginFunction}
        className="flex flex-col gap-4 max-w-sm mx-auto p-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Logga in
        </button>
        
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </section>
  );
}
