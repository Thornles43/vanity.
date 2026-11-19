# Scrigno reale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire i dati e la scansione finti con login Google, fotocamera reale, lookup prodotti e Scrigno per utente su Supabase.

**Architecture:** App Next.js statica (client-only) che parla direttamente con Supabase (Auth + Postgres con RLS) dal browser. Il lookup per codice a barre interroga prima il catalogo condiviso, poi Open Beauty Facts; i non trovati si inseriscono a mano e finiscono nel catalogo.

**Tech Stack:** Next.js 14 export statico, Tailwind, `@supabase/supabase-js`, `BarcodeDetector` con fallback `@zxing/browser`, Vitest per la logica in `lib/`.

**Spec:** `docs/superpowers/specs/2026-11-18-real-vault-design.md`

## Global Constraints

- Nuovo progetto Supabase isolato, piano gratuito; mai toccare il progetto `pyngckdtetznjohtufam`.
- `next.config.mjs` resta `output: "export"`; nessuna funzione server.
- Variabili: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la chiave anon è pubblica per design; sicurezza via RLS).
- Scadenza = data apertura + `pao_months` × 30 giorni (come `lib/expiry.ts`); giallo ≤ 60 giorni, rosso ≤ 14 giorni o scaduto.
- UI in italiano. Nessun dato di esempio precaricato.

## Review Focus

- Codice a barre non trovato né nel catalogo né su Open Beauty Facts: si apre il form manuale, mai errore bloccante.
- Rete assente o Open Beauty Facts lento/giù (timeout 6 s): form manuale con messaggio chiaro.
- Permesso fotocamera negato o browser senza `BarcodeDetector`: fallback zxing o inserimento manuale del codice.
- Stesso prodotto aggiunto due volte dallo stesso utente: si aggiunge un secondo esemplare (due barattoli possono coesistere), non un errore.
- Utente non loggato o sessione scaduta: schermata di login, nessun dato di altri visibile (RLS).

---

### Task 1: Progetto Supabase e schema

**Files:**
- Create: `supabase/migrations/0001_vanity.sql`

**Interfaces:**
- Produces: tabelle `catalog_products(id uuid pk, barcode text unique, name text, brand text, category text, image_url text, source text check in ('openbeautyfacts','user'), created_by uuid, created_at)` e `vault_items(id uuid pk, user_id uuid default auth.uid(), catalog_id uuid refs catalog_products, opened_on date, pao_months int check 1..60, notes text, created_at)`. RLS: `catalog_products` lettura per `authenticated`, insert per `authenticated`; `vault_items` select/insert/update/delete solo dove `user_id = auth.uid()`.

- [ ] **Step 1:** Creare il nuovo progetto Supabase (piano gratuito) con `create_project`, dopo conferma del costo (0 $), e attendere stato `ACTIVE_HEALTHY`.
- [ ] **Step 2:** Scrivere `0001_vanity.sql` con le due tabelle e le policy sopra; applicarla con `apply_migration`.
- [ ] **Step 3:** Verifica: `get_advisors` (security) senza avvisi su RLS; `execute_sql` con due utenti di prova mostra che l'utente A non legge le righe di B.
- [ ] **Step 4:** Annotare URL e publishable key (`get_project_url`, `get_publishable_keys`) in `.env.local` (ignorato da git).
- [ ] **Step 5: Commit** `feat: schema supabase`

### Task 2: Login Google e sessione

**Files:**
- Create: `lib/supabase.ts`, `components/AuthGate.tsx`, `components/LoginScreen.tsx`
- Modify: `app/page.tsx`, `package.json`

**Interfaces:**
- Produces: `supabase: SupabaseClient`; `useSession(): { user: User | null; loading: boolean }`; `signInWithGoogle(): Promise<void>` (`redirectTo: window.location.origin`); `signOut(): Promise<void>`.

- [ ] **Step 1:** `npm i @supabase/supabase-js`.
- [ ] **Step 2:** Implementare `lib/supabase.ts` leggendo le due variabili d'ambiente.
- [ ] **Step 3:** `AuthGate` mostra `LoginScreen` (bottone "Continua con Google") se non c'è sessione, altrimenti i figli; `app/page.tsx` ne avvolge l'AppShell e sostituisce il flag `vanitydiary:vault-unlocked`.
- [ ] **Step 4:** Verifica: `npm run build` passa; sul sito deployato il login porta a Google e torna con sessione (dopo Task 8).
- [ ] **Step 5: Commit** `feat: login google`

### Task 3: Scrigno su Supabase (via i dati finti)

**Files:**
- Create: `lib/vault.ts`, `lib/vault.test.ts`
- Modify: `lib/types.ts`, `components/Vault.tsx`, `components/ProductCard.tsx`, `app/page.tsx`
- Delete: `lib/data.ts` (`INITIAL_PRODUCTS`, `SCAN_QUEUE`); i filtri `ROUTINE_FILTERS`/`CATEGORIES` restano in un `lib/constants.ts`.

**Interfaces:**
- Produces: `listVault(): Promise<VaultItem[]>`; `addToVault(input: { catalogId: string; openedOn: string; paoMonths: number }): Promise<VaultItem>`; `removeFromVault(id: string): Promise<void>`. `VaultItem` unisce `vault_items` e `catalog_products`.
- Consumes: `getExpiryInfo(item)` aggiornato per leggere `openedOn` + `paoMonths`.

