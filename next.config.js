module.exports = {
  images: {
    domains: ['product.hstatic.net', 'st4.depositphotos.com'],
  },
  env: {
    API_BASE_URL: "https://salemodel.somee.com/api/",
    API_LOCAL: "https://localhost:44335/api/",
    REALTIME_LOCAL: "http://localhost:5000",
    REALTIME_BASE_URL: "https://cnw-realtime.herokuapp.com",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}