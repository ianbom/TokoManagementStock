## Overview

Ketintang Mart is a friendly mobile store-management dashboard designed for small retail businesses. The interface combines a dark navy photographic hero, warm yellow financial highlights, a soft cream page background, and highly rounded white cards. The product feels approachable and operational rather than corporate: key actions are presented as large touch-friendly shortcuts, financial information is summarized in one dominant card, and nearby suppliers are surfaced as actionable recommendations.

The reference surface is a narrow mobile dashboard approximately 393px wide. Its hierarchy is intentionally simple: identity and greeting at the top, monthly financial status, four primary operational actions, a best-seller shortcut, nearby suppliers, and a persistent bottom navigation. The design should remain visually calm even though it contains several high-priority actions.

**Key Characteristics:**
- Soft cream canvas with white card surfaces.
- Deep navy hero using a dimmed store photograph.
- Warm yellow-to-orange financial card as the main visual focal point.
- Poppins-style rounded sans-serif typography.
- Large rounded rectangles and circular icon containers.
- Strong touch-first sizing, with most interactive controls at least 48px high.
- Bright semantic shortcut colors: teal, red, blue, and purple.
- Persistent mobile bottom navigation with a yellow active state.
- Minimal borders; hierarchy comes from spacing, surface color, and subtle shadows.

## Colors

### Brand & Accent
- **Primary Yellow** (`{colors.primary}` — `#FDB900`): Main brand accent, active navigation background, icon outlines, star tile, and prominent highlights.
- **Primary Yellow Strong** (`{colors.primary-strong}` — `#FFB300`): Stronger yellow used in active controls and concentrated highlight areas.
- **Primary Orange** (`{colors.primary-orange}` — `#FFC333`): Secondary warm tone used in the profit-card gradient and inset financial panels.
- **Navy** (`{colors.navy}` — `#0E223E`): Primary dark brand tone used for the hero overlay, headline emphasis, profit amount, and the period selector.
- **Navy Soft** (`{colors.navy-soft}` — `#22354F`): Supporting blue-gray tone in the hero image overlay and dark secondary surfaces.

### Surface
- **Canvas** (`{colors.canvas}` — `#FEF9E8`): Main page background. A warm cream, not pure white.
- **Surface** (`{colors.surface}` — `#FFFFFF`): Default card and bottom-navigation background.
- **Surface Warm** (`{colors.surface-warm}` — `#FFF5D8`): Optional warm inset surface for highlighted empty states or low-emphasis sections.
- **Surface Yellow Soft** (`{colors.surface-yellow-soft}` — `#FFC833`): Inset financial summary panels inside the profit card.
- **Overlay Navy** (`{colors.overlay-navy}` — `rgba(8, 31, 58, 0.84)`): Overlay applied over the store photograph in the hero.
- **Divider** (`{colors.divider}` — `#ECECEC`): Thin row separators in supplier lists.
- **Border Soft** (`{colors.border-soft}` — `#F0F0F0`): Optional card outline where separation from the canvas is insufficient.

### Text
- **Text Primary** (`{colors.text-primary}` — `#252525`): Main body, card titles, supplier names, and navigation labels.
- **Text On Dark** (`{colors.text-on-dark}` — `#FFFFFF`): Hero text and text on dark icon surfaces.
- **Text Navy** (`{colors.text-navy}` — `#0E223E`): Profit amount and strong financial emphasis.
- **Text Muted** (`{colors.text-muted}` — `#858585`): Addresses, descriptions, helper text, and inactive navigation labels.
- **Text Muted Soft** (`{colors.text-muted-soft}` — `#A8A8A8`): Optional tertiary metadata.
- **Text On Yellow** (`{colors.text-on-yellow}` — `#121212`): Labels placed on yellow active surfaces.

### Semantic & Feature Colors
- **Income Teal** (`{colors.income}` — `#06B699`): Scan-in shortcut icon and positive operational state.
- **Expense Red** (`{colors.expense}` — `#E30805`): Scan-out shortcut icon and expense value.
- **Supplier Blue** (`{colors.supplier}` — `#043BC4`): Supplier shortcut icon.
- **Inventory Purple** (`{colors.inventory}` — `#98008F`): Inventory shortcut icon.
- **Success** (`{colors.success}` — `#1E9B65`): Successful stock or transaction status.
- **Warning** (`{colors.warning}` — `#F6A900`): Low-stock or attention-required state.
- **Danger** (`{colors.danger}` — `#E30805`): Destructive or critical state.
- **Notification Dot** (`{colors.notification}` — `#FF1A1A`): Unread notification indicator.

