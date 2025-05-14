// types/navigation.types.ts
import { LucideIcon } from 'lucide-react';

export type IconType = LucideIcon;

export interface NavigationItem {
  name: string;
  href: string;
  icon: IconType;
}