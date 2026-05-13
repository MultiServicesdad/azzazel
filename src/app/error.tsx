'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('AZAZEL SYSTEM ERROR:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] grid-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center space-y-8"
      >
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="relative w-24 h-24 rounded-2xl bg-zinc-900 border border-red-500/30 flex items-center justify-center shadow-2xl">
             <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Subsystem Failure</h1>
          <p className="text-zinc-500 leading-relaxed">
            The Azazel cognitive engine encountered an unexpected exception while processing your request. 
            The incident has been logged for institutional review.
          </p>
          {error.digest && (
            <div className="p-2 rounded bg-red-500/5 border border-red-500/10 font-mono text-[10px] text-red-400 inline-block">
              ID: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-8 h-12"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reinitialize Subsystem
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-12"
            render={
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Link>
            }
          />
        </div>

        <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.2em]">
          Internal Security Protocol • ERROR_CRITICAL_FAILURE
        </p>
      </motion.div>
    </div>
  );
}
