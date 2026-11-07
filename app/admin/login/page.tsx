'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/browser'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const seConnecter = async (e: React.FormEvent) => {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setChargement(false)
    if (error) {
      setErreur('E-mail ou mot de passe incorrect.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="mx-auto mt-24 max-w-sm rounded-3xl border border-[#FECDD3] bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-black text-[#831843]">Connexion admin</h1>
      <form onSubmit={seConnecter} className="space-y-3">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-[#FECDD3] px-4 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full border border-[#FECDD3] px-4 py-2 text-sm"
          required
        />
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-full bg-[#EC4899] py-2 font-black text-white disabled:opacity-60"
        >
          {chargement ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}