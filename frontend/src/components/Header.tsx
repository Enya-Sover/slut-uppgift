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
  }
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="flex flex-row gap-10">
          <span><Link href="/">Home</Link></span>
          {!user && <span><Link href="/register">Register</Link></span>} 
          {user && <span><Link href="/ownerpage">Owners page</Link></span>}
          {user && <span><Link href="/property">Create new property</Link></span>}
          {user 
          ? <button className="cursor-pointer" onClick={handleLogout}>Log out </button> :
           <span><Link href="/login">Log in</Link></span> }
      </nav>
    </header>
  );
}
