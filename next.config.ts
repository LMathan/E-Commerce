import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Uploadthing
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Supabase storage
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Dev placeholder images
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect /home to /
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Experimental features
  experimental: {
    // serverComponentsExternalPackages: ["pino"],
  },
};

export default nextConfig;
