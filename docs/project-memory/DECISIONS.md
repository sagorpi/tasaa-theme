# Decision history

Seeded 2026-10-24 from the existing conversation and `../../AGENTS.md`. This is a curated record, not a claim that every historical choice is captured. Active implementation rules and component paths live in `../../AGENTS.md`.

## D001 — Explicit deployment requests

- Status: accepted; source: user, “dont push if i dont mention.”
- Decision: keep changes local unless the user requests delivery. Git commits, Git pushes and Shopify uploads are distinct actions. Earlier approvals do not authorize future uploads.
- Reason: the user controls when changes reach shared or live environments.

## D002 — Component-specific design references

- Status: accepted; source: repeated user design requests.
- Decision: Suta is the primary storefront reference; retain the specific Sutisancha arrow/mobile references and Flipkart-inspired customer review presentation. No wishlist buttons.
- Reason: the user selected different references for particular components. A new request to match one component must not restyle the entire storefront.

## D003 — Authoring and lightweight implementation

- Status: accepted direction; source: user requests for global settings, reusable authoring and minimal weight; implementation contracts recorded in AGENTS and README.
- Decision: reuse Liquid, CSS and vanilla JavaScript. Use shared settings/metaobjects for reusable content, with product overrides where supported. Paid add-ons use actual product variants. Judge.me remains the real review source; sample reviews remain clearly labeled theme fixtures.
- Reason: avoid duplicated merchant work, unnecessary dependencies and misleading review data.

## D004 — Touch appearance with keyboard access preserved

- Status: implemented; source: user requests to remove automatic touch focus highlighting; agent implementation choice to preserve semantic and keyboard focus.
- Decision: scope pointer-specific focus suppression to the affected controls. Retain keyboard indicators, dialog focus restoration and Escape handling.
- Evidence: recent fixes are included in `e37a870`; historical verification is summarized in `WORK_LOG.md`.

## D005 — Repository memory

- Status: accepted; source: user requests to create AGENTS and relevant files for goals, steps and decisions.
- Decision: AGENTS is the entry point, STATUS is the current handoff, this file records decisions, and WORK_LOG records verified milestones. README remains the merchant authoring guide.
- Reason: future chats can recover useful project context from the checkout without depending on the full conversation. This file structure is an agent implementation choice within the user's request.

## D006 — Featured Collections cards across devices

- Status: implemented; source: user requested Suta-like mobile title/tag/price spacing, button-like tags and a Shopify upload.
- Decision: at every viewport width (extended to desktop/tablet by the user on 2026-10-26), use 4px gaps, 12px outlined type tags with 3px corners, and 10.8px price text. Scope styles to homepage Featured Collections rather than shared related-product cards.
- Implementation detail: these cards use `product_view_context: 'collection'`, which renders `collection-card__type`; target `collection-card__type` in the scoped homepage rule. The shared `featured-card__type` rule remains for other components. Verify actual Liquid-rendered cards, not only a simplified HTML fixture.
- Evidence: Suta mobile computed styles and the real local Shopify preview checked on 2026-10-24.

## D007 — Mobile quick-view image and details link

- Status: implemented and uploaded after explicit user request; source: user requested removing View Full Details only in the mobile View popup, enlarging the image like Suta, and keeping other functionality unchanged; popup height may change.
- Decision: retain the existing below-700px popup breakpoint, hide the full-details link with CSS, and use image max-width `min(280px, 65vw, 30dvh)`. Restore the existing 90dvh sheet cap by removing the later 83dvh override. Remove superseded mobile image sizing rules rather than append overrides.
- Evidence: Suta's mobile popup image measured about 254px wide at 390px. Tasaa now measures about 253px (previously 220px). Short phones retain a scrollable popup, with image size bounded by viewport height.
- Scope: CSS only; no JavaScript or Liquid changes. Desktop details links and thumbnails remain. User subsequently explicitly requested Shopify upload, completed on 2026-10-24.

## D008 — Mobile quick-view swipe stability

- Status: implemented and uploaded after explicit user request; source: user reported vertical movement following touch direction during image swipes and requested checking Suta first.
- Reference: inspected Suta's mobile quick-buy carousel before editing. It uses horizontal scrolling with vertical overflow hidden and horizontal overscroll containment; its vertical position stayed fixed when advancing slides.
- Agent implementation choice: below 700px, apply `overflow-y: hidden`, `touch-action: pan-x pinch-zoom`, and `overscroll-behavior-x: contain` to the quick-view media slider. Keep native horizontal scrolling and pinch zoom; vertical sheet scrolling remains available from the details area.
- Verification limit: computed styles and navigation/scrolling checked in resized desktop browser; real diagonal finger swipes were not tested. User subsequently requested Shopify upload; completed on 2026-10-24.

## D009 — Per-product Featured collection badge controls

- Status: reverted on 2026-10-26 at user request; superseded by D010. Both admin definitions were removed. Source: user on 2026-10-26 requested priority custom text, then no badge, then collection default.
- Decision: reuse existing product `custom.collection_label` single-line text for compatibility; add `custom.hide_collection_badge` boolean. Non-whitespace custom text wins even when hide is true; otherwise true omits badge markup, and false/unset falls back to the selected section collection title.
- Preserve existing section `show_collection_label` ID as the master switch; rename its editor label to Show product badges on images. Other card badges and title tags remain unchanged.
- User signed in to Shopify Admin; both definitions were created for all products and pinned, with existing product values untouched. This does not authorize uploading the theme.

## D010 — Revert per-product badge controls

- Status: completed; source: user on 2026-10-26 asked to revert the last changes and then explicitly confirmed deletion of both new Shopify fields.
- Decision: restore the prior badge behavior and editor labels, remove the new README/AGENTS guidance, and delete only the two definitions created for D009, preserving any saved values. Keep earlier mobile card styling, larger popup image and swipe fixes.
- Evidence: affected tracked files match HEAD; only the pre-existing CSS diff remains. Shopify definition list confirms both fields are removed. No theme upload needed because D009 code was never uploaded.

## D011 — Collection-controlled Featured collection badges

- Status: implemented locally and collection fields configured in Shopify on 2026-10-26. Source: user explicitly requested the previously outlined collection fields, collection configuration and badge-selection code. Supersedes D010's restored badge-selection behavior; D009's product fields remain removed.
- User confirmed New Arrivals first, BESTSELLER second. Both collections are enabled at priorities 1 and 2 respectively; other collections are excluded by unset visibility. Existing membership is unchanged.
- Contract: collection boolean `custom.show_as_product_badge` opts in; integer `custom.product_badge_priority` accepts 1–9999, lower wins, blank ranks last (10000). Equal priorities sort by collection handle. Only Online Store-available product collections participate. No match means no badge.
- Keep the section `show_collection_label` master switch and its persisted value. Removed unused section-title render argument and old product text override. Other card indicators and quick-view behavior unchanged.
- Verification: actual local Shopify preview showed New Arrivals on all three overlapping products, BESTSELLER on the other five, and no badge on Gift Card. Mobile/desktop fit checked. Admin fields/values saved; no theme upload authorized.

## Adding or revising a decision

Use a stable next ID, a descriptive title, status, source, decision and short rationale. Include affected files or verification when useful. Identify assumptions as unverified. For reversals, mark the earlier entry superseded and link to the replacement; update AGENTS and STATUS if their guidance changed. Never record an agent suggestion as user approval.
