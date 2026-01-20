import { ReactNode } from "react";

export default function OutreachLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {children}
    </div>
  );
}

