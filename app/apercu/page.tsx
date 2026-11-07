"use client";

import { useMemo, useState } from "react";

type Produit = {
  id: number;
  nom: string;
  prix: number;
  prixXL?: number;
  cat: string;
  desc: string;
  ingredients: string;
  emoji: string;
  image?: string;
  tone: string;
};

const PRODUITS: Produit[] = [
  {
    id: 1,
    nom: "10 Pancakes",
    prix: 5,
    cat: "Pancakes",
    desc: "Une pause douce et généreuse",
    ingredients: "Pâte maison · 1 coulis et 1 topping inclus",
    emoji: "🥞",
    image: "/pancakes-petite.jpg",
    tone: "from-amber-100 to-rose-100",
  },
  {
    id: 2,
    nom: "20 Pancakes",
    prix: 10,
    cat: "Pancakes",
    desc: "À partager… ou pas !",
    ingredients: "Pâte maison · Idéal à partager",
    emoji: "🥞",
    image: "/pancakes-grande.jpg",
    tone: "from-amber-100 to-rose-100",
  },
  {
    id: 3,
    nom: "2 Gaufres",
    prix: 6,
    cat: "Gaufres",
    desc: "Dorées et croustillantes",
    ingredients: "Pâte à gaufre maison · 1 coulis et 1 topping",
    emoji: "🧇",
    image: "/gaufres-2.jpg",
    tone: "from-yellow-100 to-rose-100",
  },
  {
    id: 4,
    nom: "4 Gaufres",
    prix: 11,
    cat: "Gaufres",
    desc: "Encore plus de gourmandise",
    ingredients: "Pâte à gaufre maison · À partager",
    emoji: "🧇",
    image: "/gaufres-4.jpg",
    tone: "from-yellow-100 to-rose-100",
  },
   {
    id: 10,
    nom: "Candy Fruits Petite",
    prix: 10,
    cat: "Candy Fruits",
    desc: "Une touche fruitée et originale",
    ingredients: "Fruits frais enrobés · Litchi · Barbe à papa",
    emoji: "🍇",
    image: "/candy-fruits-petite.jpg",
    tone: "from-pink-200 to-fuchsia-100",
  },
  {
    id: 11,
    nom: "Candy Fruits Grande",
    prix: 15,
    cat: "Candy Fruits",
    desc: "Le format généreux",
    ingredients: "Fruits frais enrobés · Litchi · Barbe à papa",
    emoji: "🍬",
    image: "/candy-fruits-grande.jpg",
    tone: "from-pink-200 to-fuchsia-100",
  },
  {
    id: 20,
    nom: "Milkshake Vanille",
    prix: 5,
    prixXL: 8,
    cat: "Milkshake",
    desc: "Doux, frais et onctueux",
    ingredients: "Lait frais · Glace vanille · Chantilly",
    emoji: "🥤",
    image: "/milkshake-vanille.jpg",
    tone: "from-rose-100 to-orange-100",
  },
  {
    id: 21,
    nom: "Milkshake Fraise",
    prix: 5,
    prixXL: 8,
    cat: "Milkshake",
    desc: "Une note fruitée et fraîche",
    ingredients: "Lait frais · Fraises · Glace vanille",
    emoji: "🍓",
    image: "/milkshake-fraise.jpg",
    tone: "from-pink-200 to-red-100",
  },
  {
    id: 22,
    nom: "Milkshake Kinder Bueno",
    prix: 5,
    prixXL: 8,
    cat: "Milkshake",
    desc: "Le plaisir ultra gourmand",
    ingredients: "Lait · Glace · Kinder Bueno · Sauce chocolat",
    emoji: "🍯",
    image: "/milkshake-kinder-bueno.jpg",
    tone: "from-amber-200 to-orange-100",
  },
  {
    id: 23,
    nom: "Milkshake Oreo",
    prix: 5,
    prixXL: 8,
    cat: "Milkshake",
    desc: "Le classique des gourmands",
    ingredients: "Lait · Glace · Biscuits Oreo · Chantilly",
    emoji: "🍦",
    image: "/milkshake-oreo.jpg",
    tone: "from-slate-200 to-rose-100",
  },
  {
    id: 30,
    nom: "Coca-Cola 33cl",
    prix: 1.5,
    cat: "Boissons",
    desc: "À déguster bien frais",
    ingredients: "Canette 33 cl",
    emoji: "🥤",
    image: "/coca-cola-33cl.jpg",
    tone: "from-red-100 to-orange-100",
  },
  {
    id: 31,
    nom: "Oasis Tropical 33cl",
    prix: 1.5,
    cat: "Boissons",
    desc: "Une pause fraîcheur",
    ingredients: "Canette 33 cl",
    emoji: "🍹",
    image: "/oasis-tropical-33cl.jpg",
    tone: "from-yellow-100 to-orange-100",
  },
];

