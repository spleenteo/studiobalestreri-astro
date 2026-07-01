---
shaping: true
---

# Riproduzione frontend studiobalestreri (Middleman → Astro) — Frame

## Source

> nella cartella /Users/spleenteo/Sites/studiobalestreri/sb-middleman-old trovi la
> vecchia versione di questo sito fatto in Middleman. Voglio riprodurre la parte di
> frontend intanto, il lyput, logo, header footer ecc. Il secondo passaggio è quello
> di ricostruire le rotte per tornare ad avere pagine e articoli. Il terzo è quello di
> ricostruire il sistema di permessi per l'accesso utenti agli articoli premium, ma
> probabilmente è una cosa che non vorrò più avere. Quello che voglio adesso è che tu
> faccia uno studio approfondito di quel codice, che ti mi /grill-me di domande per
> avere risposte (dove le so, non ho sviluppato io quel codice) e poi fai una /shaping
> per riuscire a riprodurre il frontend in Astro, connesso allo schema esistente (che
> poi dovrà essere migrato a structured text per gli articoli e le pagine).

> se oggi lo tolgo [il premium] e domani volessi ripristinare la logica, sarebbe molto
> difficile? o magari ci sono sistemi più adeguati per raggiungere il medesimo scopo
> oggi con vercel o netlify?

---

## Problem

Il sito studiobalestreri esiste in una vecchia versione **Middleman** (statica, Slim +
Sass "bemo" + jQuery/React, Netlify Functions + Netlify Identity per il premium). Lo
stesso progetto DatoCMS che alimentava quel sito è ancora vivo (environment `astro-26`,
fork di `master`) con i modelli reali: `home`, `article`, `article_category`,
`premium_articles_page`, le pagine singleton (`cv`, `contacts`, `why`, `publications`,
`customer_service`), `link`, `document`, i blocchi `text_block`/`video_block`, e `user`.

Va ricostruito il frontend su **Astro SSR** (il nuovo repo `sb-astro`, già attrezzato con
fetch tipizzato gql.tada, draft mode, SEO, content-link), connesso a quello schema. Il
vecchio stack è datato e in parte dismesso (AddThis chiuso, Netlify Identity deprecato).

## Outcome

Un sito Astro SSR che:

- riproduce l'aspetto del vecchio sito (palette, tipografia serif, layout
  header/sidebar/footer, watermark) come **base**, con libertà di ammodernare
  spaziature, scala tipografica e accessibilità;
- serve gli **stessi URL** del vecchio sito (SEO e link in entrata preservati);
- mostra **pagine e articoli** dai modelli reali, con i contenuti attuali resi come HTML
  (campi markdown), pronti per una futura migrazione a Structured Text;
- ha gli **articoli premium aperti a tutti** per ora, ma con URL/etichetta preservati e
  una cucitura server-side per riattivare facilmente il gate in futuro (auth-astro /
  Supabase, non Netlify Identity);
- mantiene le integrazioni utili (newsletter Mailchimp, privacy/cookie iubenda, feed
  RSS, condivisione con link semplici).

## Fasi (dal committente)

1. **Frontend / chrome** — layout, logo, header, footer, sidebar, stili. ← _adesso_
2. **Rotte** — pagine e articoli (liste, dettaglio, categorie, paginazione, feed).
3. **Premium** — sistema di permessi per gli articoli premium. _Probabilmente non più
   voluto; deciso: aperto ora, riattivabile._

## Decisioni di hosting

**Vercel** (deciso). Sviluppo in locale con adapter `node`; su Vercel l'adapter si sceglie
al build (via `process.env.VERCEL`) senza toccare il codice applicativo.
