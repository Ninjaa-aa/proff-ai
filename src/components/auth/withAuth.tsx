'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from 'lucide-react';

interface WithAuthProps {
  requireAdmin?: boolean;
  requireSubscription?: 'pro' | 'enterprise';
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requireAdmin = false, requireSubscription }: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (!session) {
        router.replace('/login');
        return;
      }

      if (requireAdmin && session.user.role !== 'admin') {
        router.replace('/');
        return;
      }

      if (requireSubscription && session.user.subscription !== requireSubscription) {
        router.replace('/pricing');
        return;
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      );
    }

    if (!session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 