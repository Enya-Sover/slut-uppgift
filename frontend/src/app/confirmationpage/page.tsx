"use client";

import Link from "next/link";
import * as ui from "../../ui/ui";
import * as api from "../../lib/api";
import { useEffect, useState } from "react";

export default function ConfirmationPage() {

const handleClick = () => {
  window.location.href = "/mybookings";
}
  return (
    <main >
    <h1 className={ui.mainTitle}>
        Thank you for your booking!
    </h1>
    <p className={ui.standardDescription}>
        We have received your booking and sent a confirmation email to you. </p>
        <button onClick={handleClick} className={ui.homeButton}>See your upcomming bookings</button>
   

    </main>
  );
}
