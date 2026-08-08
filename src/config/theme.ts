export const theme = {
  colors: {
    background: '#FAFBFC',
    card: '#FFFFFF',
    primary: {
      default: '#5B3DF5',
      hover: '#4A2CE2',
      light: '#EEEAFF',
      gradient: 'linear-gradient(135deg, #5B3DF5 0%, #38BDF8 100%)',
    },
    accent: {
      default: '#38BDF8',
      hover: '#0EA5E9',
      light: '#E0F2FE',
    },
    text: {
      main: '#111827',
      muted: '#64748B',
      subtle: '#94A3B8',
    },
    border: '#E5E7EB',
  },
  radii: {
    card: '24px',
    nav: '999px',
    button: '999px',
    input: '16px',
  },
  shadows: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
    cardHover: '0 20px 40px -15px rgba(91, 61, 245, 0.15)',
    glass: '0 8px 32px 0 rgba(91, 61, 245, 0.08)',
    glow: '0 0 25px rgba(56, 189, 248, 0.35)',
    indigoGlow: '0 0 35px rgba(91, 61, 245, 0.3)',
  },
  animations: {
    duration: {
      fast: 0.25,
      normal: 0.35,
      slow: 0.45,
      page: 0.5,
    },
    ease: [0.25, 0.1, 0.25, 1.0],
  },
  breakpoints: {
    mobile: 390,
    tablet: 768,
    laptop: 1280,
    desktop: 1440,
  },
};

export type Theme = typeof theme;
