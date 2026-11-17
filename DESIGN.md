---
name: Thaddeus
description: An immersive jewellery light room built around one emerald-green ring.
colors:
  night: "#021113"
  ink: "#041b1e"
  paper: "#ecf3ec"
  muted: "#b2ccc8"
  line: "#476669"
  gold: "#e5cb91"
  panel: "#05272b"
  field: "#092e31"
  field-stroke: "#6c8a84"
  secondary-stroke: "#76938d"
typography:
  display:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(45px, 5.2vw, 76px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  opening:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(38px, 6.2vh, 58px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  panel-title:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "58px"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DIN, Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.75
  action:
    fontFamily: "DIN, Arial, sans-serif"
    fontSize: "13px"
  label:
    fontFamily: "DIN, Arial, sans-serif"
    fontSize: "12px"
  wordmark:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "33px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.13em"
rounded:
  square: "0"
spacing:
  action-gap: "12px"
  row-gap: "20px"
  phone-panel-edge: "24px"
  desktop-edge: "48px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 20px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.gold}"
  button-secondary:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "15px 20px"
    width: "100%"
  button-secondary-hover:
    textColor: "{colors.gold}"
  text-action:
    textColor: "{colors.gold}"
    typography: "{typography.label}"
    padding: "15px 0"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "13px"
    width: "100%"
  dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    width: "min(1100px, calc(100vw - 64px))"
  navigation:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
---

# Design System: Thaddeus

## Overview

**Creative North Star: "The Light Room"**

The supplied Thaddeus campaign establishes a dark petrol room cut by turquoise light, emerald depth and warm gold. The ring is the focal object. Quiet, high-contrast serif lettering gives the brand an engraved character; DIN keeps navigation and practical information restrained.

The visual system lives inside the preserved native Hydra journey. The opening offers three perspectives on the same design, followed by a selected hero, a close camera approach and a full-screen photographic release. Same-document panels provide useful detail while preserving the visitor's place in the scene.

**Key Characteristics:**

- One real geometric ring, seen through three connected perspectives.
- Petrol and teal grounds, luminous material, paper-white text and gold actions.
- Short serif statements paired with quiet DIN controls.
- Square, bordered panels that recede around imagery and the 3D object.
- Native motion and touch grammar, with reduced-motion and recovery states.

## Colors

The palette pairs a cool, low-light room with pale reading surfaces and a restrained warm action colour. Frontmatter values are the normative CSS colours extracted from `thaddeus.css`.

### Primary

- **Warm Gold** (`gold`): underlined scene actions, hover emphasis, selected-image borders, focus outlines and measurement results.

### Neutral

- **Petrol Night** (`night`): the full-viewport scene ground and dark image containers.
- **Deep Ink** (`ink`): text on pale primary buttons and toast messages.
- **Paper Light** (`paper`): primary reading text and the pale primary action surface.
- **Mist Teal** (`muted`): supporting copy, labels and secondary scene information.
- **Studio Line** (`line`): dialog edges, dividers and detail rows.
- **Teal Panel** (`panel`): the same-document overlay surface and close control.
- **Teal Field** (`field`): editable form surfaces.
- **Field Stroke** (`field-stroke`) and **Secondary Stroke** (`secondary-stroke`): practical field and secondary-button boundaries.

**The Warm Action Rule.** Use gold to identify an action, selection or focus state. Keep the room itself cool; material light and supplied photographs provide the richer colour.

## Typography

**Display Font:** self-hosted Cormorant Garamond, registered in CSS as `Thaddeus`, with Georgia and serif fallbacks.

**Body Font:** self-hosted URW DIN, registered as `DIN`, with Arial and sans-serif fallbacks. Light and Medium source files supply the interface weights.

**Character:** fine serif strokes and close display tracking carry the jewellery voice. Controls remain plain and legible, without competing with the ring.

### Hierarchy

- **Display:** the selected-perspective statement uses the `display` token and deliberate line breaks. On phones it resolves to 40px, and 37px at the narrow breakpoint.
- **Opening:** the desktop opening uses the `opening` token, with its size and top position tied to viewport height to reserve the ring's motion envelope. It resolves to 40px on phones and 36px on narrow phones.
- **Panel title:** the `panel-title` token leads product, gallery and utility panels; the phone size is 44px. The visual-creation panel has a 43px phone title.
- **Body:** product and panel copy use `body`; phone copy is 14px. Panel introductions stay within 52ch; scene description blocks are shorter, at 24ch.
- **Action and label:** primary actions use `action`; navigation, form labels and detail rows use `label`.
- **Wordmark:** `wordmark` uses separated serif capitals. It resolves to 27px on phones and 24px at the narrow breakpoint.

**The Object First Rule.** Reserve room for the entire animated ring silhouette before placing display copy. Keep headlines short and preserve authored line breaks where they define the composition.

Existing 10–11px scene HUD text is a compact inherited treatment, not a general label size to extend to new reading surfaces.

## Layout

The experience occupies one fixed viewport (`100dvh`) with native camera movement rather than document scrolling. Desktop header and footer edges sit 48px from the viewport; the header uses 30px vertical padding. The opening is centred above a three-column perspective selector. Selected-perspective copy sits at the left, outside the ring silhouette. Campaign photography covers the viewport, with perspective-specific framing and copy placement.

The main responsive breakpoint is 900px. At and below it, navigation becomes a compact Menu, the header uses 25px horizontal edges, hero copy moves above the ring, and secondary hero description text is hidden. The native mobile slider preserves touch navigation and intentional neighbouring-object cropping. The 380px breakpoint further reduces display and wordmark sizes. A landscape rule for heights of 540px or less condenses the opening and removes secondary copy; desktop heights of 680px or less also suppress the opening support line.

Dialogs are bounded by the viewport and scroll internally. Desktop product detail is a two-column image/information grid; phones use one full-width column. The close control lives in a zero-height sticky control layer, with an absolutely positioned button, so it stays reachable without narrowing the grid. Other panels use 75px 60px 55px padding on desktop and 65px 24px 35px on phones. Form rows, the measurement layout and visual-creation layout collapse to one column on phones.

**The Scene Continuity Rule.** Open details, gallery, selection and utilities in the same-document overlay. Preserve the underlying camera position and restore native input when the overlay closes.

## Elevation & Depth

Depth comes primarily from native ring geometry, the camera approach, analytic studio lighting, the bounded internal gemstone shader, atmospheric points and photographic framing. Flat interface panels use borders and tonal separation. The modal backdrop darkens and blurs the scene rather than presenting a floating card stack. Native bloom and depth-of-field remain device-tier dependent.

### Shadow Vocabulary

- **Macro caption protection** (`0 2px 20px #001315`): text shadow behind the short macro caption.
- **Supporting ring cutout** (`drop-shadow(0 18px 28px rgba(0,0,0,.22))`): soft separation inside the visual-creation panel.
- **Measurement illustration** (`inset 2px 2px 5px #001416, 2px 3px 10px #001416`): physical depth in the diagram only.

The macro state also adds a dark lower fade behind the chapter and footer. This is a local readability layer, not a replacement for the native background.

**The Native Depth Rule.** Extend the existing renderer and its clock for spatial effects. The main product remains authored geometry; a supporting cutout must not substitute for the interactive ring.

## Shapes

Interface controls, fields, dialogs and photographic thumbnails use square corners. Thin borders mark structure and selection. Circular geometry belongs to the ring and its measurement illustration. The jewellery's clipped rectangular centre, faceted halo, baguettes and split shoulders provide the distinctive form language; avoid echoing those complex shapes in every control.

## Components

### Buttons

Primary actions are calm, full-width pale bars, with ink text and a right-side SVG arrow. They use the `button-primary` token and become gold on hover. Secondary actions are transparent, square and outlined; their border and text become gold on hover. Scene actions use gold underlines or the `text-action` treatment. Interactive scene targets maintain a 44px minimum height; primary and secondary panel actions have a 50px minimum height.

All keyboard-interactive controls use a gold 2px focus outline with a 5px offset. Source SVGs supply arrows, close, gallery navigation and measurement controls; the UI does not depend on icon-font or decorative Unicode substitutes.

### Cards / Containers

The principal container is the square bordered dialog, not a repeating catalogue card. Its backdrop uses a dark translucent fill and 8px blur. Product detail pairs a cropped supplied campaign image with text; gallery images use containment so the complete frame remains visible. The saved-piece row uses one thumbnail and concise actions.

### Inputs / Fields

Form inputs use the `input` token, a thin field stroke and the shared gold focus outline. Labels sit above fields with a 10px gap. Textareas have a 110px minimum height. Invalid non-empty email input gains a warm border; local status text uses gold and states whether the draft was saved, copied or downloaded.

### Navigation

The serif wordmark returns to the opening. Desktop navigation exposes the ring, campaign and saved selection. Phone navigation retains saved selection and opens a menu containing the three perspectives and utility panels. Perspective choices pair short serif names with a quiet supporting line. Their native lock state disables entry during transitions.

### Campaign Gallery

The gallery displays one complete supplied frame, with previous/next SVG buttons, a live count and a horizontally scrollable thumbnail strip. Selected thumbnails use a gold border and full opacity; others are subdued. Keyboard arrows and horizontal swipe change images, while vertical panning and pinch zoom remain available.

### Personalised Visual

A square transparent supporting ring cutout introduces name entry. The native share overlay then creates square, landscape and portrait PNGs in the visitor's browser. Its type and teal surfaces follow the room; it does not display invented edition numbers or automatically post to a service.

### Motion and Recovery

The native renderer owns the ring's slow pose changes, drag response and camera progression. The photographic release has a slow 16-second frame movement. Reduced motion removes this image animation and freezes native jewellery, dust, ambient and backdrop phases. Sound starts only after explicit opt-in. A failed or lost WebGL context presents ring/gallery access and an explicit retry while preserving access to useful content.

## Do's and Don'ts

### Do:

- **Do** preserve the native continuous selector, camera, drag and touch journey.
- **Do** use the supplied campaign photographs as the photographic and palette authority.
- **Do** protect the ring's complete motion envelope and keep controls outside its silhouette.
- **Do** use square, restrained controls with the shared gold focus treatment.
- **Do** preserve full-width phone panels, internal scrolling and an always-reachable close control.
- **Do** describe local drafts, device storage and download actions truthfully.

### Don't:

- **Don't** turn the three perspectives into three invented products or a stacked shop template.
- **Don't** replace the interactive geometric ring with the supporting PNG cutout.
- **Don't** generatively alter the nine supplied campaign photographs.
- **Don't** invent prices, certified materials, availability, testimonials or a working checkout/contact destination.
- **Don't** claim an enquiry was sent or a visual was posted when the action stays in the browser.
- **Don't** extend the inherited small scene HUD text into a general reading-size rule.
