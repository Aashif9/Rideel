---
name: Rideel Core
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#002416'
  on-tertiary: '#ffffff'
  tertiary-container: '#003c27'
  on-tertiary-container: '#00b27b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style

The design system is engineered to establish immediate trust and reliability for a high-stakes peer-to-peer delivery marketplace. It targets a professional yet tech-savvy Indian demographic, balancing premium international aesthetics with local functional requirements.

The visual style is **Corporate Modern with a Minimalist lean**. It prioritizes clarity through high-quality typography, generous whitespace, and a strict adherence to a "Less is More" philosophy. The UI avoids clutter to reduce cognitive load during time-sensitive parcel bookings. Interactive elements utilize subtle depth to indicate affordance without breaking the clean, flat surfaces that define the modern startup aesthetic.

## Colors

The palette is anchored by a deep, authoritative Blue to instill a sense of institutional security. 

- **Primary (#003366):** Used for key actions, brand moments, and primary navigation states.
- **Secondary/Surface (#F8FAFC):** The foundational canvas color, providing a cool-toned, "breathable" background that distinguishes content cards.
- **Functional Colors:** Green is reserved strictly for "Verified" statuses and successful delivery milestones. Orange and Red are utilized for urgency (e.g., "Courier Delayed") and critical errors (e.g., "Payment Failed").
- **Neutral Scale:** Uses a Slate-based palette to maintain a premium, modern feel, avoiding the "muddy" look of pure grays.

## Typography

This design system utilizes **Public Sans** for its exceptional legibility and institutional character. It feels neutral and authoritative, which is critical for a service involving the transport of personal goods.

- **Headlines:** Use tighter letter-spacing and bold weights to create a strong visual hierarchy.
- **Pricing:** Always pair the "price-display" style with the ₹ symbol. Use a slightly heavier weight for the currency symbol to ensure it is easily scannable.
- **Labels:** Small, uppercase labels are used for metadata like "CARRIER ID" or "VEHICLE TYPE" to provide structure without competing with primary content.

## Layout & Spacing

The system follows a **Fluid Grid** model with a base-8 rhythm. 

- **Mobile:** A single-column layout with 20px side margins. Cards should span the full width of the safe area.
- **Desktop:** A 12-column grid with a maximum content width of 1200px. 
- **Rhythm:** Use "stack-md" (24px) for the vertical gap between distinct sections (e.g., between the map and the delivery details card). Use "stack-sm" (12px) for internal card padding and related elements.
- **Map UI:** Map elements should be full-bleed where possible, with floating interface components (floating action buttons and status cards) positioned at least 16px from the screen edge.

## Elevation & Depth

Hierarchy is established using a **Tonal Layering** approach combined with **Ambient Shadows**.

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px border of #E2E8F0.
- **Level 2 (Active/Floating):** Pure White with a "Soft Ambient Shadow" (0px 4px 20px rgba(0, 51, 102, 0.08)). The shadow uses a tiny hint of the primary blue color to maintain brand harmony.
- **Interactions:** Upon press, elements should visually "sink" by reducing the shadow spread and slightly darkening the surface color.

## Shapes

The shape language is defined by **Rounded (0.5rem / 8px)** base corners for standard elements, but moves to **rounded-xl (1.5rem / 24px)** for major container cards and bottom sheets to evoke a friendly, modern mobile-first feel.

- **Verification Badges:** Should be pill-shaped to distinguish them from functional buttons.
- **Input Fields:** Use 8px (rounded-md) to maintain a professional, structured look.
- **Interactive Buttons:** Use 12px (rounded-lg) for a more tactile, "premium" touch target.

## Components

### Buttons & Inputs
- **Primary Button:** Deep Blue (#003366) background, white text, 12px border radius.
- **OTP Input:** Four to six distinct 48x56px boxes with high-contrast borders (#CBD5E1) that turn Primary Blue on focus.
- **Toggle Switches:** Used for insurance opt-ins. Use the Primary Blue for the "on" state and a soft gray for "off."

### Cards & Status
- **Delivery Cards:** 24px corner radius. Include a vertical progress timeline on the left side with a 2px Primary Blue stroke for completed stages.
- **Verification Badges:** Small pill containers with a Primary Blue (or Green for verified) background and a white "check" icon.
- **Wallet Card:** Uses a subtle gradient of Primary Blue to a slightly lighter tint to differentiate the financial "Safe" area of the app.

### Navigation
- **Bottom Bar:** Fixed height (80px), white background, with a subtle top border. Icons use a 1.5pt stroke weight. The active state is indicated by a Primary Blue icon and a small 4px dot indicator below the icon.

### Map UI
- **Tracking Markers:** Use a white circular base with a Primary Blue center dot for the courier location. Use standard pins for "Pickup" and "Drop-off" with clear "A" and "B" labeling.