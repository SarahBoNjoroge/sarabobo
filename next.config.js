/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export entirely
  // output: 'export',  <-- DELETE THIS

  // Optional: trailing slash for Apache
  trailingSlash: true,

  // Disable experimental static-only features
  experimental: {
    optimizeCss: true
  },

  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
