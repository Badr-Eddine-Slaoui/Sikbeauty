export default function manifest() {
  return {
    name: 'Sikbeauty',
    short_name: 'Sikbeauty',
    description: 'Discover premium skincare and beauty products at Sikbeauty.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#B5483A',
    icons: [
      {
        src: '/Pictures/SI-K-Beauty-logo.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/Pictures/SI-K-Beauty-logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/og-image.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
      }
    ],
  }
}
