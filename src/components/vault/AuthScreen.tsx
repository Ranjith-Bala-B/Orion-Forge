import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

import video1Url from '../../../video/video1.mp4';
import video2Url from '../../../video/video2.mp4';
import video3Url from '../../../video/video3.mp4';

interface AuthScreenProps {
  onLogin: (password: string, rememberDevice: boolean) => boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'denied' | 'granted'>('idle');
  const [shake, setShake] = useState(false);

  const video1Ref = React.useRef<HTMLVideoElement>(null);
  const video2Ref = React.useRef<HTMLVideoElement>(null);
  const video3Ref = React.useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2 | 3>(1);

  React.useEffect(() => {
    if (authStatus === 'idle') {
      setActiveVideo(1);
      video1Ref.current?.play().catch(() => {});
      if (video2Ref.current) {
        video2Ref.current.pause();
        video2Ref.current.currentTime = 0;
      }
      if (video3Ref.current) {
        video3Ref.current.pause();
        video3Ref.current.currentTime = 0;
      }
    }
  }, [authStatus]);

  const handleUnlock = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Unlock button clicked");
    
    const success = authService.verifyPassword(password);
    console.log("Password validation result:", success);

    if (success) {
      setAuthStatus('granted');
      setActiveVideo(2);
      video1Ref.current?.pause();
      
      const video2 = video2Ref.current;
      if (video2) {
        console.log("Starting video2 with audio");
        video2.pause();
        video2.currentTime = 0;
        video2.muted = false;
        video2.volume = 1;
        console.log("video2 muted:", video2.muted);
        requestAnimationFrame(() => {
          video2.play().catch((error) => {
            console.error("video2 playback error:", error);
          });
        });
      }
    } else {
      setAuthStatus('denied');
      setActiveVideo(3);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      video1Ref.current?.pause();
      
      const video3 = video3Ref.current;
      if (video3) {
        console.log("Starting video3 with audio");
        video3.pause();
        video3.currentTime = 0;
        video3.muted = false;
        video3.volume = 1;
        console.log("video3 muted:", video3.muted);
        requestAnimationFrame(() => {
          video3.play().catch((error) => {
            console.error("video3 playback error:", error);
          });
        });
      }
    }
  };

  return (
    <div className="min-h-[85vh] pt-28 pb-20 bg-[#FAFBFC] text-slate-900 relative overflow-hidden flex items-center justify-end pr-24 md:pr-36 lg:pr-52">
      {/* Background Videos */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={video1Ref}
          src={video1Url}
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: 'brightness(1.25) saturate(1.05)' }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${activeVideo === 1 ? 'opacity-100' : 'opacity-0'}`}
        />
        <video
          ref={video2Ref}
          src={video2Url}
          playsInline
          onEnded={() => {
            onLogin(password, false);
          }}
          onError={() => {
            onLogin(password, false);
          }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${activeVideo === 2 ? 'opacity-100' : 'opacity-0'}`}
        />
        <video
          ref={video3Ref}
          src={video3Url}
          playsInline
          onEnded={() => {
            setActiveVideo(1);
            video1Ref.current?.play().catch(() => {});
          }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${activeVideo === 3 ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Removed overlay to maintain maximum video brightness */}
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-[#5B3DF5]/30 blur-3xl opacity-60 animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[#38BDF8]/20 blur-3xl opacity-50 pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-6 pointer-events-auto"
      >
        {/* Glass Box Container */}
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white/70 backdrop-blur-2xl border border-slate-200/50 p-8 shadow-[0_20px_50px_rgba(91,61,245,0.1)]"
        >
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(91,61,245,0.5)]">
              <Lock className="h-8 w-8" />
            </div>

            <span className="text-[11px] font-extrabold tracking-widest text-[#38BDF8] uppercase mb-1">
              ORION FORGE OS
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-slate-900">
              Forge Vault Access
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter authorization key to unlock internal workspace
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {authStatus === 'idle' && (
              <>
                <div>
                  <label htmlFor="vault-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Vault Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      id="vault-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUnlock(e as any);
                        }
                      }}
                      placeholder="Enter vault password"
                      className="w-full rounded-xl bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-3 text-sm font-medium placeholder-slate-400 focus:border-[#5B3DF5] focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="group w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] py-3.5 text-sm font-bold text-white shadow-[0_4px_25px_rgba(91,61,245,0.4)] hover:shadow-[0_6px_30px_rgba(56,189,248,0.6)] active:scale-98 transition-all pointer-events-auto"
                >
                  <span>Unlock Vault</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}

            {authStatus === 'denied' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-3 bg-red-50/80 border border-red-200 rounded-2xl p-6 text-center"
              >
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-1 text-red-500 shadow-sm">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-red-600 uppercase tracking-widest">Access Denied</h3>
                <p className="text-xs text-red-500 font-medium mb-1">ILLEGAL ENTRY</p>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Forge Security Protocol Active</p>
                <p className="text-xs text-red-500 font-medium mb-1">Unauthorized Forge Member Detected.<br/>Entry Restricted.</p>
                
                <button
                  type="button"
                  onClick={() => {
                    setAuthStatus('idle');
                    setPassword('');
                  }}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md active:scale-98"
                >
                  Enter password
                </button>
              </motion.div>
            )}

            {authStatus === 'granted' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2 text-emerald-500 shadow-sm">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-emerald-600 uppercase tracking-widest">Access Granted</h3>
                <p className="text-sm font-bold text-emerald-500">Welcome to Forge Vault</p>
                <p className="text-sm font-bold text-emerald-500">Welcome back, Forge Member</p>
              </motion.div>
            )}
          </div>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Encrypted Session • Orion Forge Master Control</span>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};