## Typography

### Font Family
The interface uses one rounded geometric sans-serif family throughout.

1. **Poppins** — Recommended primary family for headings, labels, amounts, buttons, and body text.
2. **Fallback stack** — `Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

Poppins is selected because its soft geometry and clear numerals closely match the reference. The hierarchy relies on weight and size rather than mixing multiple font families.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.hero-title}` | 26px | 700 | 1.2 | -0.4px | “Halo, Ketintang Mart 👋” |
| `{typography.profile-name}` | 19px | 700 | 1.25 | -0.2px | User name in hero |
| `{typography.section-title}` | 18px | 600 | 1.35 | -0.2px | “Rekomendasi Supplier Terdekat” |
| `{typography.profit-value}` | 28px | 700 | 1.15 | -0.6px | Main profit amount |
| `{typography.card-title}` | 16px | 500 | 1.3 | -0.1px | Shortcut labels and supplier names |
| `{typography.body-md}` | 15px | 400 | 1.45 | 0 | Hero subtitle and regular body |
| `{typography.body-sm}` | 13px | 400 | 1.45 | 0 | Address and supporting descriptions |
| `{typography.label-md}` | 14px | 500 | 1.3 | 0 | “LABA”, financial labels |
| `{typography.amount-sm}` | 15px | 700 | 1.25 | -0.2px | Income and expense values |
| `{typography.action-link}` | 12px | 400 | 1.4 | 0 | “Cek Barang Tersedia” |
| `{typography.nav-label}` | 10px | 400 | 1.2 | 0 | Bottom navigation labels |
| `{typography.nav-label-active}` | 10px | 600 | 1.2 | 0 | Active bottom navigation label |
| `{typography.period-pill}` | 12px | 500 | 1.0 | 0 | “Bulan Ini” |

### Principles
- Use weight 700 only for major figures, the greeting, and identity.
- Use weight 600 for section headings and active emphasis.
- Use weight 500 for card titles and operational labels.
- Keep descriptions and metadata at weight 400.
- Financial values use tabular numerals when supported: `font-variant-numeric: tabular-nums`.
- Do not uppercase all labels globally. Only short structural labels such as “LABA” may use uppercase.
- Avoid tight line heights in multi-line shortcut titles. “Scan Barang Masuk” should remain comfortable at `1.3`.

### Font Substitution
If Poppins is unavailable, use **Inter** with slightly softer spacing:
- Headings: `Inter`, weight 700, letter-spacing `-0.02em`.
- Card labels: `Inter`, weight 500.
- Body: `Inter`, weight 400.

## Layout

### Canvas & Safe Area
- **Reference width:** 393px.
- **Minimum supported mobile width:** 320px.
- **Primary design width:** 390–430px.
- **Page background:** `{colors.canvas}`.
- Account for device safe-area insets at the top and bottom.
- The bottom navigation may be fixed; content must include enough bottom padding to prevent overlap.

### Spacing System
- **Base unit:** 4px.
- **Tokens:**  
  `{spacing.xxs}` 4px ·  
  `{spacing.xs}` 8px ·  
  `{spacing.sm}` 12px ·  
  `{spacing.md}` 16px ·  
  `{spacing.lg}` 20px ·  
  `{spacing.xl}` 24px ·  
  `{spacing.xxl}` 32px ·  
  `{spacing.section}` 40px.

### Horizontal Rhythm
- **Page gutter:** `{spacing.lg}` (20px).
- **Card-to-card gap:** `{spacing.lg}` (20px) for the 2-column shortcut grid.
- **Vertical card gap:** `{spacing.lg}` (20px).
- **Section gap:** 32–40px depending on visual density.
- **Supplier list internal padding:** 16px.
- **Bottom navigation side padding:** 16px.

### Vertical Structure
1. `{component.hero-header}` — approximately 294px tall.
2. `{component.profit-card}` — overlaps or visually follows the hero with a 20px side gutter.
3. `{component.quick-action-grid}` — two columns, two rows.
4. `{component.best-seller-card}`.
5. `{component.supplier-recommendation-section}`.
6. Bottom content spacer.
7. `{component.bottom-navigation}` — fixed or sticky at viewport bottom.

