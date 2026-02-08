import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Movie DB',
    short_name: 'MovieDB',
    description: 'Your personal movie database tracker',
    start_url: '/',
    display: 'standalone', // This is the magic setting that hides the browser bar
    background_color: '#030712', // Matches bg-gray-950
    theme_color: '#030712',
    icons: [
      {
        src: '/apple-icon.png', // Ensure you have this icon in your public folder!
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}