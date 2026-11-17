# Thaddeus native effect and interaction inventory

This source tree contains the physical-set rebuild. Fresh visual, browser and workload verification is pending; previous V2 captures and stability reports describe the preserved release, not this changed appearance. The approved AICANFEEL V5 checkpoint (`d76b2197951d7f1ebada64bc45142306e1df4189`) and the prior jewellery release remain preserved separately.

## Current native composition

| World | Jewellery focal form | Physical set |
| --- | --- | --- |
| The Stone | Free faceted emerald; metal and small-stone groups hidden | Smoked clipped glass columns and a low plinth, folded petrol fabric, studio ground and shafts |
| The Setting | Profile of the basket, joined shank and split pavé shoulders | Raised folds of teal silk, restrained glass architecture and a studio shaft |
| The Presence | Complete ring posed diagonally | Glass light chamber, folded fabric and a supplied campaign portrait on a distant wall |

`energy-core.js` owns jewellery, optics and dust. `thaddeus-world-atmosphere.js` owns the physical sets. Both install into existing Hydra scene groups and receive native update calls. They add no renderer, canvas, independent animation loop or route framework. The existing selector, per-world hero/macro/final camera journey, scene blending, drag and touch grammar remain the structural authority.

## Jewellery source counts

These are definitions in the current source, not physical-device performance measurements. GPU confirmation of the new optical/material batch remains pending.

| Variant | Module triangles, desktop / phone | Module draws per instance |
| --- | --- | --- |
| Free emerald | 96 / 96 | 3: centre mesh, floor-reflection mesh and dust points |
| Setting profile / complete ring | 31,016 / 26,056 | 6: gold, white metal, centre, small stones, floor reflection and dust points |

The full ring has one joined rounded shank that separates into split shoulders, surface-oriented pavé, and small cup settings under the halo. Four jewellery geometries are shared; the small stones remain merged rather than adding a draw per stone.

- **Centre gemstone:** 73 convex cut planes, with up to six internal hits on desktop and four on phones. Actual plane intersection, Fresnel exit, absorption and total internal reflection are bounded inside the material shader.
- **Round halo stones:** 34 optical planes and two internal hits, carried in the existing merged small-stone draw. The small-stone shader distinguishes round and baguette cuts.
- **Dust:** 2,400 desktop / 1,200 phone points per jewellery instance, in one batched draw.

The optical environment and material illumination are analytic. These counts do not make the scene a full-frame path tracer or a certified physical gemstone simulation.

## Allocation and visibility

The native topology contains three selector focal objects and three stages per world, permitting twelve jewellery instances. Those allocations belong to separate native stages; they are not twelve simultaneously visible objects. The set topology contains one selector environment and three stages per world, permitting ten environment instances. Each environment uses four mesh draws; a non-selector Presence environment adds the photographic wall as a fifth. Set draws are separate from jewellery draws and native post-processing.

Native ambient fields retain 250 points per instantiated field. Combine them with dust only when the ambient field is eligible and hierarchy-visible in the same active selector or macro composition. Do not sum allocated fields, inactive render targets or offscreen stages as visible detail.

```js
THADDEUS_JEWELLERY.getStats()
// instances / points: allocation across native stages
// visible / visiblePoints / visibleDraws: current eligibility diagnostics
// items[].variant / meshes / draws / triangles / opticalBounces
// opticalPlanes: 73; diamondOpticalPlanes: 34

THADDEUS_WORLD.getStats()
// instances / allocatedDraws: set allocation
// visibleDraws / items[].visible: current set eligibility

THADDEUS_NATIVE.getEffectStats()
// allocatedParticles: instantiated native ambient allocation
// fields[].sceneEligible / hierarchyVisible: current composition eligibility
// visibleNativeAmbientParticles: intersection of those conditions
```

Visibility diagnostics identify scene eligibility and recent native updates; they are not per-pixel occlusion or GPU timestamp measurements. No full-frame FPS, thermal or GPU-memory certification is inferred from allocation, callbacks or source counts.

## Preserved and adapted mechanisms

| Mechanism | Current treatment |
| --- | --- |
| Selector, native mobile slider, camera path, drag and touch | Preserved; three focal forms now share authored material worlds |
| Explicit world router | Preserves the V2 correction that respects the router tween's active state and completes at the requested integer target |
| In-scene world controls | Same-document buttons call the existing native navigation; active state uses `aria-current` |
| World HUD contrast | A 190px dark lower fade protects the bottom controls in selected hero/macro states; it does not replace the set |
| Bloom, depth-of-field and renderer resolution policy | Preserved; GPU-tier dependent rather than promised on every device |
| Fixed-background quads and ambient fields | Preserve the teal studio-light adaptation and original scene transforms |
| Plexus and sports Proton/streak fields | Disabled; sports-associated visuals and pairwise CPU plexus work are not reintroduced |
| Personalised artwork | Original native ShareOverlay/ShareCard, name entry, square/landscape/portrait PNG generation and local download |
| Artwork branding | Supporting ring cutout, font-rendered Thaddeus wordmark, teal grounds; invented edition numbers remain disabled |
| Audio | Existing graph and scene filtering; download deferred until explicit sound choice |
| Reduced motion | Freezes jewellery, dust, native ambient, backdrop and set time; removes dialog/image animations |
| Recovery | WebGL preflight and load/context-loss recovery expose ring/gallery content and an explicit retry; automatic GPU restoration is not claimed |
| Original sports props, garment videos, ticker and garment logo | Suppressed as part of the jewellery adaptation |

## Original emitter baseline

The original UIL configured four floating fields of 250 points, one plexus field of 1,000 desktop / 700 phone points, and three Proton emitter entries of 100, 50 and 100. One streak component defines 37 instances. These belong to separate layouts and output types, not one simultaneously visible particle total. The current ambient diagnostic must establish actual instantiated and active fields.

## Browser utilities and assets

Saved selection and enquiry drafts stay on the visitor's device, with visit-only fallback when storage is unavailable. Enquiry save, copy, text download and clear actions have no remote POST destination and never report a message as sent. The diameter-to-circumference tool is a measurement aid, not a stock-size or professional-fitting guarantee.

The nine supplied campaign images remain the source photographs. Eighteen responsive WebP files are resized/compressed derivatives recorded in `thaddeus/media/manifest.json`. Display crop/tint on the spatial back wall is compositing, not generative alteration of those files. The supporting transparent `thaddeus/share-ring.png` is a generated cutout for personalised artwork, not the interactive geometric object. `ASSET-PROVENANCE.md` records its reference and exact prompt. The preserved raster audit recorded provenance embedded or in companion metadata for 251 rasters, with zero missing records.

## Evidence boundaries

The previous V2 native batches in workspace `outputs/thaddeus-native-qa/` and `outputs/thaddeus-native-confirm/` verified artwork PNGs, opt-in audio, panel input restoration and context-loss content recovery. They produced square 740×740, landscape 1200×600 and portrait 740×1315 downloads. The later eighteen-capture verdict and navigation regression also belong to that release.

The V2 regression completed 30 desktop and 77 phone cycles; all 107 explicit destinations were correct and all 77 phone gestures moved the scene. This preserved evidence does not validate the new glass, silk, jewellery materials, full-screen editorial layouts or changed draw workload. Fresh V3 evidence is recorded separately: 25 composition captures, a focused visual correction confirmation, 36 correct route destinations and a real phone swipe from scroll 0 to 528, gallery/save/draft/reduced-motion checks, and a separately corrected fallback-action test. The exact deployment and anonymous-host evidence belong to the external V3 release record. A new long-duration soak or physical-device FPS certification is not claimed.
