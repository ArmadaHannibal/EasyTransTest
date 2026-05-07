/** @type {import('next').NextConfig} */
const nextConfig = {
  // SUPPRIMER output: 'export' - C'est la cause du problème
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dtrpkegss/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["maps.googleapis.com"],
    formats: ["image/webp", "image/avif"],
    // SUPPRIMER unoptimized: true
  },
};

module.exports = nextConfig;
