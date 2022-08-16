/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'help.twitter.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'randomuser.me',
      'firebasestorage.googleapis.com',
      'cdn.cms-twdigitalassets.com'
    ]
  }
}

module.exports = nextConfig
