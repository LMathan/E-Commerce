"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster, ToasterProvider } from "@/components/ui/Toaster";
import { CartProvider } from "./CartProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root providers wrapper.
 * Wraps the app with session, cart, toast, and UI providers.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToasterProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </ToasterProvider>
    </SessionProvider>
  );
}