const CATEGORIES = ["Tous", "Pancakes", "Gaufres", "Candy Fruits", "Milkshake", "Boissons"];

const TARIFS_LIVRAISON: Record<string, number> = {
  "Saint-Jean-de-la-Ruelle": 0,
  "Fleury-les-Aubrais": 2,
  "Orléans (Centre-Ville)": 2,
  "Ingré": 2,
  "La Chapelle-Saint-Mesmin": 2,
  "Saran": 2,
  "Olivet": 3,
  "Chécy": 5,
};

type LignePanier = { nom: string; prix: number; quantite: number };

export default function ApercuPage() {
   const [categorie, setCategorie] = useState("Tous");
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [villeLivraison, setVilleLivraison] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [telephoneClient, setTelephoneClient] = useState("");
  const [adresseClient, setAdresseClient] = useState("");

  const produitsFiltres = useMemo(
    () => (categorie === "Tous" ? PRODUITS : PRODUITS.filter((p) => p.cat === categorie)),
    [categorie]
  );

  const nombreArticles = panier.reduce((total, ligne) => total + ligne.quantite, 0);
  const total = panier.reduce((sum, ligne) => sum + ligne.prix * ligne.quantite, 0);

  const fraisLivraison =
    villeLivraison !== "" ? TARIFS_LIVRAISON[villeLivraison] : null;
  const totalAvecLivraison = total + (fraisLivraison ?? 0);

  function ajouter(nom: string, prix: number) {
    setPanier((courant) => {
      const existe = courant.find((ligne) => ligne.nom === nom);
      if (existe) {
        return courant.map((ligne) =>
          ligne.nom === nom ? { ...ligne, quantite: ligne.quantite + 1 } : ligne
        );
      }
      return [...courant, { nom, prix, quantite: 1 }];
    });
  }

    function modifierQuantite(nom: string, variation: number) {
    setPanier((courant) =>
      courant
        .map((ligne) =>
          ligne.nom === nom
            ? { ...ligne, quantite: ligne.quantite + variation }
            : ligne
        )
        .filter((ligne) => ligne.quantite > 0)
    );
  }

  function commanderWhatsApp() {
    if (
      panier.length === 0 ||
      !nomClient.trim() ||
      !telephoneClient.trim() ||
      !adresseClient.trim() ||
      !villeLivraison
    ) {
      alert("Merci de remplir vos coordonnées et de vérifier votre panier.");
      return;
    }

    const detailsProduits = panier
      .map(
        (ligne) =>
          `- ${ligne.quantite} x ${ligne.nom} : ${(ligne.prix * ligne.quantite).toFixed(2).replace(".", ",")} €`
      )
      .join("\n");

    const message = `Bonjour Pancakerie,

Nom : ${nomClient.trim()}
Téléphone : ${telephoneClient.trim()}
Adresse : ${adresseClient.trim()}
Ville : ${villeLivraison}

Commande :
${detailsProduits}

Sous-total : ${total.toFixed(2).replace(".", ",")} €
Livraison : ${(fraisLivraison ?? 0).toFixed(2).replace(".", ",")} €
TOTAL : ${totalAvecLivraison.toFixed(2).replace(".", ",")} €

Merci de confirmer ma commande.`;

    const url = `https://wa.me/33777302398?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }


return (

    <main className="min-h-screen bg-[#fff9fb] text-[#422333]">
      <div className="bg-[#8f315d] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        Une envie de douceur ? Faites-vous plaisir · Livraison à Orléans et alentours
      </div>

 
   <header className="sticky top-0 z-40 border-b border-[#f3dce6] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#accueil" className="flex items-center gap-3" aria-label="Pancakerie, accueil">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7dce8] text-2xl shadow-sm">🥞</span>
            <span>
              <span className="block text-lg font-black tracking-[0.12em] text-[#8f315d]">PANCAKERIE</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b77b96]">Le bonheur est fait maison</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#795568] md:flex">
            <a className="transition hover:text-[#c34e82]" href="#carte">La carte</a>
            <a className="transition hover:text-[#c34e82]" href="#engagements">Notre univers</a>
            <a className="transition hover:text-[#c34e82]" href="#infos">Livraison</a>
          </nav>

          <button
            onClick={() => setPanierOuvert((ouvert) => !ouvert)}
            className="rounded-full bg-[#a83f70] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-[#873057]"
          >
            <span aria-hidden="true">♡</span> <span className="ml-1">Mon panier ({nombreArticles})</span>
          </button>
        </div>
      </header>

      <section id="accueil" className="relative overflow-hidden">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#f9e0eb] blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#fbe9d9] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f0cbdc] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a83f70] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#d77ca3]" /> Douceurs préparées avec amour
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-[#54283f] sm:text-5xl lg:text-6xl">
              Une pause
              <span className="block font-serif font-medium italic text-[#c45d8c]">délicieusement</span>
              <span className="block">gourmande.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#806477] sm:text-lg">
              Pancakes moelleux, gaufres dorées et milkshakes onctueux… Retrouvez vos douceurs préférées, préparées à la commande.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#carte" className="inline-flex items-center justify-center rounded-full bg-[#a83f70] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-[#873057]">
                Découvrir la carte <span className="ml-3">→</span>
              </a>
              <a href="#infos" className="inline-flex items-center justify-center rounded-full border border-[#e9c7d7] bg-white/80 px-7 py-4 text-sm font-bold text-[#8f315d] transition hover:bg-[#fff0f6]">
                Informations livraison
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-[#936f83]">
              <span>♡ Préparé à la commande</span>
              <span>✦ Recettes gourmandes</span>
              <span>⌖ Orléans & alentours</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-[#f4d8e5]" />
            <div className="relative overflow-hidden rounded-[2.2rem] border-[7px] border-white bg-white shadow-2xl shadow-[#b96b8c]/20">
              <img src="/pancake.jpg" alt="Pancakes gourmands" className="h-[340px] w-full object-cover sm:h-[440px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3f2032]/75 via-[#3f2032]/20 to-transparent p-6 pt-20 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-100">La gourmandise à partager</p>
                <p className="mt-1 font-serif text-3xl italic">Fait maison, avec le cœur.</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[#f2d7e3] bg-white px-5 py-4 shadow-xl">
              <span className="block text-xs font-semibold text-[#9b7187]">À partir de</span>
              <span className="text-2xl font-black text-[#a83f70]">5 €</span>
            </div>
            <div className="absolute -right-3 -top-5 flex h-20 w-20 rotate-12 items-center justify-center rounded-full bg-[#f4d4e2] text-center text-xs font-black leading-tight text-[#8f315d] shadow-lg">
              100%<br />plaisir
            </div>
          </div>
        </div>
      </section>

      <section id="engagements" className="border-y border-[#f3e2e9] bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f6] text-xl">🥞</span>
            <span><strong className="block text-sm text-[#63364e]">Fait maison</strong><span className="text-xs text-[#9b7c8e]">Des douceurs préparées avec soin</span></span>
          </div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f6] text-xl">♡</span>
            <span><strong className="block text-sm text-[#63364e]">Généreux & gourmands</strong><span className="text-xs text-[#9b7c8e]">Des recettes pour se faire plaisir</span></span>
          </div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f6] text-xl">⌖</span>
            <span><strong className="block text-sm text-[#63364e]">Livraison locale</strong><span className="text-xs text-[#9b7c8e]">Orléans et communes voisines</span></span>
          </div>
        </div>
      </section>

      <section id="carte" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#bd6b91]">Notre sélection</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#54283f] sm:text-5xl">La carte des douceurs</h2>
          <p className="mt-4 text-sm leading-7 text-[#8b7181] sm:text-base">Choisissez votre envie du moment et composez votre petit moment de bonheur.</p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategorie(item)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
                categorie === item
                  ? "bg-[#a83f70] text-white shadow-md shadow-pink-200"
                  : "border border-[#ecd5df] bg-white text-[#8f6078] hover:border-[#d99ab6] hover:bg-[#fff0f6]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produitsFiltres.map((produit) => (
            <article key={produit.id} className="group overflow-hidden rounded-[1.6rem] border border-[#f0dce5] bg-white shadow-[0_8px_30px_rgba(108,54,82,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(108,54,82,0.12)]">
              <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${produit.tone}`}>
                {produit.image ? (
                  <img src={produit.image} alt={produit.nom} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-7xl drop-shadow-sm">{produit.emoji}</span>
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#96506f] shadow-sm">
                  {produit.cat}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-extrabold text-[#54283f]">{produit.nom}</h3>
                <p className="mt-1 text-xs font-medium text-[#b06f8d]">{produit.desc}</p>
                <p className="mt-3 min-h-10 text-xs leading-5 text-[#907888]">{produit.ingredients}</p>
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#f4e7ed] pt-4">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#aa8a9b]">À partir de</span>
                    <span className="text-xl font-black text-[#9c3d6a]">{produit.prix.toFixed(2).replace(".", ",")} €</span>
                    {produit.prixXL !== undefined && <span className="ml-1 text-[10px] font-semibold text-[#9b7c8e]">/ XL {produit.prixXL} €</span>}
                  </div>
                  {produit.prixXL !== undefined ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => ajouter(produit.nom, produit.prix)} className="rounded-full bg-[#f8e3ec] px-3 py-2 text-xs font-bold text-[#963c68] transition hover:bg-[#f1cddd]">S</button>
                      <button onClick={() => ajouter(`${produit.nom} XL`, produit.prixXL!)} className="rounded-full bg-[#a83f70] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#873057]">XL</button>
                    </div>
                  ) : (
                    <button onClick={() => ajouter(produit.nom, produit.prix)} className="rounded-full bg-[#a83f70] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#873057]">
                      Ajouter +
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {panier.length > 0 && (
          <div id="panier" className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#e9c9d8] bg-white p-6 shadow-xl shadow-pink-100">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold text-[#54283f]">Votre sélection</h3>
              <button onClick={() => setPanierOuvert((ouvert) => !ouvert)} className="text-xs font-bold text-[#a83f70]">{panierOuvert ? "Masquer" : "Afficher"}</button>
            </div>
            {panierOuvert && (
              <>
                <div className="mt-5 rounded-2xl bg-[#fff7fa] p-4">
                  <label
                    htmlFor="ville-livraison"
                    className="mb-2 block text-sm font-bold text-[#68465a]"
                  >
                    📍 Choisir ma ville de livraison
                  </label>
                  <select
                    id="ville-livraison"
                    value={villeLivraison}
                    onChange={(event) => setVilleLivraison(event.target.value)}
className="w-full rounded-xl border border-[#e9c9d8] bg-white px-4 py-3 text-sm text-[#68465a] outline-none focus:border-[#a83f70]"                  >
                    <option value="">Sélectionner une ville</option>
                    {Object.entries(TARIFS_LIVRAISON).map(([ville, tarif]) => (
                      <option key={ville} value={ville}>
                        {ville} — {tarif === 0 ? "Gratuit" : `${tarif.toFixed(2).replace(".", ",")} €`}
                      </option>
                    ))}
                  </select>
                </div>
<div className="mt-4 space-y-3 rounded-2xl bg-[#fff7fa] p-4">
  <h4 className="font-bold text-[#68465a]">Vos coordonnées</h4>

  <input
    type="text"
    value={nomClient}
    onChange={(event) => setNomClient(event.target.value)}
    placeholder="Nom et prénom"
    className="w-full rounded-xl border border-[#e9c9d8] bg-white px-4 py-3 text-sm outline-none focus:border-[#a83f70]"
  />

  <input
    type="tel"
    value={telephoneClient}
    onChange={(event) => setTelephoneClient(event.target.value)}
    placeholder="Numéro de téléphone"
    className="w-full rounded-xl border border-[#e9c9d8] bg-white px-4 py-3 text-sm outline-none focus:border-[#a83f70]"
  />

  <textarea
    value={adresseClient}
    onChange={(event) => setAdresseClient(event.target.value)}
    placeholder="Adresse complète de livraison"
    rows={2}
    className="w-full rounded-xl border border-[#e9c9d8] bg-white px-4 py-3 text-sm outline-none focus:border-[#a83f70]"
  />
</div>
                <div className="mt-4 space-y-3">
               
  {panier.map((ligne) => (
    <div
      key={ligne.nom}
      className="flex items-center justify-between gap-3 border-b border-dashed border-[#efdce5] pb-3 text-sm"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#68465a]">{ligne.nom}</p>
        <p className="text-xs text-[#967b8c]">
          {(ligne.prix * ligne.quantite).toFixed(2).replace(".", ",")} €
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => modifierQuantite(ligne.nom, -1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e9c9d8] bg-white font-bold text-[#a83f70] hover:bg-[#f8e8ef]"
          aria-label={`Retirer une unité de ${ligne.nom}`}
        >
          −
        </button>

        <span className="min-w-5 text-center font-bold text-[#68465a]">
          {ligne.quantite}
        </span>

        <button
          type="button"
          onClick={() => modifierQuantite(ligne.nom, 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e9c9d8] bg-white font-bold text-[#a83f70] hover:bg-[#f8e8ef]"
          aria-label={`Ajouter une unité de ${ligne.nom}`}
        >
          +
        </button>
      </div>
    </div>
  ))}
</div>
                
                <div className="mt-5 space-y-3 border-t border-[#efdce5] pt-4">
                  <div className="flex justify-between text-sm text-[#806477]">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2).replace(".", ",")} €</span>
                  </div>

                  <div className="flex justify-between text-sm text-[#806477]">
                    <span>Livraison</span>
                    <span>
                      {fraisLivraison === null
                        ? "À sélectionner"
                        : fraisLivraison === 0
                          ? "Gratuite"
                          : `${fraisLivraison.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#efdce5] pt-3 text-lg font-black text-[#54283f]">
                    <span>{villeLivraison ? "Total avec livraison" : "Total provisoire"}</span>
                    <span>
                      {villeLivraison
                        ? `${totalAvecLivraison.toFixed(2).replace(".", ",")} €`
                        : `${total.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>

                  {!villeLivraison && (
                    <p className="text-xs text-[#b06f8d]">
<p className="mt-5 text-[10px] text-pink-100/60">
  Commandes par WhatsApp · Pancakerie Orléans
</p>                    </p>
                  )}
                </div>
<button
  type="button"
  onClick={commanderWhatsApp}
  className="mt-5 w-full rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#1eae54]"
>
  Commander sur WhatsApp
</button>

<p className="mt-3 text-center text-xs leading-5 text-[#967b8c]">
  Vérifiez votre commande dans WhatsApp puis appuyez sur Envoyer.
Aucun paiement en ligne n&apos;est effectué sur cette page.</p>              </>
            )}
          </div>
        )}
      </section>

      <section id="infos" className="bg-[#f8e8ef]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ad5c82]">Un petit plaisir près de chez vous</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#54283f] sm:text-4xl">On s’occupe de la douceur,<br className="hidden sm:block" /> vous profitez du moment.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#806477]">Livraison proposée à Orléans et dans plusieurs communes voisines. Les frais sont indiqués au moment de la commande.</p>
          </div>
          <a href="#carte" className="inline-flex items-center justify-center rounded-full bg-[#a83f70] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-[#873057]">Voir les gourmandises <span className="ml-3">→</span></a>
        </div>
      </section>

      <footer className="bg-[#54283f] px-4 py-9 text-center text-white">
        <div className="font-black tracking-[0.16em]">PANCAKERIE</div>
        <p className="mt-2 text-xs text-pink-100/80">Pancakes · Gaufres · Milkshakes · Orléans</p>
        <p className="mt-5 text-[10px] text-pink-100/60">Maquette de prévisualisation — les commandes et paiements ne sont pas activés ici.</p>
      </footer>

      {nombreArticles > 0 && (
        <button
          onClick={() => {
            setPanierOuvert(true);
            document.getElementById("panier")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-[#a83f70] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-pink-300 transition hover:bg-[#873057]"
        >
          Voir le panier · {totalAvecLivraison.toFixed(2).replace(".", ",")} €{fraisLivraison === null ? " + livraison" : ""}
        </button>
      )}
    </main>
  );
}