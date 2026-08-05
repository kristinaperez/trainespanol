const isDevelopment = process.env.NODE_ENV === "development"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isDevelopment ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isDevelopment
    ? {
        async rewrites() {
          return [{ source: "/backend-api/:path*", destination: "http://localhost:3001/:path*" }]
        },
      }
    : {}),
}

export default nextConfig
