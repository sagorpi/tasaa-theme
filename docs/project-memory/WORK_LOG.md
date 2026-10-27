# Work log

Keep meaningful milestones here, newest first. Record actual outcomes and verification, not planned success. Detailed diffs belong in Git; authoring instructions belong in README.

## 2026-10-28 — Git delivery of listing fixes and Shopify settings

- User explicitly requested committing all changes and pushing to GitHub. Reviewed seven pending files: listing/header styles, pulled Shopify settings, AGENTS and the three project-memory documents. Refreshed origin and confirmed no divergence on `feature/homepage-redesign` before committing.
- Diff check and saved-settings JSON validation pass. The three changed runtime/configuration files still match the verified D026 download; the most recent Theme Check returned zero errors/nine existing warnings. Earlier desktop/mobile interaction checks are recorded below and were not repeated for this Git-only request.
- Commit/push remain pending at this snapshot. No additional Shopify upload is requested; earlier verified uploads and the configuration pull remain intact.

## 2026-10-28 — Pull live theme and saved merchant settings

- User requested pulling from Shopify. Re-verified live theme `192399933723` on `tasaa-dev.myshopify.com`; downloaded all 415 theme files into a temporary snapshot and backed up the six pending local files plus saved settings before applying changes. Existing runtime code, including D024/D025, matched; no files were deleted.
- Imported only meaningful remote differences in `config/settings_data.json`: selected `tasa_logo.png`, logo width 90→120 and an enabled breadcrumbs section using Jost. The current background differs only in hex case (`#FFFFFF`→`#ffffff`), retaining white. These were existing Shopify settings; their author/time is unverified. Kept the local formatting of 65 semantically identical JSON files, and preserved pending source/documentation work.
- Verification after import: all 415 files match Shopify (350 bytes, 65 parsed JSON). All six previously pending files were unchanged before updating memory. Diff check and Theme Check pass: zero errors/nine existing warnings. No new browser/physical-device tests for the configuration import. Recorded D026 and current status.
- Delivery: pull applied locally; configuration, earlier source fixes and notes remain uncommitted. No Git push or new Shopify upload.

## 2026-10-28 — Listing View buttons beneath sticky filters

- Reproduced the desktop overlap: a visible View button and the filter toolbar shared z-index 3, and the View button painted/received pointer hits above the bar. Added a two-line comment/rule in `assets/collection-filters.css` isolating the custom listing product grid. Cards retain their overlay order; the toolbar stays above the grid, and body-mounted quick-view dialogs still open above the filters. The earlier uploaded scroll-sync rules are unchanged. Updated AGENTS and D025; no merchant setting or JavaScript/Liquid change.
- At 1280px and 390px, positioned a visible View button within the sticky toolbar's bounds and confirmed the toolbar wins hit testing. View opens with product content on both layouts, remains body-mounted at z-index 101, and Escape closes/restores focus; the settled mobile sheet fits within the viewport. Desktop/mobile Sort opens; mobile Filter opens and Escape restores its trigger and body scrolling. No mobile document overflow. Desktop/mobile screenshots saved/inspected and temporary viewport reset; no physical-device testing.
- Verification: `git diff --check` passes; preview loaded the isolation rule. No new JavaScript or Liquid checks were required for this CSS-only change.
- Shopify delivery: user subsequently requested upload. Re-verified live theme `192399933723` (`dev-theme-id`) on `tasaa-dev.myshopify.com`; backed up the filter stylesheet and confirmed its only difference from local was the new stacking rule. Uploaded only `assets/collection-filters.css` using explicit store/theme, `--allow-live`, `--nodelete` and `--only`. CLI confirmed success; downloaded saved stylesheet matches local byte-for-byte. D024 remains intact; all other theme files/background settings were excluded.
- Git delivery: source and notes remain uncommitted; no new Git push.

## 2026-10-28 — Desktop header and listing filter motion

