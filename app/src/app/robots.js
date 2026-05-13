export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/cart/',
        '/checkout/',
        '/profile/',
        '/orders/',
        '/login/',
        '/signup/',
        '/success/',
        '/cancel/'
      ],
    },
    sitemap: 'https://sikbeauty.com/sitemap.xml',
  }
}
