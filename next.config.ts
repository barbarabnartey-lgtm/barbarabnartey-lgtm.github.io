import type { NextConfig } from "next";

const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserSite =
  repositoryName?.toLowerCase() === `${repositoryOwner?.toLowerCase()}.github.io`;

const nextConfig: NextConfig = {
  output: "export",
  basePath:
    process.env.NEXT_PUBLIC_BASE_PATH ??
    (repositoryName && !isUserSite ? `/${repositoryName}` : undefined),
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
