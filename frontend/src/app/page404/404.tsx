"use client";

import Link from "next/link";
import * as ui from "../../ui/ui";

export default function Page404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">
        Oops! Page not found 🕵️‍♂️ 
      </h2> 
      <p className="text-gray-600 mt-2 mb-6 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.  
        Double-check the URL or go back to the homepage.
      </p>

      <Link
        href="/"
        className={ui.homeButton}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
