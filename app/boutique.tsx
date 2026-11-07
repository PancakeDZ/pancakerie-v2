"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/*
  Ne pas supprimer : ces couleurs sont enregistrées dans Supabase.
  Les écrire ici permet à Tailwind de les générer.
  from-amber-100 to-rose-100
  from-yellow-100 to-rose-100
  from-pink-200 to-fuchsia-100
  from-rose-100 to-orange-100
  from-pink-200 to-red-100
  from-amber-200 to-orange-100
  from-slate-200 to-rose-100
  from-red-100 to-orange-100
  from-yellow-100 to-orange-100
*/

type Produit = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string | null;
  price: number;
  compare_at_price: number | null;
  emoji: string | null;
  color: string | null;
};

type Categorie = { id: string; name: string };
type Zone = {
  id: string;
  name: string;
  fee: number;
  min_order_amount: number | null;
};
type Variante = {
  id: string;
  product_id: string;
  name: string;
  price: number;
};
type PanierItem = { key: string; nom: string; prix: number; qty: number };

type Props = {
  produits: Produit[];
  categories: Categorie[];
  zones: Zone[];
  variantes: Variante[];
};

const TEL = "07.77.30.23.98";
const TEL_LINK = "33777302398";
const STORAGE_PANIER = "pancakerie_panier_v2";

