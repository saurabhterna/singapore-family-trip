# Singapore family trip

A mobile-friendly, public itinerary hosted on GitHub Pages. Days 0 and 1 are ready; later days will be planned incrementally. Day 1 opens by default, and `#day0` / `#day1` links select a day.

## Privacy

This repository and website are public. They contain no PDF documents, passports, visas, QR codes, booking references, contact information or payment details.

Document buttons are placeholders until restricted Google Drive links are supplied and verified. Documents must remain in Google Drive with **General access: Restricted**, shared only with intended accounts. Links themselves do not provide access. Never upload documents to this repository or its Pages build.

The `noindex` metadata discourages search-engine indexing but does not make the website private. The checklist is saved in the visitor's own browser; it is not synchronised or sent to a server.

## Editing

- `index.html`: itinerary and flight information.
- `styles.css`: responsive layout and print styling.
- `app.js`: local checklist, day navigation, one-tap Google Maps URLs and external document links.

Day 1 includes the one-change airport MRT route via Expo, a two-change alternative, child travel-card guidance and hotel rest. Two accessible evening tabs preserve the original Merlion-first route (`#day1-merlion`) and add a playground-first alternative (`#day1-playground`): PropNex, the bay loop to Merlion, Indian dinner and 9pm Spectra. Each has a tired-child fallback. The all-maps directory follows the selected tab. The alternative visits PropNex in daylight, without promising glowing sand; the original proposes 7:30pm, but exact illumination start time is unconfirmed. Estimated journey times are not live directions. Official source links are included under the Day 1 review notes.

There is no build step. GitHub Pages publishes the root of the `main` branch. Preserve `.nojekyll`. Use an explicit file allowlist when committing. Do not copy in a full local travel folder.

Flight times and baggage are from the booked ticket, not live airline data. Reconfirm before travel. Carry original passports and printed visas; this website does not replace travel documents.
