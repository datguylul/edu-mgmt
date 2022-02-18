module.exports = {
  images: {
    domains: ['product.hstatic.net', 'st4.depositphotos.com', 'res.cloudinary.com'],
  },
  env: {
    API_BASE_URL: "https://doanmta2022.herokuapp.com/ratruong/",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}