- Reproduced the reported reveal gap: the toolbar jumped to 77px while the navigation bottom was still animating from 0px. Added shared header transition timing in `assets/base.css`; desktop toolbar/sidebar in `assets/collection-filters.css` now follow `.section-header.animate`, including the sidebar's max-height. No new JavaScript, dependencies or merchant settings. Initial instant hide, collection containment and mobile/tablet motion remain. Desktop listing reduced motion stops both pieces together through the same variable. Updated AGENTS and D024.
- Browser verification at 1280px and 990px: reveal/hide and an interrupted hide-to-reveal stay within 0.015625px alignment throughout sampled moving frames; sidebar spacing stays 20px. First hide has no transition on either component. Sort opens and Escape closes/restores visible keyboard focus. At the loaded collection's end, toolbar/sidebar remain above the footer. At 820px and 390px no document overflow; phone header remains relative, filter opens/Escape closes and body scrolling restores. Reduced-motion source reviewed, without changing the system preference. Screenshot saved/inspected and temporary viewport reset. No physical-device test.
- Verification: `git diff --check` passed; actual preview parsed and applied both modified stylesheets. No Liquid or JavaScript changed, so no new Theme Check or JavaScript syntax run was needed; the earlier zero-error/nine-warning Theme Check belongs to the prior delivery.
- Shopify delivery: user subsequently requested upload. Re-verified live theme `192399933723` (`dev-theme-id`) on `tasaa-dev.myshopify.com`, backed up both remote stylesheets and confirmed they matched the committed baseline. Uploaded only `assets/base.css` and `assets/collection-filters.css` with explicit store/theme, `--allow-live`, `--nodelete` and individual `--only` flags. CLI confirmed success; post-upload downloads of both files match local byte-for-byte. Background settings and all other theme files were excluded.
- Git delivery: source changes and notes remain uncommitted; no new Git push. Earlier Git/Shopify deliveries below remain unchanged.

## 2026-10-27 — Git delivery of pending storefront changes

- User explicitly requested committing all pending changes and pushing to Git. Reviewed all 17 changed files, including theme settings and project documentation; refreshed `origin/feature/homepage-redesign` and confirmed no divergence from the current branch before committing.
- Rechecked whitespace, all three modified JavaScript files, Shopify JSON and Theme Check: zero errors/nine existing warnings. Earlier browser verification remains recorded below; no additional storefront changes were made for this delivery.
- Git delivery: created `5530381` (Refine product listing and featured collection cards), containing all 17 pending files, and pushed it to `origin/feature/homepage-redesign`. Confirmed branch tracking has zero commits ahead/behind and a clean working tree before recording this final delivery note. This note and the reconciled delivery statuses are recorded in a separate documentation commit.
- Shopify delivery: the verified 11-file upload remains complete; no additional upload was performed for this Git request. The white-background setting is included in Git only and has not been uploaded to Shopify.

## 2026-10-27 — Featured corrections and authorized Shopify delivery

- User extended photo-only hover and restored price styling to Featured Collection, then explicitly requested Shopify upload. Consolidated both components’ image-hover and sale-price rules in `assets/section-featured-collection.css`, removing the duplicate listing price block from `assets/template-collection.css`. Updated README/AGENTS and D023.
- Featured desktop pointer verification: over photo, opacities 0/1; below photo, 1/0 while View stays available. Featured View opens with product content and Escape closes. At 390px both sampled sale prices are black/current-first and red/struck-through original, without price/document overflow. Listing correction/View checks are recorded immediately below. Screenshots inspected/saved; viewport reset. No physical-device or purchase test.
- Pre-upload checks: diff/JS syntax pass; Theme Check returns zero errors/nine existing warnings. Verified live target `192399933723` (`dev-theme-id`) on `tasaa-dev.myshopify.com`. Pulled remote files into a temporary backup; collection template only required the intended Quick add/secondary-image changes. Shared quick-add JS/CSS already matched local and were not uploaded.
- Uploaded exactly 11 runtime files: six listing/shared assets (`collection-filters.css/js`, `collection-load-more.js`, `facets.js`, `section-featured-collection.css`, `template-collection.css`), two collection sections, two shared card/filter snippets and `templates/collection.json`. Used explicit store/theme, `--allow-live`, `--nodelete`, and individual `--only` flags. CLI confirmed success on the verified live target.
- Post-upload: downloaded all 11 files; 10 non-JSON files match local byte-for-byte and the collection template matches structurally. This delivery includes earlier pending listing/mobile/badge changes and Featured VIEW ALL/sale-badge changes in the uploaded files. The white-background config and documentation were excluded.
- Git delivery: no commit or Git push. All working changes remain local and uncommitted. Shopify delivery: complete and saved files verified. Historical entries below retain their original delivery state.

