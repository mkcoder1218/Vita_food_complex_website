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
      } catch (err) {
        console.error(`Failed to fetch page ${slug}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  return { page, loading, error };
}
