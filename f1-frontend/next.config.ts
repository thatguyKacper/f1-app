import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  /* Base path for my Kubernetes cluster, ignore in local development
  basePath: '/kubernetes/f1',*/
}

export default nextConfig