## 2026-10-27 — Photo-only listing hover and price-style correction

- In `assets/section-featured-collection.css`, listing image swapping now uses the photo container instead of the full card. Added listing resets for Dawn’s inherited card-wide swap; Featured hover and View reveal/focus rules stay as before. Restored prior listing sale-price rules in `assets/template-collection.css`: discounted price first/black, original price red/11.2px/line-through and compact wrapping. Updated README, AGENTS and D022; D021 marked partially superseded.
- Local desktop pointer check: hovering the photo yields image opacities 0/1; moving below the photo yields 1/0 while View remains available. Betul’s computed current/original colors are black/red, original line-through is present and discounted price appears first. View popup opens with content and Escape closes. No JavaScript/Liquid changed; `git diff --check` passed. Mobile screenshot/fit checked at 390px; no physical-device testing. Viewport reset.
- Delivery: local and uncommitted; no Git push or Shopify upload. Prior unrelated pending changes preserved.

## 2026-10-27 — Listing typography, View popup and hover images

- Shared Featured card CSS now also covers Product listing card details, View controls, photo links and pointer/touch rules. Section width/grid/title/VIEW ALL rules stay scoped to Featured. Removed listing’s duplicate tag/price overrides so title, type tag and current/compare-at prices match Featured exactly. Listing’s existing font setting is now labeled Product card font (same ID). README/AGENTS and D021 record setup and shared ownership.
- Listing cards reuse the standard View icon/button and compact quick-view branches in `snippets/card-product.liquid`, without using the Featured ratio/badge flag. Enabled Standard quick add and second-image hover in `templates/collection.json` and section defaults; loaded the shared stylesheet in the listing section. Listing ratios, grid choices and discount-first badges remain.
- Fixed body-mounted popup cleanup on result replacement in `assets/collection-filters.js` and `assets/facets.js`, scoped to the collection section. This prevents duplicate modal IDs after filtering/sorting; other sections remain untouched. Default Suta path browser-tested; alternate Dawn facet cleanup reviewed and syntax-checked, without changing the saved filter layout to exercise it in-browser.
- Actual desktop comparison for Betul: title/tag/current price/compare-at price computed fonts, colors, spacing and margins match Featured exactly; title/tag/price gaps are 4px. All 16 initial listing cards render View, and nine products have second-image markup. Fine-pointer hover advances to the second image and reveals View. Desktop popup opens, gallery advances to 2/2, details link remains and Escape closes/restores View focus. No cart/purchase submitted.
- At 390px and 820px listing text/grid has no document or information overflow. Mobile popup hides View full details, retains horizontal gallery containment and fits the viewport. At 320×568 its scrollable sheet reaches Add to cart (scrollTop 51); no physical-device/touch gesture test. Suta filter refresh retains 16 unique popup IDs; Load More yields 18 cards/18 unique popups, and View still opens. Homepage regression: 24 cards/View controls, 22 collection labels and zero sale badges. Screenshots inspected/saved; viewport reset.
- `node --check` passes for modified JS, JSON parses and `git diff --check` passes. Theme Check: zero errors, nine existing warnings. No dependencies added.
- Delivery: local and uncommitted; no Git push or Shopify upload. Earlier pending work preserved.

## 2026-10-27 — Listing badge priority: discount then collection

- Added a listing-card flag from `sections/main-collection-product-grid.liquid` to `snippets/card-product.liquid`. Listing image badges now render percentage discount first, otherwise reuse the existing collection-priority selection, otherwise omit the top badge. Removed the duplicate native listing sale path while retaining Sold out. Updated listing-scoped badge CSS in `assets/template-collection.css`, README, AGENTS and D020. No Admin data changed.
- Actual local preview at desktop and 390px: Betul shows only 24% OFF, Beet And Turnip/Bossy Caramel show New Arrivals, the other five eligible non-discounted sarees/blouses show BESTSELLER, Gift Card/other ineligible products have no upper-left badge. Both discounted products have exactly one discount badge. All nine top badges align at zero top offset and fit on mobile; no document overflow. No broken badge/title accessibility references. Screenshots inspected and saved; viewport reset.
- Homepage regression checked: 24 Featured cards, 22 existing collection labels, no sale badges and no listing-specific badges. Theme Check: zero errors, nine existing warnings; `git diff --check` passed. No JavaScript changed or physical-device testing. Discounted sold-out branch reviewed, without a dedicated saved test product.
- Delivery: local and uncommitted; no Git push or Shopify upload. Earlier pending changes preserved.

