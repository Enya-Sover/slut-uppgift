import React from "react";

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  return <main>{children}</main>;
}
