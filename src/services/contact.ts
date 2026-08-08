import { ApiResponse, simulatedDelay } from './api';
import { SOCIAL_LINKS } from '../constants/social';

export interface ContactFormPayload {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export const submitContactForm = async (
  payload: ContactFormPayload
): Promise<ApiResponse<{ recipient: string; timestamp: string }>> => {
  // Simulate network latency for /api/contact backend endpoint
  await simulatedDelay(1000);

  // Validation check
  if (!payload.fullName || !payload.email || !payload.message) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
      error: 'VALIDATION_ERROR',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
      error: 'INVALID_EMAIL',
    };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: '71f71b95-42cc-41f0-b324-232dc141b2b6',
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone || 'Not Provided',
        message: payload.message,
        subject: `Orion Forge Inquiry from ${payload.fullName}`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: `Thank you, ${payload.fullName}! Your message has been dispatched to Orion Forge.`,
        data: {
          recipient: 'orionforge@googlegroups.com',
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: 'There was an issue sending your message. Please try again later.',
        error: 'API_ERROR',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: 'NETWORK_ERROR',
    };
  }
};