## 2026-10-27 — Filled mobile grid icons with tighter spacing

- Updated only runtime CSS in `assets/collection-filters.css`: filled mobile icons with charcoal selected / grey inactive state and white divisions for the two-product icon, matching the inspected Suta reference. Shifted each symbol inward 4px to reduce visual center spacing by 8px while retaining separate 44×46px targets. Recorded D019 and active AGENTS guidance.
- Local preview at 390px confirms fill colors, 36px symbol-center spacing, 1/2 switching and selected-color updates. Tab retains a 2px visible focus outline. Screenshot inspected/saved. At 320px neither toolbar nor document overflows; viewport reset. `git diff --check` passed. No JavaScript/Liquid changes in this task; no physical-device test.
- Delivery: local and uncommitted; no Git push or Shopify upload. Earlier pending changes preserved.

## 2026-10-27 — Mobile listing toolbar and filter count

- Updated `snippets/collection-filters.liquid` and `assets/collection-filters.css`: below 990px use single/two-product view icons at left, Sort By centered and Filter at right. Hide mobile product total, add inline sort/filter icons and a red applied-filter count badge. Desktop retains its existing controls and default three columns. D018, README and AGENTS record the contract.
- `assets/collection-filters.js` keeps independent mobile view state on the persistent layout root. `sections/main-collection-product-grid.liquid` initializes the authored mobile-column setting for CSS fallback. Listing main/hover image sizes follow rendered mobile width and restore their original desktop sizes. `assets/collection-load-more.js` emits a small products-added event so new images get the same sizing.
- Count uses successfully returned Shopify state: each selected value plus one active price range, with sorting excluded and zero hidden. Verified availability alone=1, availability plus both price bounds=2, price removal=1, Reset=hidden, and browser Back restores the filtered state. Invalid price above the allowed range stays unsubmitted, as before.
- Local preview verified at 320px, 390px, 820px and 1280px. Mobile 1/2 switching, sort persistence and no horizontal overflow checked; desktop starts at 3, switches to 4, shows product total and hides mobile controls. Load More expanded 16 to 18 results with correct sizes on new images. Sort keyboard opening, focus trap, Escape/focus return and filter Escape checked. Screenshots inspected; no physical-device test. Temporary viewport reset after testing.
- JavaScript syntax checks and `git diff --check` passed; Theme Check returned zero errors and nine existing warnings. Refreshed the preview after code changes to avoid stale scripts during development.
- Delivery: local and uncommitted; no Git push or Shopify upload. Earlier changes preserved.

## 2026-10-27 — Percentage badge alignment

- Added `display: block` to the listing-scoped discount badge in `assets/template-collection.css`, removing inline baseline spacing from its positioned wrapper.
- Verification: both visible sale badges measured zero top offset from their images after the change at desktop and 390px phone width; screenshots inspected. The initial desktop measurement also showed zero offset, so the reported gap was not reproduced there before editing. `git diff --check` passed. CSS only; no physical-device test. Temporary viewport reset.
- Delivery: local, uncommitted; no Git push or Shopify upload. Earlier changes preserved.

## 2026-10-27 — Three-column collection default

- Set desktop listing default to three across grid controller, CSS fallback, Liquid control state, section schema and saved collection template. Updated README and AGENTS; D016 records the decision. Existing 2/3/4 controls remain.
- Verification: actual local desktop preview starts with three equal columns and the 3 control selected, without horizontal overflow. Switching to 2 then back to 3 works; screenshot inspected. JavaScript syntax and `git diff --check` passed. Theme Check: zero errors, nine existing warnings.
- Delivery: local and uncommitted; no Git push or Shopify upload. Earlier pending changes preserved.

## 2026-10-27 — Align collection listing width

- Updated `assets/template-collection.css` so the listing/filter container matches product details/footer: centered 1356px cap and 48/24/16px responsive gutters. Nested page-width elements have no duplicate side padding. Homepage Featured collections remain unchanged. Recorded D015 and AGENTS guidance.
- Verification: local `/collections/all` at 1440px has the same 1356px outer width and 48px padding as the footer; desktop screenshot inspected. At 820px and 390px computed padding matches footer at 24px and 16px; no horizontal document overflow at all three widths. Mobile screenshot/interaction verification was inconclusive: browser viewport rendering changed and filter locator did not resolve. Viewport override reset. `git diff --check` passed. CSS only; no JavaScript or Liquid changed.
- Delivery: local and uncommitted; no Git push or Shopify upload. All pre-existing changes preserved.

