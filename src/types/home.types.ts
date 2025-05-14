
import { ComponentType } from 'react';

export interface Feature {
  icon: ComponentType;
  title: string;
  description: string;
}


export interface StatItem {
  label: string;
  value: string;
}

export interface TestimonialItem {
  text: string;
  author: string;
  role: string;
}