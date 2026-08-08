import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatedSection } from './AnimatedSection';
import { submitContactForm, ContactFormPayload } from '../services/contact';
import { SOCIAL_LINKS } from '../constants/social';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormPayload>({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const response = await submitContactForm(formData);
    setLoading(false);

    if (response.success) {


      setStatus({ type: 'success', message: response.message });
      setFormData({ fullName: '', phone: '', email: '', message: '' });

      // Trigger Confetti Burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5B3DF5', '#38BDF8', '#4A2CE2'],
      });
    } else {
      setStatus({ type: 'error', message: response.message });
    }
  };

  return (
    <AnimatedSection id="contact" className="py-24 bg-[#FAFBFC] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-4">
            GET IN TOUCH
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Let’s Build Something <span className="text-[#5B3DF5]">Together</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Have a project, research proposal, or technical inquiry? Dispatch a direct message to our innovation engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col justify-between min-h-[440px] relative overflow-hidden">
            {/* Background Glow Orbs */}
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[#5B3DF5]/30 blur-3xl" />
            <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-[#38BDF8]/20 blur-3xl" />

            <div className="relative z-10">
              <span className="text-xs font-extrabold text-[#38BDF8] uppercase tracking-wider mb-2 block">
                DIRECT COMMUNICATION
              </span>
              <h3 className="font-heading text-2xl font-bold text-white mb-6">
                Orion Forge Innovation Hub
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                We collaborate with research labs, AI startups, defense organizations, and tech founders building edge intelligence.
              </p>

              <div className="space-y-6 text-sm text-slate-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#38BDF8]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Target Dispatch</span>
                    <a href={`mailto:${SOCIAL_LINKS.EMAIL}`} className="font-semibold text-white hover:underline">
                      {SOCIAL_LINKS.EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#5B3DF5]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Engineering Line</span>
                    <span className="font-semibold text-white">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#38BDF8]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">HQ Location</span>
                    <span className="font-semibold text-white">Innovation Campus, Tech Ridge</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-4 w-4 text-[#38BDF8]" />
              <span>Responses dispatched within 24 operational hours.</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ranjith Bala"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#5B3DF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#5B3DF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#5B3DF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your project, inquiry, or collaboration goals..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#5B3DF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 transition-all resize-none"
                />
              </div>

              {/* Status Alert Banner */}
              <AnimatePresence>
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                      status.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] py-4 text-sm font-bold text-white shadow-[0_8px_25px_rgba(91,61,245,0.3)] hover:shadow-[0_12px_30px_rgba(56,189,248,0.4)] active:scale-98 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Dispatching Message...</span>
                  </span>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </AnimatedSection>
  );
};
