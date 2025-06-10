import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // --- images 설정 추가 시작 ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // 만약 다른 외부 이미지 호스트가 있다면 여기에 추가
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-cdn.com',
      //   port: '',
      //   pathname: '/path/to/images/**',
      // },
    ],
  },
  // --- images 설정 추가 끝 ---

  async rewrites() {
    return [
      {
        source: '/api/:path*',       // 프론트에서 /api/* 로 요청하면
        destination: 'http://localhost:8080/:path*' // 백엔드로 프록시
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;