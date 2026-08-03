"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface SiteSettings {
  siteName: { en: string; am: string };
  analytics: { ga4Id: string };
  socialLinks: { 
    facebook?: string; 
    instagram?: string; 
    linkedin?: string; 
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setSettings(data);
      })
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