## 2026-10-27 — Match Suta VIEW ALL buttons

- Updated only Featured collection View all CSS to match the live Suta reference: transparent fill, charcoal text, thin grey outline, square corners and compact 12px lettering/padding. Removed Dawn decorative pseudo-borders in this scope and retained a visible keyboard focus outline. Saved style variants now share this appearance; documented in README, AGENTS and D014.
- Verification: actual local preview at 1280×900, 820×1180 and 390×844 shows both links at about 88×32px with matching colours/border and no text overflow. Desktop/mobile screenshots inspected, keyboard focus verified, destinations remain `/collections/all`, temporary viewport reset. `git diff --check` passed. CSS-only runtime change; no new JavaScript or Liquid changes in this task. No physical-device testing.
- Delivery: local and uncommitted; no Shopify upload or Git push. Preserved pending white background, sale-badge removal and their notes.

## 2026-10-27 — Remove Featured Collection percentage-off badges

- Featured collection explicitly disables sale badges through `show_sale_badge: false` in the shared product-card snippet. Rendering skips badge markup, wrappers, percentage calculation and associated title accessibility references. Sold-out badges and price details remain. Shared sale logic/styles remain because collection listings still use them. Updated README, AGENTS and D013.
- Verification: local homepage at 1280×900 and 390×844 has 24 featured cards and zero discount badges; sale/compare-at prices, ratings, 22 collection labels and sold-out badges remain. Screenshots inspected, mobile information has no overflow, viewport reset. Collection listing still renders percentage badges. Theme Check: zero errors, nine existing warnings; `git diff --check` passed. No JavaScript changes or physical-device testing.
- Delivery: local, uncommitted; no Git push or Shopify upload. Earlier white-background change and user-owned preview server preserved.

## 2026-10-27 — White body background, local only

- Changed only the two Scheme 1 background values in `config/settings_data.json` from cream to `#FFFFFF` (current settings and Dawn preset). Other scheme values, typography and component backgrounds are preserved. Updated AGENTS and D012.
- Verification: actual local homepage body is white with no background image at 1280×900 and 390×844; screenshots inspected and viewport reset. JSON parses, `git diff --check` passed, Theme Check has zero errors and nine existing warnings. No physical-device testing.
- Delivery: uncommitted local change. Existing preview server retained; no explicit Shopify push, live-theme upload or Git push.

## 2026-10-27 — Local commit of pending theme work

- User requested committing all changes. This commit includes Featured collection spacing/tags across devices, mobile quick-view layout/swipe fixes, collection-based badge selection, README authoring guidance, AGENTS and project-memory files. No new storefront behavior was introduced during commit preparation.
- Verification: `git diff --check` passed; Shopify Theme Check returned zero errors and nine existing warnings outside the modified files. No JavaScript changed. Previous browser verification remains documented below; no new browser tests were run for this commit-only request.
- Delivery scope: local Git commit on `feature/homepage-redesign`; no Git push or Shopify upload. CSS was previously uploaded, while the collection-badge Liquid changes remain awaiting explicit upload authorization. See Git log for the commit identifier.

## 2026-10-26 — Desktop and tablet Featured collection styling

- User requested extending the mobile title/tag/price treatment to desktop/tablet and uploading it. Promoted the existing scoped rules in `assets/section-featured-collection.css` out of the phone media query; retained mobile layout rules. Suta's live desktop cards confirmed 4px gaps, 12px outlined tags with 3px corners, and 10.8px title/price text. Updated D006 and AGENTS.
- Local preview at 1280×900, 820×1180 and 390×844: all 24 cards measure 4px title/type and type/price gaps with no information overflow. Desktop/tablet screenshots inspected; desktop quick view opens and Escape closes. Temporary viewport override reset. `git diff --check` passed. No JavaScript/Liquid changes or physical-device tests.
- Delivery: verified theme list, then uploaded only the CSS asset with explicit store/theme, `--nodelete` and `--allow-live` to `tasaa-dev.myshopify.com`, live theme `192399933723`. CLI confirmed success; pulled the saved asset into a temporary directory and `cmp` confirmed an exact match. No Git commit/push. Separate pending collection-badge Liquid changes preserved and not uploaded.

