// app/signup/page.tsx
import Navbar from '@/components/navbar/navbar';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-32">
        <SignupForm />
      </div>
    </div>
  );
}