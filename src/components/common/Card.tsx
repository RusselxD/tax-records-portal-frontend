import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  accentBorder?: boolean;
}

export default function Card({
  children,
  className = "",
  accentBorder = false,
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${className}`}
    >
      {accentBorder && <div className="h-1 bg-accent" />}
      {children}
    </div>
  );
}