export default function Boutique({
  produits,
  categories,
  zones,
  variantes,
}: Props) {
  const [cat, setCat] = useState("tous");
  const [panier, setPanier] = useState<PanierItem[]>([]);
  const [panierCharge, setPanierCharge] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    adresse: "",
    zoneId: zones[0]?.id ?? "",
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stocke = localStorage.getItem(STORAGE_PANIER);
        if (stocke) setPanier(JSON.parse(stocke));
      } catch {
        // Panier invalide : on repart de zéro.
      }
      setPanierCharge(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!panierCharge) return;
    localStorage.setItem(STORAGE_PANIER, JSON.stringify(panier));
  }, [panier, panierCharge]);

  const produitsFiltres = useMemo(
    () =>
      cat === "tous"
        ? produits
        : produits.filter((p) => p.category_id === cat),
    [cat, produits]
  );

  const nomCategorie = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  };

  const ajouter = (key: string, nom: string, prix: number) => {
    setPanier((current) => {
      const existant = current.find((item) => item.key === key);
      if (existant) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { key, nom, prix: Number(prix), qty: 1 }];
    });
    showToast(`${nom} ajouté ✅`);
  };

  const moins = (key: string) => {
    setPanier((current) =>
      current.flatMap((item) => {
        if (item.key !== key) return [item];
        return item.qty === 1 ? [] : [{ ...item, qty: item.qty - 1 }];
      })
    );
  };

  const plus = (key: string) => {
    setPanier((current) =>
      current.map((item) =>
        item.key === key ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const viderPanier = () => {
    if (window.confirm("Vider le panier ?")) {
      setPanier([]);
      setShowForm(false);
    }
  };

  const zone = zones.find((z) => z.id === form.zoneId);
  const total = panier.reduce((sum, item) => sum + item.prix * item.qty, 0);
  const frais = Number(zone?.fee ?? 0);
  const totalAvecLivraison = total + frais;
  const nbArticles = panier.reduce((sum, item) => sum + item.qty, 0);

  const validerCommande = () => {
    if (panier.length === 0) {
      window.alert("Le panier est vide.");
      return;
    }
    if (!form.nom || !form.tel || !form.adresse || !zone) {
      window.alert("Remplis nom, téléphone, adresse et ville.");
      return;
    }
    const minimum = Number(zone.min_order_amount ?? 0);
    if (minimum > 0 && total < minimum) {
      window.alert(
        `Commande minimum pour ${zone.name} : ${minimum.toFixed(2)}€`
      );
      return;
    }

    const detail = panier
      .map(
        (item) =>
          `• ${item.qty}x ${item.nom} (${(item.prix * item.qty).toFixed(2)}€)`
      )
      .join("\n");

    const message = [
      "Bonjour Pancakerie 🥞",
      "Je souhaite commander :",
      detail,
      "",
      `Sous-total : ${total.toFixed(2)}€`,
      `Livraison (${zone.name}) : ${
        frais === 0 ? "Gratuite" : `${frais.toFixed(2)}€`
      }`,
      `TOTAL : ${totalAvecLivraison.toFixed(2)}€`,
      "",
      `📍 ${form.adresse}, ${zone.name}`,
      `👤 ${form.nom} - ${form.tel}`,
    ].join("\n");

    window.open(
      `https://wa.me/${TEL_LINK}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF1F2] text-[#831843]">
      {toast && (
        <div className="fixed top-20 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-black px-6 py-2 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#FECDD3] bg-white/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2 text-xl font-black">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EC4899] text-white">
            P
          </span>
          PANCAKERIE
        </div>

        <a
          href="#panier"
          className="rounded-full bg-[#EC4899] px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-[#BE185D]"
        >
          🛒 {nbArticles} - {total.toFixed(2)}€
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8 text-center">
        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          <span className="text-[#D9A75E]">
            Pancakes • Gaufres • Milkshakes
          </span>{" "}
          <span className="text-[#EC4899]">faits maison</span>
        </h1>

        <p className="mt-3 text-lg font-medium text-[#BE185D]/70">
          Livraison rapide à Orléans et ses environs • Commande simple via
          WhatsApp
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative h-48 overflow-hidden rounded-3xl border border-[#FECDD3] shadow-sm">
            <img
              src="/pancake.jpg"
              alt="Pancakes"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-white px-3 py-1 text-xs font-black">
              🥞 PANCAKES
            </span>
          </div>

          <div className="relative h-48 overflow-hidden rounded-3xl border border-[#FECDD3] shadow-sm">
            <img
              src="/milkshake.jpg"
              alt="Milkshakes"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-white px-3 py-1 text-xs font-black">
              🥤 MILKSHAKES
            </span>
          </div>

          <div className="relative h-48 overflow-hidden rounded-3xl border border-[#FECDD3] shadow-sm">
            <img
              src="/boissonsfraiches.jpg"
              alt="Boissons"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-white px-3 py-1 text-xs font-black">
              🧃 BOISSONS FRAÎCHES
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {[{ id: "tous", name: "Tous" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                cat === c.id
                  ? "border-[#EC4899] bg-[#EC4899] text-white shadow"
                  : "border-[#FECDD3] bg-white text-[#BE185D] hover:bg-[#FFF1F2]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {produitsFiltres.map((p) => {
            const tailles = variantes.filter((v) => v.product_id === p.id);
            const prixMini = tailles.length
              ? Math.min(...tailles.map((v) => Number(v.price)))
              : Number(p.price);

            return (
              <div
                key={p.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-[#FECDD3] bg-white shadow-sm transition hover:shadow-md"
              >
                <div
                  className={`flex h-28 flex-col items-center justify-center bg-gradient-to-br ${
                    p.color ?? "from-rose-100 to-orange-100"
                  } p-4 text-center`}
                >
                  <span className="text-4xl">{p.emoji}</span>
                  <span className="mt-1 text-[10px] font-black tracking-widest opacity-60">
                    {nomCategorie(p.category_id).toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-black">
                    <Link href={`/produits/${p.slug}`}>{p.name}</Link>
                  </h3>

                  <p className="mt-1 text-xs text-[#BE185D]/60">
                    {p.description}
                  </p>

                  {p.ingredients && (
                    <p className="mt-2 rounded-xl border border-dashed border-[#FECDD3] bg-[#FFF1F2] p-2 text-[11px] leading-tight">
                      {p.ingredients}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-black text-[#BE185D]">
                      {tailles.length > 0 && (
                        <span className="text-xs font-normal">dès </span>
                      )}
                      {p.compare_at_price && (
                        <s className="mr-1 text-xs font-normal">
                          {Number(p.compare_at_price).toFixed(2)}€
                        </s>
                      )}
                      {prixMini.toFixed(2)}€
                    </span>

                    {tailles.length > 0 ? (
                      <div className="flex gap-1">
                        {tailles.map((v) => (
                          <button
                            key={v.id}
                            onClick={() =>
                              ajouter(
                                `${p.id}:${v.id}`,
                                `${p.name} ${v.name}`,
                                Number(v.price)
                              )
                            }
                            className="rounded-full bg-[#EC4899] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#BE185D]"
                          >
                            {v.name} {Number(v.price).toFixed(0)}€
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          ajouter(p.id, p.name, Number(p.price))
                        }
                        className="rounded-full bg-[#EC4899] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#BE185D]"
                      >
                        Ajouter +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {panier.length > 0 && (
          <div
            id="panier"
            className="mx-auto mt-10 max-w-xl scroll-mt-24 rounded-3xl border-2 border-[#EC4899] bg-white p-6 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-black">Récap ({nbArticles})</h3>

              <button
                onClick={viderPanier}
                className="rounded-full border bg-gray-100 px-3 py-1 text-xs font-bold hover:bg-red-100"
              >
                🗑️ Vider
              </button>
            </div>

            {panier.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between border-b border-dashed border-[#FECDD3] py-2"
              >
                <div>
                  <div className="text-sm font-bold">{item.nom}</div>
                  <div className="text-xs text-[#BE185D]">
                    {item.prix.toFixed(2)}€ x {item.qty}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moins(item.key)}
                    className="h-7 w-7 rounded-full border border-[#FECDD3] font-bold hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => plus(item.key)}
                    className="h-7 w-7 rounded-full bg-[#EC4899] font-bold text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black">
              <span>Total + livraison</span>
              <span>{totalAvecLivraison.toFixed(2)}€</span>
            </div>

            <p className="mt-1 text-center text-xs text-gray-500">
              {zone?.name} :{" "}
              {frais === 0
                ? "Livraison Gratuite"
                : `+ ${frais.toFixed(2)}€ de livraison`}
            </p>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 w-full rounded-full bg-[#EC4899] py-3 font-black text-white shadow hover:bg-[#BE185D]"
              >
                Commander
              </button>
            ) : (
              <div className="mt-4 space-y-2 rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] p-4">
                <input
                  placeholder="Nom et prénom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full rounded-full border border-[#FECDD3] bg-white px-4 py-2 text-sm"
                />
                <input
                  placeholder="Téléphone"
                  type="tel"
                  value={form.tel}
                  onChange={(e) => setForm({ ...form, tel: e.target.value })}
                  className="w-full rounded-full border border-[#FECDD3] bg-white px-4 py-2 text-sm"
                />
                <input
                  placeholder="Adresse complète"
                  value={form.adresse}
                  onChange={(e) =>
                    setForm({ ...form, adresse: e.target.value })
                  }
                  className="w-full rounded-full border border-[#FECDD3] bg-white px-4 py-2 text-sm"
                />
                <select
                  value={form.zoneId}
                  onChange={(e) =>
                    setForm({ ...form, zoneId: e.target.value })
                  }
                  className="w-full rounded-full border border-[#FECDD3] bg-white px-4 py-2 text-sm"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} -{" "}
                      {Number(z.fee) === 0
                        ? "Gratuit"
                        : `${Number(z.fee).toFixed(2)}€`}
                    </option>
                  ))}
                </select>

                <button
                  onClick={validerCommande}
                  className="w-full rounded-full bg-[#25D366] py-3 font-black text-white shadow hover:bg-[#1ebe5a]"
                >
                  Commander sur WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-[#FECDD3] bg-white py-8 text-center text-sm">
        <div className="font-black">PANCAKERIE • {TEL} • Orléans</div>
        <p className="mt-1 text-xs text-gray-500">
          Vente à domicile - Sur commande
        </p>
      </footer>
    </div>
  );
}