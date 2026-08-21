import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background selection:bg-accent selection:text-foreground">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
        {/* Logo Icon with Pulse Effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-accent p-6 rounded-2xl shadow-neon-blue">
            <ShieldCheck className="w-16 h-16 text-foreground" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="font-bold text-5xl tracking-tight text-foreground font-mono mb-2">
            TRUE<span className="text-accent">STYLE</span>
          </h1>
          <p className="text-muted tracking-widest uppercase text-xs font-semibold animate-pulse">
            Authenticating Platform...
          </p>
        </div>
        
        {/* Loading Bar */}
        <div className="mt-12 w-48 h-1 bg-card rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{
            animation: 'loading 2s ease-in-out forwards'
          }}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
