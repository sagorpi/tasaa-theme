# Tasaa Shopify theme — project guidance

Read this file before changing the theme. Read the relevant custom authoring sections in `README.md` and inspect current code before implementing. This file records durable decisions from the project conversation; it is not a substitute for checking current repository or Shopify state. New explicit user instructions take precedence.

## Project memory workflow

- At the start of work, read [current status](docs/project-memory/STATUS.md), then relevant entries in [decisions](docs/project-memory/DECISIONS.md) and [work log](docs/project-memory/WORK_LOG.md). Check the actual working tree; notes are dated snapshots, not live state.
- `STATUS.md` holds the current goal, remaining steps, blockers and handoff. Update it after meaningful progress and before ending unfinished work. Do not turn historical requests into a new backlog without checking whether they were completed or cancelled.
- `DECISIONS.md` records important user decisions and consequential implementation choices with their source, rationale and status. Distinguish user requirements, agent choices and unverified assumptions. Mark superseded decisions and link their replacements; keep active rules in this file consistent.
- `WORK_LOG.md` records completed milestones, affected files or commits, verification and separate Git/Shopify delivery status. Include failed attempts only when they explain an unresolved issue or prevent repeating a mistake. Use dated, concise entries rather than transcripts.
- Maintain these notes as part of relevant work, including decisions made by the user. Record uncertainty honestly; never infer successful testing, deployment or user approval from a plan. Do not overwrite another contributor's pending work or claim it as your own.
- Keep merchant setup instructions in `README.md`, code history in Git, and durable operating rules here. Link rather than duplicate long explanations. No separate per-agent files are needed unless parallel work actually requires them.
- These files provide continuity to chats that can read this checkout; they do not automatically transfer every conversation or synchronize to other checkouts. Documentation updates do not authorize commits or pushes.

## Working and deployment rules

- This is a customized Shopify Dawn theme. Prefer Liquid, existing CSS and small vanilla JavaScript components over new dependencies or apps.
- Make requested changes locally and verify them first. **Do not push to Shopify unless the user explicitly requests it.** A past push request does not authorize deployment of future changes.
- Git commits, Git pushes and Shopify uploads are separate actions. “Push local commits” means Git; “push to Shopify” means a theme upload. Do not infer one from the other.
- Preserve unrelated work. Check `git status` and the current branch before editing or committing. Do not reset or overwrite user changes.
- Last established working branch: `feature/homepage-redesign`. Verify rather than switching automatically.
- Git remote `origin`: `https://github.com/sagorpi/tasaa-theme.git`. `upstream` is Shopify/Dawn; do not push project changes there.
- Correct Shopify store: **`tasaa-dev.myshopify.com`**. Last verified live theme: **`192399933723`**, named `dev-theme-id`. There is also an unpublished theme with the same name, so use the numeric ID and verify the target before deploying.
- `shopify.theme.toml` contains placeholder environment values and a production store named `tasaa.myshopify.com`. Do not use that production environment as the deployment target without explicit user direction.
- For an authorized scoped upload, use explicit store/theme flags, `--nodelete`, and `--only` for the changed theme files. Use `--allow-live` for the verified live target. Do not overwrite remote configuration or templates unnecessarily.
- Local preview has been served at `http://127.0.0.1:9292`. Check availability; do not stop or replace a user-owned development server.
- Never store credentials, tokens, customer data or browser session material in this file or the repository.

## Design decisions

