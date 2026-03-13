import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Force HTTPS for 2 years, include subdomains, allow preloading
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Prevent clickjacking
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent MIME-type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable browser features not used by this app
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Content Security Policy (Advanced):
    // - style-src-elem: Controls <style> tags. We allow only self and Google Fonts.
    // - style-src-attr: Controls style="..." attributes. React needs 'unsafe-inline' here for dynamic variables.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      ...(process.env.NODE_ENV === "development"
        ? ["script-src 'self' 'unsafe-inline' 'unsafe-eval'"]
        : ["script-src 'self' 'unsafe-inline'"]),
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com", 
      "style-src-attr 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Fallback for older browsers
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://raw.githubusercontent.com",
      "connect-src 'self'",
      "media-src 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

export default nextConfig;
