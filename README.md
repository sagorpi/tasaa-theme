# Dawn

[![Build status](https://github.com/shopify/dawn/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Shopify/dawn/actions/workflows/ci.yml?query=branch%3Amain)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=informational)](/.github/CONTRIBUTING.md)

[Getting started](#getting-started) |
[Staying up to date with Dawn changes](#staying-up-to-date-with-dawn-changes) |
[Developer tools](#developer-tools) |
[Contributing](#contributing) |
[Code of conduct](#code-of-conduct) |
[Theme Store submission](#theme-store-submission) |
[License](#license)

Dawn represents a HTML-first, JavaScript-only-as-needed approach to theme development. It's Shopify's first source available theme with performance, flexibility, and [Online Store 2.0 features](https://www.shopify.com/partners/blog/shopify-online-store) built-in and acts as a reference for building Shopify themes.

* **Web-native in its purest form:** Themes run on the [evergreen web](https://www.w3.org/2001/tag/doc/evergreen-web/). We leverage the latest web browsers to their fullest, while maintaining support for the older ones through progressive enhancement—not polyfills.
* **Lean, fast, and reliable:** Functionality and design defaults to “no” until it meets this requirement. Code ships on quality. Themes must be built with purpose. They shouldn’t support each and every feature in Shopify.
* **Server-rendered:** HTML must be rendered by Shopify servers using Liquid. Business logic and platform primitives such as translations and money formatting don’t belong on the client. Async and on-demand rendering of parts of the page is OK, but we do it sparingly as a progressive enhancement.
* **Functional, not pixel-perfect:** The Web doesn’t require each page to be rendered pixel-perfect by each browser engine. Using semantic markup, progressive enhancement, and clever design, we ensure that themes remain functional regardless of the browser.

You can find a more detailed version of our theme code principles in the [contribution guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md#theme-code-principles).

## Getting started
We recommend using Dawn as a starting point for theme development. [Learn more on Shopify.dev](https://shopify.dev/themes/getting-started/create).

> If you're building a theme for the Shopify Theme Store, then you can use Dawn as a starting point. However, the theme that you submit needs to be [substantively different from Dawn](https://shopify.dev/themes/store/requirements#uniqueness) so that it provides added value for merchants. Learn about the [ways that you can use Dawn](https://shopify.dev/themes/tools/dawn#ways-to-use-dawn).

Please note that the main branch may include code for features not yet released. The "stable" version of Dawn is available in the theme store.

## Staying up to date with Dawn changes

Say you're building a new theme off Dawn but you still want to be able to pull in the latest changes, you can add a remote `upstream` pointing to this Dawn repository.

1. Navigate to your local theme folder.
2. Verify the list of remotes and validate that you have both an `origin` and `upstream`:
```sh
git remote -v
```
3. If you don't see an `upstream`, you can add one that points to Shopify's Dawn repository:
```sh
git remote add upstream https://github.com/Shopify/dawn.git
```
4. Pull in the latest Dawn changes into your repository:
```sh
git fetch upstream
git pull upstream main
```

## Developer tools

There are a number of really useful tools that the Shopify Themes team uses during development. Dawn is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://github.com/Shopify/shopify-cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes—everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://shopify.dev/docs/themes/tools/cli) to get started.

### Theme Check

We recommend using [Theme Check](https://github.com/shopify/theme-check) as a way to validate and lint your Shopify themes.

We've added Theme Check to Dawn's [list of VS Code extensions](/.vscode/extensions.json) so if you're using Visual Studio Code as your code editor of choice, you'll be prompted to install the [Theme Check VS Code](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension upon opening VS Code after you've forked and cloned Dawn.

You can also run it from a terminal with the following Shopify CLI command:

```bash
shopify theme check
```

### Continuous Integration

Dawn uses [GitHub Actions](https://github.com/features/actions) to maintain the quality of the theme. [This is a starting point](https://github.com/Shopify/dawn/blob/main/.github/workflows/ci.yml) and what we suggest to use in order to ensure you're building better themes. Feel free to build off of it!

#### Shopify/lighthouse-ci-action

We love fast websites! Which is why we created [Shopify/lighthouse-ci-action](https://github.com/Shopify/lighthouse-ci-action). This runs a series of [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) audits for the home, product and collections pages on a store to ensure code that gets added doesn't degrade storefront performance over time.

#### Shopify/theme-check-action

Dawn runs [Theme Check](#Theme-Check) on every commit via [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action).

## Contributing

Want to make commerce better for everyone by contributing to Dawn? We'd love your help! Please read our [contributing guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build for Dawn.

## Code of conduct

All developers who wish to contribute through code or issues, please first read our [Code of Conduct](https://github.com/Shopify/dawn/blob/main/.github/CODE_OF_CONDUCT.md).

## Theme Store submission

The [Shopify Theme Store](https://themes.shopify.com/) is the place where Shopify merchants find the themes that they'll use to showcase and support their business. As a theme partner, you can create themes for the Shopify Theme Store and reach an international audience of an ever-growing number of entrepreneurs.

Ensure that you follow the list of [theme store requirements](https://shopify.dev/themes/store/requirements) if you're interested in becoming a [Shopify Theme Partner](https://themes.shopify.com/services/themes/guidelines) and building themes for the Shopify platform.

## License

Copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md) for further details.

## Mobile menu icons

In Shopify **Content → Menus**, append an Iconify name to an item label:
`Sarees [icon:mdi:hanger]`. Use one icon token per label. This works for all
three menu levels. Mobile/tablet drawers display the 20px icon; desktop and
footer menus display only the clean label. Remove the token for a text-only item.

Icons load as lazy SVG images from Iconify's public API, without a library or app.
Invalid names and failed images leave the label/link usable. Icon sets retain
their individual licenses. No separate theme-editor icon blocks are needed.

## Product information and delivery authoring

The default product template now places **Delivery estimate** and **Product information**
blocks after Buy buttons. In **Online Store → Themes → Customize/Edit theme → Products →
Default product → Product information**, edit headings, choose shared Pages and optionally
open the first available row. Other product templates need these blocks added manually.
Remove the old standalone Description block if adding Product information to another template.
Empty rows are hidden for shoppers; editor-only hints explain missing content.

### 1. Product Details (different for each product)

In **Settings → Metafields and metaobjects → Products → Add definition**, create:

- Name: Product Details
- Namespace and key: `custom.product_details`
- Type: **Rich text** (one value)

Open **Products → your product → Metafields → Product Details** and enter your labelled
specifications (for example Fabric, Length, Width, Blouse piece and Wash care). Bold labels
and lists are supported. Save the product. Do not paste all the specifications into the
Description if you want the two accordions to stay separate.

### 2. Description (different for each product)

Edit the normal **Description** field at the top of each product's admin page. It renders
in the Description accordion, independently of Product Details.

### 3. Importer/Marketer/Packer Details (shared with optional product selection)

For one business shared by all products, create a Shopify **Page** with your own importer,
marketer and packer names, addresses, country of origin and contact information. In the
Product information block select it under **Default business information page**. There
is no need to add that Page to your navigation menu.

For products that require different business information:

1. In **Settings → Metafields and metaobjects**, add a metaobject definition named
   **Business information**, type `business_information`.
2. Add a **Name** field (`name`, single-line text, used as the display name) and a
   **Content** field (`content`, rich text). Content can describe different businesses
   for each role; it is not restricted to one company.
3. Enable **Storefront access**. If active/draft status is enabled, publish entries as Active.
4. Under **Content → Metaobjects**, create one entry per reusable set of business details.
5. Add a Product metafield named **Business information**, key
   `custom.business_information`, type **Metaobject reference**, one entry, restricted
   to the Business information definition. Enable storefront access where offered.
6. Select an entry on each applicable product. Updating one entry updates all products
   referencing it. Products without a populated entry use the shared Page instead.

### 4. Return & Exchange Policy (shared with optional product override)

Create a Shopify Page containing your own policy. Select it as **Default Return & Exchange
Policy page** in the Product information block. Editing that Page changes the policy
wherever it is referenced; changing static template settings affects all products using
that template, even when you preview a particular product in the editor.

For exceptions, define Product metafield `custom.return_policy_override`, type **Page
reference** (one value). Select an alternative policy Page on the relevant product.
Leave it empty to use the block's default Page. No policy wording or company details from
other stores have been copied into your store.

### 5. Delivery estimate

Select the **Delivery estimate** block in the product template:

- Toggle the message on/off.
- Set minimum/maximum **calendar days** (default 5–7).
- Edit text before and after the dates (default destination: within India).

Dates update in **Asia/Kolkata** time on page load and while the page stays open, including
month/year boundaries. Weekends and holidays count; this is not a postcode/carrier lookup.
The maximum is never allowed to display earlier than the minimum. With JavaScript disabled
the estimate stays hidden rather than displaying stale dates.

For a product-specific range, create two Product metafields of type **Integer** (one value):
`custom.delivery_min_days` and `custom.delivery_max_days`. Set a minimum validation of zero.
Fill in both on the product, or leave them empty to use the template defaults.
Confirm your actual fulfilment timings before using the default range on your live store.

These theme changes do not create admin metafield definitions, metaobject entries or Pages;
complete the setup above to populate the empty accordions. Content uses the same Liquid
snippet in the full product page and the featured quick-view modal. No app is required.

## Product image gallery

The default product template uses **Thumbnail carousel**, **Show mobile thumbnails**,
and the new **Vertical desktop thumbnails** setting (Product information section → Media).
At 990px and wider, portrait thumbnails sit in a scrollable column to the left of the main
image. Below 990px, they form a horizontally scrollable strip below the main image.
Selecting a thumbnail updates the main image; the existing touch slider and image zoom
remain available. The selected thumbnail has a border and supports keyboard focus.

Manage images and their order in **Products → your product → Media**. No separate thumbnail
uploads are required. Products with only one image do not need a thumbnail strip. For
other templates, select the same three settings in their main product section. The
featured quick-view modal retains its compact gallery layout.

### Structured Product Details and SKU

Product Details now prefers structured specifications, then shows the selected variant's
SKU last. Supported rows are rendered in this order; empty values are hidden:

| Label | Category field (preferred) | Custom fallback |
| --- | --- | --- |
| Fabric | `shopify.fabric` | `custom.fabric` |
| Colour | `shopify.color-pattern` | `custom.colour` |
| Age group | `shopify.age-group` | `custom.age_group` |
| Target gender | `shopify.target-gender` | `custom.target_gender` |
| Length | — | `custom.length` |
| Width | — | `custom.width` |
| Blouse piece | — | `custom.blouse_piece` |
| Blouse piece length | — | `custom.blouse_piece_length` |
| Wash care | `shopify.care-instructions` (if available) | `custom.wash_care` |

Select the appropriate product category and fill its **Category metafields** in the product
editor. The category determines which standard fields Shopify offers; the theme does not
create category definitions. Reference-list fields render their readable labels (for
example Cotton, Linen), never internal IDs.

For custom definitions use Dimension for measurements, True/false for blouse-piece
inclusion, Rich text for wash care, and Single line text for other simple values. A false
blouse-piece value displays **No**. Missing fields produce no row. The existing
`custom.product_details` rich-text value is displayed only if no supported structured
specifications are populated; it is not appended to structured fields, avoiding duplicate
specifications. Migrate any essential notes before switching a product to structured data.

Author SKU in **Products → product → variant → Inventory → SKU** (the exact editor grouping
may vary). It remains Shopify's native SKU, not a custom metafield. SKU updates with variant
selection and is hidden when blank. If no details or SKU exist, the accordion is hidden.
Manufacturer/business details, Description and policy sources remain unchanged.

### Shared note after SKU

In **Online Store → Themes → Customize/Edit theme → Theme settings → Product details**,
fill in **Default product note** and save. This global rich-text setting appears as
**Note:** after SKU (or after the specifications when SKU is blank) in the Product Details
accordion. It applies across product templates using the Product information block and
in their quick views. Leave it empty to hide it. No per-product entry or metafield is needed.

### Featured collection View all

Featured collection VIEW ALL links use a consistent compact outlined design across
phone, tablet and desktop, matching Suta: charcoal text, a thin grey border, square
corners and a transparent background. This scoped design overrides the saved
**View all style** variants. **Show view all** and collection destinations still
behave as before; the link appears only when more products are available.

### Featured collection image badges

The top-left badge on a Featured collection card is chosen from the product's collections,
independently of the collection displayed by that section. In **Settings → Metafields and
metaobjects → Collections**, create and pin these definitions (already created on
`tasaa-dev.myshopify.com` on 2026-10-26):

| Name | Namespace and key | Type |
| --- | --- | --- |
| Show as product badge | `custom.show_as_product_badge` | True or false |
| Product badge priority | `custom.product_badge_priority` | Integer, minimum 1, maximum 9999 |

Open **Products → Collections → a collection → Metafields**. Set **Show as product badge**
to True and enter a priority to allow its title to appear as a badge. False or an unset
visibility field excludes the collection. Lower priority numbers win; an unset priority
ranks after all numbered priorities. Equal priorities are resolved alphabetically by
collection handle. If no enabled collection belongs to the product, no badge is rendered.
Only collections available to the Online Store sales channel participate.

Initial Tasaa setup: **New Arrivals** is enabled at priority **1**, **BESTSELLER** at
priority **2**. All other collections are excluded while their visibility field is unset.

The Featured collection section's **Show collection badges on images** setting is the
master switch. Existing saved settings retain their value. Featured collection cards omit
the sale/percentage-off badge; sale and compare-at prices, product type labels, ratings
and sold-out badges remain visible. Collection listings use the discount-first rule below.
This collection-based selection replaces the old product `custom.collection_label` override and section-title fallback.
Uploading a theme to another store does not create the metafield definitions there.

### Product listing image badges

Collection Product listing cards show one upper-left badge, in this order:

1. **Percentage discount** (`% OFF`) when Compare-at price exceeds Price, rounded to a whole percentage, regardless of collection membership.
2. Otherwise, the winning enabled collection title from **Show as product badge** and **Product badge priority**, using the same rules above (currently New Arrivals priority 1, BESTSELLER priority 2).
3. No upper-left badge when neither applies.

Discount badges are red; collection badges are charcoal. The separate **Sold out** badge remains, including on discounted sold-out items. Sale and compare-at prices remain unchanged. The Featured collection badge switch controls only Featured collections; listing badges automatically use the collection fields. Filtering, sorting and loading more products use the same badge rules.

### Product title badges

The title automatically displays Product Type followed by Fabric. Set Type in the product's **Product organization** area. Fabric reads **Category metafields → Fabric** (`shopify.fabric`) first, falling back to `custom.fabric`. Supported fabric values are text, text lists, and category/metaobject references with a label or name. Only the first list entry is displayed; comma-separated text also uses its first entry. Missing values are hidden. These are display badges, not Shopify product Tags. Product Type uses warm terracotta; Fabric uses Suta's pale green styling.

### Similar Products accordion and Related Products carousel

- In the theme editor, select **Products → Default product → Product information → Product information** (the block). Enable **Show Similar Products**, edit its heading, select **Default similar products**, and choose whether it opens by default. The row appears before Product Details and hides when its list is empty.
- For a separate selection per product: **Settings → Custom data → Products → Add definition**. Name it **Similar products**, use namespace/key **custom.similar_products**, and select **Product reference → List of products**. In each product's metafields, select and order the products to show. This overrides the shared fallback. The current product is excluded.
- **Related Products** remains Shopify's automatic related recommendations. In the theme editor's **Related products** section, author the heading, number of products (up to 10), desktop/mobile columns, font and card settings. Its arrows appear only when products overflow the visible row. Shopify Search & Discovery can be used to curate the related recommendations independently of the Similar Products list.

### Short product description

Create **Settings → Custom data → Products → Add definition → Short description**, namespace/key **custom.short_description**, type **Single line text**. Author the value in each product's metafields. The theme displays it below the Product Type/Fabric badges and above the price, in Suta-style 14px medium Jost. Empty or whitespace-only values render nothing. The existing product Description editor continues to supply the full Description accordion independently.

### Mobile bottom menu

Open **Online Store → Themes → Edit theme → Footer → Mobile bottom menu**. The menu appears below 990px and includes Shopify Login/Account, Categories, live Search, New Arrivals and a direct Cart link.

- **Icons:** upload replacement images under Icons; leave blank for the lightweight inline SVG defaults (no icon library or app). Use a white Search icon for the dark circle. Built-in SVG paths are in `snippets/mobile-navigation-icon.liquid`.
- **Categories:** add/reorder Category tile blocks, select a collection or custom link, and upload its image. Uploaded images override the sample image URL. Clear the sample URL to use the collection image automatically. Disable **Image already contains its label** when your image has no embedded text. The initial Suta images are replaceable samples.
- **New Arrivals:** choose the destination collection. Manage its products under **Products → Collections → New Arrivals**; the starter collection contains three existing products sorted newest first.
- **Colors:** edit Background, Text and icons, and Category header divider.
- **Floating product button:** enable/disable the circular Add to Cart and choose Icon and text or Text only. It appears on mobile/tablet product pages, submits the existing product form, and follows variant availability and loading states.

Search uses Shopify predictive search, with normal search submission as a fallback. Dialogs support Escape, focus restoration and reduced motion. The desktop navigation remains unchanged.

### Shared product benefits

Open **Online Store → Themes → Edit theme → Theme settings (gear icon) → Product benefits**. These settings apply to every product page using the main product section, including alternate product templates. They are not product metafields.

- Toggle the entire row, or each of its four benefits.
- Edit each label, choose one of the four built-in icons, or upload a custom icon image.
- Optionally add a destination link. Leave it blank to display informational text without a link.
- For WhatsApp Assistance, enter `https://wa.me/` followed by the business number including country code, without spaces or `+`. No phone number is configured by default.

The row appears immediately below the purchase buttons. It uses one compact row of four benefits on all devices, with icons above the labels on mobile/tablet. The payment shield uses the SVG from the merchant-supplied Garden Vareli product reference; the remaining icons are inline SVGs. No app, JavaScript library, or third-party icon request is needed.

### Product add-on checkboxes (Saree / Blouse)

Manage these in **Shopify Admin → Content → Metaobjects**, not Theme settings.

**Product addon** entries describe one reusable option:

| Field | What to enter |
| --- | --- |
| Label | Customer-facing name, unique within a group (for example Gift wrap). |
| Kind | `free` for an optional free service, `paid` for a priced variant, or `included` for a service already provided. |
| Description | Not displayed on the storefront. Only the option label and price (or included-service notice) are shown. |
| Variant | Required for `paid`: select the exact purchasable product variant. Leave blank for the other kinds. Price comes from this variant. |

For a paid service, first create a Shopify product such as Gift wrap, set its actual price and shipping/inventory settings, and make it available to the Online Store. Then choose its variant in the add-on entry. An accessory needing a size or colour needs an entry pointing to that exact variant. Subscription-only variants are not supported. Do not use a parent product's own variant as its add-on.

Gift Wrap (₹50) and Gift Box (₹200) are configured in tasaa-dev and linked to both groups. Change their prices in **Products → Gift Wrap / Gift Box → Price**; the checkbox reads the variant price automatically. Both use Type `Add-on` and status **Unlisted**, so they remain purchasable through the add-on while staying out of normal search and collection listings. Inventory is not tracked; enable tracking and enter actual stock if packaging supply is limited. Gift Wrap is a non-shipping service; Gift Box is a physical product.

An `included` entry renders a pale green checked notice, for example **This saree comes with FREE Fall and Edging**, instead of an optional checkbox. Enter only `Fall and Edging` as its Label; the theme supplies the sentence and uses “blouse” for Blouse products. No extra price or variant is needed. Put included entries first in the group's Options list. Use a separate group assigned through the product's Addon group metafield when the service applies to only some products. Only keep the entry Active for products where the service is actually included.

**Product addon group** entries contain a Name and ordered list of Options. The Heading field is not displayed on the storefront. Up to 20 options are displayed. Publish both the group and its referenced options as **Active** when ready. Draft entries do not render.

- **Saree**: edit the group whose handle is `saree`. Products with Type `Saree`, `Sarees`, or `Saree with blouse piece` use it automatically (case-insensitive).
- **Blouse**: edit the group whose handle is `blouse`. Products with Type `Blouse` or `Blouses` use it automatically.
- Keep those two handles unchanged. The Type field is under **Products → your product → Product organization**; it is not Shopify's Category field.
- For an exception, create another group and select it under **Products → your product → Metafields → Addon group** (`custom.addon_group`). For a matching petticoat, point an option to the correct colour/size variant and use a group containing that entry.
- To suppress every add-on on one product, set **Disable addons** (`custom.disable_addons`) to true. Clearing the group override returns to the product-type default.
- To reorder checkboxes, reorder Options in the group. Editing a shared option updates every group using it.

All optional checkboxes start unchecked. Free and included services are recorded as product line-item properties. Paid options are actual nested cart items, added in the same request as the parent, with one add-on per unit of the parent at the time of adding. Shopify removes nested add-ons when the parent is removed. Cart quantity edits remain Shopify's standard behaviour; child quantities can be edited independently. Unavailable or unconfigured paid options are disabled.

Normal Add to cart and the floating button submit the same form. When options are present, Buy it now uses the normal checkout after adding the main item plus selected options; the existing cart is retained. Products without options retain Shopify's accelerated checkout. Gift cards are excluded. Service descriptions do not automatically enforce shipping delays, return restrictions or COD eligibility—only author services supported by your fulfilment and payment setup.

Definitions used by the theme (for another store):

- `product_addon`: required single-line `label`; required choice-list single-line `kind` (`free`, `paid`, `included`); optional multi-line `description`; optional product-variant reference `variant`.
- `product_addon_group`: required single-line `name`; optional single-line `heading`; list of `product_addon` references `options`.
- Product metafields: `custom.addon_group` (single reference to `product_addon_group`), `custom.disable_addons` (true/false). Assign to all products, without category constraints.
- Enable storefront access and active/draft status for both metaobject definitions.

### Collection filters and sorting

The default collection uses **Sidebar with mobile panels** under **Theme editor → Collections → Default collection → Product grid → Filter layout**. Desktop shows collapsible filters and a sort dropdown; mobile/tablet (below 990px) uses a right-hand filter drawer and a bottom sort sheet. Filters update Shopify results without a full reload, preserve sorting and support Clear all, removable selections, price ranges and browser Back/Forward. Existing horizontal, vertical and drawer layouts remain selectable.

Available filter groups and values come from Shopify **Search & Discovery → Filters**. Enable Product type, Fabric, Colour or other supported metafields there; the theme does not invent filter values. Sort choices use Shopify's collection sorting, plus the theme's **Discount: High to Low** option described below.

**Automatic product loading:** Enabled by default in **Collections → Default collection → Product grid → Automatically load more products**. The next batch loads when the customer approaches the bottom of the grid, on desktop, tablet and mobile. **Products per page** controls batch size. Filtering or sorting starts a fresh result set; subsequent batches retain those selections. The loader stops at the final page, announces loading/results to screen readers and offers a manual retry on failure. The Load more link also works without JavaScript. Disable the setting to restore numbered pagination. No app is required.

### Collection card appearance and View

Product listing cards share Featured Collection’s compact appearance: uppercase 10.8px titles, outlined 12px type tags, 10.8px current prices and 4px title/tag/price gaps. Featured Collection and Product listing discounted prices show the current price first in black, followed by the original price in red with a strike-through. Set **Product grid → Product card font** (default Jost) for titles, tags, prices and the View control; the existing setting ID is preserved.

**Quick add → Standard** now shows the same eye-icon **view** button and compact popup as Featured Collection, including single-variant and sold-out products. The saved default collection template and new section defaults enable this mode. None hides the control; Bulk retains its bulk-order behavior. Photos and titles still link to product pages.

**Show second image on hover** is enabled in the saved default template and new section defaults. In both Listing and Featured Collection, products with a second image switch only while the pointer is over the photo area on desktop/fine-pointer devices (hovering the title, tag or price does not swap images); touch devices keep the main photo and show the View control without a hover step. Products with one image keep it. The popup reuses the existing compact purchase/gallery/Product Details behavior, with a mobile sheet and desktop dialog. Listing image proportions, grid choices and discount-first badges are retained.

### Collection grid views
The Sidebar with mobile panels layout includes 2-, 3- and 4-column buttons at the left of the desktop toolbar. Each page starts at 3 columns. Changing the view is instant and stays selected while filtering, sorting and automatically loading more products. Below 990px, the toolbar has single/two-product view icons on the left, Sort By in the middle and Filter on the right. The product total is hidden there. Mobile starts with the section’s **Mobile columns** setting and retains a chosen view through filtering, sorting and product loading; desktop and mobile choices are independent. Sort and Filter have lightweight inline icons. A red badge on Filter counts selected values plus one for an active price range (either or both bounds); sorting is excluded, and zero is hidden. The count updates after results load, including Clear all, individual removal and browser Back/Forward. No app or external icon library is required.

### Discount sorting
Collection Sort by offers Featured, Price: Low to High, Price: High to Low, Discount: High to Low, Date old to new, and Date new to old. Discount sorting computes percentage savings from Price and Compare-at price across every page of the filtered collection. It loads matching card markup before sorting, then reveals cards in normal scroll batches. This option can take longer on large collections; normal Shopify sorts retain server pagination. The discount_sort=1 URL flag preserves the custom order across refreshes and browser navigation. No app is required.