### Grid
- Use a 2-column grid for primary shortcut cards.
- Columns are equal width: `minmax(0, 1fr)`.
- Gap: 20px.
- Supplier recommendations stay in one vertical list on mobile.
- The profit summary uses a 2-column internal grid for income and expense.

### Alignment
- All primary content aligns to the 20px page gutter.
- Hero profile content aligns to the same 20px gutter.
- Main card titles align left.
- Supplier CTAs align to the right within each row.
- Icons and shortcut labels align to the top-left, not centered vertically.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Page canvas and hero image |
| Surface | White fill, no visible border | Standard content cards |
| Soft | `0 4px 14px rgba(14, 34, 62, 0.04)` | Shortcut cards and supplier container |
| Floating | `0 8px 24px rgba(14, 34, 62, 0.08)` | Bottom navigation and active navigation tile |
| Icon Glow | `0 4px 10px rgba(253, 185, 0, 0.24)` | Colored shortcut icon containers |
| Active Glow | `0 8px 18px rgba(253, 185, 0, 0.26)` | Active bottom-navigation item |

### Principles
- Shadows are soft, low-opacity, and warm-neutral.
- Do not use hard black shadows.
- The profit card gains depth primarily through its saturated gradient, not a heavy shadow.
- The hero gains depth from photography and a navy overlay.
- Keep white cards visually light; no thick outlines.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---:|---|
| `{rounded.sm}` | 8px | Small inner indicators |
| `{rounded.md}` | 12px | Period pill and small controls |
| `{rounded.lg}` | 16px | Standard cards and icon tiles |
| `{rounded.xl}` | 20px | Profit card, supplier container |
| `{rounded.hero}` | 0 0 36px 36px | Hero bottom corners |
| `{rounded.nav}` | 20px 20px 0 0 | Bottom navigation container |
| `{rounded.full}` | 9999px | Avatar, notification button, supplier thumbnails |

### Geometry Principles
- Use consistent 16–20px card corners.
- The hero is full-bleed at the top and rounded only on the two lower corners.
- Icon tiles are rounded squares, not circles.
- Supplier photos and profile avatar are circular.
- The active navigation item is a rounded square/vertical tile.
- Do not mix sharp rectangular cards with this system.

## Iconography & Imagery

### Icon Style
- Use rounded filled icons from a consistent library such as **Material Symbols Rounded**, **Phosphor Icons**, or **Lucide** with rounded stroke caps.
- Standard icon stroke: 2–2.5px.
- Navigation icons: 30–34px.
- Shortcut icons: 28–34px inside 58–60px colored tiles.
- Small chevrons: 16px.

### Hero Photography
- Use a real small-store or minimarket interior.
- Position products and shelves in the upper and right background so text remains readable.
- Apply `{colors.overlay-navy}` across the image.
- Avoid high-detail foreground objects behind the greeting.
- The image should remain recognizable but subordinate to the UI.

### Avatars & Thumbnails
- Profile avatar: simple friendly illustration, 48px circle.
- Supplier thumbnail: real storefront or warehouse photo, 54–58px circle.
- Use `object-fit: cover`.
- Do not apply heavy borders; an optional 1px white or cream ring is allowed.

## Components

### Hero Header

**`hero-header`** — Full-width top section containing background photography, identity, notification, and greeting.

- Height: approximately 294px at 393px viewport width.
- Background: store photograph with `{colors.overlay-navy}`.
- Radius: `{rounded.hero}`.
- Horizontal padding: 20px.
- Top padding: safe-area + 28px.
- Bottom padding: 92px to leave visual room for the greeting.
- Text color: `{colors.text-on-dark}`.

**Composition:**
- Top row: `{component.profile-summary}` left, `{component.notification-button}` right.
- Greeting block below with approximately 42px top separation.
- Heading uses `{typography.hero-title}`.
- Subtitle uses `{typography.body-md}` at 90–95% white opacity.

### Profile Summary

**`profile-summary`** — User avatar and store identity.

- Display: horizontal flex.
- Gap: 16px.
- Avatar: 48 × 48px, `{rounded.full}`.
- Name: `{typography.profile-name}`, white.
- Store name: `{typography.body-sm}`, white at 90% opacity.
- Vertically center the two text lines against the avatar.

### Notification Button

**`notification-button`** — Circular translucent control in the hero.

