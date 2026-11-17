# Thaddeus native effect and interaction inventory

The approved source checkpoint is AICANFEEL V5 (`d76b2197951d7f1ebada64bc45142306e1df4189`). The prior Thaddeus V1 conversion kept its native Hydra engine, but its energy-mode adapter disabled several ambience and personalisation systems. This release restores meaningful native mechanisms with jewellery-specific visuals.

## Original configured emitters

These values come from `assets/data/uil.json`, `Tests.floatingParticles()`, `Tests.plexusParticles()` and the original custom component implementations. They describe separate layouts and are **not one simultaneously visible scene**.

| Original system | Configured locations | Count in each configured component | Interpretation |
| --- | --- | --- | --- |
| `FloatingParticles` | Selector; world 1, 2 and 3 macro/product sections | 250 point vertices each | Four independent fields. Normally one selector or active macro field contributes to the displayed composition. |
| `PlexusEffect` | World 3 macro/product section | 1,000 desktop / 700 mobile | Particle vertices plus dynamically built pairwise connection lines. Its CPU distance loop checks particle pairs. |
| `Proton` | `sectionlayout_bgLines`; world 1 product; world 2 product | Config values 100, 50, 100 | Configured emitter slots. These are not reliable proof of visible point vertices: the configured outputs include custom instanced geometry. |
| `InstancedMeshLines` | World 2 product/background-line paths | 37 instances per constructed component | Streak geometry, not particles. One custom component can be produced by an emitter; do not sum 37 and emitter counts as independent visible objects. |
| `InstancedMeshLines2` | World 2 product | Source-defined geometry system | Streak geometry. Must be inspected at runtime before claiming an actual visible instance count. |

There are eight configured emitter entries: four floating fields, one plexus field and three Proton entries. An arithmetic aggregate of the point/emitter config numbers is 2,250 desktop / 1,950 mobile, but it mixes layouts and output types; it is not a rendering or visual-complexity measurement.

## Native mechanism treatment

| Mechanism | Thaddeus treatment |
| --- | --- |
| Three-object selector and native mobile slider | Retained. Same named groups, hitboxes, world state and transition controller. Ring viewpoints replace garments. |
| Native per-world hero/macro/final scene journey | Retained. Camera paths approach jewellery details; the campaign image releases the final scene into the supplied photographic world. |
| Native pointer camera offsets, drag, arrows and touch navigation | Retained. Root interface may queue explicit perspective selections during a native lock; the native gesture implementation remains. |
| Explicit native world-router startup | Fixed a proven Thaddeus transition race: the deferred drag flag could clear before the router tween's first update, so the next integer-position frame incorrectly finalised the previous world. The loop now respects the router tween's `animating` state in Thaddeus mode, and its completion writes the exact integer target before releasing that state. Native tween timing, easing and gesture physics remain unchanged. |
| Native scene transition blending | Retained. Dark petrol/teal replaces garment-era red and white world colours. |
| Original `FloatingParticles` component and scene transforms | Restored wherever the four original configured layouts instantiate the component. Still 250 actual point vertices per instantiated field, one batched draw per field. The shader uses restrained teal/gold tint and slower movement. Reduced motion freezes motion and shimmer phase. |
| Original plexus and sports-associated Proton/streak fields | Kept disabled. The expensive pairwise plexus and old sports semantics are replaced by the jewellery module's own batched gemstone-light field. Confirm the module's **actual attribute count** at runtime rather than quoting a planned number. |
| Bloom, depth-of-field and native renderer resolution policy | Native mechanisms retained. Bloom/DOF remain GPU-tier dependent; their presence in source does not prove they run on every device. |
| Native `FixedBackground` quads | Retained quad geometry now carries a restrained analytical studio-light shader: asymmetric cyan shafts and soft refracted bands, darker behind left-aligned copy. No extra canvas, render target or pass. Reduced motion freezes the light phase. |
| Original `ShareOverlay` and `ShareCard` | Restored through `THADDEUS_NATIVE.openShare(name)`. Preserves native overlay transitions, name-based artwork, square/landscape/portrait PNG generation and downloads/share fallbacks. |
| Personalised card branding | Ring screenshot asset at `thaddeus/share-ring.png`; actual font-rendered Thaddeus wordmark texture; dark teal backgrounds; pale teal personalisation; muted grayscale post effect. No garment logo/artwork is intentionally rendered. |
| Faux campaign edition numbering | Disabled for Thaddeus. Generated artwork does not claim a production number or participant count. |
| Inline garment-era ticker and name-entry scene | Kept suppressed. Personalisation is exposed through the Thaddeus visual-creation interface, keeping scene copy readable around the ring. |
| Original audio graph and scene-sensitive filtering | Retained, explicit visitor opt-in. Native gain/filter/warp/drag hooks remain in the engine. |
| Initial audio download | Deferred until the first explicit sound choice in Thaddeus mode. The existing native decode/media-element graph is unchanged. The original non-Thaddeus eager-load branch remains available. |
| Background visibility behaviour | Native renderer pause/resume remains. Hidden-tab pausing must be exercised in a browser that actually changes `document.hidden` before being called verified. |
| Native scroll instruction sprites | Replaced by the root Thaddeus hint typography. Underlying camera/scroll handlers are retained. |
| Sports props, old clothing videos and garment raster logo | Suppressed. Their visual semantics do not fit jewellery; replacing them is an intentional brand adaptation. |

