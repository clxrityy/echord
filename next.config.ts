import type { NextConfig } from 'next';
import createMdx from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  // rewrites: async () => {
  //   return [
  //     {
  //       source: '/tos',
  //       destination: '/terms',
  //     },
  //     {
  //       source: '/user/:path',
  //       destination: '/profile/:path',
  //     },

  //   ]
  // },
  output:
    process.env.DEPLOYMENT_ENVIRONMENT === 'docker' ? 'standalone' : undefined,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images.dzcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'echord.uk',
      },
    ],
  },
  compiler: {
    reactRemoveProperties: true,
    styledComponents: {
      ssr: true,
      minify: true,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // {
          //   key: 'Content-Security-Policy',
          //   value:
          //     "default-src 'self'; script-src 'self' cdn-images.dzcdn.net; style-src 'self';",
          // }, // THIS IS THE ONE THAT PREVENTS XSS
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
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
            // THIS IS THE ONE THAT ENABLES GZIP COMPRESSION (https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/?utm_source=lighthouse&utm_medium=devtools)
          },
        ],
      },
    ];
  },
  compress: true,
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
};

const withMdx = createMdx({
  extension: /\.(md|mdx)$/,
});

export default withMdx(nextConfig);
