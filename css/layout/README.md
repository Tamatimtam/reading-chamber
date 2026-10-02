# CSS Layout (`css/layout/`)

This directory contains styles for global structural elements that appear across multiple pages or handle application-level framing.

---

## File Inventory

* `nav.css`: Navigation bar styles, blur backdrop, brand logo, mobile nav drawer, and active page pill indicators.
* `loader.css`: Fullscreen curtain page-transition loader, spinner typography, and GSAP transition curtain styles.

---

## Rules & Best Practices

1. **High Z-Index Hierarchy**:
   * Navigation: `z-index: 1000`
   * Loader / Transition Curtain: `z-index: 9999`
2. **Fixed Scaffolding**: Layout elements must not disrupt document flow or introduce unintended horizontal scroll bars (`overflow-x: hidden` where appropriate).
3. **Smooth Responsive Scaling**: Use `clamp()` and CSS variables for flexible padding across desktop, tablet, and mobile breakpoints.

---

## What NOT to Do

* Do not style page body content inside layout files.
* Do not attach page-specific business logic or component rules here.
