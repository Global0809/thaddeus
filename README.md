# THADDEUS — A rare kind of presence

Immersive jewellery brand preview using the supplied Thaddeus campaign images and a procedural native 3D interpretation of the green-centre ring.

Public website: https://global0809.github.io/thaddeus/. The release record supplied with delivery identifies the deployed commit, archive and anonymous-host verification.

## Experience

Three connected perspectives — the stone, the setting and the presence — preserve the native Hydra selector, camera journey, scene transitions, drag and touch controls. Scroll through the ring's details into a photographic campaign release. Same-document panels provide ring details, the nine-image gallery, saved selection, ring measurement, privacy information and enquiry preparation without discarding the scene position.

The main ring is authored geometry rendered by the native runtime. Four shared jewellery mesh groups represent gold, white metal, the green centre and halo/baguette/pavé stones. A floor-reflection mesh and one batched dust draw bring each ring instance to six draws before native scene and post-processing work. The green centre uses actual intersection against 73 cut planes, with Fresnel exits, absorption and bounded internal reflection: three bounces on desktop, two on phones. The studio environment, metal and small stones use analytic shader approximations; this is not a full-frame path tracer or a certified physical gemstone simulation.

Each instance has 2,400 desktop or 1,200 phone dust points. Native ambient fields retain 250 points in an eligible active selector or macro composition. Twelve allocated ring instances belong to different native stages; they are not twelve simultaneously visible rings. Use the runtime diagnostics for allocation and current-view counts.

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

The prior approved garment-based AICANFEEL V5 remains in Git history and the tag `aicanfeel-v5-before-thaddeus`. The original Sites deployment and source archives are preserved separately.

Source checks and bounded desktop/phone captures cover the native journey, dialogs, artwork downloads, audio opt-in and context-loss recovery. An extended run exposed a native first-frame routing race, which was fixed without changing animation or gestures. Post-fix verification completed 30 rapid desktop cycles and 77 phone cycles over 20.2 minutes, including physical touch scrolling: 107 intended destinations reached with no recorded errors or failures. These are Chrome-browser observations, not physical-device full-frame FPS certification. See `NATIVE-EFFECT-INVENTORY.md` for counting rules and the scope of recorded evidence.

## Files

`index.html`, `thaddeus.css` and `thaddeus.js` provide the brand interface. `thaddeus-boot.js` performs WebGL preflight and loads the native modules. `energy-core.js` holds the ring meshes, optics and dust (the filename is a compatibility boundary). `assets/js/app.js` retains the native renderer and guarded jewellery integration. `immersive-data.js` supplies narrative data. `thaddeus/media` contains campaign derivatives and the source manifest; `thaddeus/fonts` contains Cormorant Garamond and its OFL licence. `DESIGN.md` and `.impeccable/design.json` record the implemented visual system.

GitHub Pages serves the `gh-pages` branch with `.nojekyll`; asset URLs resolve against `/thaddeus/`. Development direction and review contracts belong outside this folder and must not enter the browser-delivered package.

## Local preview

Requires Node.js; no package installation is needed. Run `npm run dev` from this folder, then open http://127.0.0.1:4184/thaddeus/. The development server binds to the local computer only. Run `npm run check` for JavaScript syntax checks. Stop the server with Ctrl+C.

Keep the `/thaddeus/` base path when publishing as this GitHub Pages project. The native renderer owns the animation lifecycle; source edits should preserve its selector, camera and touch hooks.
