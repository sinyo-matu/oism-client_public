const { i18n } = require("./next-i18next.config.js");
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  images: {
    domains: ["https://d2vg6jg1lu9m12.cloudfront.net"],
    deviceSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
  async rewrites() {
    let rewrites = [];
    if (process.env.NODE_ENV === "development") {
      rewrites.push({
        source: "/api/:path*",
        destination: `http://localhost:24463/api/:path*`, // Proxy to Backend
      });
    }
    return rewrites;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: [
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