## Current ring module and counting rules

`energy-core.js` authors real ring geometry, shared across native stages. Each instance contains four jewellery meshes (gold, white metal, centre stone and small stones), one floor-reflection mesh and one dust point draw: six draws inside the ring module, before native scene and post-processing work. Geometry detail is reduced on phones.

The centre stone's convex cut resolves to **73 optical planes**. The fragment shader performs real cut-plane intersections, Fresnel exits, distance-based green absorption and total internal reflection, bounded to **three internal bounces on desktop and two on phones**. Its lighting environment is analytic; metal and small-stone shading are stylised studio approximations. This is not a full-frame path tracer or a certified physical gemstone simulation.

Each ring instance owns **2,400 desktop / 1,200 phone dust points** in one batched draw. Twelve ring instances are allocated across selector, hero, macro and final native stages; that does not mean twelve rings or all their points contribute to the current composition. Combine visible ring-module dust with the **250 native ambient points** only when the ambient field is eligible and hierarchy-visible in the same active selector or macro state. Allocation totals, inactive targets and offscreen previews are not visible detail.

```js
THADDEUS_JEWELLERY.getStats()
// instances / points: allocation across native stages
// visible / visiblePoints / visibleDraws: current eligibility diagnostic
// opticalPlanes: 73
// items[].opticalBounces: 3 desktop, 2 phone
```

The point and draw diagnostics describe source-defined rendering work, not physical-device FPS. A performance claim requires a measured frame workload on a stated device and scene.

## Runtime evidence API

```js
THADDEUS_NATIVE.getEffectStats()
// fields[].particles: actual position-attribute count
// allocatedParticles: all instantiated original floating fields, including inactive render targets
// fields[].sceneEligible: active selector or visible current-world macro
// fields[].hierarchyVisible: native object's visible-ancestor check
// visibleNativeAmbientParticles: intersection of those two conditions

await THADDEUS_NATIVE.openShare('YOUR NAME')
THADDEUS_NATIVE.getShareState()
```

The native ambient diagnostic deliberately distinguishes allocation from the current composition. For total active particle counts, combine it with the ring module's own diagnostics only for the same active native scene. Points that render in inactive targets, hidden stages, diagnostic pages or offscreen previews are not visible detail.

## Local validation

The following is bounded local evidence from 17 November 2026. Public source/deployment identity and anonymous-host verification are recorded separately in the final release manifest.

The native source passes `node --check`. Two sequential owned-Chrome batches are recorded in `outputs/thaddeus-native-qa/report.json` and `outputs/thaddeus-native-confirm/report.json` (workspace-root output paths, outside this publication folder). Their browsers were closed after completion.

The final combined capture ran from **2026-11-17 14:13:50 UTC to 14:14:37 UTC**. It records per-capture timestamps and SHA-256 hashes for the native app, ring module, UI script, stylesheet and boot loader. Those five files remained unchanged throughout the batch.

