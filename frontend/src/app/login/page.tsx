"use client";

import { useState } from "react";
import { handleLogin } from "../../lib/api";
import { set } from "zod";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const loginFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data: FormData = await handleLogin({ email, password });
      setEmail("");
      setPassword("");
      setError(null);
    } catch (error) {
      console.error("Could not login user", error);
      setError("Wrong email or password");
    }
  };
  return (
    <section>
      <h1>Logga in</h1>
      <form
        onSubmit={loginFunction}
        className="flex flex-col gap-4 max-w-sm mx-auto p-4"
      >
        <input
          type="email"
          placeholder="Email"
          required
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
      {error && <p className="text-red-500 text-center">{error}</p>}
    </section>
  );
}
