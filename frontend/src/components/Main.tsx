import React from "react";
import {mainContainer} from "../ui/ui"; 

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  return <main className={`${mainContainer}`}>{children}</main>;
}