## 2026-10-26 — Collection-based badge selection

- Updated `snippets/card-product.liquid` to select the lowest-priority enabled collection title, with deterministic handle ties and no badge when no collection qualifies. Updated Featured collection schema help and removed unused `collection_label` render argument. README and AGENTS document the contract (D011).
- Created and pinned collection definitions Show as product badge (`custom.show_as_product_badge`, boolean) and Product badge priority (`custom.product_badge_priority`, integer 1–9999) on tasaa-dev.myshopify.com.
- Saved New Arrivals enabled/priority 1 and BESTSELLER enabled/priority 2, as confirmed by the user. Other collections remain unset/excluded. No collection memberships or product values changed.
- Theme Check: zero errors, nine existing warnings outside the two changed Liquid files. `git diff --check` passed. Local preview initially rendered no badge before opt-in; after setup, overlapping products Beet And Turnip/Betul/Bossy Caramel render New Arrivals, other bestseller members render BESTSELLER, Gift Card has no badge. At 390×844 and 1280×900, all 22 rendered badges fit without overflow.
- Delivery: collection definitions and values saved in Shopify Admin. Theme source changes local only; no theme upload, Git commit or Git push. Earlier uploaded CSS changes preserved.

## 2026-10-26 — Reverted per-product badge controls

- User requested reverting the preceding task. Restored `README.md`, `sections/featured-collection.liquid` and `snippets/card-product.liquid` to their previous content; removed the corresponding active AGENTS rule. Preserved all earlier CSS changes.
- After explicit confirmation, deleted only Shopify definitions `557599293723` and `557602734363`, using Delete field only. Both showed zero products; final admin list confirms removal. No saved values deleted.
- `git diff --check` passed; affected tracked files match HEAD. No theme upload, commit or Git push. D009 superseded by D010.

## 2026-10-26 — Per-product Featured collection badges

- Implemented custom text → hide badge → collection title priority in `snippets/card-product.liquid`. Reused `custom.collection_label`; added `custom.hide_collection_badge`. Empty/whitespace custom text falls through; hidden badges emit no span. Updated Featured collection editor help without changing its persisted setting ID.
- Documented setup and priority in README and AGENTS (D009). After user sign-in, created and confirmed both product definitions in Shopify Admin for all products, pinned: text definition `557599293723`, boolean definition `557602734363`. No product values changed.
- Verification: Shopify Theme Check completed with zero errors and nine warnings elsewhere, none in either modified Liquid file. `git diff --check` passed. Actual local Shopify preview continues to render 24 default collection badges. Custom/hide branches reviewed; not tested with saved product values.
- Delivery: Shopify admin definitions saved; new theme files remain local, not uploaded. No Git commit or Git push. Prior uploaded CSS diff preserved.

## 2026-10-24 — Authorized swipe-fix upload

- User explicitly requested Shopify upload. Rechecked the live theme target: `192399933723` (`dev-theme-id`) on `tasaa-dev.myshopify.com`.
- Uploaded only `assets/section-featured-collection.css` with `--allow-live` and `--nodelete`. CLI confirmed success; pulled the saved asset into a temporary directory and `cmp` confirmed it matches the local stylesheet exactly.
- `git diff --check` passed. No Git commit or Git push. Existing browser verification and physical-device limitation remain as recorded below.

## 2026-10-24 — Mobile quick-view swipe stability

- Inspected Suta's live mobile popup before editing. Added a below-700px rule in `assets/section-featured-collection.css` to hide vertical gallery overflow and restrict gestures to horizontal panning plus pinch zoom; see D008. No JavaScript handlers or dependencies added.
- At 390×844, computed styles match the fix and the gallery stays at y≈232px while Next advances the slide. At 320×568, Product Details expands and keyboard scrolling advances the sheet to scrollTop 247. Escape closes. At 1280×900, original touch/overflow styles and the desktop details link remain.
- `git diff --check` passed. No physical-phone or synthetic touch swipe test; no purchase submitted.
- Delivery: this fix is local only. No Git commit, Git push or Shopify upload.

## 2026-10-24 — Authorized quick-view upload

