import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface HelpSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  content: ReactNode;
}
