import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
        >
          <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#38BDF8]" />
              <span className="font-heading text-xs font-bold tracking-widest uppercase">
                {type === 'privacy' ? 'PRIVACY POLICY' : 'TERMS OF SERVICE'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-4 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
            {type === 'privacy' ? (
              <>
                <p className="font-semibold text-slate-800">Effective Date: January 1, 2026</p>
                <p>
                  Orion Forge ("Lab", "we", "us") respects your privacy. This policy outlines our telemetry and communication data handling practices when visiting our public web platform.
                </p>
                <h4 className="font-heading text-sm font-bold text-slate-900 mt-4">1. Information We Collect</h4>
                <p>We collect contact details voluntarily submitted via our contact form (Name, Email, Phone, Message) strictly to process your inquiry.</p>
                <h4 className="font-heading text-sm font-bold text-slate-900 mt-4">2. Data Security & Storage</h4>
                <p>All communication forms are protected using industry-standard transport security. We do not sell or lease user data to third parties.</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">Effective Date: January 1, 2026</p>
                <p>
                  By accessing Orion Forge's public platform, you agree to comply with the following operational terms and conditions.
                </p>
                <h4 className="font-heading text-sm font-bold text-slate-900 mt-4">1. Intellectual Property</h4>
                <p>All brand logos, proprietary AI system descriptions, and media belong exclusively to Orion Forge.</p>
                <h4 className="font-heading text-sm font-bold text-slate-900 mt-4">2. Open Source Code</h4>
                <p>Open-source repositories linked via GitHub are governed by their respective licenses (MIT, Apache 2.0).</p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
