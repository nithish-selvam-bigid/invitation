# Engagement Invitation — static site

A South Indian style digital invitation card. Plain HTML, CSS and vanilla JS.
No build step, no backend, no dependencies (only Google Fonts over CDN).

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Markup for the seven sections + the SVG motif sprite (kolam, toran, lotus, jasmine, gopuram, ornamental corners) |
| `styles.css` | Design system — colour tokens, paper texture, framed sections, responsive rules, print styles |
| `js/config.js` | **Everything you need to edit.** Names, dates, venue, families, quotes, photo, RSVP, options |
| `js/app.js` | Renders the config into the page: countdown, .ics calendar file, scroll reveals, jasmine petals, music toggle |
| `assets/favicon.svg` | Lotus favicon (gold on maroon) |
| `assets/couple-placeholder.svg` | Replace with the couple photograph (4:5 portrait) |
| `assets/og-image.png` | 1200×630 WhatsApp / social preview card (`assets/og-image.svg` is its editable source) |
| `assets/music/invitation-ballad.m4a` | 58-second looping piano ballad, composed for this page (the default) |
| `assets/music/invitation-melody.m4a` | 53-second brighter harp piece, the alternative |

## Two templates

| Path | Look |
| --- | --- |
| `/` (root) | **Maroon & gold** — letterpress card on handmade paper, kolam medallions, mango-leaf toran, cream envelope with a maroon wax seal |
| `/floral/` | **Floral** — ivory and dusty rose, sage foliage, jasmine garlands, a rose-wreathed hero and a rose in place of the wax seal |

Both read the same `js/config.js`, so names, dates, venue and families are
edited in one place and both designs update. The floral template loads
`../js/config.js` and `../js/app.js`; only its markup and stylesheet differ.
Each has its own favicon and OG card.

## Customising

1. Open `js/config.js` and change the values. Names, dates, venue, family names,
   quotes, RSVP number and the feature toggles all live there.
2. Replace `assets/couple-placeholder.svg` with your photograph and point
   `couple.photo` at it.
3. Edit the three social tags in `index.html` `<head>` — `<title>`,
   `meta[name=description]`, `og:*`. WhatsApp and other crawlers do not run
   JavaScript, so those cannot be filled from the config.
4. Re-render `assets/og-image.png` after editing `assets/og-image.svg`:

   ```sh
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless --window-size=1200,630 --hide-scrollbars \
     --screenshot=assets/og-image.png assets/og-image.svg
   ```

### Options (`config.options`)

| Key | Effect |
| --- | --- |
| `envelope` | Opening "Unseal the invitation" overlay |
| `countdown` | Live countdown section (reads `event.startsAt`) |
| `music` + `musicSrc` | Shows the music button. Never autoplays; empty `musicSrc` hides it |
| `floatingFlowers`, `flowerCount` | Drifting jasmine petals |

Dates use ISO 8601 with a timezone offset — `+05:30` is IST. `event.dateLabel`
and `event.timeLabel` are the strings printed on the card, so they can be worded
freely (Tamil month, muhurtham etc.); `startsAt` / `endsAt` drive only the
countdown and the calendar file.

## The music

Two original pieces ship with the site, both written for it, so no third-party
licence is attached to either:

- **`invitation-ballad.m4a`** (default) — a slow 6/8 piano ballad in G major
  over the plain vi–IV–I–V turn, with a warm pad underneath, a melody that
  comes round twice (the second pass an octave brighter) and a long reverb
  tail. 32 bars at 66 BPM, 58 seconds, ~290 KB.
- **`invitation-melody.m4a`** — brighter and lighter: harp-like arpeggios over
  I–V–vi–IV in D major. 53 seconds, ~240 KB.

Switch between them by changing `options.musicSrc` in `js/config.js`. Both
loop a whole number of bars, so they repeat without an audible seam.

Playback starts on its own (`options.musicAutoplay`). Browsers refuse unmuted
autoplay until the visitor has interacted with the page, so a refused attempt
falls back to their first tap — nearly always the tap that opens the envelope.
The volume fades in rather than cutting in, and the corner button stops it.

### Using a commercial track instead

A popular song cannot simply be dropped in here: hosting a recording, or an
instrumental cover of one, needs a licence from the rights holders even on a
private invitation page. If you want a specific song, buy a licensed
instrumental (a stock-music library, or a licensed cover from a marketplace),
put the file in `assets/music/` and point `options.musicSrc` at it.

## Running locally

```sh
open index.html          # file:// works, nothing needs a server
python3 -m http.server 8000   # or serve it, e.g. to test on a phone
```

## Publishing

Any static host: GitHub Pages, Netlify, Cloudflare Pages, Vercel, S3. Upload the
folder as-is. For WhatsApp previews to appear, the site must be served over
HTTPS and `og:image` must resolve to an absolute URL — once you know the final
address, change it to e.g.
`https://your-domain.example/assets/og-image.png`.

## Accessibility & behaviour notes

- `prefers-reduced-motion` disables petals, reveals and the scroll hint.
- Audio never autoplays; it starts only on a click.
- The card prints cleanly (overlay, buttons and petals are dropped).
- Fonts: Marcellus (headings), Cormorant Garamond (accents), Jost (body),
  Tiro Devanagari Hindi (invocation) — each with a local serif/sans fallback.
