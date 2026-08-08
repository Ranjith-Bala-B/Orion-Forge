// Centralized telemetry wrapper for Orion Forge
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event]: ${eventName}`, properties || {});
  }
  // Production analytics integration hook (Google Analytics, PostHog, Clarity)
};

export const trackPageView = (path: string) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics PageView]: ${path}`);
  }
};
