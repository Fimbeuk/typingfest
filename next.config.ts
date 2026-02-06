import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Désactiver la collecte de données statiques pour les routes API pendant le build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
