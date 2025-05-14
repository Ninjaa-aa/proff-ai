import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'student';
      subscription: 'free' | 'pro' | 'enterprise';
    }
  }

  interface User {
    role: 'admin' | 'student';
    subscription: 'free' | 'pro' | 'enterprise';
  }
} 