- User explicitly requested pushing the pending changes to Shopify.
- Rechecked branch, diff and theme list; `192399933723` is still the live `dev-theme-id` on `tasaa-dev.myshopify.com`.
- Uploaded only `assets/section-featured-collection.css` with `--nodelete` and `--allow-live`; Shopify CLI confirmed success. Includes mobile quick-view layout and prior unused-selector cleanup.
- `git diff --check` passed. No Git commit or Git push; documentation remains local.

## 2026-10-24 — Mobile quick-view layout

- Updated `assets/section-featured-collection.css` to hide View full details below 700px and enlarge the image to match Suta's mobile popup proportions; see D007. Removed two superseded media-width overrides and the 83dvh sheet-height override; existing 90dvh scrolling cap applies.
- Actual local Shopify preview verified at 390×844, 320×568 and 1280×900. Mobile link is display:none, image is about 253×337px at 390px, short-phone content scrolls to Add to cart and Product Details. Gallery Next changes the slide, Product Details opens/closes, Escape closes and restores focus to View. Desktop details link and thumbnails remain visible.
- `git diff --check` passed. No purchase was submitted, no physical device test was performed, and no JavaScript/Liquid changed.
- Delivery: local only; no Shopify upload, Git commit or Git push. Earlier homepage-card cleanup remains local as well.

## 2026-10-24 — Featured Collections cleanup

- Removed the unused `.featured-collection.collection .featured-card__type` selector from the new phone rule after the user asked about unwanted code. The real homepage class is `collection-card__type`.
- Kept shared `featured-card__type` styling used outside the homepage and the required spacing/font overrides. No fixture or dependency was added to the repository.
- Verification: inspected section/snippet context and `git diff --check`. Selector removal does not affect actual homepage markup.
- Delivery: local only; no additional Shopify upload, Git commit or Git push.

## 2026-10-24 — Mobile Featured Collections correction

- Updated `assets/section-featured-collection.css` for Suta's 4px title/type/price rhythm and outlined mobile tags; see D006.
- First upload targeted only `featured-card__type`, but the actual snippet rendered `collection-card__type`, leaving tags unstyled. User reported no visible change. Added the real class and explicit font/border sizing.
- Verified actual local Shopify cards at 390px (4px gaps and 20px bordered tags) and 320px (24 cards, no information overflow), plus unchanged desktop tag styling. `git diff --check` passes. Theme Check on the initial CSS-only change returned no errors.
- Delivery: corrected CSS uploaded successfully, scoped to one file with `--nodelete`, to `tasaa-dev.myshopify.com`, live theme `192399933723`. No Git commit or push. Public storefront is password protected; visual verification used the local Shopify preview.

## 2026-10-24 — Project memory setup

- User requested persistent files for important decisions, goals, steps and completed work.
- Created `STATUS.md`, `DECISIONS.md` and this log; added a linked read/update workflow to root `AGENTS.md`.
- Seeded the handoff from the conversation and a fresh local branch/status/log/diff inspection. Recorded the pre-existing Featured collection CSS change without modifying it.
- Verification: documentation links resolve locally; `git diff --check` passes. No storefront runtime test is needed for these documentation-only edits.
- Delivery: local documentation only. No commit, Git push or Shopify upload performed.

## Historical baseline — latest implementation milestone

Recorded on 2026-10-24; original completion dates were not reconstructed.

- Local Git confirms `e37a870`: “Improve product gallery, review highlights, and mobile interactions.”
- Work included fitted product image viewing with bounded zoom and empty-space dismissal; product/reviews/related alignment; mobile image/breadcrumb spacing; seven-card review highlights; pointer-focus fixes for Categories, review return and product accordions.
- Earlier conversation reports browser checks for mobile/desktop layout and pointer/keyboard interactions, followed by commit, origin push and scoped Shopify uploads. These checks and remote state were not rerun for the memory setup. Physical-device testing was not established.
- Existing behavior and limitations are summarized in `../../AGENTS.md`; use the commit and actual source for implementation details.

## Entry format for future work

- Date and concrete outcome; distinguish the user's requirement from agent implementation choices.
- Affected files or commit; important decisions link to `DECISIONS.md`.
- Checks actually run and results; remaining limitations or blockers.
- Delivery stated separately: local / committed / Git-pushed / Shopify-uploaded, including verified target where applicable.
- Update `STATUS.md` with remaining steps rather than leaving obsolete pending work in this log.
