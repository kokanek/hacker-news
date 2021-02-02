module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/news',
        permanent: true,
      },
    ]
  },
}