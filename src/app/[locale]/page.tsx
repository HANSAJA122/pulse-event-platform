"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const t = useTranslations('Navigation');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Subtle Luma-like blurred mesh background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.04] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Top Glass Navigation Bar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-12 w-[90%] max-w-4xl"
      >
        <div className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          Pulse
        </div>
        <div className="flex items-center gap-6">
          <Link href="/discover" className="text-pulse-text-muted hover:text-white transition-colors text-sm font-medium">
            {t('discover')}
          </Link>
          <Link href="/login" className="text-pulse-text-muted hover:text-white transition-colors text-sm font-medium">
            Log In
          </Link>
          <Link href="/login" className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
            Sign Up
          </Link>
        </div>
      </motion.nav>

      <main className="z-10 w-full max-w-5xl flex flex-col items-center mt-24">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs md:text-sm font-medium text-pulse-text-muted mb-8"
        >
          <Sparkles className="w-4 h-4 text-white" />
          The new standard for events
        </motion.div>
        
        {/* Massive Typographic Hero */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tighter leading-[0.9] text-balance mb-8"
        >
          Bring people<br />
          <span className="text-white/40">together.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-pulse-text-muted max-w-2xl text-balance mb-12"
        >
          Beautiful event pages. Seamless RSVPs. Powerful management. Everything you need to host unforgettable moments.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Start Hosting <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/discover" 
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel-interactive font-medium text-lg flex items-center justify-center"
          >
            Explore Events
          </Link>
        </motion.div>

        {/* Bento Box Feature Preview (Very subtle) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-24"
        >
          <div className="glass-panel rounded-3xl p-8 text-left flex flex-col items-start gap-4 h-64 relative overflow-hidden group">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mt-auto">Lightning fast setup</h3>
            <p className="text-pulse-text-muted">Create a stunning event page and start collecting RSVPs in less than 60 seconds.</p>
          </div>
          <div className="glass-panel rounded-3xl p-8 text-left flex flex-col items-start gap-4 h-64 relative overflow-hidden group">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mt-auto">Guest management</h3>
            <p className="text-pulse-text-muted">Approve guests, send updates, and check them in at the door seamlessly.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
