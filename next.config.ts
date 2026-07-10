import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/advocacia-especializada-em-direito-condominial",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-condominial",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-imobiliario",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-imobiliario",
        permanent: true,
      },
      {
        source: "/especialistas-em-recuperacao-de-credito",
        destination: "/areas-de-atuacao/especialistas-em-recuperacao-de-credito",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-trabalhista",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-trabalhista",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-civil",
        destination: "/areas-de-atuacao/advocacia-especializada-em-direito-civil",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-tributario",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-tributario",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-publico",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-publico",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-previdenciario",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-previdenciario",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-em-direito-bancario",
        destination:
          "/areas-de-atuacao/advocacia-especializada-em-direito-bancario",
        permanent: true,
      },
      {
        source: "/advocacia-especializada-no-setor-agro",
        destination: "/areas-de-atuacao/advocacia-especializada-no-setor-agro",
        permanent: true,
      },
      {
        source: "/informativos/:path*",
        destination: "/publicacoes",
        permanent: false,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/api/informativos/**/*": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },
  reactCompiler: true,
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