- Size: 48 × 48px.
- Background: `rgba(255,255,255,0.22)`.
- Radius: `{rounded.full}`.
- Bell icon: 24px, white.
- Unread dot: 9px, `{colors.notification}`, positioned at top-right of the bell.
- Minimum touch target: 48px.

### Profit Card

**`profit-card`** — Dominant monthly financial summary.

- Margin-top: -56px when overlapping the hero; otherwise place directly after the hero with a 20px gap.
- Width: `calc(100% - 40px)`.
- Background: `linear-gradient(135deg, {colors.primary} 0%, {colors.primary-orange} 100%)`.
- Radius: `{rounded.xl}`.
- Padding: 16px.
- Text color: `{colors.text-navy}`.
- Optional shadow: `0 8px 20px rgba(255, 179, 0, 0.10)`.

**Header row:**
- Label “LABA” at left using `{typography.label-md}`, white.
- `{component.period-pill}` at right.

**Main amount:**
- “Rp 650.000,00” using `{typography.profit-value}`.
- Margin-top: 12px.
- Preserve Indonesian currency punctuation.

**Internal summaries:**
- Two equal columns with 10px gap.
- Each summary uses `{component.financial-summary-tile}`.

### Period Pill

**`period-pill`** — Current financial period selector.

- Height: 28px.
- Padding: 0 12px.
- Background: `{colors.navy}`.
- Text: `{colors.primary}`.
- Radius: `{rounded.md}`.
- Type: `{typography.period-pill}`.
- No shadow.

### Financial Summary Tile

**`financial-summary-tile`** — Income or expense inset panel.

- Background: `rgba(255, 210, 83, 0.65)`.
- Radius: `{rounded.md}`.
- Padding: 14px.
- Min-height: 75px.
- Label row includes a 16px directional icon.
- Label: white at 90% opacity, `{typography.body-sm}`.
- Value: `{typography.amount-sm}`, margin-top 8px.
- Income value uses `{colors.text-primary}`.
- Expense value uses `{colors.expense}`.

### Quick Action Grid

**`quick-action-grid`** — Four primary operational shortcuts.

- Display: grid.
- Columns: repeat(2, minmax(0, 1fr)).
- Gap: 20px.
- Margin-top: 40px.
- Each item is `{component.quick-action-card}`.

### Quick Action Card

**`quick-action-card`** — Large touch card with colored icon and label.

- Background: `{colors.surface}`.
- Radius: `{rounded.lg}`.
- Min-height: 140px.
- Padding: 16px.
- Shadow: `{elevation.soft}`.
- Layout: vertical.
- Align items: flex-start.
- Icon margin-bottom: 14px.
- Label width: 100%.
- Minimum tap target covers the entire card.

**Variants:**
- `scan-in`: icon background `{colors.income}`.
- `scan-out`: icon background `{colors.expense}`.
- `supplier`: icon background `{colors.supplier}`.
- `inventory`: icon background `{colors.inventory}`.

### Shortcut Icon Tile

**`shortcut-icon-tile`** — Colored rounded-square icon container.

- Size: 58 × 58px.
- Radius: `{rounded.lg}`.
- Border: 4px solid `{colors.primary}`.
- Shadow: `{elevation.icon-glow}`.
- Icon color: white.
- Icon size: 30px.

### Best Seller Card

**`best-seller-card`** — Horizontal shortcut to monthly best-selling products.

- Background: `{colors.surface}`.
- Radius: `{rounded.lg}`.
- Padding: 20px 16px.
- Min-height: 104px.
- Display: flex, align-items center.
- Gap: 14px.
- Margin-top: 20px.
- Entire card is tappable.

**Icon:**
- 58 × 58px gold tile.
- Background: `{colors.primary}`.
- Border: 4px solid a lighter yellow such as `#FFD451`.
- White star icon.

**Text:**
- Title: “Barang Terlaris”, `{typography.card-title}`.
- Description: “Lihat produk best-seller bulan ini”, `{typography.body-sm}`, `{colors.text-muted}`.

### Supplier Recommendation Section

**`supplier-recommendation-section`** — Nearby supplier discovery area.

- Margin-top: 40px.
- Section title: `{typography.section-title}`.
- Title margin-bottom: 12px.
- Contains `{component.supplier-list-card}`.

### Supplier List Card

**`supplier-list-card`** — Single white rounded container holding multiple suppliers.

- Background: `{colors.surface}`.
- Radius: `{rounded.xl}`.
- Overflow: hidden.
- Shadow: `{elevation.soft}`.
- No internal outer padding; each row controls its own spacing.

