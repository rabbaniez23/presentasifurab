---
name: Furap
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is anchored in a sophisticated and airy aesthetic, blending the clarity of high-end editorial design with the depth of modern Glassmorphism. It targets a discerning audience that values minimalism, transparency, and a high degree of digital craftsmanship. 

The visual narrative is defined by "The Glass Layer"—a philosophy where interface elements float above a pure, infinite white canvas. By utilizing frosted glass effects, soft ambient shadows, and hairline borders, the UI achieves a sense of lightness and architectural precision. The emotional response should be one of calm, confidence, and effortless intuition.

## Colors
The palette is intentionally monochromatic and high-clarity to emphasize form and texture. By utilizing white for both secondary and tertiary roles, the system achieves maximum luminousity.

- **Pure White (#FFFFFF):** Serves as the foundational background and primary surface color, providing an expansive and clean environment.
- **Elegant Dark (#1A1A1A):** Used for primary typography, icons, and high-emphasis elements to provide a grounded contrast against the white field.
- **Glass Accents:** A system of semi-transparent whites and subtle greys used for surfaces. 
- **Functional Neutrals:** Mid-tone greys (#717171) are reserved for secondary information and metadata, ensuring a clear information hierarchy without cluttering the visual field.

## Typography
This design system utilizes **Manrope** for its balanced, modern, and highly legible geometric qualities. The typographic scale prioritizes generous line heights and subtle negative letter-spacing for large displays to maintain a premium feel.

- **Headlines:** Set in bold weights with tight tracking to create a strong visual anchor.
- **Body Text:** Optimized for readability with a slightly larger base size (16px/18px) and open leading.
- **Labels:** Small caps and increased letter-spacing are used for utility text and categories to differentiate them from narrative content.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to preserve the elegance of whitespace, while transitioning to a **Fluid Grid** on mobile devices. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered with wide margins to create a "gallery" feel.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.
- **Spacing Rhythm:** Based on an 8px base unit. Component internal padding should favor larger increments (e.g., 24px, 32px) to reinforce the sense of luxury and breathing room.

## Elevation & Depth
Depth is achieved through the physical metaphor of stacked glass.
- **Layer 0 (Background):** Pure #FFFFFF.
- **Layer 1 (Cards/Panels):** `backdrop-filter: blur(20px)`, a 40% white fill, and a 1px solid white stroke at 60% opacity. 
- **Shadows:** Instead of heavy blacks, use "Ambient Shadows"—ultra-soft, large-radius blurs with very low opacity (e.g., `rgba(0,0,0,0.04)`) to lift glass panels off the white background without creating "dirt."
- **Interaction:** Hover states should increase the backdrop blur intensity or slightly brighten the white stroke to simulate light catching the edge of the glass.

## Shapes
The shape language is "Rounded," striking a balance between approachable softness and professional structure. 
- **Standard Radius:** 0.5rem (8px) for small components like inputs and buttons.
- **Container Radius:** 1rem (16px) for cards and modals to emphasize their role as distinct surfaces.
- **Interactive Elements:** Maintain consistent corner radii across all states to ensure the "glass sheet" metaphor remains intact.

## Components
- **Glass Cards:** The signature component. Feature a 1px internal white border, 20px background blur, and soft shadow. Content inside should have generous padding (min 24px).
- **Navigation Bar:** Fixed at the top, utilizing a high-intensity blur (30px) to allow background colors to bleed through softly while maintaining text legibility.
- **Buttons:** 
  - *Primary:* Solid Elegant Dark (#1A1A1A) with white text for high contrast.
  - *Secondary:* Glass style with a thin dark outline or semi-transparent fill.
- **Input Fields:** Minimalist design with a bottom-only border or a very subtle glass fill. Focus states are indicated by a slight increase in border opacity.
- **List Items:** Separated by hairline dividers (1px, #E0E0E0) or housed within individual glass cells for a more modular appearance.
- **Chips:** Small, pill-shaped glass elements used for categorization, featuring `label-sm` typography.