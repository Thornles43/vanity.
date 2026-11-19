# VanityDiary: Scrigno reale (design)

**Intent.** L'app era una demo: scansione simulata, 14 prodotti inventati, nessun dato reale. L'utente vuole un'app vera: fotocamera che legge il codice a barre, banca dati prodotti, Scrigno vuoto che contiene solo ciò che aggiunge lui, con scadenza (PAO) calcolata. Obiettivo a lungo termine: pubblicazione su Play Store.

**Goals**
- Login con Google (Supabase Auth); ogni utente vede solo il proprio Scrigno.
- Scansione EAN con fotocamera reale.
- Lookup prodotto: catalogo condiviso su Supabase, poi Open Beauty Facts.
- Prodotto non trovato: form manuale (nome, marca, categoria, foto opzionale) salvato nel catalogo condiviso.
- Per ogni prodotto nello Scrigno: data di apertura + mesi PAO; scadenza = apertura + PAO.

**Non-goals (fase successiva)**: Feed social, consigli IA, "shop the look", restyling Stitch "Haute Boudoir".

**Anti-goals**: nessun dato finto precaricato; nessun tocco ai dati dell'app gallery.

**Constraints**
- Hosting: Cloudflare Workers static assets, sito statico (`output: "export"`), piano gratuito, nessuna funzione server.
- Supabase: NUOVO progetto isolato, piano gratuito (scelta dell'utente; non usare il progetto `pyngckdtetznjohtufam`, che contiene la gallery).
- Fotocamera richiede HTTPS (workers.dev lo è); testabile solo su telefono.
- Il codice a barre non contiene la scadenza: la inserisce l'utente.
- Lingua UI: italiano.

**Approaches considered**
1. Solo locale (localStorage): rapido, ma dati persi cambiando telefono. Scartato dall'utente.
2. Supabase + Google login subito. **Scelto dall'utente.**
Lookup: Open Beauty Facts (gratis, API per barcode, copertura irregolare) + catalogo condiviso come cache/colmatura. Scelta mia, motivata dalla copertura incompleta.

**Left to the builder**: layout delle schermate, microcopy, nomi interni dei componenti.

**Servono dall'utente**: credenziali OAuth Google (Google Cloud Console); variabili d'ambiente su Cloudflare.