- Suta (`https://suta.in`) is the primary visual and interaction reference. Inspect the relevant current reference when matching a new behavior; do not assume all sections use the same design.
- Sutisancha supplies specific references, including related-product arrows and some mobile behavior. Customer review photos/cards use a Flipkart-inspired layout. Preserve these deliberate exceptions.
- **No wishlist buttons anywhere in the theme.**
- Use white (`#FFFFFF`) for the theme-wide default body background: Scheme 1 in the current settings and Dawn preset. Preserve separately authored section and component colours. Keep product pages, product listings and customer-review backgrounds white.
- Keep changes scoped to the requested component/device. Full product pages use `.tasaa-product-page[data-update-url='true']`; quick view uses `data-update-url='false'` and has separate compact styling.
- Collection product listings match the product details/footer container: 1356px maximum width with 48px desktop, 24px tablet and 16px phone side padding. Keep this scoped to `.product-listing-section`; homepage Featured collections retain their own width.
- Product content width is capped at 1356px, with 48px desktop, 24px tablet and 16px phone side padding. Product-page related products and customer reviews align with that content. Do not widen homepage collections as a side effect.
- On phones (below 750px), the main product photo aligns with the description at 16px side padding, retains its proportions, and has no extra section-top/slide-top padding after the breadcrumbs. Breadcrumb bottom spacing provides approximately 7px of separation.
- Most navigation switches to mobile/tablet below 990px. Follow each component's existing breakpoints instead of applying a single breakpoint globally.
- Mobile upper navigation is not sticky. The secondary navbar appears only on the homepage. Main navigation does not show an active-page indication.
- Below 990px, keep the mobile/tablet menu drawer above listing filters throughout closing. Retain the header's raised layer while the custom header drawer's main `details[open]` remains open; the existing controller owns close completion, rapid reopen, reduced motion and focus restoration.
- Touch/click activation must not leave unwanted focus outlines on product accordions, the Categories close button, or Show all reviews after returning. **Preserve semantic focus, keyboard focus indicators, Escape behavior and focus restoration.** Do not globally remove focus styles or blur all controls.
- Render the cart confirmation with native `hidden` so its message cannot flash before asynchronous CSS loads. `CartNotification.open()` removes `hidden` before measuring the entrance animation; keep the existing countdown, close transition, `aria-hidden`/`inert` state and focus behavior. Its Liquid snippet and JavaScript must be deployed together when authorized.

## Component map

| Feature | Main files |
| --- | --- |
| Homepage Featured collection | `sections/featured-collection.liquid`, `assets/section-featured-collection.css`, `snippets/card-product.liquid` |
| Image link, including horizontal scroll variant | `sections/image-link-banner.liquid`, `assets/section-image-link-banner.css`, `assets/section-image-link-scroll.css`, `assets/image-link-scroll.js` |
| Testimonials | `sections/testimonial-carousel.liquid` |
| Product page and gallery | `sections/main-product.liquid`, `assets/section-main-product.css`, `assets/product-info.js`, `snippets/product-media-gallery.liquid`, `assets/product-gallery-navigation.css` |
| Product image zoom viewer | `snippets/product-media-modal.liquid`, `assets/product-modal.js` |
| Information and Similar Products accordions | `snippets/product-information.liquid`, `snippets/product-detail-specifications.liquid`, `snippets/product-similar-accordion.liquid`, `assets/product-information.css` |
| Related products | `sections/related-products.liquid`, `assets/section-related-products.css`, `assets/product-carousel.js` |
| Customer reviews | `assets/customer-reviews.js`, `assets/customer-reviews.css`, `sections/apps.liquid`, `snippets/sample-product-reviews.liquid` |
| Mobile bottom navigation and floating Add To button | `sections/mobile-bottom-menu.liquid`, `assets/mobile-bottom-menu.js`, `assets/mobile-bottom-menu.css` |
| Cart confirmation notification | `snippets/cart-notification.liquid`, `assets/cart-notification.js`, `assets/component-cart-notification.css`; stylesheet loaded in `sections/header.liquid` |
| Collection cards and quick view | `sections/main-collection-product-grid.liquid`, `snippets/card-product.liquid`, `assets/template-collection.css`, `assets/section-featured-collection.css`, `assets/quick-add.js` |
| Collection filters, sorting and loading | `sections/main-collection-product-grid.liquid`, `assets/collection-filters.js`, `assets/collection-filters.css`, `assets/collection-load-more.js`, `assets/collection-discount-sort.js`, `assets/facets.js` |

The editor name is **Image link**, although its section filename still contains `banner`. Scroll and banner layouts are variants of the same section, with an optional title and authorable visible-image counts.

