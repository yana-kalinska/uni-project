# Arcano — independent restaurant website concept

Open `index.html` through the repository's local HTTP server. No build step or npm installation is required. The supplied Lovable `index.tsx` contains route metadata and imports only; its referenced components were not supplied. This standalone implementation follows that metadata and section structure, rather than importing the missing React application.

- Three.js 0.180.0 is vendored in `vendor/`, including its MIT license. The wine glass uses procedural lathe/cylinder geometry, physical glass and wine materials, and generated studio reflections. No external 3D model is needed.
- GSAP and ScrollTrigger reuse the repository's existing local libraries.
- Fonts: Cormorant Garamond and Manrope via Google Fonts, with system fallbacks.
- Illustrative photography: Unsplash images `photo-1414235077428-338989a2e8c0` and `photo-1510812431401-41d2bd2722f3`. These depict atmosphere, not verified photographs of Arcano.
- Sample menu and mood copy are illustrative. Booking is a local preview and does not transmit data or create reservations.
- Pointer and scroll influence the glass; the Swirl button is keyboard accessible. Motion respects reduced-motion preferences; the page remains navigable without WebGL.

Preview: `python3 -m http.server 8000 --bind 127.0.0.1`, then visit `/projects/arcano/`.
