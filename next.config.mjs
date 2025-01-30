/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "fal.media",
      "v3.fal.media",
    ],
  },
};

export default nextConfig;
