/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return []
    return [{ source: "/backend-api/:path*", destination: "http://localhost:3001/:path*" }]
  },
}

export default nextConfig
