'use client';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DemoModal } from './DemoModal';

interface DemoCredentials {
  email: string;
  password: string;
  expiresAt: string;
}

export const DemoButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<DemoCredentials | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDemoAccess = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/demo', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to create demo account');
      
      const data = await response.json();
      console.log('Demo credentials:', data.credentials);
      setCredentials(data.credentials);
      setShowModal(true);
    } catch (error) {
      console.error('Demo access failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDemoAccess}
        disabled={isLoading}
        className="flex items-center justify-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Creating Demo...</span>
          </>
        ) : (
          <span>Try Demo</span>
        )}
      </button>

      {showModal && credentials && (
        <DemoModal
          email={credentials.email}
          password={credentials.password}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};