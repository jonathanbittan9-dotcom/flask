# CSS mastery — beginner to advanced

Same series structure as `js_mastery/`, but CSS is not executable code — it
only means something applied to HTML. So each file here is a **complete,
self-contained `.html` page**: open it directly in a browser (double-click
it, or right-click → Open With → your browser) and you see the lesson
rendered. The `<style>` block in each one is where the real content is —
read it like you'd read a commented `.py` file, then edit values and
refresh to see what changes.

## How to view these

No server needed — these are plain files:

```powershell
start 01_how_css_reaches_page.html
```

(or just double-click the file in Explorer). Edit the `<style>` block in
any text editor, save, and hit **Ctrl+Shift+R** in the browser tab to
force a reload — browsers cache CSS aggressively, and a plain refresh
sometimes shows you stale styles.

## The roadmap

**Beginner — how CSS works at all**
| # | File | Subject |
|---|------|---------|
| 01 | `01_how_css_reaches_page.html` | Inline/internal/external CSS, anatomy of a rule, linking from Flask |
| 02 | `02_selectors.html` | Type/class/id, combinators, attribute & pseudo-class selectors |
| 03 | `03_cascade_and_specificity.html` | Why a rule does or doesn't win — the #1 CSS frustration, solved |
| 04 | `04_box_model.html` | Content/padding/border/margin, `box-sizing`, margin collapse |
| 05 | `05_units.html` | `px` vs `rem` vs `em` vs `%` vs `vh`, `clamp()` |
| 06 | `06_color.html` | hex/rgb/hsl, contrast, `currentColor` |

**Intermediate — layout and text**
| # | File | Subject |
|---|------|---------|
| 07 | `07_typography.html` | Font stacks, type scale, line-height, measure |
| 08 | `08_display_and_flow.html` | block/inline/inline-block, normal flow, `display: none` |
| 09 | `09_flexbox.html` | One-dimensional layout — rows, columns, toolbars |
| 10 | `10_grid.html` | Two-dimensional layout — `fr`, `repeat()`, named areas |
| 11 | `11_positioning.html` | static/relative/absolute/fixed/sticky, `z-index` |

**Advanced — polish and scale**
| # | File | Subject |
|---|------|---------|
| 12 | `12_backgrounds_and_borders.html` | Gradients, `border-radius`, `box-shadow` |
| 13 | `13_transitions.html` | Animating state changes, cheap vs expensive properties |
| 14 | `14_animations.html` | `@keyframes`, loading states, `prefers-reduced-motion` |
| 15 | `15_responsive_design.html` | Mobile-first `@media`, fluid layouts without breakpoints |
| 16 | `16_custom_properties.html` | Real CSS variables, theming, light/dark mode |
| 17 | `17_modern_css.html` | `:has()`, container queries, nesting, `@layer` |
| 18 | `18_organizing_a_stylesheet.html` | Naming conventions, file structure, styling `hello.py`'s templates for real |

Work through them in order. Every file's `<style>` block only uses
properties taught in an earlier file (or explains a new one inline with
a `/* NEW: ... */` comment) — so if something looks unfamiliar, it's
either brand new in that file or worth a re-read of an earlier one.