### Supplier Row

**`supplier-row`** — Individual supplier recommendation.

- Min-height: 105px.
- Padding: 16px.
- Display: grid.
- Grid columns: 58px 1fr.
- Column gap: 16px.
- Add 1px `{colors.divider}` bottom border except on the final row.
- Thumbnail: 54–58px circle aligned near the top.
- Main content: supplier name, address, and CTA.

**Text:**
- Supplier name: `{typography.card-title}`.
- Address: `{typography.body-sm}`, `{colors.text-muted}`, margin-top 4px.
- CTA: `{typography.action-link}`, `{colors.primary-strong}`, aligned right, margin-top 12px.
- Chevron icon follows the text with an 8px gap.

### Bottom Navigation

**`bottom-navigation`** — Persistent primary mobile navigation.

- Position: fixed at bottom, left 0, right 0.
- Height: approximately 128px including safe-area padding.
- Background: `{colors.surface}`.
- Radius: `{rounded.nav}`.
- Shadow: `{elevation.floating}`.
- Padding: 18px 16px calc(12px + env(safe-area-inset-bottom)).
- Z-index: 50.
- Grid: 4 equal columns.

**Items:**
1. Dashboard — active.
2. Riwayat.
3. Obrolan.
4. Pengaturan.

### Bottom Navigation Item

**`bottom-nav-item`** — Icon and label stacked vertically.

- Min-width: 72px.
- Height: 80px.
- Display: flex column.
- Align and justify center.
- Gap: 8px.
- Icon size: 31px.
- Inactive color: `{colors.text-muted}`.
- Label: `{typography.nav-label}`.

**Active variant:**
- Background: `{colors.primary}`.
- Radius: `{rounded.lg}`.
- Color: `{colors.text-on-yellow}`.
- Shadow: `{elevation.active-glow}`.
- Label uses `{typography.nav-label-active}`.
- Keep at least 8px internal horizontal padding.

### Loading, Empty, and Error States

**`loading-card`**
- Preserve the same card dimensions.
- Use warm-neutral skeletons: `#F1EBD9`.
- Avoid animated gradients if reduced-motion is enabled.

**`empty-state`**
- White card with a small yellow illustration.
- Title uses `{typography.card-title}`.
- Description uses `{typography.body-sm}`.
- CTA uses a filled yellow button.

**`error-state`**
- Use `{colors.danger}` only for icon, concise message, and retry control.
- Do not turn the whole screen red.

## Buttons & Controls

### Primary Button

**`button-primary`** — Filled yellow CTA.

- Height: 48px.
- Padding: 0 20px.
- Background: `{colors.primary}`.
- Text: `{colors.text-on-yellow}`.
- Radius: `{rounded.md}`.
- Type: 14px, weight 600.
- Pressed state: `{colors.primary-strong}`.
- Disabled state: 45% opacity.

### Secondary Button

**`button-secondary`** — White or transparent secondary action.

- Height: 48px.
- Background: `{colors.surface}`.
- Border: 1px solid `{colors.border-soft}`.
- Text: `{colors.text-primary}`.
- Radius: `{rounded.md}`.

### Text Link

**`text-link`**
- Color: `{colors.primary-strong}`.
- No underline by default.
- Use a right chevron for navigational links.
- Minimum effective tap height: 44px through padding or parent row.

## Do's and Don'ts

### Do
- Keep `{colors.canvas}` visible between content sections.
- Use `{colors.primary}` for active navigation and important operational highlights.
- Keep the dark hero photograph readable with a strong navy overlay.
- Use white cards with 16–20px corners.
- Preserve the four shortcut feature colors consistently.
- Keep all key actions comfortably tappable.
- Use tabular numerals for financial values.
- Maintain Indonesian labels and currency formatting.
- Keep supplier CTAs aligned consistently on the right.
- Add bottom content padding equal to the fixed navigation height.

