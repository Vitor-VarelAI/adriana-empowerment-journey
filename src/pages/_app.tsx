import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookingProvider } from "@/contexts/BookingContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import "../../app/globals.css";

const queryClient = new QueryClient();

export default function LegacyApp({ Component, pageProps, router }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <NavigationProvider
          navigate={(path) => router.push(path)}
          replace={(path) => router.replace(path)}
        >
          <Component {...pageProps} />
        </NavigationProvider>
      </BookingProvider>
    </QueryClientProvider>
  );
}
