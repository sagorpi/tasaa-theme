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

### Product title badges

The title automatically displays Product Type followed by Fabric. Set Type in the product's **Product organization** area. Fabric reads **Category metafields → Fabric** (`shopify.fabric`) first, falling back to `custom.fabric`. Supported fabric values are text, text lists, and category/metaobject references with a label or name. Only the first list entry is displayed; comma-separated text also uses its first entry. Missing values are hidden. These are display badges, not Shopify product Tags. Product Type uses warm terracotta; Fabric uses Suta's pale green styling.
