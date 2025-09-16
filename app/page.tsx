"use client";

import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  );
}
