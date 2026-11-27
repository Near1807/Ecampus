# E-CAMpus — Documentation du frontend

Guide pour retrouver chaque fichier et chaque component du frontend, comprendre ce qu'il fait et le modifier facilement.

> **Emplacement conseillé dans le repo** : `Ecampus/Ecampus-Frontend/docs/ARCHITECTURE-FRONTEND.md`

---

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Lancer le projet](#2-lancer-le-projet)
3. [Arborescence](#3-arborescence)
4. [Flux de données](#4-flux-de-données)
5. [Types et données](#5-types-et-données)
6. [Thème (`theme/tokens.ts`)](#6-thème-themetokensts)
7. [Components UI](#7-components-ui)
8. [Les cartes (templates)](#8-les-cartes-templates)
9. [Placement automatique sur la grille (`layout/`)](#9-placement-automatique-sur-la-grille-layout)
10. [Components de layout](#10-components-de-layout)
11. [Pages](#11-pages)
12. [CSS global et responsive](#12-css-global-et-responsive)
13. [Recettes : comment modifier X](#13-recettes--comment-modifier-x)
14. [Lien avec le backend et la base](#14-lien-avec-le-backend-et-la-base)
15. [Ce qui a été fait (historique)](#15-ce-qui-a-été-fait-historique)
16. [Limites connues et à faire](#16-limites-connues-et-à-faire)
17. [Dépannage](#17-dépannage)

---

## 1. Vue d'ensemble

E-CAMpus est un **tableau d'affichage en liège** pour l'ECAM. Les annonces sont des « papiers » épinglés (punaises, scotch, étiquettes, polaroïds…) dont la taille traduit l'importance.

Il existe **deux pages** :

| Page | Fichier | Quand |
|---|---|---|
| Desktop : en-tête, filtres, grand tableau de 6 colonnes | `pages/BoardPage.tsx` | fenêtre > 640 px |
| Mobile : carrousel de 5 panneaux, navigation basse | `pages/MobileBoardPage.tsx` | fenêtre ≤ 640 px |

**Principe clé : une annonce = des données, un template = un composant.**

- Une annonce (`Annonce`) est un objet typé, miroir de la table `annonces`.
- Son `templateId` (ou `templateCode`) désigne **un composant carte** (`components/cards/`).
- Un **slot** (emplacement) dit **où** et **à quelle taille** la carte s'affiche. Les slots sont **calculés automatiquement** par `layout/` : l'algorithme remplit la grille en partant toujours du coin haut gauche, en essayant plusieurs formes par annonce tant qu'il reste de la place.

Technologies : React 19, TypeScript, Vite. Le style est en **styles inline** (objets `style={{…}}`), sans bibliothèque CSS. Les polices viennent de Google Fonts.

---

## 2. Lancer le projet

```bash
cd Ecampus/Ecampus-Frontend
npm install        # une seule fois
npm run dev        # http://localhost:5173
npm run build      # vérifie TypeScript + construit dist/
```

- La version mobile s'affiche quand la fenêtre fait **640 px ou moins** (ou via le mode appareil des outils de développement, F12 puis Ctrl+Shift+M).
- Sans réglage, l'app utilise les **données de démo** (`data/mockAnnonces.ts`) : le backend n'est pas nécessaire.
- Pour brancher le backend : créer `Ecampus-Frontend/.env.local` avec `VITE_USE_MOCK=false` (voir [§14](#14-lien-avec-le-backend-et-la-base)).

---

## 3. Arborescence

```
Ecampus-Frontend/
├── index.html                       # lang="fr", titre, viewport-fit=cover
└── src/
    ├── main.tsx                     # point d'entrée React
    ├── App.tsx                      # choisit desktop / mobile + réglages thème
    ├── index.css                    # polices, reset, media queries du tableau
    │
    ├── assets/
    │   └── veste-en-jean.jpg        # photo de l'annonce « veste en jean »
    │
    ├── theme/
    │   └── tokens.ts                # polices, couleurs, punaises, liège, helpers
    │
    ├── types/
    │   └── annonce.ts               # type Annonce + enums (miroir du backend)
    │
    ├── data/
    │   └── mockAnnonces.ts          # 12 annonces de démonstration
    │
    ├── api/
    │   └── annonces.ts              # fetchAnnonces() : mock ou GET /api/annonces
    │
    ├── hooks/
    │   ├── useAnnonces.ts           # charge les annonces (loading / error)
    │   └── useIsMobile.ts           # true si largeur ≤ breakpoint
    │
    ├── utils/
    │   └── date.ts                  # formatDateLong / formatDateShort
    │
    ├── config/
    │   └── categories.ts            # filtres de la barre (desktop)
    │
    ├── layout/                      # PLACEMENT AUTOMATIQUE sur la grille
    │   ├── packGrid.ts              # algorithme de remplissage (sans React)
    │   ├── shapes.ts                # formes possibles par priorité / par template
    │   ├── board.ts                 # layoutDesktop() et layoutMobile()
    │   └── slot.ts                  # type Slot + inclinaison stable (tiltFor)
    │
    ├── components/
    │   ├── BoardItem.tsx            # place une annonce sur la grille
    │   ├── EmptySlot.tsx            # « Place libre » (mobile, placée par l'algorithme)
    │   ├── ui/                      # briques visuelles
    │   │   ├── Pin.tsx              # punaise
    │   │   ├── Tape.tsx             # scotch
    │   │   ├── Tag.tsx              # étiquette de catégorie
    │   │   ├── Rings.tsx            # cercles décoratifs « À la une »
    │   │   └── icons.tsx            # icônes SVG
    │   ├── layout/
    │   │   ├── TopBar.tsx           # barre du haut (desktop)
    │   │   ├── FilterBar.tsx        # date + filtres + légende (desktop)
    │   │   ├── MobileHeader.tsx     # en-tête mobile
    │   │   ├── MobilePanel.tsx      # un panneau du carrousel
    │   │   └── MobileNav.tsx        # barre de navigation basse (mobile)
    │   └── cards/                   # UN FICHIER PAR TEMPLATE
    │       ├── types.ts             # CardProps + kickerOf()
    │       ├── registry.ts          # code de template → composant
    │       ├── AfficheUne.tsx
    │       ├── AppelProjet.tsx
    │       ├── JournalUne.tsx
    │       ├── Breve.tsx
    │       ├── Etiquette.tsx
    │       ├── PostIt.tsx
    │       ├── Polaroid.tsx
    │       ├── AfficheCreme.tsx
    │       ├── AfficheAccent.tsx
    │       ├── AfficheSombre.tsx
    │       ├── FeuilleQuadrillee.tsx
    │       └── NoteJournal.tsx
    │
    └── pages/
        ├── BoardPage.tsx            # page desktop
        └── MobileBoardPage.tsx      # page mobile

supabase/migrations/
└── 20261120120000_seed_templates.sql  # insère les 12 codes de templates
```

**Où aller selon ce que tu veux changer ?**

| Je veux changer… | Fichier |
|---|---|
| Le texte / les infos d'une annonce de démo | `data/mockAnnonces.ts` |
| L'apparence d'un type de carte | `components/cards/<Nom>.tsx` |
| Les tailles (formes) possibles d'une annonce | `layout/shapes.ts` |
| Quelles annonces vont dans quel panneau mobile | `layout/board.ts` (`PANEL_RULES`) |
| La logique de remplissage elle-même | `layout/packGrid.ts` |
| Une autre disposition du tableau | `App.tsx` (`LAYOUT_SEED`) |
| L'amplitude de l'inclinaison | `layout/slot.ts` (`tiltFor`) |
| Les couleurs, polices, fond de liège | `theme/tokens.ts` |
| La couleur d'accent (rouge) | `App.tsx` (`ACCENT`) |
| Les filtres de catégories | `config/categories.ts` |
| L'en-tête / la barre de navigation | `components/layout/*` |
| Les points de rupture responsive | `index.css` + `App.tsx` |

---

## 4. Flux de données

```
 mockAnnonces.ts ─┐                       ┌─ BoardPage (desktop)
                  ├─▶ api/annonces.ts ─▶ useAnnonces ─▶ App ─┤
 GET /api/annonces┘   (VITE_USE_MOCK)                        └─ MobileBoardPage (mobile)
                                                                   │
      layout/board.ts + packGrid.ts ──▶ calcule les emplacements   │
                                                                   ▼
                              BoardItem  (position, inclinaison, atténuation)
                                   │
                                   ▼
                    registry.ts : templateCode / templateId ──▶ composant carte
                                   │
                                   ▼
              <Carte annonce accent density variant />   (cards/*.tsx)
```

1. `App` appelle `useAnnonces()` qui appelle `fetchAnnonces()`.
2. `App` choisit la page selon `useIsMobile(640)`.
3. La page appelle `layoutDesktop()` / `layoutMobile()` (dossier `layout/`) qui calculent les **slots** ; pour chacun, elle retrouve l'annonce par son `id`.
4. `BoardItem` place l'annonce sur la grille et demande à `resolveCard()` le bon composant.
5. La carte reçoit `annonce`, `accent`, `density` et `variant`.

---

## 5. Types et données

### 5.1 `types/annonce.ts`

| Type | Rôle |
|---|---|
| `Categorie` | Valeurs de l'enum Java `Categorie` : `OBJET_TROUVE`, `OBJET_A_DONNER`, `EVENEMENT`, `APPEL_A_PROJET`, `PUBLICITE`, `ANNONCE_ADMINISTRATION` |
| `CategorieAffichage` | `Categorie` **+ `'JOURNAL'`** (n'existe pas encore côté backend, voir [§16](#16-limites-connues-et-à-faire)) |
| `NiveauPriorite` | `STANDARD`, `HAUTE_PRIORITE`, `A_LA_UNE` |
| `ValidationStatus` | `EN_ATTENTE`, `VALIDE`, `DECLINE` |
| `AnnonceDetails` | Champs d'affichage propres aux templates (voir ci-dessous) |
| `Annonce` | L'annonce complète |

**`Annonce`**

| Champ | Type | Origine |
|---|---|---|
| `id` | `string` | colonne `id` (UUID) |
| `categorie` | `CategorieAffichage` | `categorie` |
| `titre` | `string` | `titre` |
| `descriptionCourte` | `string \| null` | `description_courte` |
| `descriptionLongue` | `string` | `description_longue` |
| `niveauPriorite` | `NiveauPriorite` | `niveau_priorite` |
| `validationStatus` | `ValidationStatus` | `validation_status` |
| `templateId` | `number` | `template_id` (0 = STANDARD) |
| `templateCode` | `string?` | **optionnel** : code du template si l'API le renvoie (prioritaire sur `templateId`) |
| `createdAt`, `expiresAt`, `eventDate` | `string` | `created_at`, `expires_at`, `event_date` |
| `details` | `AnnonceDetails?` | **côté front uniquement** (n'existe pas en base) |

**`AnnonceDetails`** — champs optionnels utilisés par les cartes :

| Champ | Exemple | Sert à |
|---|---|---|
| `kicker` | `Événement · Cercle informatique` | étiquette complète (desktop) |
| `kickerCourt` | `Événement` | étiquette courte (mobile) |
| `sousTitre` | `48 heures` | 2ᵉ ligne du titre, en contour (AfficheUne) |
| `accroche` | `48 heures · ouvert à tous` | ligne d'accroche (AfficheUne `minimal`) |
| `ref` | `Réf. AP-26-04` | référence d'appel à projets |
| `numero`, `edition`, `editionCourte`, `rubrique` | `N° 12`, `Octobre 2026`, `Oct. 2026`, `Journal étudiant` | bandeau du journal |
| `etiquette` | `Journal` | tag du journal |
| `dateBig`, `dateLabel`, `dateShort` | `07–08`, `Novembre 2026`, `nov.` | blocs de date |
| `horaire`, `lieu`, `lieuCourt`, `quand` | `12 h 30`, `Auditoire principal`, `Auditoire`, `lundi` | heure et lieu |
| `deadline`, `deadlineYear` | `30.11`, `2026` | date limite (appel à projets) |
| `ctaLabel`, `ctaLabelCourt`, `ctaHref` | `S'inscrire →`, `#` | bouton / lien |
| `signature` | `Publié par le Bureau des étudiants` | signature |
| `intervenant` | `Avec […]` | conférencier |
| `note` | `À récupérer à l'accueil` | note en bas de carte |
| `tags` | `['Java','React']` | pastilles |
| `imageUrl`, `imageAlt` | | photo (Polaroid) |

### 5.2 `data/mockAnnonces.ts`

12 annonces de démonstration qui reprennent la maquette. Chaque annonce a un `id` lisible (sert de clé pour retrouver l'annonce depuis un slot).

| `id` | Catégorie | Priorité | Template (id → code) |
|---|---|---|---|
| `hackathon` | EVENEMENT | A_LA_UNE | 1 → `AFFICHE_UNE` |
| `appel-campus` | APPEL_A_PROJET | HAUTE_PRIORITE | 2 → `APPEL_PROJET` |
| `journal-robotique` | JOURNAL | HAUTE_PRIORITE | 3 → `JOURNAL_UNE` |
| `breve-bibliotheque` | JOURNAL | STANDARD | 4 → `BREVE` |
| `calculatrice` | OBJET_TROUVE | STANDARD | 5 → `ETIQUETTE` |
| `cle-usb` | OBJET_TROUVE | STANDARD | 6 → `POST_IT` |
| `veste-jean` | OBJET_TROUVE | STANDARD | 7 → `POLAROID` |
| `afterwork` | EVENEMENT | HAUTE_PRIORITE | 8 → `AFFICHE_CREME` |
| `collecte-sang` | EVENEMENT | HAUTE_PRIORITE | 9 → `AFFICHE_ACCENT` |
| `conference-ia` | EVENEMENT | HAUTE_PRIORITE | 10 → `AFFICHE_SOMBRE` |
| `appel-domotique` | APPEL_A_PROJET | HAUTE_PRIORITE | 11 → `FEUILLE_QUADRILLEE` |
| `journal-recrute` | JOURNAL | STANDARD | 12 → `NOTE_JOURNAL` |

### 5.3 `api/annonces.ts`

```ts
fetchAnnonces(signal?) : Promise<Annonce[]>
```
- Si `VITE_USE_MOCK !== 'false'` → renvoie `MOCK_ANNONCES`.
- Sinon → `GET /api/annonces`, puis ne garde que les annonces `validationStatus === 'VALIDE'`.

### 5.4 Hooks

| Hook | Retour | Détail |
|---|---|---|
| `useAnnonces()` | `{ annonces, loading, error }` | Charge au montage, annule la requête au démontage |
| `useIsMobile(breakpoint = 640)` | `boolean` | Écoute `resize` ; `true` si `window.innerWidth <= breakpoint` |

### 5.5 `utils/date.ts`

- `formatDateLong()` → « Vendredi 20 novembre 2026 » (desktop)
- `formatDateShort()` → « Ven. 20 novembre 2026 » (mobile)

La date affichée est celle du jour (la maquette avait une date fixe).

---

## 6. Thème (`theme/tokens.ts`)

| Export | Contenu |
|---|---|
| `ANTON`, `FRAUNCES`, `MONO` | Familles de polices (titres affiche / texte serif / texte mono) |
| `CREAM` | `#FFF4E2`, blanc cassé |
| `DEFAULT_ACCENT` | `#CC3D1C`, rouge d'accent |
| `PINS` | Dégradés des punaises : `white`, `gold`, `red`, `green`, `blue`, `dark` |
| `PinColor` | Type des clés de `PINS` |
| `CORK` | Style du fond en liège |
| `gridBlue(size, alpha?)` | Papier millimétré bleu (taille de maille en px) |
| `ruledPaper(offset)` | Feuille à lignes (décalage vertical en px) |
| `Density` | `'lg' \| 'md' \| 'sm'` (voir ci-dessous) |
| `pick(d, lg, md, sm?)` | Choisit une valeur selon la densité ; `sm` retombe sur `md` si absent |

### La notion de **densité**

Une même carte s'affiche à trois tailles :

| Densité | Où | Exemple |
|---|---|---|
| `lg` | Tableau desktop | grande carte avec tous les détails |
| `md` | Carrousel mobile, carte pleine largeur | version resserrée |
| `sm` | Carrousel mobile, carte demi-largeur | version minimale |

Dans chaque carte, tu verras `const lg = density === 'lg'` et des ternaires du type `lg ? 52 : 38` : le premier chiffre est la valeur desktop, le second la valeur mobile. `pick(density, a, b, c)` fait la même chose pour trois valeurs.

---

## 7. Components UI

Petites briques réutilisées par les cartes. Dossier `components/ui/`.

### `Pin` — punaise
```tsx
<Pin color="gold" left={30} />
```
| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `color` | `PinColor` | `'white'` | couleur de la punaise |
| `left` / `right` | `number` | centrée | décalage en px depuis le bord |
| `top` | `number` | `-8` | position verticale |

La carte parente doit être en `position: relative`.

### `Tape` — scotch
```tsx
<Tape w={86} h={26} rotate={-7} top={-12} left={22} />
<Tape center w={80} h={24} rotate={-3} />
```
| Prop | Rôle |
|---|---|
| `w`, `h` | largeur, hauteur (px) |
| `rotate` | rotation en degrés |
| `top` | défaut `-10` |
| `left` / `right` | décalage ; `center` centre horizontalement |
| `bg` | couleur de fond du scotch |

### `Tag` — étiquette de catégorie
```tsx
<Tag fontSize={11} padding="4px 8px" border="1px solid #fff">Événement</Tag>
```
Props : `fontSize`, `padding`, `border?`, `color?`, `alignSelf?` (`'flex-start'`).

### `Rings` — cercles décoratifs
```tsx
<Rings big={[160, 440]} mid={[96, 312]} small={[34, 188]} />
```
Chaque tuple est `[décalage, taille]` en px, ancré en bas à droite. Utilisé uniquement par `AfficheUne`.

### `icons.tsx` — icônes SVG
Toutes acceptent `size?` et `strokeWidth?` et prennent la couleur du texte (`currentColor`).

`SearchIcon`, `PlusIcon`, `UserIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `BoardIcon`, `DocIcon`, `ShieldIcon`, `BloodDropIcon`.

Pour ajouter une icône : copier une des icônes existantes dans `icons.tsx` et changer les `<path>`.

---

## 8. Les cartes (templates)

Dossier `components/cards/`. **Un fichier = un template.**

### 8.1 Contrat commun (`cards/types.ts`)

```ts
interface CardProps {
  annonce: Annonce        // les données
  accent: string          // couleur d'accent (rouge par défaut)
  density: 'lg'|'md'|'sm' // taille d'affichage
  variant?: string        // variante propre à certains templates
}

kickerOf(annonce, density)  // étiquette complète en lg, courte sinon
```

Règles que respectent toutes les cartes :
- la racine est un `<article>` (ou un `<div>` pour Etiquette/Polaroid) avec `flex: '1 1 auto'` pour **remplir la case de la grille** ;
- `position: 'relative'` pour que punaises et scotch se placent par rapport à la carte ;
- l'inclinaison, la position et l'atténuation sont gérées **par `BoardItem`**, pas par la carte.

### 8.2 `registry.ts` — code → composant

```ts
CARD_BY_CODE: Record<string, ComponentType<CardProps>>
resolveCard(annonce): ComponentType<CardProps>
```

`resolveCard` cherche dans cet ordre :
1. `annonce.templateCode` (si fourni par l'API) ;
2. `CODE_BY_ID[annonce.templateId]` ;
3. sinon `STANDARD` (donc `AfficheCreme`).

Les ids correspondent à la migration `20261120120000_seed_templates.sql`.

### 8.3 Tableau récapitulatif

| Code | Id | Composant | Look | Densités | Décoration |
|---|---|---|---|---|---|
| `STANDARD` | 0 | `AfficheCreme` | affiche crème, gros titre couleur d'accent | lg, md | punaise verte |
| `AFFICHE_UNE` | 1 | `AfficheUne` | grande carte rouge « À la une » | lg, md, variante `minimal` | punaise blanche + cercles |
| `APPEL_PROJET` | 2 | `AppelProjet` | papier millimétré bleu, date limite | lg, md, sm | 2 punaises dorées (1 en sm) |
| `JOURNAL_UNE` | 3 | `JournalUne` | une de journal, texte en 2 colonnes | lg, md, sm | 2 scotchs (1 en sm) |
| `BREVE` | 4 | `Breve` | petit papier crème | lg, sm | punaise bleue à droite |
| `ETIQUETTE` | 5 | `Etiquette` | étiquette jaune à œillet | lg, sm | punaise rouge + œillet |
| `POST_IT` | 6 | `PostIt` | papier jaune | lg, sm | scotch centré |
| `POLAROID` | 7 | `Polaroid` | photo + légende | lg, sm | punaise rouge |
| `AFFICHE_CREME` | 8 | `AfficheCreme` | idem `STANDARD` | lg, md | punaise verte |
| `AFFICHE_ACCENT` | 9 | `AfficheAccent` | carte pleine couleur + pictogramme | lg, sm | punaise sombre |
| `AFFICHE_SOMBRE` | 10 | `AfficheSombre` | affiche sombre | lg, sm | punaise dorée à gauche |
| `FEUILLE_QUADRILLEE` | 11 | `FeuilleQuadrillee` | feuille à lignes + tags | lg, md | punaise bleue |
| `NOTE_JOURNAL` | 12 | `NoteJournal` | mot de la rédaction | lg, sm | scotch à gauche |

### 8.4 Détail de chaque carte

Pour chaque carte : les champs de l'annonce lus, et ce qui diffère entre desktop et mobile.

#### `AfficheUne` — carte « À la une »
- **Lit** : `titre`, `descriptionLongue` (lg) / `descriptionCourte` (md), `details.kicker` / `kickerCourt`, `sousTitre`, `accroche` (minimal), `dateBig`, `dateLabel` et `lieu` (lg), `dateShort`, `ctaLabel` (lg) / `ctaLabelCourt`, `ctaHref`.
- **Variante `minimal`** : version compacte du panneau « Événements » mobile (titre seul, accroche, date + bouton).
- **Pour modifier** : taille du titre (`clamp(64px, 7vw, 100px)` en desktop, `50` en mobile), cercles (`Rings`), tampon « À la une ».

#### `AppelProjet` — appel à projets
- **Lit** : `titre`, `descriptionLongue` (lg) / `descriptionCourte` (md), `details.kicker`, `ref`, `deadline`, `deadlineYear`, `ctaLabel` / `ctaLabelCourt`, `ctaHref`.
- **3 mises en page** : lg (bloc texte + encadré de date à droite), md (date en bas), sm (encadré de date centré).
- **Maille** du papier millimétré : 22 px (lg), 18 (md), 16 (sm) — via `gridBlue(...)`.

#### `JournalUne` — une du journal
- **Lit** : `titre`, `descriptionLongue` (lg, md) / `descriptionCourte` (sm), `details.numero`, `edition` (lg, md) / `editionCourte` (sm), `rubrique`, `etiquette`, `ctaHref`, `niveauPriorite`.
- Le nom du journal est la constante `NOM_JOURNAL` en haut du fichier (`« Le Journal de l'ECAM »`) ; en sm il s'affiche « Le Journal ».
- Sur mobile (md), le tag affiche « Important » si la priorité n'est pas `STANDARD`.
- Le texte est en **2 colonnes** (`columnCount: 2`).

#### `Breve` — brève
- **Lit** : `titre` (le texte de la brève), `details.kicker` / `kickerCourt`.

#### `Etiquette` — étiquette à œillet
- **Lit** : `titre`, `descriptionLongue`, `details.kicker`, `note`.
- La forme vient de `clipPath: polygon(...)`. L'ombre est un `filter: drop-shadow` posé sur le conteneur parent (une `box-shadow` serait coupée par le `clipPath`).

#### `PostIt` — papier jaune
- **Lit** : `titre`, `details.kicker`, `ctaLabel`, `ctaHref` ; `descriptionLongue` seulement en lg.

#### `Polaroid` — photo
- **Lit** : `titre`, `details.imageUrl`, `imageAlt`, `kicker` + `lieu` (lg) ou `lieu` + `quand` (mobile).
- La hauteur de l'image : 126 px (lg), 176 px (mobile). Sans `imageUrl`, la carte s'affiche sans photo.

#### `AfficheCreme` — affiche crème (et `STANDARD`)
- **Lit** : `titre`, `descriptionLongue`, `details.kicker` (sinon « Annonce »), `signature` (lg seulement).
- C'est le **template de secours** quand le code de template est inconnu.

#### `AfficheAccent` — pleine couleur + pictogramme
- **Lit** : `titre`, `details.kicker` / `kickerCourt`, `dateLabel`, `lieu`, `note` (lg).
- Le pictogramme est `BloodDropIcon` : pour une autre thématique, remplace l'icône dans le fichier.

#### `AfficheSombre` — affiche sombre
- **Lit** : `titre`, `details.kicker` / `kickerCourt`, `intervenant` (lg), `dateLabel`, `horaire`, `lieu` (lg) / `lieuCourt` (mobile).
- La barre colorée sous le titre utilise la couleur d'accent.

#### `FeuilleQuadrillee` — feuille à lignes
- **Lit** : `titre`, `descriptionLongue`, `details.kicker` / `kickerCourt`, `tags`.
- Bordure haute bleue de 6 px ; pastilles de tags en bas.

#### `NoteJournal` — mot de la rédaction
- **Lit** : `details.kicker`, `titre`, `descriptionLongue` (lg) / `descriptionCourte` (mobile), `ctaLabel` et `ctaHref` (lg).

---

## 9. Placement automatique sur la grille (`layout/`)

Les emplacements ne sont **plus écrits à la main** : un algorithme remplit la grille tout seul.

### 9.1 Le principe

> On part **toujours de la première case libre**, en balayant la grille ligne par ligne depuis le **coin haut gauche**. On y place une annonce, en essayant **plusieurs formes** (largeur × hauteur) selon la place disponible. On continue **tant qu'il reste de la place et des annonces**.

Étapes, dans l'ordre (`layout/packGrid.ts`) :

1. **Ordre de la file** : tri par priorité (`A_LA_UNE` → `HAUTE_PRIORITE` → `STANDARD`) ; à priorité égale, l'ordre d'origine est conservé.
2. **Première case libre** : balayage de gauche à droite, de haut en bas ; le curseur ne revient jamais en arrière.
3. **Place disponible** : largeur libre à droite de cette case, et hauteur restante.
4. **Passe 1 (forme préférée)** : on prend la première annonce de la file dont la **forme préférée** tient. Une petite annonce plus loin dans la file peut donc passer devant une grande qui ne tient pas.
5. **Passe 2 (compromis)** : sinon, on prend l'annonce qui tient avec sa 2ᵉ forme (réglable avec `compromise`, défaut 1). Si plusieurs conviennent, celle dont la forme est la plus proche de sa préférence.
6. **Rien ne tient** : la case reste **vide** et on passe à la suivante.
7. **Pas de trou orphelin** : si, après placement, il reste de la largeur à droite et qu'**aucune autre annonce ne pourrait la combler**, la carte prend la forme **la plus large** possible.
8. **Fin** : plus d'annonces, ou plus de place (`maxRows` sur mobile).

### 9.2 Les fichiers

| Fichier | Rôle |
|---|---|
| `layout/packGrid.ts` | Algorithme générique `packGrid({ cols, maxRows, items, shapesFor, seed, compromise })`, sans React. Renvoie `{ placements, rows, leftover }` |
| `layout/shapes.ts` | Les **formes possibles** par priorité et par template, et les dimensions des grilles |
| `layout/board.ts` | `layoutDesktop(annonces, seed)` et `layoutMobile(annonces, seed)` : transforment le résultat en `Slot[]` |
| `layout/slot.ts` | Type `Slot` et `tiltFor(id)` (inclinaison stable) |

Le type `Slot` (consommé par `BoardItem`) :

```ts
interface Slot {
  annonceId: string | null   // id de l'annonce ; null = « Place libre » (mobile)
  col: string                // gridColumn, ex. '1 / span 3'
  row: string                // gridRow,    ex. '1 / span 4'
  tilt: number               // inclinaison en degrés
  density: 'lg'|'md'|'sm'
  variant?: string           // ex. 'minimal'
  wide?: boolean             // grande carte (3 colonnes ou plus), classe .wide
}
```

`'1 / span 3'` se lit « commence à la colonne 1 et occupe 3 colonnes ».

### 9.3 Les formes (`layout/shapes.ts`)

Chaque annonce a une liste de formes `cols × rows`, **de la plus souhaitée à la moins souhaitée**. Le code cherche d'abord une liste propre au **template** (`byTemplate`), sinon celle de la **priorité** (`byPriority`, « taille = importance »).

**Desktop** (grille de 6 colonnes, hauteur illimitée)

| Clé | Formes (préférence → repli) |
|---|---|
| `A_LA_UNE` | 3×4 · 4×3 · 2×3 |
| `HAUTE_PRIORITE` | 2×2 · 3×2 · 2×3 · 1×3 |
| `STANDARD` | 1×2 · 1×3 · 2×2 |
| template `JOURNAL_UNE` | 2×3 · 3×3 |
| template `APPEL_PROJET` | 3×2 · 2×2 |
| template `BREVE` | 2×1 · 1×2 |
| templates `ETIQUETTE`, `POST_IT`, `POLAROID`, `NOTE_JOURNAL` | 1×2 · 1×3 |

**Mobile** (un panneau = grille de 2 colonnes × 6 lignes)

| Clé | Formes |
|---|---|
| `A_LA_UNE` | 2×3 · 2×2 |
| `HAUTE_PRIORITE` | 1×3 · 2×2 · 2×3 |
| `STANDARD` | 1×3 · 1×2 · 2×2 |
| template `JOURNAL_UNE` | 2×3 · 1×3 |
| template `BREVE` | 1×2 |
| template `ETIQUETTE` | 1×3 · 1×2 |
| templates `POST_IT`, `NOTE_JOURNAL` | 1×2 · 1×3 |
| template `POLAROID` | 1×3 |
| « Place libre » | 1×3 · 1×2 |

Sur mobile, la **densité** de la carte dépend de sa largeur : **2 colonnes → `md`**, **1 colonne → `sm`**. La carte « À la une » (`AFFICHE_UNE`) passe en variante `'minimal'` quand elle fait 2 lignes ou moins.

### 9.4 Les panneaux mobile (`PANEL_RULES` dans `layout/board.ts`)

Chaque règle dit quelles annonces vont dans un panneau, et ce qu'on fait du surplus.

| Panneau | Annonces retenues | Surplus |
|---|---|---|
| À la une | priorité ≠ `STANDARD` | non affiché ici (l'annonce reste visible dans son panneau de catégorie) |
| Événements | `EVENEMENT` | nouveau panneau « Événements (2) », etc. |
| Objets trouvés | `OBJET_TROUVE`, `OBJET_A_DONNER` (+ une « Place libre » s'il reste de la place) | nouveau panneau |
| Journal | `JOURNAL` | nouveau panneau |
| Appels à projet | `APPEL_A_PROJET` | nouveau panneau |
| Autres annonces | toutes les autres catégories | nouveau panneau |

Un panneau sans annonce n'est pas affiché. Les points de pagination et la navigation s'adaptent au nombre de panneaux.

### 9.5 Plusieurs manières de remplir : la variante (`seed`)

`layoutDesktop(annonces, seed)` et `layoutMobile(annonces, seed)` acceptent un entier :

- `0` (défaut) : l'ordre de préférence des formes est respecté ;
- tout autre entier : l'ordre des formes de chaque annonce est mélangé de façon **déterministe**. Le même `seed` donne toujours la même disposition ; un autre `seed` en donne une autre.

Dans `App.tsx` : `const LAYOUT_SEED = 0` (essaie 1, 2, 3…). Avec les données de démo, la hauteur du tableau desktop varie de 8 à 12 lignes selon la variante.

### 9.6 Exemple : disposition desktop par défaut (`seed = 0`, données de démo)

```
        col 1  col 2  col 3  col 4  col 5  col 6
ligne 1 HACK   HACK   HACK   APPC   APPC   APPC
ligne 2 HACK   HACK   HACK   APPC   APPC   APPC
ligne 3 HACK   HACK   HACK   JOUR   JOUR   CALC
ligne 4 HACK   HACK   HACK   JOUR   JOUR   CALC
ligne 5 AFTE   AFTE   USB    JOUR   JOUR   VEST
ligne 6 AFTE   AFTE   USB    COLL   COLL   VEST
ligne 7 CONF   CONF   RECR   COLL   COLL   BREV
ligne 8 CONF   CONF   RECR   DOMO   DOMO   BREV
ligne 9 .....  .....  .....  DOMO   DOMO   .....
```
HACK = hackathon (3×4), APPC = appel-campus (3×2), JOUR = journal-robotique (2×3), CALC = calculatrice, AFTE = afterwork, USB = cle-usb, VEST = veste-jean, COLL = collecte-sang, CONF = conference-ia, RECR = journal-recrute, DOMO = appel-domotique, BREV = breve-bibliotheque. Les cases `.....` restent vides faute d'annonce.

### 9.7 Inclinaison (`tiltFor`)

L'inclinaison n'est plus saisie à la main : `tiltFor(id)` (dans `layout/slot.ts`) la déduit de l'id de l'annonce, entre **-2,6° et +2,6°**. Elle est **stable** : une annonce garde la même inclinaison d'un rendu à l'autre.

### 9.8 Réglages en un coup d'œil

| Je veux… | Je modifie |
|---|---|
| Changer la taille d'une annonce | `layout/shapes.ts` (formes par priorité / template) |
| Limiter la hauteur du tableau desktop | `DESKTOP_GRID.maxRows` dans `layout/shapes.ts` (ex. `8` ; `Infinity` = illimitée) |
| Accepter plus ou moins de compromis | option `compromise` de `packGrid` (0 = jamais, 1 par défaut) |
| Changer le contenu des panneaux mobile | `PANEL_RULES` dans `layout/board.ts` |
| Changer la hauteur d'un panneau mobile | `MOBILE_GRID.rows` dans `layout/shapes.ts` |
| Obtenir une autre disposition | `LAYOUT_SEED` dans `App.tsx` |

---

## 10. Components de layout

Dossier `components/layout/`, plus `BoardItem` et `EmptySlot` à la racine de `components/`.

### `BoardItem` — place une annonce
```tsx
<BoardItem slot={slot} annonce={annonce} accent={accent} tilt={true} dimmed={false} />
```
Rôle : crée le conteneur de grille (`gridColumn`, `gridRow`), applique l'inclinaison (`rotate`), l'atténuation (`opacity: .2` + `grayscale(1)` si `dimmed`) et la transition, puis affiche la carte renvoyée par `resolveCard()`.

| Prop | Rôle |
|---|---|
| `slot` | position, taille, inclinaison, densité, variante |
| `annonce` | les données |
| `accent` | couleur d'accent transmise à la carte |
| `tilt` | `false` désactive toutes les inclinaisons |
| `dimmed` | estompe l'annonce (filtre actif sur une autre catégorie) |

Ajoute la classe CSS `wide` quand `slot.wide` est vrai.

### `EmptySlot` — « Place libre »
Cadre en pointillés avec un bouton « + Publier ». Reçoit `col` et `row`. Placé par l'algorithme dans le panneau « Objets trouvés » du mobile, s'il reste de la place.

### `TopBar` — barre du haut (desktop)
Logo « E-CAMpus », navigation (Tableau / Mes annonces / Modération + badge Admin), champ de recherche, bouton « Publier une annonce », bouton compte. Prop : `accent`.
> Les liens sont des `href="#"` : à brancher sur le routeur quand il existera.

### `FilterBar` — filtres (desktop)
Affiche la date du jour, les boutons de filtre (depuis `config/categories.ts`) et la légende des tailles.

| Prop | Rôle |
|---|---|
| `accent` | couleur du carré « Événements » et « À la une » |
| `filter` | filtre actif (`'all'` ou une catégorie) |
| `onChange` | appelée au clic sur un filtre |

### `MobileHeader` — en-tête mobile
Logo « E-camarade », date courte, bouton de recherche. Prop : `accent`.

### `MobilePanel` — un panneau du carrousel
Plaque en laiton avec le titre et les points de pagination, puis la grille de liège (2 colonnes × 6 lignes).

| Prop | Rôle |
|---|---|
| `index` | numéro du panneau |
| `current` | panneau actuellement affiché (sert à `aria-hidden`) |
| `total` | nombre de panneaux (points de pagination) |
| `title` | titre sur la plaque |
| `children` | les cartes |

### `MobileNav` — navigation basse
5 entrées : Tableau (actif), Mes annonces, **bouton rond « Publier »** au centre, Modération, Compte. Hauteur fixe de **76 px**. Prop : `accent`.

---

## 11. Pages

### `App.tsx`
```tsx
const ACCENT = DEFAULT_ACCENT   // couleur d'accent
const TILT = true               // inclinaison des annonces
```
- Affiche « Chargement du tableau… » pendant le chargement et un message en cas d'erreur.
- Sinon : `useIsMobile(640)` → `MobileBoardPage` ou `BoardPage`.

### `pages/BoardPage.tsx` — desktop
- **État** : `filter` (`FilterId`, défaut `'all'`).
- Calcule les emplacements avec `layoutDesktop(annonces, seed)` (mémoïsé) : remplissage automatique depuis le coin haut gauche (voir [§9](#9-placement-automatique-sur-la-grille-layout)).
- Une annonce est **estompée** si `filter !== 'all'` et `annonce.categorie !== filter`.
- Structure : `<header>` (`TopBar` + `FilterBar`) puis `<main>` avec le cadre en bois et la grille de liège.
- Grille : 6 colonnes, `gridAutoRows: 104`, `gap: 22`, `padding: 36`, largeur max du contenu 1440 px.

### `pages/MobileBoardPage.tsx` — mobile
- **État** : `index` (panneau courant) et `startX` (début du geste).
- **Navigation** : flèches gauche/droite, ou **glisser** de plus de **45 px** ; la navigation est **circulaire** (le dernier panneau ramène au premier).
- Les panneaux sont côte à côte dans un conteneur déplacé par `translateX(-index * 100%)` (transition 0,5 s).
- Les panneaux sont calculés par `layoutMobile(annonces, seed)` (voir [§9.4](#94-les-panneaux-mobile-panel_rules-dans-layoutboardts)).
- Les slots avec `annonceId: null` affichent `EmptySlot`.
- Conteneur : largeur max 430 px, hauteur `100dvh` (minimum 600 px).

---

## 12. CSS global et responsive

### `index.css`
- Import des polices Google Fonts (Anton, Fraunces, IBM Plex Mono).
- Reset (`box-sizing`, `margin` du body, couleur de fond), couleur des liens.
- `.sr` : texte réservé aux lecteurs d'écran.

### Classes utilisées par les media queries

Les styles étant en ligne, les media queries ciblent des **classes** :

| Classe | Posée sur | Rôle |
|---|---|---|
| `.wrap` | conteneurs de `TopBar`, `FilterBar`, `<main>` | réduit les marges latérales en mobile |
| `.board` | grille de liège (`BoardPage`) | repasse en 2 puis 1 colonne |
| `.wide` | cases larges (`BoardItem`) | occupe 2 colonnes entre 641 et 1100 px |
| `.legend` | légende de `FilterBar` | retire la marge gauche en mobile |
| `.sr` | titres cachés | accessibilité |

### Points de rupture

| Largeur | Effet |
|---|---|
| ≤ 1100 px | `.board` passe à 2 colonnes (cases `min-height: 230px`, les `.wide` occupent 2 colonnes) |
| ≤ 640 px | `.board` passe à 1 colonne ; **`App` bascule sur la page mobile** (`useIsMobile(640)`) |

> Si tu changes le seuil mobile, modifie **à la fois** `useIsMobile(640)` dans `App.tsx` **et** les `@media (max-width: 640px)` de `index.css`.

> Les styles inline ne gèrent pas `:hover`. Pour un effet de survol, ajoute une classe dans `index.css`.

---

## 13. Recettes : comment modifier X

### Changer la couleur d'accent (rouge)
`App.tsx` :
```ts
const ACCENT = '#1F6FEB'   // à la place de DEFAULT_ACCENT
```
Ou change `DEFAULT_ACCENT` dans `theme/tokens.ts`.

### Désactiver l'inclinaison des annonces
`App.tsx` : `const TILT = false`.

### Changer l'amplitude de l'inclinaison
`layout/slot.ts`, fonction `tiltFor` : la dernière ligne est `((h >>> 0) % 521) / 100 - 2.6` (plage de -2,6° à +2,6°). Pour ±1,5° : `((h >>> 0) % 301) / 100 - 1.5`.

### Modifier le texte d'une annonce de démo
`data/mockAnnonces.ts` : édite `titre`, `descriptionLongue`, `descriptionCourte` ou les champs de `details`.

### Ajouter une annonce de démo (existante dans un template)
1. Dans `data/mockAnnonces.ts`, ajoute un objet :
   ```ts
   {
     ...base,
     id: 'mon-annonce',
     categorie: 'EVENEMENT',
     niveauPriorite: 'HAUTE_PRIORITE',
     templateId: 8,                       // AFFICHE_CREME
     titre: 'Soirée jeux de société',
     descriptionLongue: 'Mardi 8 décembre, dès 19 h · Cafétéria',
     details: { kicker: 'Événement' },
   },
   ```
2. **C'est tout** : l'algorithme la place automatiquement dans la première case libre en partant du coin haut gauche, selon sa priorité (voir [§9](#9-placement-automatique-sur-la-grille-layout)).
3. Sur mobile, elle apparaît dans le panneau de sa catégorie ; si sa priorité n'est pas `STANDARD`, aussi dans « À la une ».

### Changer la taille d'une annonce
`layout/shapes.ts` : ajoute, retire ou réordonne des formes `sh(cols, rows)`.
- pour **tous les templates d'une priorité** : `byPriority` ;
- pour **un template précis** : `byTemplate` (ex. `POLAROID: [sh(1, 2), sh(1, 3)]`).

La première forme de la liste est la préférée ; les suivantes servent quand la place manque.

### Obtenir une autre disposition du tableau
`App.tsx` : change `LAYOUT_SEED` (0 = ordre de préférence, puis 1, 2, 3… pour d'autres arrangements). Un même `seed` donne toujours la même disposition.

### Limiter la hauteur du tableau desktop
`layout/shapes.ts` : `DESKTOP_GRID.maxRows` (ex. `8`). Les annonces qui ne tiennent pas ne sont alors pas affichées. `Infinity` = le tableau grandit autant que nécessaire.

### Changer le contenu des panneaux mobile
`layout/board.ts`, tableau `PANEL_RULES` : pour chaque panneau, `title`, `match` (quelles annonces), `spill` (le surplus passe-t-il dans un panneau suivant ?) et `placeLibre`.

### Ajouter un panneau mobile
Ajoute une règle à `PANEL_RULES` :
```ts
{ title: 'Publicités', match: (a) => a.categorie === 'PUBLICITE', spill: true },
```
Un panneau sans annonce n'est pas affiché ; les points de pagination et la navigation s'adaptent.

### Ranger les annonces dans un autre ordre
L'ordre de la file est calculé par `sortByPriority` dans `layout/board.ts` (priorité, puis ordre d'origine). Pour trier par date, trie les annonces avant l'appel, par exemple par `createdAt`.

### Modifier l'apparence d'un type de carte
Ouvre `components/cards/<Nom>.tsx` (voir [§8.4](#84-détail-de-chaque-carte)).
- Valeurs desktop / mobile : cherche les ternaires `lg ? … : …` ou `pick(...)`.
- Couleur de fond : la propriété `background` de l'`<article>`.
- Ombre : `boxShadow`.
- Textes affichés : les champs `annonce.*` et `details.*` listés dans la section de la carte.

### Changer la couleur ou la position d'une punaise
Dans la carte concernée, repère `<Pin … />` :
```tsx
<Pin color="red" left={30} />    // couleurs : white, gold, red, green, blue, dark
```
Pour une nouvelle couleur, ajoute une entrée à `PINS` dans `theme/tokens.ts`.

### Créer un nouveau template (nouvelle carte)
1. **Composant** : crée `components/cards/MaCarte.tsx` :
   ```tsx
   import { CREAM, FRAUNCES } from '../../theme/tokens'
   import { Pin } from '../ui/Pin'
   import type { CardProps } from './types'

   export function MaCarte({ annonce, density }: CardProps) {
     const lg = density === 'lg'
     return (
       <article style={{ position: 'relative', display: 'flex', flexDirection: 'column',
                         flex: '1 1 auto', background: CREAM, color: '#2A211A' }}>
         <Pin color="blue" />
         <div style={{ padding: lg ? 24 : 14, fontFamily: FRAUNCES }}>
           <h2 style={{ margin: 0 }}>{annonce.titre}</h2>
           <p>{annonce.descriptionLongue}</p>
         </div>
       </article>
     )
   }
   ```
2. **Registre** : dans `cards/registry.ts`, importe-la et ajoute :
   ```ts
   CARD_BY_CODE: { …, MA_CARTE: MaCarte }
   CODE_BY_ID:   { …, 13: 'MA_CARTE' }
   ```
3. **Base de données** : nouvelle migration (ou ajoute à la liste) :
   ```sql
   INSERT INTO templates (id, code, nom) VALUES (13, 'MA_CARTE', 'Ma carte');
   ```
4. **Utilisation** : mets `templateId: 13` (ou `templateCode: 'MA_CARTE'`) sur une annonce.

### Ajouter un champ d'affichage (ex. `prix`)
1. `types/annonce.ts` : ajoute `prix?: string` dans `AnnonceDetails`.
2. `data/mockAnnonces.ts` : renseigne `details: { prix: '5 €' }`.
3. Dans la carte : `{annonce.details?.prix}`.

### Ajouter ou modifier un filtre de catégorie
`config/categories.ts`, tableau `FILTERS` :
```ts
{ id: 'PUBLICITE', label: 'Publicités', swatch: '#8E44AD' }
```
`id` doit être une valeur de `CategorieAffichage`. `swatch: 'ACCENT'` utilise la couleur d'accent.

### Changer le seuil entre desktop et mobile
`App.tsx` : `useIsMobile(640)` **et** `index.css` : les `@media (max-width: 640px)` (voir [§12](#12-css-global-et-responsive)).

### Changer les polices
1. `index.css` : modifie l'URL Google Fonts.
2. `theme/tokens.ts` : modifie `ANTON`, `FRAUNCES`, `MONO`.

### Modifier la barre de navigation
- Desktop : `components/layout/TopBar.tsx` (liens `navLink(...)`).
- Mobile : `components/layout/MobileNav.tsx` (5 entrées dans la grille `repeat(5, …)` ; le bouton central est dans la 3ᵉ colonne).

### Changer le sens du carrousel ou le seuil du glissement
`pages/MobileBoardPage.tsx`, fonction `onUp` : `dx < -45` et `dx > 45` (en px).

### Modifier le nom du journal
`components/cards/JournalUne.tsx` : constante `NOM_JOURNAL`.

---

## 14. Lien avec le backend et la base

### Correspondance front ↔ base

| Frontend | Table `annonces` | Remarque |
|---|---|---|
| `id` | `id` | UUID |
| `categorie` | `categorie` | `JOURNAL` n'existe pas encore en base |
| `titre` | `titre` | |
| `descriptionCourte` | `description_courte` | nullable |
| `descriptionLongue` | `description_longue` | non nulle |
| `niveauPriorite` | `niveau_priorite` | |
| `validationStatus` | `validation_status` | le front ne garde que `VALIDE` |
| `templateId` | `template_id` | défaut 0 |
| `createdAt` / `expiresAt` / `eventDate` | `created_at` / `expires_at` / `event_date` | |
| `details.*` | — | **n'existe pas en base** |

### Table `templates`
La base ne stocke que `id`, `code`, `nom`, `actif` : **le template lui-même est du code React**. Le `code` est la clé stable que le front associe à un composant (`registry.ts`). La migration `20261120120000_seed_templates.sql` insère les 12 templates (ids 1 à 12) et réaligne la séquence d'identité.

### Brancher le backend
1. Créer `Ecampus-Frontend/.env.local` :
   ```
   VITE_USE_MOCK=false
   ```
2. Le proxy `/api` → `http://localhost:8080` est déjà configuré dans `vite.config.ts` (et `nginx.conf` en Docker).
3. Côté backend (Spring Boot) :
   - créer l'endpoint **`GET /api/annonces`** (il n'existe pas encore d'`AnnonceController`) ;
   - l'ouvrir dans `SecurityConfig` (`PUBLIC_ROUTES`) ou brancher l'authentification, car toutes les autres routes exigent un utilisateur authentifié ;
   - idéalement renvoyer `templateCode` en plus de `templateId`.
4. Les vraies annonces sont placées automatiquement par `layout/` : aucun id à déclarer.

---

## 15. Ce qui a été fait (historique)

1. **Analyse de la maquette** `eCAMpus__2_.html` : deux pages (tableau desktop « E-camarade — Tableau d'annonces » et « Panneaux mobile »), les styles, les polices et la photo de la veste en jean ont été extraits.
2. **Premier prototype** `App.jsx` : les deux pages en un seul fichier, annonces écrites en dur dans le JSX.
3. **Analyse du repo** `Ecampus.zip` : monorepo avec `Ecampus-Frontend` (Vite, React 19, TypeScript), `Ecampus-Backend` (Spring Boot) et `supabase/` (migrations). Constats : proxy `/api` déjà configuré, table `templates` avec un `code` stable, enums de catégorie / priorité / validation.
4. **Refonte en architecture TSX** (cette documentation) :
   - données typées (`Annonce`) au lieu de textes en dur ;
   - **un composant par template**, relié par `registry.ts` ;
   - placement séparé des cartes (dossier `layout/`) ;
   - pages, layout et briques UI découpés ;
   - mode démo (`mockAnnonces`) avec bascule vers l'API ;
   - migration SQL pour les templates.
5. **Placement automatique** (`layout/`) : remplacement des emplacements écrits à la main par un algorithme qui remplit la grille depuis le coin haut gauche, avec plusieurs formes par annonce et une variante (`seed`). L'algorithme a été exécuté sur les données de démo (desktop et mobile) avec 60 variantes : aucun chevauchement, toutes les annonces placées.
6. **Vérification** : type-check TypeScript en mode strict avec des déclarations minimales de React. Le seul message restant vient de ces déclarations simplifiées (type de l'événement `e`), pas du code.

### Différences avec la maquette
- La date est celle du jour (la maquette avait « 16 octobre 2026 »).
- Les textes de la maquette mobile qui diffèrent légèrement (ex. « Le Journal » au lieu de « Le Journal de l'ECAM ») sont obtenus avec la densité de la carte.
- Quelques punaises mobiles ont la couleur ou la position de leur équivalent desktop (ex. la brève et « Le journal recrute » utilisent la même décoration partout).

---

## 16. Limites connues et à faire

- **Non testé dans un navigateur** : le rendu visuel n'a pas été vérifié ; seul un type-check a été fait. Compare avec la maquette et ajuste les valeurs de style si besoin.
- **Catégorie `JOURNAL`** : à ajouter à l'enum Java `Categorie` **et** au `CHECK chk_annonces_categorie` (nouvelle migration), ou à retirer du front.
- **`details`** : absent de la base. Soit une colonne `details JSONB`, soit déduire les valeurs de `description_longue` / `event_date`.
- **Aucun endpoint** `GET /api/annonces` ; sécurité à ouvrir ou à brancher.
- **Placement** : on ne peut pas (encore) épingler une annonce à un emplacement précis ; l'ordre dépend de la priorité puis de l'ordre d'arrivée. Les formes sont réglées pour les données de démo : le rendu de chaque carte à toutes les tailles possibles (par exemple une carte 1×3 sur desktop) n'a pas été vérifié visuellement et un texte long peut y être tronqué.
- **Navigation** : les liens (`href="#"`) ne sont pas branchés (pas de routeur) ; la recherche et les boutons « Publier » / compte n'ont pas d'action.
- **Accessibilité** : les panneaux inactifs du carrousel ont `aria-hidden`, mais leurs liens restent focalisables au clavier.
- **Tests** : aucun test automatisé.

---

## 17. Dépannage

| Problème | Cause probable | Solution |
|---|---|---|
| Page blanche, erreur sur `veste-en-jean.jpg` | image absente | vérifier `src/assets/veste-en-jean.jpg` |
| Mise en page « centrée et étroite » | ancien `index.css` du template Vite | remplacer par le `index.css` fourni |
| Polices non chargées | pas de connexion à Google Fonts | vérifier le réseau ou héberger les polices |
| Erreur TypeScript sur `.jpg` | types Vite absents | `tsconfig.app.json` doit contenir `"types": ["vite/client"]` |
| « Impossible de charger les annonces (… 401 / 404) » | `VITE_USE_MOCK=false` sans endpoint ou sans auth | remettre le mode démo ou créer / ouvrir `GET /api/annonces` |
| Une annonce n'apparaît pas | `validationStatus` ≠ `VALIDE` ; ou plus de place (`maxRows`) ; ou, sur mobile, panneau « À la une » plein (elle reste dans son panneau de catégorie) | vérifier le statut ; augmenter `maxRows` ; regarder le panneau de sa catégorie |
| Cases vides dans le tableau | pas assez d'annonces, ou aucune forme ne tient dans l'espace restant | ajouter des formes plus petites dans `layout/shapes.ts` ; essayer un autre `LAYOUT_SEED` |
| Texte tronqué dans une carte | forme trop petite pour le contenu | retirer cette forme de `layout/shapes.ts` pour ce template |
| Mauvaise carte affichée | `templateId` / `templateCode` inconnu → `STANDARD` | vérifier `registry.ts` et la table `templates` |
| La version mobile ne s'affiche pas | fenêtre > 640 px | réduire la fenêtre ou utiliser le mode appareil (F12) |
| Une annonce reste grisée | un filtre d'une autre catégorie est actif | cliquer sur « Tout » |