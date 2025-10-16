"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { getCurrentUser } from "../lib/api";

export default function Header() {
  const [user, setUser] = useState<LocalUser | null>(null);
  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
  }, []);
  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/";
  };
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="flex items-center justify-between px-6 py-3">
        {/* Vänster sida */}
        <div className="flex gap-10 items-center">
          {user && (
            <span className="font-bold">
              {`Welcome ${capitalizeFirstLetter(user.name)}`}
            </span>
          )}
          <span><Link href="/">Home</Link></span>
          {user && (
            <span><Link href="/ownerpage">Owners page</Link></span>
          )}
          {user && (<span><Link href="/property">Create new property</Link></span>)}</div>

        <div className="flex gap-6 items-center">
          {!user && (<span><Link href="/register">Register</Link></span>)}
          {user ? (<button 
          className="cursor-pointer hover:underline" 
          onClick={handleLogout}>Log out</button>
          ) : (
            <span><Link href="/login">Log in</Link></span>
          )}
        </div>
      </nav>
    </header>
  );
}
