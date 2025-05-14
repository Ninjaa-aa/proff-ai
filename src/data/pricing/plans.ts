// data/pricing/plans.tsx
import React from 'react';
import { Zap, Rocket, Crown } from 'lucide-react';
import { PricingPlan } from '@/types/price.types';

export const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "forever",
    description: "Perfect for trying out Professor AI",
    icon: React.createElement(Zap, { className: "w-6 h-6 text-blue-500" }),
    buttonText: "Get Started",
    features: [
      { name: "20 questions per day", included: true },
      { name: "Basic subject coverage", included: true },
      { name: "Standard response time", included: true },
      { name: "Community support", included: true },
      { name: "Custom learning paths", included: false },
      { name: "Advanced explanations", included: false },
      { name: "Priority support", included: false },
      { name: "Unlimited questions", included: false },
    ]
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Ideal for serious students",
    icon: React.createElement(Rocket, { className: "w-6 h-6 text-blue-500" }),
    buttonText: "Go Pro",
    highlight: true,
    features: [
      { name: "Unlimited questions", included: true },
      { name: "Complete subject coverage", included: true },
      { name: "Fast response time", included: true },
      { name: "Email support", included: true },
      { name: "Custom learning paths", included: true },
      { name: "Advanced explanations", included: true },
      { name: "Priority support", included: false },
      { name: "API Access", included: false },
    ]
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For educational institutions",
    icon: React.createElement(Crown, { className: "w-6 h-6 text-blue-500" }),
    buttonText: "Contact Sales",
    features: [
      { name: "Unlimited questions", included: true },
      { name: "Complete subject coverage", included: true },
      { name: "Instant response time", included: true },
      { name: "24/7 Priority support", included: true },
      { name: "Custom learning paths", included: true },
      { name: "Advanced explanations", included: true },
      { name: "API Access", included: true },
      { name: "Custom integration", included: true },
    ]
  }
];