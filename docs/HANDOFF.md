# Shanthanu Kelso | Portfolio handoff
Updated: 2026-09-21 | Owner: Shanthanu Kelso
## Standing instruction - every future edit
After every completed portfolio edit, update this handoff's editable source and regenerate the PDF. Include code, content, styling, asset, configuration and bug-fix changes. Do not leave the handoff update for the owner to request. Keep this instruction in every future edition and pass it to any successor agent.
Update the current-state sections and append a dated change-log entry listing what changed, affected files, why, actual verification results, deployment status and unresolved issues. Preserve relevant history. Never present unperformed checks as passed.
Commit docs/HANDOFF.md and docs/portfolio-handoff.pdf with the related changes where practical. Use scripts/build_handoff.py to regenerate the PDF. Render and visually inspect the PDF before delivery. The root AGENTS.md repeats this requirement so agents entering the repo can discover it.
This is an agent workflow requirement, not a background automation. An agent must carry it out when making edits. If blocked, report the missing update explicitly.
## Project and source of truth
Live site: https://skstudiossd.github.io/
Repository: https://github.com/skstudiossd/skstudiossd.github.io
Branch: main. Website source baseline verified for this edition:
7eb699581fb5101d13f01ba703353a8f4987a1d7
This documentation-only revision describes that website baseline. The containing documentation commit is available in Git history; a PDF cannot include its own final commit hash before that commit exists.
Read current main and any newer owner instructions before editing. This PDF is a snapshot, not a replacement for live source. No redesign or website code changes are part of this handoff revision.
## Purpose
A personal showcase spanning engineering and graphic design. Visitors should explore the work. No storefront, commissions or sales are currently required. Contact uses email and LinkedIn, not a server-backed form.
The owner is an aerospace engineering student at UC Merced with a long-term interest in Formula 1 aerodynamics. Keep communication direct and concise. Preserve supplied project facts and copy; ask about unspecified major layout changes.
---
# Architecture and file map
## Static site, no application build
Six HTML pages, plain CSS and vanilla JavaScript. GitHub Pages serves the repository. There is no framework, package build or application backend. The handoff generator's Python dependency is documentation-only.
- index.html: central landing page, Engineering and Graphic Design cards, contact. Title is Shanthanu Kelso; eyebrow is Full Portfolio. Includes legacy gallery routing.
- design.html: full poster catalogue, filters, sorting, driver variants, zoom/pan lightbox, scrolling marquee and contact. Most page CSS and JavaScript are inline.
- about.html: biography, portrait with corner brackets, hero particle animation and contact. Most page CSS and JavaScript are inline.
- engineering.html: two engineering project cards. Fighter has a 3D preview; RC plane has a photo cover.
- fighter-concept.html: interactive aircraft model on the left, description and facts on the right; stacked layout on smaller screens.
- rc-plane.html: photo gallery on the left, project description and facts on the right; previous/next buttons and thumbnail navigation.
- engineering.css: shared engineering styling, model stage, project layout and corner frames.
- engineering.js: hover orbit, model loading/error/fallback state, reset controls and RC gallery.
- responsive.css: shared final overrides, loaded by all six pages. Contact layout, touch targets, responsive headings, lightbox scrolling, wide-screen spacing and thumbnails.
## Assets and external dependencies
- images/sk-logo.png: navigation, footer and browser icon source. images/profile_portrait.jpg: About photo.
- images/engineering/rcplane1.jpg through rcplane11.jpg: eleven project photos; preserve their source content.
- images/engineering/fighter-preview.png: transparent front three-quarter fallback image. The older fighter-preview.jpg remains in the repo but is not the active fallback.
- models/fighter-concept.glb: supplied aircraft geometry. Do not replace or modify geometry without instruction.
- Poster images live directly under images/. Driver designs have borderless and bordered image pairs.
- Model viewer: @google/model-viewer 4.1.0 from jsDelivr, loaded as an ES module on the two fighter-viewer pages. CDN/network/WebGL failures must leave a useful fallback.
## Contact on all six pages
Email: shanthanukelso@gmail.com (mailto link; opens the visitor's email app).
LinkedIn: https://www.linkedin.com/in/shanthanu-kelso-650050421/
No message is sent by the site itself. The earlier fake request form and proposed Formspree workflow are historical, not the current contact implementation.
---
# Design and content contract
## Palette and typography
Primary accent #D64A32; cream #E7D1C3; teal #617F8A.
Background #060604; surfaces #0d0d0b and #131311; text #F0EDE6; muted body copy #9a9690; borders #1a1a17 and #272724.
Headlines: Rockwell / Rockwell Nova / Zilla Slab / Georgia / serif. Body: Avenir Next / Avenir / Century Gothic / Nunito Sans / sans-serif.
All titles and headers stay upright and off-white. Do not restore italic or colored final words. Sharp corners; no rounded cards. No emoji or Unicode pictogram controls: use clean monochrome SVG/CSS icons. Gear icons should remain symmetric.
## Visual behavior
Keep transitions subtle and subordinate to the work. No button scaling. Poster image hover may scale inside its wrapper. Grayscale engineering/design decorative icons roll out on home-card hover. Respect reduced-motion preferences.
Orange diagonal racing stripes are an existing motif. Navigation logo is grayscale via brightness(0) invert(1), around .82 opacity; footer logo around .55 opacity. Do not show the color logo against the dark background.
Engineering preview corners use top-left and bottom-right brackets only. About portrait keeps its four-corner frame.
## Exact copy and dimensions
Home title: Shanthanu Kelso. Eyebrow: Full Portfolio.
Graphic design title: Excellence Expressed in Art (no period; increased line spacing).
Graphic design introduction: Poster designs celebrating the icons that defined speed. From endurance racers to supersonic fighters to the men and women who operated them.
Marquee includes Original Artwork. Keep this owner-requested exception to the earlier preference for the word designs.
Do not restore Full Collection or Two Projects tags. Preserve per-design dimensions; the catalogue's 2:3 poster wrappers do not authorize changing artwork dimensions or cropping source files.
## Catalogue behavior and inventory
Full catalogue stays visible through All / Cars / Jets / Drivers filtering. Sort defaults to Newest and also offers A-Z. Cards use data-category, data-name, data-date, data-tag and data-desc. Newest compares YYYYMMDD dates.
Current subjects: Ferrari 812 GTS; Mercedes-AMG ONE; Ferrari LaFerrari; McLaren P1; Porsche 918 Spyder; Maserati MC12; McLaren Senna; Rimac Nevera; Volkswagen Beetle; Volkswagen Golf GTI; Pagani Zonda R; Corvette ZR1X; F-16 Fighting Falcon; F-22 Raptor; Charles Leclerc; Max Verstappen.
Driver pairs use data-variant-borderless and data-variant-bordered. goToVariant/shiftVariant manage card slides; openLightbox/switchVariant manage the viewer. Keep selected variants synchronized. Audit actual code before extending beyond two variants.
Preserve dates, including both VW designs at 20251107. Do not silently update driver statistics. Keep supplied descriptions and About biography unless the owner requests changes.
---
# Engineering behavior and troubleshooting
## Project facts
Fighter Aircraft Concept: January-June 2025. Shanthanu completed all modeling.
RC Plane: May-June 2025. Shanthanu completed all design and most assembly. It flew successfully. Flight video may be supplied later; none is presently integrated.
## Model presentation
Default camera orbit: 45deg 60deg 105%, showing the front three-quarter view.
The engineering cover runs one 360-degree orbit over six seconds on hover/focus, then returns to the starting view. Rotation stops when leaving the card or hiding the document and respects reduced motion.
The detail viewer supports drag rotation, scroll/pinch zoom, keyboard controls, Reset view and a GLB download. Its camera controls are enabled; the cover viewer does not intercept pointer input.
The stage uses a near-black background with orange-red grid lines at 40px and 160px intervals and a subtle radial background. The model-viewer background is transparent so the grid shows through.
## Critical regression: duplicate aircraft image
The fallback PNG is a sibling underneath model-viewer. With a transparent viewer background, it will remain visible unless explicitly hidden.
In engineering.js, each viewer finds its parent's direct img child. On load, add ready and set fallback.hidden = true. On error, remove ready and set fallback.hidden = false. The initial model.loaded check handles a model loaded before listeners attach.
Do not remove that synchronization. Test both engineering.html and fighter-concept.html: fallback before loading, only the live model after loading, fallback restored after failure. A static screenshot alone cannot prove the model is interactive.
## Other troubleshooting paths
- Model absent: check GLB request, case-sensitive paths, CDN module, console/WebGL errors, ready state and fallback. Do not hide the fallback before the model actually loads.
- Lightbox controls cut off: inspect responsive.css; outer .lightbox must scroll and inner content must not shrink into a capped height. Check phone portrait and landscape.
- Marquee gaps/snapping: fitMarquee creates two identical groups, each wider than the viewport; animation travels one group width. Recalculate after resizing and fonts load. Do not revert to a short fixed repeat count.
- About animation: particles fade out after the hero; do not extend them behind body text. Design page particles can persist full-page. Reduced motion hides the canvas and reveals content.
- Tall RC thumbnails: thumbnail links have aspect-ratio:1 and overflow:hidden; images fill both dimensions with object-fit:cover.
- Unexpected layout differences: inspect final responsive.css overrides as well as inline page CSS and engineering.css.
---
# Editing, validation and deployment
## Working procedure
1. Read root AGENTS.md and this handoff. Inspect latest remote main, existing changes and relevant files before editing. Re-read owner-supplied revisions rather than assuming they match earlier copies.
2. Make targeted changes, retaining existing assets and copy. Scope any new instructions to the requested work. Never overwrite unrelated edits.
3. Check the changed interactions in a real browser. At minimum cover mobile, tablet, desktop and wide screen when layout changes. Check overflow, navigation, focus, touch controls and reduced motion where affected.
4. Update docs/HANDOFF.md and its change log. Run python3 scripts/build_handoff.py (requires reportlab). Render docs/portfolio-handoff.pdf with pdftoppm and visually inspect every page. Verify extracted text and page boundaries.
5. Commit the code and updated handoff together when practical. Push without force. If main moved, fetch and reconcile instead of overwriting.
6. Check the GitHub Pages deployment run for the exact commit and verify the relevant live page. Distinguish local validation, committed changes and successful deployment. Report limitations explicitly.
7. Deliver the current PDF. If deployment failed after export, record that failure and regenerate the handoff before calling the work complete.
## Access and maintenance
A connected GitHub plugin was used successfully in this conversation for reads, blobs, Git trees, commits and non-force main updates. Each new agent must verify its own access; do not assume a connection transfers with the PDF.
Git CLI is an alternative when authenticated. The site does not require manual HTML uploads. The original handoff's claims of no connector and two files are obsolete.
No custom CI workflow is in the verified tree. GitHub's Pages deployment runs are available through Actions. Documentation generation is manual and must be performed by the editing agent; no scheduled task or auto-generation service is installed.
A PDF is portable context, not a source-code backup. The repo contains the code and assets. Keep this document free of credentials and private session details because the repo is public.
## Verification record and limits
2026-09-19 browser checks from the preceding editing session: six pages at 14 widths (320, 375, 600, 640, 700, 768, 850, 960, 961, 1024, 1440, 1920, 2560, 3440px). No detected heading overflow or navigation collisions; no JavaScript page errors in that audit.
Additional checks: live model loaded over the grid; mobile and 812x375 landscape lightbox controls reachable; eleven RC thumbnails square; reduced-motion About content visible.
Duplicate-image correction: Chrome verified both viewer pages hide fallback after model load, restore it on a simulated error and hide it again on a load event. Pages deployment run 35471424414 completed successfully.
These are historical Chrome checks, not physical-device or Safari verification. On 2026-09-21, the current repository source was re-read for this document; the full website browser matrix was not rerun for this documentation-only change.
---
# Change log and next-agent checklist
## 2026-09-21 - Establish maintained handoff
Added docs/HANDOFF.md, docs/portfolio-handoff.pdf, scripts/build_handoff.py and root AGENTS.md. Purpose: let any successor agent edit or troubleshoot with current architecture, preferences, regression details and the standing instruction to update this handoff after every edit.
Website baseline: 7eb699581fb5101d13f01ba703353a8f4987a1d7. No website code changes. The PDF is generated and visually reviewed before committing; publication of this documentation commit must be checked separately in GitHub Actions.
## 2026-09-19 - Remove duplicate model fallback
engineering.js now hides the sibling fallback image on model load and restores it on error, on both engineering overview and fighter detail pages. This fixes the static aircraft showing through the transparent live viewer. Browser state checks passed; deployment succeeded.
## 2026-09-19 - Contact, responsive layout and model stage
Added LinkedIn contact links on all six pages; changed home eyebrow to Full Portfolio; added responsive.css for mobile headings, touch targets, scrollable lightbox, wide-screen alignment, reduced motion and square thumbnails.
engineering.css changed the model background to a red/black CSS grid. engineering.html and fighter-concept.html use a transparent fighter-preview.png fallback. Six-page responsive audit and Pages deployment passed. The duplicate fallback defect introduced by the transparent stage was fixed in the subsequent entry above.
## Earlier accepted work
Created the central portfolio hub and engineering pages; integrated eleven RC photos and the fighter GLB. Added front three-quarter orbit and grayscale icons; removed emoji arrows and cleaned the gear. Standardized upright off-white headers, preserved exact Poster capitalization, added engineering corner brackets, changed marquee to Original Artwork and repaired continuous looping. Increased design hero line spacing and removed its final period.
## Outstanding / owner-led additions
- Possible RC flight video when supplied.
- Future engineering projects, photos or model embeds when supplied.
- Owner may provide rewritten copy or poster mockups later.
- No storefront or commission setup requested.
- Cross-browser/physical-device coverage remains unverified beyond the historical Chrome checks.
## Checklist for the next agent
Read live source and this instruction. Make the requested edit. Verify the affected behavior. Update current-state sections. Append a dated entry with affected paths and evidence. Regenerate and inspect the PDF. Commit the handoff with the edit. Verify deployment and report any remaining limitations.
Do not remove or weaken the standing instruction unless Shanthanu explicitly changes it.
