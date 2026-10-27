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

- Status: implemented; collection fields configured in Shopify on 2026-10-26 and theme uploaded in D023 on 2026-10-27. Source: user explicitly requested the previously outlined collection fields, collection configuration and badge-selection code. Supersedes D010's restored badge-selection behavior; D009's product fields remain removed.
- User confirmed New Arrivals first, BESTSELLER second. Both collections are enabled at priorities 1 and 2 respectively; other collections are excluded by unset visibility. Existing membership is unchanged.
- Contract: collection boolean `custom.show_as_product_badge` opts in; integer `custom.product_badge_priority` accepts 1–9999, lower wins, blank ranks last (10000). Equal priorities sort by collection handle. Only Online Store-available product collections participate. No match means no badge.
- Keep the section `show_collection_label` master switch and its persisted value. Removed unused section-title render argument and old product text override. Other card indicators and quick-view behavior unchanged.
- Verification: actual local Shopify preview showed New Arrivals on all three overlapping products, BESTSELLER on the other five, and no badge on Gift Card. Mobile/desktop fit checked. Admin fields/values saved; no theme upload authorized.

## D012 — White default body background

- Status: implemented locally; source: user on 2026-10-27 requested white (`#FFFFFF`) across the theme and explicitly asked to keep it local.
- Decision: update Scheme 1 background in both current settings and the Dawn preset in `config/settings_data.json`. Theme and password layouts inherit this base scheme; preserve dedicated component colours and other schemes.
- Verification: local homepage body computes to `rgb(255, 255, 255)` with no background image at 1280×900 and 390×844. Theme Check: zero errors, nine existing warnings. No commit, Git push or live-theme upload.

## D013 — No Featured collection sale badge

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested removing the bottom-left percentage-off badge and its related code from Featured Collection.
- Decision: pass `show_sale_badge: false` from Featured collection to the shared card snippet. Omit sale badge markup, its empty wrapper and badge accessibility references at render time; do not hide it with CSS. Shared percentage calculation/styles remain in use by collection listing cards. Retain sold-out badges, collection labels, ratings and sale/compare-at prices.
- Delivery: uploaded in D023 after the user’s explicit request; local changes remain uncommitted and no Git push was made.

## D014 — Suta-style Featured collection VIEW ALL

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested matching Suta’s VIEW ALL design/color. Interpreted “suta.im” as the established suta.in reference.
- Inspected the live visible Suta collection button at desktop/mobile widths: transparent background, `#1c1c1c` text, 1px `#0000008b` border, zero corner radius, Jost 12px/19.8px, 1.3px letter spacing, 5px/12px padding (about 88×32px).
- Scoped CSS applies the same appearance to Featured collection View all links, overriding legacy style variants and Dawn pseudo-element borders. Preserve destinations/visibility conditions and explicit keyboard focus. No global button changes.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D015 — Collection listing width alignment

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested product listing width like product details/footer.
- Use a centered 1356px maximum container with 16px phone, 24px tablet (750px+) and 48px desktop (990px+) padding. Reset nested page-width padding within the listing to avoid duplicate gutters across filter layouts. Homepage Featured collections are unaffected.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D016 — Three-column collection default

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested three-grid default. Supersedes D003-era four-column defaults described in earlier work.
- Desktop collections start with three columns in JavaScript, CSS fallback, selected grid control, section schema and saved default collection template. Preserve 2/3/4 controls and mobile layout.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D017 — Product listing scope for this chat

- Status: accepted; source: user on 2026-10-27 explicitly said this chat mainly concerns Product listing and unspecified requests should refer to that component.
- Applies only to chat `01a17c2a-c2c3-7081-b744-d685b51bd317` (currently titled Review project history and context). Explicit component references override this default. Do not apply it automatically to other project chats.

