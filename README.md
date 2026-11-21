# She Builds the World

A self-contained mini-CV gallery of public female role models across **mechanical engineering**, **cybersecurity**, **artificial intelligence**, **product design**, **marketing**, **retail**, and **information technology (IT)**, drawn from around the world. Built as a starter look-up list for a girl in Riyadh — not a ranking.

## How to open

**Easiest:** double-click `index.html` (or open it in any browser). Portraits load from the local `portraits/` folder, so the gallery works offline except for Google Fonts.

**If portraits fail to show** (some browsers restrict `file://` paths), serve the folder:

```bash
cd /workspace/me-role-models
python3 -m http.server 8765
```

Then visit <http://127.0.0.1:8765/>.

## What’s inside

| File | Purpose |
| --- | --- |
| `index.html` | The gallery |
| `styles.css` | Editorial layout (navy / cream / brass / terracotta) |
| `app.js` | Domain filters, group filters, search, mini-CV panel |
| `profiles.js` | Verified public facts only |
| `portraits/` | Local official photos (no hotlinking; monogram fallback) |

**Domain chips (primary):** All domains · Mechanical Engineering · Cybersecurity · Artificial Intelligence · Product Design · Marketing · Retail · Information Technology  

**Group chips (secondary, within domain):** All · Watch this week · Industry leaders · Trailblazers. Use the country/region dropdown to find women from a specific place (e.g. GCC, Levant & Iraq, North Africa).

Click a card for a side-panel mini-CV. Press **Esc** to close. Search covers name, field, tags, and domain.

People without a freely downloadable official portrait use a brass monogram on navy. No generated faces. Adjacent fields are tagged.

## Sources

Bios and bullets were taken from Wikipedia, NASA, MIT, Stanford, KAUST, ASME, Black Hat MEA, EFF, CISA/RSAC pages, TED, university pages, and the listed personal/org pages. Social URLs that could not be verified were omitted. LinkedIn URLs came from public indexes and may require login.

## Update — 11 Oct 2026

- 137 profiles (23 new). Every profile now has `country` and `region` fields.
- New country/region dropdown filter; search also matches country.
- Each mini-CV shows a **Sources** line listing its verification URLs.
- "Last updated: 11 Oct 2026" line in the hero; hero count is computed from `PROFILES.length`.

## Update — 5 Nov 2026

- **Yes — looking into Africa and Asia.** Added 29 verified profiles focused on sub-Saharan Africa and Asia (plus existing MENA coverage under Near home).
- New `Africa` region in the country/region filter (alongside `Asia`, GCC, Levant & Iraq, North Africa, Americas, Europe, Oceania).
- Last updated: 5 Nov 2026. Total profiles: 166.

## Update — 21 Nov 2026

- Worldwide focus: the "Near home (Saudi/MENA)" group filter was removed; its 80 profiles were reassigned to Industry leaders, Trailblazers or Watch this week. Middle East women remain findable via the country/region filter.
- Three new domains: Marketing, Retail, Information Technology, seeded with 23 verified profiles.
- Last updated: 21 Nov 2026. Total profiles: 189.

## Live site & updates

Published free on GitHub Pages: https://business-tales.github.io/she-builds-the-world/

Profiles are refreshed weekly with verified public facts. Photos come from official pages or Wikimedia Commons (credited to their original authors under their Commons licences); people without a reliable public photo show a monogram.
