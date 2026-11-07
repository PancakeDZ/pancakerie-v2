import type { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

const SITE = 'https://pank-vercel.vercel.app' // à remplacer par ton domaine

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('slug')

  return [
    { url: SITE, lastModified: new Date() },
    ...(products ?? []).map((p) => ({
      url: `${SITE}/produits/${p.slug}`,
      lastModified: new Date(),
    })),
  ]
}