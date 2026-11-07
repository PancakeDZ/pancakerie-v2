'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/browser'

const STATUT_ACTIF = 'active'
const STATUT_MASQUE = 'draft'

type Produit = {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  status: string
}
type Variante = {
  id: string
  product_id: string
  name: string
  price: number
  is_active: boolean
}
type Zone = {
  id: string
  name: string
  fee: number
  min_order_amount: number | null
  is_active: boolean
}

const nombre = (texte: string): number | null => {
  const n = Number(texte.replace(',', '.'))
  return texte.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null
}

export function BoutonDeconnexion() {
  const router = useRouter()
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut()
        router.push('/admin/login')
        router.refresh()
      }}
      className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-bold text-white"
    >
      Se déconnecter
    </button>
  )
}

export default function AdminPanel(props: {
  produits: Produit[]
  variantes: Variante[]
  zones: Zone[]
}) {
  const supabase = createClient()
  const [message, setMessage] = useState('')

  const [prods, setProds] = useState(
    (props.produits ?? []).map((p) => ({
      ...p,
      prix: String(p.price),
      promo: p.compare_at_price == null ? '' : String(p.compare_at_price),
    }))
  )

  const [vars, setVars] = useState(
    (props.variantes ?? []).map((v) => ({
      ...v,
      prix: String(v.price),
    }))
  )

  const [lieux, setLieux] = useState(
    (props.zones ?? []).map((z) => ({
      ...z,
      frais: String(z.fee),
      minimum: z.min_order_amount == null ? '' : String(z.min_order_amount),
    }))
  )

  const sauver = async (
    table: 'products' | 'product_variants' | 'delivery_zones',
    id: string,
    valeurs: Record<string, unknown>,
    libelle: string
  ) => {
    const { data, error } = await supabase
      .from(table)
      .update(valeurs)
      .eq('id', id)
      .select('id')
    if (error) setMessage(`❌ ${libelle} : ${error.message}`)
    else if (!data || data.length === 0)
      setMessage(`❌ ${libelle} : non enregistré (droits insuffisants ?)`)
    else setMessage(`✅ ${libelle} enregistré`)
  }

  const champ = 'w-24 rounded border border-[#FECDD3] px-2 py-1 text-sm'
  const bouton =
    'rounded-full bg-[#EC4899] px-3 py-1 text-xs font-bold text-white hover:bg-[#BE185D]'

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6 text-[#831843]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Administration</h1>
        <BoutonDeconnexion />
      </div>

      {message && (
        <p className="sticky top-2 z-10 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
          {message}
        </p>
      )}

      <section>
        <h2 className="mb-2 text-lg font-black">Produits</h2>
        <p className="mb-3 text-xs text-gray-500">
          Prix barré : laisse vide pour ne pas en afficher. Décoche « Visible »
          pour masquer un produit (rupture).
        </p>
        <div className="space-y-2">
          {prods.map((p, i) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[#FECDD3] bg-white p-3"
            >
              <span className="min-w-40 flex-1 text-sm font-bold">{p.name}</span>
              <label className="text-xs">
                Prix €{' '}
                <input
                  className={champ}
                  value={p.prix}
                  onChange={(e) =>
                    setProds(prods.map((x, j) => (j === i ? { ...x, prix: e.target.value } : x)))
                  }
                />
              </label>
              <label className="text-xs">
                Prix barré €{' '}
                <input
                  className={champ}
                  value={p.promo}
                  onChange={(e) =>
                    setProds(prods.map((x, j) => (j === i ? { ...x, promo: e.target.value } : x)))
                  }
                />
              </label>
              <label className="text-xs">
                <input
                  type="checkbox"
                  checked={p.status === STATUT_ACTIF}
                  onChange={(e) =>
                    setProds(
                      prods.map((x, j) =>
                        j === i
                          ? { ...x, status: e.target.checked ? STATUT_ACTIF : STATUT_MASQUE }
                          : x
                      )
                    )
                  }
                />{' '}
                Visible
              </label>
              <button
                className={bouton}
                onClick={() => {
                  const prix = nombre(p.prix)
                  const promo = p.promo.trim() === '' ? null : nombre(p.promo)
                  if (prix === null || (p.promo.trim() !== '' && promo === null)) {
                    setMessage('❌ Prix invalide')
                    return
                  }
                  sauver(
                    'products',
                    p.id,
                    { price: prix, compare_at_price: promo, status: p.status },
                    p.name
                  )
                }}
              >
                Enregistrer
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-black">Tailles (S / XL)</h2>
        <div className="space-y-2">
          {vars.map((v, i) => {
            const produit = props.produits.find((p) => p.id === v.product_id)
            return (
              <div
                key={v.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-[#FECDD3] bg-white p-3"
              >
                <span className="min-w-40 flex-1 text-sm font-bold">
                  {produit?.name} — {v.name}
                </span>
                <label className="text-xs">
                  Prix €{' '}
                  <input
                    className={champ}
                    value={v.prix}
                    onChange={(e) =>
                      setVars(vars.map((x, j) => (j === i ? { ...x, prix: e.target.value } : x)))
                    }
                  />
                </label>
                <label className="text-xs">
                  <input
                    type="checkbox"
                    checked={v.is_active}
                    onChange={(e) =>
                      setVars(vars.map((x, j) => (j === i ? { ...x, is_active: e.target.checked } : x)))
                    }
                  />{' '}
                  Actif
                </label>
                <button
                  className={bouton}
                  onClick={() => {
                    const prix = nombre(v.prix)
                    if (prix === null) {
                      setMessage('❌ Prix invalide')
                      return
                    }
                    sauver(
                      'product_variants',
                      v.id,
                      { price: prix, is_active: v.is_active },
                      `${produit?.name} ${v.name}`
                    )
                  }}
                >
                  Enregistrer
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-black">Frais de livraison</h2>
        <div className="space-y-2">
          {lieux.map((z, i) => (
            <div
              key={z.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[#FECDD3] bg-white p-3"
            >
              <span className="min-w-40 flex-1 text-sm font-bold">{z.name}</span>
              <label className="text-xs">
                Frais €{' '}
                <input
                  className={champ}
                  value={z.frais}
                  onChange={(e) =>
                    setLieux(lieux.map((x, j) => (j === i ? { ...x, frais: e.target.value } : x)))
                  }
                />
              </label>
              <label className="text-xs">
                Minimum €{' '}
                <input
                  className={champ}
                  value={z.minimum}
                  onChange={(e) =>
                    setLieux(lieux.map((x, j) => (j === i ? { ...x, minimum: e.target.value } : x)))
                  }
                />
              </label>
              <label className="text-xs">
                <input
                  type="checkbox"
                  checked={z.is_active}
                  onChange={(e) =>
                    setLieux(lieux.map((x, j) => (j === i ? { ...x, is_active: e.target.checked } : x)))
                  }
                />{' '}
                Active
              </label>
              <button
                className={bouton}
                onClick={() => {
                  const frais = nombre(z.frais)
                  const minimum = z.minimum.trim() === '' ? null : nombre(z.minimum)
                  if (frais === null || (z.minimum.trim() !== '' && minimum === null)) {
                    setMessage('❌ Montant invalide')
                    return
                  }
                  sauver(
                    'delivery_zones',
                    z.id,
                    { fee: frais, min_order_amount: minimum, is_active: z.is_active },
                    z.name
                  )
                }}
              >
                Enregistrer
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}