### Don't
- Don't replace the cream canvas with pure white.
- Don't use the yellow accent for every piece of text.
- Don't add heavy shadows, glassmorphism, or glossy 3D effects.
- Don't put text directly on a bright, undimmed store photograph.
- Don't center shortcut-card labels; keep them left-aligned.
- Don't reduce shortcut cards below comfortable touch size.
- Don't use sharp 0px card corners.
- Don't mix multiple unrelated icon styles.
- Don't allow the fixed navigation to cover supplier content.
- Don't introduce additional saturated feature colors without a semantic role.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Small Mobile | 320–359px | Reduce page gutter to 16px, shortcut gap to 12px, profit amount to 25px |
| Mobile | 360–479px | Reference layout; 2-column shortcuts, fixed bottom navigation |
| Large Mobile | 480–767px | Increase max content width to 440px and center it; preserve 2-column grid |
| Tablet | 768–1023px | Use a centered 2-column dashboard, convert bottom nav to compact side rail or top navigation |
| Desktop | ≥1024px | Use a persistent left sidebar, wider hero, multi-column content, supplier cards may become horizontal |

### Small-Mobile Adjustments
- Page gutter: 16px.
- Shortcut grid gap: 12px.
- Shortcut padding: 14px.
- Profit card internal gap: 8px.
- Supplier thumbnail: 50px.
- Keep all text readable; never scale below 10px for navigation labels.

### Tablet Transformation
- Max content width: 720px.
- Hero radius: 0 0 28px 28px.
- Profit card and quick actions may form a 2-column top layout.
- Supplier rows remain vertical unless each card has at least 300px width.
- Bottom navigation can become a top tab bar or left navigation rail.

### Desktop Transformation
- Left sidebar width: 240–280px.
- Main content max width: 1280px.
- Hero becomes a wide banner.
- Profit summary takes approximately 46% of the main row.
- Shortcut actions form a 2 × 2 grid beside the profit card.
- Supplier recommendations may render as three equal horizontal cards.
- Preserve the same colors, typography, radii, and icon variants.

### Touch Targets
- Notification button: minimum 48 × 48px.
- Quick-action card: full card is interactive.
- Bottom navigation item: minimum 64 × 64px.
- Text link effective target: minimum 44px high.
- Avoid interactive elements closer than 8px.

### Image Behavior
- Hero image uses `cover`.
- At narrow widths, anchor image position near `65% center` to keep shelves visible while preserving text contrast.
- Supplier photos remain square and crop to a circle.
- Do not stretch or letterbox imagery.

## Accessibility

- Maintain at least 4.5:1 contrast for body text.
- White hero text must remain readable over every image crop; strengthen the overlay when needed.
- Do not communicate income/expense state only through color; retain icons and text labels.
- Add visible focus rings using `{colors.navy}` on light surfaces and `{colors.primary}` on dark surfaces.
- Support text scaling up to 200% without clipping the profit amount or supplier rows.
- Icons require accessible labels.
- Respect `prefers-reduced-motion`.
- Bottom navigation must expose the active item with `aria-current="page"`.

## Motion

- Card press: scale to `0.98` over 120ms.
- Navigation active-state movement: 160–200ms ease-out.
- Supplier row press: subtle background shift to `{colors.surface-warm}`.
- Notification dot may use a single entrance pulse, not a continuous animation.
- Avoid parallax in the hero.
- Motion should confirm interaction rather than decorate the screen.

## Iteration Guide

1. Build `{component.hero-header}` and verify text readability against real store photographs.
2. Build `{component.profit-card}` using the exact financial hierarchy before adding secondary sections.
3. Implement one `{component.quick-action-card}` and create color variants from the same base component.
4. Keep all component colors referenced through `{colors.*}` tokens.
5. Keep spacing referenced through `{spacing.*}` tokens.
6. New cards default to `{rounded.lg}`; major container cards use `{rounded.xl}`.
7. Do not create unique radii for every component.
8. Validate the fixed `{component.bottom-navigation}` at 320px, 393px, and 430px widths.
9. Test long supplier names and addresses before finalizing row height.
10. When adapting to desktop, change layout—not the visual language.

## Known Gaps

- The exact original font is not embedded in the screenshot; Poppins is the closest practical recommendation.
- The precise hero source photograph and supplier thumbnail assets are not available in the reference.
- Hover states are not visible because the source is a mobile interface; only default, pressed, focus, disabled, loading, and active states are specified.
- The exact navigation behavior, notification drawer, supplier detail flow, and scanner flows are outside the visible reference.
- The screenshot does not show form controls, modal patterns, toast messages, or validation states.
- Desktop and tablet adaptations are inferred from the mobile hierarchy and should be validated through implementation prototypes.
- Color values are sampled and visually inferred from the supplied screenshot; minor calibration may be needed after comparing against original brand assets.
