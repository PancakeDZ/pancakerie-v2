import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const p = await getProduct(slug)
  if (!p) return {}
  const prix = Number(p.price).toFixed(2).replace('.', ',')
  return {
    title: `${p.name} – ${prix} € | Ma boutique`,
    description: `${p.description}. ${p.ingredients ?? ''}`.slice(0, 155),
  }
}

export default async function Produit({ params }: Props) {
  const { slug } = await params
  const p = await getProduct(slug)
  if (!p) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: `${p.description}. ${p.ingredients ?? ''}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: p.price,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <main>
      <h1>{p.emoji} {p.name}</h1>
      <p>{p.description}</p>
      <p>{p.ingredients}</p>
      <p>
        {p.compare_at_price && <s>{p.compare_at_price} €</s>} {p.price} €
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}