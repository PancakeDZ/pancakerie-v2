import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminPanel, { BoutonDeconnexion } from './admin-panel'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: estAdmin } = await supabase.rpc('is_admin')
  if (!estAdmin) {
    return (
      <main className="mx-auto mt-24 max-w-sm rounded-3xl border bg-white p-6 text-center">
        <p className="mb-4 font-bold">Accès refusé : ce compte n&apos;est pas administrateur.</p>
        <BoutonDeconnexion />
      </main>
    )
  }

  const [produits, variantes, zones] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, compare_at_price, status, sort_order')
      .order('sort_order'),
    supabase
      .from('product_variants')
      .select('id, product_id, name, price, is_active, sort_order')
      .order('sort_order'),
    supabase
      .from('delivery_zones')
      .select('id, name, fee, min_order_amount, is_active')
      .order('fee')
      .order('name'),
  ])

  console.log('DIAGNOSTIC ADMIN', {
    estAdmin,
    produits: produits.error?.message,
    nbProduits: produits.data?.length,
    variantes: variantes.error?.message,
    nbVariantes: variantes.data?.length,
    zones: zones.error?.message,
    nbZones: zones.data?.length,
  })

  return (
    <AdminPanel
      produits={produits.data ?? []}
      variantes={variantes.data ?? []}
      zones={zones.data ?? []}
    />
  )
}