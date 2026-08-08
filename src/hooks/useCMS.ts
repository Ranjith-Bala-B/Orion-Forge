import { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import { CMSData } from '../types/cms';

export function useCMS() {
  const [data, setData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    cmsService.getCMSData().then((cmsData) => {
      if (mounted) {
        setData(cmsData);
        setLoading(false);
      }
    });
    
    const handleUpdate = () => {
      cmsService.getCMSData().then((cmsData) => {
        if (mounted) setData(cmsData);
      });
    };
    
    window.addEventListener('cms_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('cms_updated', handleUpdate);
    };
  }, []);

  return { data, loading };
}
