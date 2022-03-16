module.exports = {
  images: {
    domains: ['product.hstatic.net', 'st4.depositphotos.com', 'res.cloudinary.com'],
  },
  env: {
    HOST: "https://edu-management-be.herokuapp.com/",
    API_BASE_URL: "https://localhost:44323/",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}