## Product content and authoring

- Product Details renders category metafields first, equivalent custom metafields second. `custom.product_details` rich text is the fallback when structured rows are absent. Variant SKU follows, then the shared `settings.product_details_note`.
- Short description uses `custom.short_description`; the separate Description accordion uses the normal Shopify product description.
- Business information uses `custom.business_information` (metaobject with rich-text `content`) or a shared selected Page. Return policy uses `custom.return_policy_override` (Page reference) or the shared selected Page. Hide missing content rather than inventing storefront information.
- Delivery estimates use shared block defaults with `custom.delivery_min_days` / `custom.delivery_max_days` product overrides; these are estimates, not carrier guarantees.
- Featured collection image badges come from product collections with `custom.show_as_product_badge` true. Lowest `custom.product_badge_priority` (integer 1–9999) wins; blank priority ranks last, ties use collection handle order, and no eligible collection means no badge. Section `show_collection_label` remains the master switch. This replaces the old product override/section-title fallback; see README.
- Product listing upper-left badges show percentage discount first (when Compare-at price exceeds Price), otherwise the collection badge using the same opt-in/priority/handle rules above, otherwise none. Use one top-left badge; retain the separate Sold out badge. Keep this distinct from Featured collection’s sale-badge suppression.
- Featured collection and Product listing cards share compact uppercase 10.8px titles/prices, 4px title/type/price gaps and outlined 12px type tags with 3px corners at every size. Card/quick-view styles are shared in `assets/section-featured-collection.css`; keep section widths/grids/headings separate. Featured collection omits sale badges while retaining prices, ratings, collection labels and sold-out badges; listing keeps its discount-first rule.
- Product listing Quick add → Standard uses Featured’s eye-icon View button and compact popup, including single-variant products. Standard and second-image hover are enabled in the default collection template/new section defaults. In Product listing and Featured Collection, fine pointers swap images only over the photo area, not the title/tag/price below it; retain the View button’s existing card-hover/focus behavior. Touch retains the main image with View available. Both components show sale prices as current price first in black, then red struck-through original price (11.2px). Keep listing ratios and badge logic separate from `featured_card`. Result refreshes must clean up only that section’s body-mounted quick-view modals to avoid duplicate IDs; preserve focus.
- Featured collection VIEW ALL links use Suta’s compact outlined style at every width: transparent background, `#1c1c1c` text, 1px `#0000008b` border, square corners, 12px type and 5px/12px padding. Keep keyboard focus visible. This scoped styling takes precedence over saved View all style variants.
- Title badges show Product Type then Fabric; use the first value when multiple values exist. Preserve the distinct first-tag color and coordinated share styling.
- Similar Products is the first accordion, with its own rounded colored header, bordered product cards and horizontal scrollbar. Do not apply that styling to the other information rows.
- Hide the quantity counter and place Add to cart and Buy it now side by side. Keep quick view compact: omit add-ons, delivery estimate, Similar Products and other information accordions except Product Details. Below the quick-view mobile breakpoint (700px), hide View full details and use the larger viewport-bounded image; preserve desktop details links, gallery navigation and purchase behavior. Keep mobile image swipes horizontal with vertical gallery overflow hidden; allow the details area to scroll the sheet and preserve pinch zoom.
- Benefits are globally authored: Secure Payments, Cash on Delivery, WhatsApp Assistance and Packed With Love. Keep the compact icon row.
- Add-ons use shared `product_addon` and `product_addon_group` metaobjects. Groups with handles `saree` / `blouse` provide Product Type defaults; `custom.addon_group` overrides and `custom.disable_addons` disables them. Paid add-ons are actual variant-backed cart items; free/included services use line-item properties. See README for setup and cart behavior.
- Mobile menu Iconify tokens are authored in Shopify menu labels, e.g. `Sarees [icon:twemoji:sari]`. The token is removed from displayed text; lazy SVG images avoid an icon library or app.
- Collection layout defaults to three desktop columns with 2/3/4 controls. Below 990px, use independent 1/2-product view controls on the left, Sort By in the middle and Filter on the right; hide the product total. Mobile grid icons are filled charcoal when selected and grey otherwise, with compact visual spacing and separate 44px touch targets. Mobile starts from the authored mobile columns setting. Include sort/filter icons and a filter-count badge (selected values plus one active price range; exclude sorting, hide zero). Keep view choices and filter/sort state across loading and navigation, and size listing images appropriately for the selected mobile view.
- Desktop listing toolbar and sidebar follow the main header's `.animate` state and shared `--header-sticky-transition` timing, keeping their sticky offsets synchronized during reveal, hide and direction changes. Preserve the initial instant hide and collection-end containment. Reduced-motion desktop listings stop both header and filter motion together; mobile/tablet behavior stays separate.
- Keep listing card overlays, including View, below the sticky filter toolbar on mobile and desktop. Isolate `#ProductGridContainer` within `.tasaa-collection-layout`; body-mounted quick-view dialogs remain above the filters. Preserve the View button's existing reveal and popup behavior.
- Mobile/tablet Sort By must dim the toolbar with the page. Keep its sheet outside `.cf-toolbar` but inside `collection-filters`; `syncPanels()` restores the original desktop dropdown placement. Preserve one panel ID, delegated events, sorting refreshes, focus trapping and focus return. Focus the mobile sheet after it becomes visible, with guards for close/resize/disconnect; retain keyboard focus indicators. Deploy the matching filter JS/CSS together when authorized.

