"use client";

export function NewBackground(_props: {
  showGradient?: boolean;
  showAnimation?: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 bg-white" />
  );
}
