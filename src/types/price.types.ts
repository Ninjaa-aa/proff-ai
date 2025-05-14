// types/pricing.types.ts
import { ReactNode } from 'react';

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  icon: ReactNode;
  features: PlanFeature[];
  highlight?: boolean;
  period: string;
  buttonText: string;
}

export interface FAQItem {
  q: string;
  a: string;
}