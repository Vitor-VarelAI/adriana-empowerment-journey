"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookingProvider } from "@/contexts/BookingContext";
import { BrowserRouter } from "react-router-dom";

// Single query client instance for Next.js client tree
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>{children}</BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </QueryClientProvider>
  );
}
