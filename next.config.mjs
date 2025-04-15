/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ethic.es',
      'sarten-backend.onrender.com'  // También agregamos el dominio del backend por si acaso
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