## D018 — Mobile product listing toolbar

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested hiding the mobile product total, one/two-product display controls at left, Sort By centered and Filter at right, with icons and applied-filter count. Inspected Suta’s current `/collections/all` mobile bar; supplied Flipkart images guide the sort/filter icons and red count badge.
- Applies below the existing 990px navigation breakpoint. Desktop keeps 2/3/4 controls and default 3. Mobile starts from the saved section setting (currently 2), with independent view state retained during AJAX updates/loading; responsive image sizes follow the selected view. Inline SVG only, no dependency.
- Count selected list/boolean values individually and any active price range once (one or both bounds). Do not count sorting; hide zero. Render from Shopify filter state and refresh only after successful result loads, with accessible applied-count text. Existing filter drawer, sort sheet, keyboard focus and Escape behavior remain.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D019 — Filled, closer mobile grid icons

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested filled grid icons like Suta and a slightly smaller gap between them.
- Inspected Suta’s current mobile collection controls: solid single square / four filled squares, selected charcoal with muted inactive state. Tasaa uses `#1c1c1c` selected and `#8e8e8e` inactive, with white divisions in the two-product icon.
- CSS-only below 990px. Symbols are 18px and their centers move from 44px to 36px apart by shifting each SVG inward 4px; separate 44×46px buttons and keyboard focus remain.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D020 — Discount-first Product listing image badges

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested upper-left listing badge priority of percentage discount, then the established collection priority list.
- Listing cards show one upper-left badge: rounded percentage savings when Compare-at price exceeds Price; otherwise choose a collection using D011’s enabled flag, numeric priority and handle tie-breaker; otherwise none. Current collection priorities remain New Arrivals 1 and BESTSELLER 2. No Admin values changed.
- Agent implementation: explicit `listing_card` render flag scopes the new branch in the shared card snippet, suppressing duplicate native sale badges. Reuse the existing collection selection rather than copying it. Listing-owned styles use red for discount and charcoal for collection. Separate native Sold out badges remain, so discount also wins the upper-left slot on discounted sold-out items.
- Featured collection retains its master switch and sale-badge suppression. Sorting order, prices, filters and loading behavior are unchanged.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D021 — Listing cards match Featured Collection

- Status: implemented; Shopify upload completed in D023; price presentation and hover scope partially superseded by D022/D023. Source: user on 2026-10-27 requested Featured/Suta-like title/tag/price typography and design, the same View button and second-image hover.
- Reuse the existing Featured card CSS for listing card details, View controls, fine-pointer hover/touch behavior and photo links; keep Featured section grid, widths, heading and VIEW ALL styling separate. Listing’s authored font setting now covers the whole card (renamed Product card font, same ID). Listing price presentation now matches actual Featured prices, replacing its separate sale-price overrides.
- Extend only quick-view UI branches to the explicit listing flag. Do not set `featured_card` for listing cards: image ratios and discount-first badges must stay separate. Standard Quick add and second-image hover are enabled in the saved default collection template and schema defaults; None/Bulk remain authorable. Use the existing compact modal/gallery/purchase code without a new library.
- Filter/sort result replacement cleans up this section’s body-mounted quick-add modals in both custom Suta and Dawn facet paths, preventing duplicate modal IDs. Load More appends new controls normally. Preserve keyboard focus and other sections.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D022 — Photo-only listing hover and restored sale prices

- Status: implemented; Shopify upload completed in D023; source: user on 2026-10-27 requested image swapping only over the image (not the card information below), all other functionality unchanged, and reverting the original/discounted price color/strike-through design. Partially supersedes D021.
- Listing image swap targets `.card__inner:hover`, the photo area including its link overlay. Explicit listing reset rules neutralize Dawn’s card-wide hover swap. Featured hover and View button card-hover/focus behavior remain unchanged; no markup/JavaScript changes.
- Restore listing sale-price presentation: discounted price first in black; original price red, 11.2px and line-through, with wrapping/gap rules. Keep current compact title/tag/base price typography and other listing functionality.
- Delivery: uploaded to the verified dev-store live theme in D023 on 2026-10-27; working changes remain uncommitted and no Git push was made.

## D023 — Extend corrections to Featured and upload to Shopify

- Status: implemented and uploaded; source: user on 2026-10-27 requested the same photo-only hover/current-versus-original price corrections for Featured Collection, then explicitly requested Shopify upload.
- Shared card CSS now gives Listing and Featured Collection photo-only image swapping, current sale price first in black, and original price red/11.2px/line-through. View card-hover/focus and popup behavior remain. Extends D022; D021’s remaining typography/controls are retained.
- Upload scope: 11 listing/shared Featured runtime files, including the default collection template and both affected card/section Liquid files. Include earlier pending changes present in those files. Exclude the earlier explicitly-local white background in `config/settings_data.json`, documentation and Git delivery.
- Delivery evidence: verified `192399933723` is the live `dev-theme-id` on `tasaa-dev.myshopify.com`; backed up target files and compared remote collection settings (only requested quick-add/secondary-image toggles differed; no unrelated merchant edits to merge). Existing quick-add JS/CSS dependencies matched local files.
- Scoped upload completed with explicit store/theme, `--allow-live`, `--nodelete` and `--only`. Download verification matched all 10 non-JSON files byte-for-byte and the collection template structurally. Working changes remain uncommitted; no Git push.

## Adding or revising a decision

Use a stable next ID, a descriptive title, status, source, decision and short rationale. Include affected files or verification when useful. Identify assumptions as unverified. For reversals, mark the earlier entry superseded and link to the replacement; update AGENTS and STATUS if their guidance changed. Never record an agent suggestion as user approval.
