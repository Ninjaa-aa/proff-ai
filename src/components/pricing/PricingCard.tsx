// components/pricing/PricingCard.tsx
import { PricingPlan } from '@/types/price.types';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handlePlanClick = () => {
    if (!session) {
      localStorage.setItem('selectedPlan', plan.name);
      router.push('/login?redirectTo=/pricing');
      return;
    }

    router.push('/chatbot');
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl p-1 group hover:scale-105 transition-transform duration-300
      ${plan.highlight ? 'bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent' : ''}`}
    >
      <div className="relative h-full rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 to-black p-8 flex flex-col backdrop-blur-xl">
        {plan.highlight && (
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rotate-12 animate-pulse" />
        )}
        
        <div className="mb-6">
          <div className="rounded-2xl bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
            {plan.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-slate-400 mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-slate-400">{plan.period}</span>
          </div>
        </div>

        <div className="flex-grow">
          <div className="space-y-4 mb-8">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
                <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handlePlanClick}
          className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all
            ${plan.highlight 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white'
            }`}
        >
          {plan.buttonText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PricingCard;