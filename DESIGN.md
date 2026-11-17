---
name: Thaddeus
description: Three sculptural light rooms reveal the stone, setting and presence of one jewellery design.
colors:
  night: "#021113"
  ink: "#041b1e"
  paper: "#f1f0e3"
  muted: "#bbd1cb"
  line: "#496963"
  gold: "#e5cb91"
  panel: "#031c20"
  gallery: "#010e10"
  field: "#092e31"
  field-stroke: "#6c8a84"
  secondary-stroke: "#66847a"
typography:
  display:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(56px, 5.2vw, 76px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  opening:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(46px, 5.6vw, 80px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  piece-title:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(62px, 5vw, 82px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  gallery-title:
    fontFamily: "Thaddeus, Georgia, serif"
    fontSize: "clamp(58px, 5vw, 82px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.03em"
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
    fontSize: "31px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.105em"
rounded:
  square: "0"
  close-control: "50%"
spacing:
  action-gap: "12px"
  row-gap: "20px"
  phone-panel-edge: "24px"
  desktop-edge: "44px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px 20px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
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
  fullscreen-dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    width: "100vw"
    height: "100dvh"
  close-control:
    rounded: "{rounded.close-control}"
    width: "46px"
    height: "46px"
  navigation:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
---

# Design System: Thaddeus

## Overview

**Creative North Star: "The Sculptural Light Rooms"**

The supplied campaign establishes petrol shadow, turquoise light, emerald depth and warm gold. The local implementation gives these materials a physical setting: cut-glass architecture, folded silk, an obsidian ground and a distant photographic wall. Cormorant's high-contrast serif voice and DIN controls keep the interface quiet around the staged objects.

Three materially distinct worlds reveal one jewellery design. The Stone suspends a free emerald among smoked cut-glass forms; The Setting turns the ring to expose its basket and split shank over folded teal silk; The Presence poses the complete ring diagonally in a light chamber with a campaign portrait on the back wall. They share the preserved native Hydra selector, camera, drag and touch journey rather than adding pages or another renderer.

**Key Characteristics:**

- Three authored setpieces with distinct focal forms: gemstone, setting profile and complete ring.
- Physical native meshes, restrained atmospheric light and supplied photographic material.
- A continuous spatial journey with full-screen editorial product and campaign overlays.
- Short serif statements, selective italic emphasis and quiet DIN controls.
- Native motion, opt-in sound, reduced-motion and content-recovery states.

## Colors

The interface holds a cool room around a warm action colour. Frontmatter values are normative; `thaddeus-world.css` overrides the base stylesheet.

### Primary

- **Warm Gold** (`gold`): primary action surfaces, action lines, selection and focus.

### Neutral

- **Petrol Night** (`night`) and **Deep Ink** (`ink`): spatial ground and dark text on bright actions.
- **Paper Light** (`paper`): warm pale reading text and primary-action hover.
- **Mist Teal** (`muted`): supporting copy and secondary navigation.
- **Studio Line** (`line`): detail dividers and utility boundaries.
- **Teal Panel** (`panel`): product and utility overlay ground.
- **Gallery Night** (`gallery`): full-screen campaign gallery ground.
- **Teal Field**, **Field Stroke** and **Secondary Stroke** (`field`, `field-stroke`, `secondary-stroke`): editable and secondary-action surfaces.

Smoked glass, silk and studio shafts use world-specific shader tints. These are material settings rather than additional interface accents.

**The Warm Action Rule.** Use gold to identify action, selection or focus. Keep the room cool; material light and supplied photographs provide the richer colour.

## Typography

**Display Font:** self-hosted Cormorant Garamond, registered as `Thaddeus`, with Georgia and serif fallbacks.

**Body Font:** self-hosted URW DIN, registered as `DIN`, with Arial and sans-serif fallbacks.

The opening is one editorial sentence with italic emphasis on “presence.” Product and gallery headings have distinct larger roles; utility panels retain the quieter panel-title role.

### Hierarchy

- **Display:** `display` leads selected worlds; phone sizes are 43px and 39px at the narrow breakpoint.
- **Opening:** `opening` is centred above the staged selector. Phones use a 39–55px viewport-width clamp and a 38px narrow override.
- **Piece title:** `piece-title` leads the full-screen product layout; phones use 55px.
- **Gallery title:** `gallery-title` forms the left editorial column with italic “light.” Phones use 42px and remove desktop line breaks.
- **Panel title and body:** utilities use `panel-title`; copy uses `body`, reduced to 14px on phones.
- **Action, label and wordmark:** retain the normative roles above; the wordmark becomes 25px on phones and 23px on narrow phones.

**The Object First Rule.** Reserve the focal object's animated silhouette before placing display copy. Keep statements short and preserve authored line breaks where they define a world.

The source includes compact 9–11px scene HUD and gallery captions. These are not general reading-size defaults to extend to new surfaces.

## Layout

The experience occupies one fixed viewport (`100dvh`); native camera movement carries the journey. Desktop header/footer edges are 44px, with 27px vertical header padding. The opening sits above three staged focal forms. Selected-world copy sits left at 4.4%; bottom in-scene navigation permits direct world changes and underlines the active choice.

At 900px, display copy moves above the object, navigation compacts into Menu, and the native mobile slider preserves touch movement and intentional neighbouring-object cropping. At 380px, type and controls condense further; a 340px override reduces world-choice names again. Portrait phones 660px high or shorter reduce the opening and phase display and hide its secondary action. Desktop heights of 720px or less and landscape heights of 540px or less have explicit condensed compositions.

Product and campaign dialogs fill the viewport. The desktop product gives imagery 1.45fr and information 1fr, with a 380px minimum information column. Phones stack a 43dvh image with at least 300px height above the details. The desktop gallery places an editorial column beside a contained photograph, followed by caption/tools and thumbnails. Phones stack these elements and scroll internally. Image containment preserves the complete campaign frame.

Utility dialogs retain the bounded base layout and internal scrolling. The circular close control lives in an independent sticky layer so it does not consume content width.

**The Scene Continuity Rule.** Use same-document overlays for details, campaign and utilities. Preserve the native camera position and restore scene input after closing.

## Elevation & Depth

The focal depth is native geometry: a faceted stone, profile jewellery, bevelled smoked-glass columns and plinths, folded silk, a studio cyclorama and diffused light-shaft quads. The Presence adds a supplied portrait as a distant back-wall surface. Its photographic tint and crop are compositing treatments, not regenerated source imagery.

The centre and round halo stones use bounded cut-plane optics, absorption and internal reflection. Metal, glass, silk and studio light use analytic illumination. Native bloom and depth-of-field remain device-tier dependent. The existing renderer and clock own every spatial layer; the set adds no canvas or render loop.

A 190px dark lower fade protects world navigation and footer controls in selected hero/macro states. It is a local readability layer above the scene, not a replacement for the staged background.

### Shadow Vocabulary

- **Macro caption protection** (`0 2px 20px #001315`): local text protection.
- **Supporting cutout** (`drop-shadow(0 18px 28px rgba(0,0,0,.22))`): separation in the visual-creation panel.
- **Measurement illustration** (`inset 2px 2px 5px #001416, 2px 3px 10px #001416`): diagram depth only.

**The Native Depth Rule.** Extend native meshes, shaders and the existing clock. Keep geometric focal objects and their environments distinct from supporting bitmap cutouts.

## Shapes

Square controls, fields, imagery and panel geometry remain the general interface language. The overlay close control is deliberately circular: 46px on desktop and 44px on phones. Thin gold lines mark active worlds and gallery selections. Clipped gemstone corners, bevelled glass and flowing silk belong to the staged material world rather than repeated decorative control shapes.

## Components

### Buttons

Primary actions are full-width gold bars with ink text and an inline SVG direction marker. They become paper light on hover and have a 54px minimum height. Secondary actions remain square, transparent and outlined. Quiet scene/detail actions use gold lines. Keyboard controls retain the gold 2px focus outline with a 5px offset.

### Cards / Containers

Product and campaign use full-screen borderless overlays. Utility panels remain bounded; all retain internal scrolling and focus restoration. The close control is a dark translucent circle in a sticky layer. Product imagery is cropped deliberately; gallery imagery is contained.

### Inputs / Fields

Fields retain the normative teal surface and stroke, labels above, and the shared gold focus outline. Textareas have a 110px minimum height. Validation and local save/copy/download status remain explicit.

### Navigation

The wordmark returns to the opening. Desktop navigation exposes the ring, campaign and saved selection; the phone Menu adds worlds and utilities. Opening choices pair serif world names with animated short gold rules. In-scene navigation uses DIN labels, an active underline and `aria-current`. Native transition locks temporarily disable world entry.

### Campaign Gallery

A large editorial title sits beside the photograph on desktop. SVG arrows, keyboard arrows, swipe and a live count change the frame. The selected thumbnail uses full opacity and a two-pixel gold bottom line; other thumbnails are subdued. The phone gallery stacks and scrolls while preserving the complete image frame.

### Personalised Visual

The supporting transparent ring cutout introduces name entry. The native overlay creates square, landscape and portrait PNGs locally, without invented edition numbers or automatic posting.

### Motion and Recovery

Native pose changes and camera movement animate object and set. Silk motion uses native time; reduced motion holds it along with ring, dust, ambient and backdrop phases. Dialogs reveal over .55s with a clip/opacity transition, and the photographic release retains its slow 16-second frame movement. Reduced motion removes these interface/image animations. WebGL failure or loss exposes ring/gallery content and an explicit retry.

## Do's and Don'ts

### Do:

- **Do** preserve the continuous native selector, camera, drag and touch journey.
- **Do** give each world its own focal form and physical material setting.
- **Do** retain supplied campaign imagery and protect its photographic content.
- **Do** reserve the focal object's full motion envelope and keep controls outside it.
- **Do** preserve full-width phone overlays, internal scrolling and reachable close controls.
- **Do** describe local drafts, storage and downloads truthfully.

### Don't:

- **Don't** reduce the worlds to repeated identical rings on an empty teal field.
- **Don't** turn three aspects of one creation into three invented products.
- **Don't** add a replacement renderer, animation clock or stacked shop structure.
- **Don't** substitute the supporting PNG for the interactive geometric focal object.
- **Don't** invent commercial facts, a working checkout or sent-message status.
- **Don't** extend compact scene captions into general reading-size defaults.
