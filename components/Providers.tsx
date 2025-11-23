"use client";

import { ReactNode } from "react";
import { ChatProvider } from "@/lib/ChatContext";
import { StreetConnectGuide } from "@/components/StreetConnectGuide";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChatProvider>
      {children}
      <StreetConnectGuide />
    </ChatProvider>
  );
}
