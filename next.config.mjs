/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Esportazione statica: l'app gira interamente nel browser, quindi puo'
  // essere servita gratis da Cloudflare (banda illimitata, nessuna funzione).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
