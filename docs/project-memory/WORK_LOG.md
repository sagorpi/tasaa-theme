# Work log

Keep meaningful milestones here, newest first. Record actual outcomes and verification, not planned success. Detailed diffs belong in Git; authoring instructions belong in README.

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
