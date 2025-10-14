"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Hem</Link></li>
          <li><Link href="/login">Logga in</Link></li>
        </ul>
      </nav>
    </header>
  );
}
