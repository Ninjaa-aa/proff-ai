// app/page.tsx
import { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { Navbar } from '@/components/navbar/navbar';
export const metadata: Metadata = {
  title: 'Professor AI - Your Intelligent Academic Assistant',
  description: 'Experience the future of education with our advanced AI assistant. Get instant answers, personalized learning, and comprehensive academic support.',
  keywords: [
    'AI tutor',
    'academic assistant',
    'educational AI',
    'online learning',
    'personalized tutoring',
    'Professor AI'
  ],
  openGraph: {
    title: 'Professor AI - Your Intelligent Academic Assistant',
    description: 'Experience the future of education with our advanced AI assistant',
    type: 'website',
    locale: 'en_US',
    siteName: 'Professor AI'
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <HomePage />
    </main>
  );
}