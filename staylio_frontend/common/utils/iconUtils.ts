/* eslint-disable @typescript-eslint/no-explicit-any */
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

export const getUtilityIcon = (iconName?: string) => {
  if (!iconName) return HelpCircle;

  const pascalName = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (LucideIcons as any)[pascalName] || HelpCircle;
}