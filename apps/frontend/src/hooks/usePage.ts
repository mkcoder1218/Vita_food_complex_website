import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function usePage(slug: string) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await api.get(`/content/pages/${slug}`);
        setPage(response.data);
        setError(null);
      } catch (err) {
        // The public site has static/local fallbacks for page content. A local
        // dev session without the backend should therefore degrade quietly
        // instead of looking like an application failure in the browser.
        const code = (err as { code?: string } | null)?.code;
        if (code !== 'ERR_NETWORK') {
          console.error(`Failed to fetch page ${slug}:`, err);
        }
        setPage(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  return { page, loading, error };
}