## Reviews and image behavior

- Judge.me supplies real reviews. Never fabricate verified-buyer or Judge.me verification badges.
- Clearly labeled sample reviews are theme-only design fixtures, gated to the dev store and `beet-and-turnip` by the Apps section's **Show sample reviews** setting. They use catalogue photos, are not customer feedback, and are not uploaded to Judge.me. Disable the setting to restore the real widget.
- The review preview carousel shows at most seven reviews, newest date first, highest rating as the tie-breaker for the same day. This sorts the reviews currently available in the widget DOM; it does not fetch the entire remote review history just to rank the preview.
- Show all reviews opens a popup on desktop and a fullscreen view with a fixed back/filter header on mobile. Initially show five reviews; Load More adds five with a circular loader. Keep filter labels bold in both selected and unselected states to prevent shifting. No like/dislike buttons or “X reviews shown” text.
- Review photos share one mosaic with a remaining-photo counter on the last tile. Photo viewing shows the associated review details, Read more, name and date when present. Mobile details overlay the centered image on translucent black; arrows stay fixed, with directional swipe transitions.
- Ratings use yellow stars; preview cards show five star positions with filled/outline states. The average count is larger than its adjacent yellow star.
- Main product image viewing fits the full image first, with bounded intentional zoom/pan, swipe/arrow navigation and empty-space dismissal. Preserve native dialog focus handling, reduced-motion behavior and deferred video/model support.

## Verification and ongoing maintenance

- Run `git diff --check` and `node --check` for modified JavaScript. Run Shopify theme checks for relevant Liquid/schema changes; distinguish existing warnings from new failures.
- For visual/interaction changes, verify the affected mobile/desktop sizes in the local preview, including opening/closing, scrolling, keyboard access and overflow where applicable. Do not claim physical-device testing when only a resized browser was used.
- In the final response, state what changed, meaningful verification, and whether it was kept local, committed, pushed to Git, or uploaded to Shopify.
- **Keep this file updated during future work** when an accepted decision changes design rules, deployment targets, authoring contracts, component ownership or important limitations. Replace superseded guidance rather than appending contradictory instructions.
- Update README authoring instructions when merchant-facing settings or content sources change. README contains older Dawn boilerplate and some historical descriptions; inspect current code and reconcile obsolete custom guidance when touching that area.
- Keep this file concise and durable. Do not log every tool call, temporary screenshot, routine push or conversation turn. Use Git history for detailed changes. Documentation maintenance does not authorize a commit or deployment.
