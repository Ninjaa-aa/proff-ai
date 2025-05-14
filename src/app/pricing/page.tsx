import { Metadata } from 'next';
import Navbar from '@/components/navbar/navbar';
import { PricingPage } from '@/components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing - Professor AI | Choose Your Learning Journey',
  description: 'Flexible pricing plans for every learning need. Start your enhanced learning journey with Professor AI today.',
  keywords: ['AI tutor pricing', 'education pricing', 'learning assistant plans', 'Professor AI pricing'],
};

export default function Page() {
  return (
    <>
      <Navbar />
      <PricingPage />
    </>
  );
}