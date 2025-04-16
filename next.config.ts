import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images.dzcdn.net',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' cdn-images.dzcdn.net; img-src 'self' img.example.com; style-src 'self';",
          }, // THIS IS THE ONE THAT PREVENTS XSS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          }, // THIS IS THE ONE THAT PREVENTS MIME SNIFFING
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          }, // THIS IS THE ONE THAT PREVENTS XSS
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          }, // THIS IS THE ONE THAT PREVENTS REFERRER LEAKAGE
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=()',
          }, // THIS IS THE ONE THAT DISABLES CAMERA AND MICROPHONE
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          }, // THIS IS THE ONE THAT ENABLES COEP
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          }, // THIS IS THE ONE THAT ENABLES COOP
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          }, // THIS IS THE ONE THAT ENABLES DNS PREFETCHING
        ],
      },
    ];
  },
};

export default nextConfig;
