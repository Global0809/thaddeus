# THADDEUS — A rare kind of presence

Immersive jewellery brand preview using the supplied Thaddeus campaign images and a procedural native 3D interpretation of the green-centre ring.

Public website: https://global0809.github.io/thaddeus/. Version 3.0.0 introduces the physical-set redesign. The preceding V2 release is preserved. Publication evidence and the exact deployed commit are recorded separately in the workspace release record.

## Experience

Three connected worlds preserve the native Hydra selector, camera journey, scene transitions, drag and touch controls. The Stone suspends a free emerald among smoked cut-glass architecture. The Setting presents the ring's basket and split shank above folded teal silk. The Presence places the complete diagonal ring inside a light chamber, with a supplied campaign portrait on its distant wall. These are three aspects of one design, not separate products. The native renderer and clock own the objects and sets; no new pages, canvas or renderer are added.

Bottom in-scene navigation switches worlds directly. The camera still approaches the jewellery and releases into campaign photography. Product details and the nine-image campaign gallery now use full-screen editorial overlays; saved selection, measurement, privacy and enquiry preparation remain same-document utilities.

The jewellery is authored native geometry. The complete ring/profile uses four shared jewellery mesh groups, a floor-reflection mesh and one batched dust draw. A joined rounded shank separates into split pavé shoulders, and small cup settings support the halo. The free-emerald variant hides the metal and small-stone groups. Native set meshes provide folded silk, bevelled glass, ground and light shafts; The Presence adds a photographic back wall. The green centre intersects 73 cut planes with up to six desktop or four phone internal hits. Round halo stones use 34-plane, two-hit bounded optics in their merged draw. Lighting remains analytic; this is not a full-frame path tracer or certified physical gemstone simulation. The changed materials compiled and rendered in the desktop and phone browser checks.

Each jewellery instance has 2,400 desktop or 1,200 phone dust points. Native ambient fields retain 250 points in an eligible active selector or macro composition. Allocated instances span separate native stages and are not all visible at once. Use `THADDEUS_JEWELLERY.getStats()` and `THADDEUS_WORLD.getStats()` for jewellery/set allocation and current-view diagnostics.

## Browser features

- Save the piece on the current device; a storage failure falls back to the current visit.
- Prepare, copy, download or clear an explicitly local enquiry draft. There is no POST endpoint and nothing is sent to Thaddeus.
- Estimate inner circumference from a 12–26mm ring diameter. The illustration is not actual size, and the result does not confirm available sizes.
- Enter a name and use the native artwork overlay to download square, landscape or portrait PNGs. No automatic posting occurs.
- Choose sound explicitly. Initial audio loading is deferred until opt-in.
- Use reduced motion, keyboard focus, gallery arrows/swipe and modal focus restoration.
- Continue to ring details and campaign imagery through WebGL preflight/load-failure/context-loss recovery, with an explicit 3D retry.

## Product truth

The design and palette are interpreted from the supplied photographs. No price, gemstone/metal certification, product provenance, stock, contact destination or purchasing service is asserted. Final specifications and commercial details require confirmation. The enquiry form explicitly saves a local draft and sends nothing.

All nine campaign photographs retain the supplied image content. Eighteen WebP files provide 800px and 1600px responsive derivatives; `thaddeus/media/manifest.json` maps them to the sources. `thaddeus/social.jpg` is a resized supplied detail image. The transparent `thaddeus/share-ring.png` is a generated supporting product cutout for personalised artwork, not the main 3D object. The publication raster audit covers 251 raster files with provenance embedded or recorded in companion metadata, and zero missing records. `ASSET-PROVENANCE.md` records the supporting cutout's reference and exact prompt.

## Preservation

The approved garment-based AICANFEEL V5 remains in Git history and the tag `aicanfeel-v5-before-thaddeus`. The prior jewellery release is preserved by `thaddeus-v2-before-world-rebuild`, alongside its V2 release tags. The original Sites deployment and source archives remain separate.

This revision completed 25 desktop/phone composition captures, a focused correction confirmation, and an independent visual closure review. Fresh interaction checks verified 36 destinations, an actual phone touch gesture, gallery keyboard navigation, saved selection, local drafts, reduced motion, a single canvas and no horizontal overflow or browser errors. The recovery test passed after correcting its selector to use the visible recovery action. Previous V2 soak evidence remains separate; this revision does not claim physical-device FPS certification.

## Files

`index.html`, `thaddeus.css`, `thaddeus-world.css` and `thaddeus.js` provide the interface and editorial overlays. `thaddeus-boot.js` performs WebGL preflight and loads the native modules. `energy-core.js` holds jewellery meshes, optics and dust; `thaddeus-world-atmosphere.js` authors the physical sets. `assets/js/app.js` retains the native renderer and guarded integrations. `immersive-data.js` supplies narrative data. `thaddeus/media` contains campaign derivatives and the source manifest; `thaddeus/fonts` contains Cormorant Garamond and its OFL licence. `DESIGN.md` and `.impeccable/design.json` record the current source's visual system.

GitHub Pages serves the `gh-pages` branch with `.nojekyll`; asset URLs resolve against `/thaddeus/`. Development direction and review contracts belong outside this folder and must not enter the browser-delivered package.

## Local preview

Requires Node.js; no package installation is needed. Run `npm run dev` from this folder, then open http://127.0.0.1:4184/thaddeus/. The development server binds to the local computer only. Run `npm run check` for JavaScript syntax checks. Stop the server with Ctrl+C.

Keep the `/thaddeus/` base path when publishing as this GitHub Pages project. The native renderer owns the animation lifecycle; source edits should preserve its selector, camera and touch hooks.
