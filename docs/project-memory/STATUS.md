# Current project status

Last updated: 2026-10-27. Read `../../AGENTS.md` first. Verify this snapshot against Git and the current task before acting.

## Goal and current work

Maintain Tasaa's customized Shopify theme with the accepted Suta-inspired storefront and deliberate Sutisancha/Flipkart references. Preserve authorable settings, lightweight implementation and mobile/keyboard behavior.

Latest request: commit all pending changes locally on `feature/homepage-redesign`. This commit packages the Featured collection styling, mobile quick-view improvements, collection-controlled badges, README authoring guidance and project memory. No Git push or new Shopify upload is part of this request.

## Repository and delivery snapshot

- Branch checked: `feature/homepage-redesign`. Previous HEAD: `e37a870`. Use Git log for this commit's identifier.
- `assets/section-featured-collection.css`: 4px title/type/price gaps and outlined tags at every width, larger mobile quick-view images, hidden mobile details link and horizontal swipe containment. The CSS was uploaded to live theme `192399933723` on `tasaa-dev.myshopify.com` by 2026-10-26; downloaded asset matched local CSS exactly.
- `snippets/card-product.liquid` and `sections/featured-collection.liquid`: collection badge selection (D011) is included in this commit but has not been uploaded to Shopify. Definitions and collection values are already configured in Admin: New Arrivals priority 1, BESTSELLER priority 2, other collections excluded while unset.
- README, AGENTS and project-memory documents are included in this commit. Historical entries retain the delivery state at the time of each milestone.
- No checkout provider has been selected or installed; the Shopflo/Razorpay discussion was advice only.

## Remaining steps and verification

- Collection badge theme upload awaits an explicit user request; only the two Liquid files need uploading for that feature. Git push likewise awaits a request.
- On 2026-10-27, `git diff --check` passed and Shopify Theme Check returned zero errors and nine existing warnings outside the changed files. No JavaScript was modified. Earlier visual checks below were not repeated for this commit-only request.
- Local preview previously verified at 1280×900, 820×1180 and 390×844: all 24 cards have 4px gaps and no information overflow. Desktop quick view opens/closes; viewport override reset. No physical-device testing.
- Actual saved collection values previously verified in the local preview: New Arrivals wins for three overlapping products, BESTSELLER for its other five members, Gift Card has no badge. Badges fit at mobile and desktop sizes.
- Shopify Admin's main Collections list did not offer metafield columns when inspected on 2026-10-26. Product badge priority was enabled in the collection bulk editor instead; values were not changed.
- D009's product metafield definitions remain removed. Preserve the user-owned preview server.

## Handoff routine

1. Read the latest user request and these notes; inspect branch, status and relevant code.
2. Replace the current-work section with the actual goal and a short checklist for substantial work. Track completed steps, next action and concrete blockers.
3. Record changed decisions in `DECISIONS.md`; log completed work and verification in `WORK_LOG.md`.
4. Before handing off, state exactly what is local, committed, Git-pushed or uploaded to Shopify. Date the snapshot and retain unrelated pending changes.
