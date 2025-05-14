import { useState, useRef, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DemoModalProps {
  email: string;
  password: string;
  onClose: () => void;
}

export const DemoModal = ({ email, password, onClose }: DemoModalProps) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignIn = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div ref={modalRef} className="w-96 bg-[#0A0118] rounded-xl border border-gray-800/50 shadow-2xl">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-2">
            Demo Account Created
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Your demo credentials are ready. These will be valid for 12 hours with full access.
          </p>
          
          <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 overflow-hidden mb-6">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800/50">
              <span className="text-sm font-medium text-gray-300">Your Credentials</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800/50"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <p className="text-sm font-mono text-purple-400 select-all">{email}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Password</label>
                <p className="text-sm font-mono text-purple-400 select-all">{password}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In with Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};