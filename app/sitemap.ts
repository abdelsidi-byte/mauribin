import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mauribin.vercel.app';
  const now = new Date();
  
  return [
    { url: base, lastModified: now, changeFrequency: 'always', priority: 1 },
    { url: `${base}/news`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/standings`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/matches`, lastModified: now, changeFrequency: 'always', priority: 0.8 },
  ];
}