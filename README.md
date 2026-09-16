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
| `assets/music/invitation-melody.m4a` | 53-second looping instrumental, composed for this page (see below) |

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

`assets/music/invitation-melody.m4a` is an original piece written for this
invitation, so no third-party licence is attached to it: harp-like arpeggios
over a I–V–vi–IV progression in D major, a plain melody above, a warm pad
underneath and a short reverb tail. 16 bars at 72 BPM — 53 seconds, AAC,
~240 KB — and the loop is a whole number of bars, so it repeats without a
seam.

It starts on its own (`options.musicAutoplay`). Browsers refuse unmuted
autoplay until the visitor has interacted with the page, so if the attempt is
refused the music starts on their first tap instead — which is nearly always
the tap that opens the envelope. Either way the volume fades in rather than
cutting in, and the button in the corner stops it.

To use your own track, drop the file in `assets/music/` and point
`options.musicSrc` at it — config paths resolve against the config file's
folder, so one value serves both templates. `options.musicAutoplay: false`
requires a press on the button; `options.music: false` removes it entirely.

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
