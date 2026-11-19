# Arcano — independent restaurant website concept

Open `index.html` through the repository's local HTTP server. No build step or npm installation is required. The supplied Lovable `index.tsx` contains route metadata and imports only; its referenced components were not supplied. This standalone implementation follows that metadata and section structure, rather than importing the missing React application.

- A custom SVG engraving inspired by Arcano’s stone arch forms the central collage graphic. A flat typographic wine seal continues the print motif in the wine chapter. No WebGL or Three.js is loaded.
- GSAP and ScrollTrigger reuse the repository's existing local libraries.
- Fonts: Cormorant Garamond and Manrope via Google Fonts, with system fallbacks.
- Official Arcano logo, interior and food photographs sourced from https://www.arcanobarcelona.com/en and https://www.arcanobarcelona.com/en/restaurante. Original Wix asset identifiers are documented in assets/SOURCES.md.
- Menu selections are adapted from https://www.arcanobarcelona.com/en/carta; verify the official menu for current availability and prices. Mood descriptions are editorial. The booking popup collects local preferences, then links to the official reservation page without transmitting the selections or creating a reservation.
- Includes robots noindex,nofollow for this independent design study.
- The arch responds to hover and scroll, and links to the room explorer. Animations respect reduced-motion preferences.

Preview: `python3 -m http.server 8000 --bind 127.0.0.1`, then visit `/projects/arcano/`.

## Visual direction

The revised structure takes direction from https://www.lidiaeamato.com/: oversized typography, floating object composition, contrasting editorial chapters and scroll-linked transforms. It uses Arcano’s own assets; no imagery or code was copied from the reference. Includes a full-screen keyboard-accessible navigation, room explorer and typographic menu tabs.