- [ ] **Step 1:** Test `getExpiryInfo` in `lib/expiry.test.ts`: apertura 2026-10-18, PAO 6 → `daysLeft` 164 e livello `green` il 2026-11-18; PAO 1 → `yellow`; apertura 8 mesi fa con PAO 6 → `red`.
- [ ] **Step 2:** Eseguire `npx vitest run` e verificare che fallisca; poi adeguare `lib/expiry.ts` e `lib/types.ts`.
- [ ] **Step 3:** Implementare `lib/vault.ts` con query Supabase (join su `catalog_products`).
- [ ] **Step 4:** `Vault` mostra stato vuoto ("Il tuo Scrigno è vuoto: scansiona il primo elisir") quando `listVault()` è vuoto; rimuovere tutti i riferimenti a `INITIAL_PRODUCTS`.
- [ ] **Step 5:** Verifica: test passano; `grep -r INITIAL_PRODUCTS` vuoto; `npm run build`.
- [ ] **Step 6: Commit** `feat: scrigno reale per utente`

### Task 4: Lookup codice a barre

**Files:**
- Create: `lib/barcode.ts`, `lib/barcode.test.ts`

**Interfaces:**
- Produces: `normalizeEan(raw: string): string | null` (solo cifre, lunghezza 8/12/13/14, altrimenti null); `lookupBarcode(ean: string): Promise<CatalogProduct | null>`: cerca in `catalog_products`; se manca, chiama `https://world.openbeautyfacts.org/api/v2/product/{ean}.json?fields=product_name,brands,categories,image_front_small_url` con timeout 6 s, salva il risultato nel catalogo (`source: 'openbeautyfacts'`) e lo restituisce; `null` se non trovato o in errore.

- [ ] **Step 1:** Test con `fetch` simulato: risposta `status: 1` → prodotto mappato; `status: 0` → `null`; timeout → `null`; `normalizeEan("80 1234")` → `null`.
- [ ] **Step 2:** Vitest fallisce; implementare.
- [ ] **Step 3:** Vitest passa. **Step 4: Commit** `feat: lookup open beauty facts`

### Task 5: Fotocamera reale

**Files:**
- Create: `components/BarcodeScanner.tsx`
- Modify: `components/ScanViewfinder.tsx`, `components/ScanOverlay.tsx`, `app/page.tsx`
- Modify: `package.json` (`@zxing/browser`)

**Interfaces:**
- Produces: `<BarcodeScanner onDetect={(ean: string) => void} onError={(reason: 'denied'|'unsupported') => void} />`: usa `getUserMedia({video:{facingMode:'environment'}})` e `BarcodeDetector` (formati ean_13, ean_8, upc_a); se assente, ZXing. Ferma lo stream allo smontaggio.

- [ ] **Step 1:** Implementare il componente; chiamare `onDetect` una sola volta per lettura valida (`normalizeEan` ≠ null).
- [ ] **Step 2:** Rimuovere il timer di 1800 ms e la scansione simulata da `app/page.tsx`.
- [ ] **Step 3:** In caso di `denied`/`unsupported` mostrare campo "Inserisci il codice a mano".
- [ ] **Step 4:** Verifica manuale sul telefono (unico modo): il codice di un prodotto reale viene letto e lo stream si spegne alla chiusura.
- [ ] **Step 5: Commit** `feat: scansione con fotocamera`

### Task 6: Form di aggiunta (prodotto + PAO)

**Files:**
- Create: `components/AddProductSheet.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `lookupBarcode`, `addToVault`, tabella `catalog_products` (insert per prodotto manuale con `source: 'user'`).
- Produces: `<AddProductSheet ean={string} found={CatalogProduct|null} onDone={() => void} />`.

- [ ] **Step 1:** Se `found`, mostra nome/marca/foto e chiede solo data di apertura (default oggi) e PAO (mesi, scelte 3/6/9/12/18/24 + campo libero 1-60).
- [ ] **Step 2:** Se `null`, aggiunge i campi nome (obbligatorio), marca, categoria; salva prima nel catalogo, poi nello Scrigno.
- [ ] **Step 3:** Verifica: aggiungere prodotto trovato e uno manuale; ricaricare la pagina e vederli ancora; secondo esemplare dello stesso EAN consentito.
- [ ] **Step 4: Commit** `feat: aggiunta prodotto con PAO`

### Task 7: Rimuovere Feed e Profilo finti

**Files:**
- Delete: `components/Feed.tsx`
- Modify: `components/Profile.tsx` (solo email/nome Google, conteggio prodotti, "Esci"), `components/AppShell.tsx` (tab: Scrigno, Profilo)

- [ ] **Step 1:** Eliminare Feed e relativo tab; riscrivere Profilo.
- [ ] **Step 2:** Verifica: `grep -ri "shop the look\|punti"` vuoto; `npm run build`.
- [ ] **Step 3: Commit** `refactor: via feed e profilo finti`

### Task 8: Deploy e Google OAuth

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Guidare l'utente: Google Cloud Console → credenziali OAuth (Web), redirect `https://<progetto>.supabase.co/auth/v1/callback`; incollare Client ID/Secret nel provider Google di Supabase; in Supabase Auth impostare Site URL `https://vanity.gaetanoregbista.workers.dev` e aggiungerlo ai Redirect URLs.
- [ ] **Step 2:** Su Cloudflare, aggiungere le due variabili `NEXT_PUBLIC_*` tra le variabili di build.
- [ ] **Step 3:** Push su `main`; attendere deploy Ready.
- [ ] **Step 4:** Verifica sul telefono: login Google, scansione di un prodotto reale, scadenza coerente, dati ancora presenti dopo riapertura.
- [ ] **Step 5: Commit** `docs: deploy e oauth`
