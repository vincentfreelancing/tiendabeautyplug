# Black Friday 2026

The countdown and the Pure Seduction Whipped -10% offer are time-gated.

- Sale window (America/Bogota, UTC-5): **2026-11-27 00:00** through **2026-11-30 23:59:59**.
- `saleEnd` includes Cyber Monday. That end date is a reasonable default; change `BLACK_FRIDAY_END` in `shared/products.js` (and the matching `saleEnd` on the product) if you want a different close.
- Client-side JS (`shared/products.js` `BP_SALE` + `shared/store.js`) shows the 76.500 price, strike-through 85.000, and “Black Friday -10%” badge only inside that window. The banner reads “Black Friday empieza en” + days/hours/min/sec until midnight Nov 27, then “BLACK FRIDAY — ¡Ya empezó!”. After `saleEnd` the banner hides and regular prices return.
- Static HTML and JSON-LD cannot time-gate themselves. `scripts/generate-seo-pages.mjs` uses the **build time** (or `BP_NOW`) to decide whether to bake the sale into pages. Rebuild and push on Nov 27 so Google and no-JS visitors also see 76.500.

## Publish the countdown (after preview approval)

Merge `bf-countdown-preview` into `main`, then push. Do this whenever the countdown should go live (before Nov 27). If you merge before Nov 27, generate pages without `BP_NOW` so static prices stay at 85.000.

```bash
cd /workspace/beauty-plug/site
git checkout main
git merge --ff-only bf-countdown-preview
export GH_TOKEN=$(cat ~/.config/bp/gh_token) && git -c credential.helper= -c 'credential.helper=!f(){ echo username=x-access-token; echo "password=$GH_TOKEN"; };f' push -q origin main
```

## Commands to run on Friday Nov 27, 2026 (America/Bogota)

Run these after midnight Bogotá time so the generator bakes sale prices into the static pages and JSON-LD. The on-page JS will already have flipped at 00:00.

```bash
cd /workspace/beauty-plug/site
git checkout main
git pull
node scripts/generate-seo-pages.mjs
git add -A
git status
git commit -m "Activa las páginas estáticas de Black Friday (76.500 y JSON-LD)"
export GH_TOKEN=$(cat ~/.config/bp/gh_token) && git -c credential.helper= -c 'credential.helper=!f(){ echo username=x-access-token; echo "password=$GH_TOKEN"; };f' push -q origin main
```

After Cyber Monday (Dec 1, 2026 or later), run the same generate / commit / push steps so static pages return to 85.000.

## Local testing (do not commit fakes)

- Client: open a page with `?bp_now=2026-11-27T00:00:00-05:00` (or `window.BP_NOW`).
- Generator: `BP_NOW=2026-11-27T00:00:00-05:00 node scripts/generate-seo-pages.mjs`, inspect pages, then regenerate **without** `BP_NOW` before committing if it is still before the sale.