- Desktop and iPhone-profile entry show three instantiated native floating fields, 750 allocated points, and 250 scene-eligible/hierarchy-visible native ambient points in the selector. The world 1 macro likewise exposes 250 visible native ambient points. The fourth UIL-configured field must not be counted as instantiated without observing it.
- Five original background quad shaders were allocated across native layouts. All five backdrop motion uniforms and all instantiated ambient motion uniforms were `0` in the reduced-motion phone context. Allocation is not a current-view draw count.
- The root personalisation form accepted `Noor`, and the actual native generated-card cache retained that name.
- Keyboard Enter downloaded a **740×740** square PNG; Space downloaded a **1200×600** landscape PNG; Enter downloaded a **740×1315** story PNG. PNG signatures and dimensions were read from the downloaded files. Local filenames are `thaddeus-square.png`, `thaddeus-landscape.png`, `thaddeus-story.png`. No automatic social posting occurs.
- Saved-image review confirmed Thaddeus branding and personalised text. The landscape card's inherited half-width gradient seam was removed and its final downloaded PNG reviewed.
- Native share close restored wheel input: scroll moved from 0 to 500 in the first batch. Both batches produced no page errors or missing-resource responses.
- Final desktop entry transferred 4,494,230 bytes across 47 resources; the phone context transferred 5,562,134 bytes across 55 resources. These are this local-browser run's measured resource transfers, not promises for every network, cache or device. The earlier desktop entry before lazy audio transferred 6,187,195 bytes.
- Both desktop and iPhone-profile contexts requested **zero MP3 resources before opt-in**, then one MP3 resource after the first explicit sound choice. First sound-on and second sound-off states passed. No obsolete clothing MP4 was requested.
- Fresh 1440×900 desktop and phone captures cover selector, hero, macro progress 0.46, campaign, and 360px hero. A true `WEBGL_lose_context` event was triggered last in the phone context; immediate recovery appeared and its piece/gallery buttons both opened their intended dialogs.

The first batch also measured 325 native render callbacks over roughly 1.8 seconds on the headless test machine. This is a native-clock observation, **not** a full-frame or physical-device FPS certification. Hidden-tab pausing remains separate from the verified context-loss recovery and is not claimed here. Public publication and anonymous-host verification remain root-owned.

A later 18-capture confirmation is recorded in the workspace's `outputs/thaddeus-review-verdict/report.json`. It covers desktop selector poses, phone product width and companion product/gallery states with settled stage/canvas/viewport bounds, source hashes and zero reported errors. The independent verdict resolved the two scored layout findings. That verdict is limited to the fix batch; it does not replace extended runtime stability validation.

## Later stability finding and bounded correction

An extended phone soak exposed an explicit perspective request returning to its previous world. The non-invasive route trace in `outputs/thaddeus-phone-route-repro.json` proves the requested `white-tracksuit/1` route entered the native transition at approximately 30,742 ms, then the native router emitted the old `bomber/1` route about 4 ms later, before its 1,500 ms tween could progress. The accepted fix is limited to the two native router conditions described above. Syntax passes; root's post-fix repeated-route and sustained-touch confirmation is pending. This finding does not invalidate the separately verified artwork, audio and recovery controls, but the earlier capture hashes precede this router correction.

## Assets and browser-only utilities

All nine campaign photographs retain the supplied image content. Eighteen responsive WebP derivatives are recorded in `thaddeus/media/manifest.json`; they were resized/compressed without generative changes. The supporting transparent `thaddeus/share-ring.png` was generated from a supplied design reference for the personalised artwork panel. It is not the main interactive object. `ASSET-PROVENANCE.md` records its exact prompt and reference. The publication audit records provenance embedded or recorded in companion metadata for 251 raster files, with zero missing records.

The root interface includes local saved selection, enquiry save/copy/text-download/clear, privacy preferences and diameter-to-circumference measurement. Enquiries have no remote POST destination and are labelled as local drafts. WebGL preflight precedes runtime loading; load failure or context loss offers piece/gallery access and an explicit retry. Context-loss recovery is a content-recovery state, not a claim of automatic GPU context restoration.

## Completed post-fix navigation regression

The initial 32-minute desktop run completed 85 cycles, but its subsequent phone run exposed a dropped destination; that combined run is not presented as a pass. A valid route trace showed a native finish only four milliseconds after a request, before the 1500ms router tween could progress. The Thaddeus-only loop guard now respects the active router animation and completion assigns the exact target.

The final unchanged-source regression completed 30 rapid desktop cycles plus 77 phone cycles across 20.2 phone-profile minutes. All 107 explicit destinations were correct; all 77 phone touch gestures moved the scene. The report records no page errors, HTTP errors, non-abort request failures, panel drift or horizontal overflow. Eight active source files matched their start hashes. Actual physical-device FPS, thermal behaviour and GPU-memory stability are not inferred from these tests.
