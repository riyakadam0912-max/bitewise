import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Vercel runs Next.js on Node, where Cloudflare's virtual module does not
      // exist. The shim lets the marketing site build while getDb() continues
      // to reject API calls that require an actual D1 binding.
      "cloudflare:workers": "./lib/vercel-cloudflare-workers-shim.ts",
    },
  },
};

export default nextConfig;
