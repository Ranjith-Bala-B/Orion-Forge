import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Orion Forge — Forging Ideas. Building Intelligent Solutions.',
  description = 'An elite Innovation Lab focused on Artificial Intelligence, Software Development, Research, and Emerging Technologies.',
  image = 'https://orionforge.ai/og-image.png',
  url = 'https://orionforge.ai/',
}) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description, image, url]);

  return null;
};
