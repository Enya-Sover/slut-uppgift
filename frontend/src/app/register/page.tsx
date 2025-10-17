"use client";

import { registerUser, handleLogin } from "../../lib/api";
import { useState } from "react";
import { mainTitle } from "../../ui/ui";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
  
      const loginResponse = await handleLogin({ email, password });
  
      setName("");
      setEmail("");
      setPassword("");
      window.location.href = "/";
    } catch (err) {
      console.error("Could not register user", err);
    }
  };
  

  return (
    <section className="flex flex-col">
      <h1 className={mainTitle}>Register page </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-4">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        required
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Logga in
      </button>
    </form>
    </section>
  );
}
