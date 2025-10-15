"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="flex flex-row gap-10">
          <span><Link href="/">Home</Link></span>
          <span><Link href="/login">Log in</Link></span>
          <span><Link href="/register">Register</Link></span>
          <span><Link href="/ownerpage">Owners page</Link></span>
          <span><Link href="/property">Create new property</Link></span>
      </nav>
    </header>
  );
}
