# VanityDiary

App mobile-first per tenere traccia di trucchi e skincare e delle loro scadenze (PAO).
Next.js 14 + Tailwind, esportata come sito statico e pubblicata su Cloudflare (piano gratuito).

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera la cartella out/
```

## Pubblicazione su Cloudflare (gratis)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**.
2. Scegli questo repo e il branch da pubblicare.
3. Impostazioni di build:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Salva: ogni push sul branch ripubblica il sito.

La configurazione è in `wrangler.jsonc` (serve la cartella `out/`). Non usa funzioni
né database, quindi resta nel piano gratuito con banda illimitata.

## Prossimi passi

- Accesso con email e password (Supabase) e Scrigno per utente: fatto.
- Schermate dal design Stitch "Haute Boudoir": Scansione, Rituali, Dettaglio prodotto.
