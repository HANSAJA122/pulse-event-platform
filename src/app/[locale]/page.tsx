import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('Navigation');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pulse-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="z-10 max-w-3xl flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pulse-slate/50 bg-pulse-slate/20 text-sm font-mono text-pulse-cyan mb-4">
          <span className="w-2 h-2 rounded-full bg-pulse-cyan animate-pulse-wave" />
          Pulse is live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-balance">
          Host events that <br/>
          <span className="text-pulse-gradient">feel alive.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-pulse-text/70 max-w-2xl text-balance">
          Turn your calendar into a vibrant community. Create, share, and check in guests with a platform built for speed and signal.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link 
            href="/login" 
            className="px-8 py-4 rounded-xl bg-pulse-gradient text-pulse-bg font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(94,234,212,0.3)]"
          >
            Start Hosting
          </Link>
          <Link 
            href="/discover" 
            className="px-8 py-4 rounded-xl border border-pulse-slate hover:bg-pulse-slate/30 transition-colors font-medium text-lg"
          >
            {t('discover')}
          </Link>
        </div>
      </main>
    </div>
  );
}
