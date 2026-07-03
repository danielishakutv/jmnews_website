"use client";

import { createContext, type ReactNode } from "react";

export const NowContext = createContext<string | null>(null);

export function NowProvider({ now, children }: { now: string; children: ReactNode }) {
  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}
