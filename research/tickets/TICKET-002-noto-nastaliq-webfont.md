# 🎫 Ticket: TICKET-002 Noto Nastaliq Urdu Web Font Embedding & Saccadic Flow
**Priority:** HIGH  
**Status:** OPEN  
**Clinical Grounding:** Saccadic Eye Movement & Linguistic Primacy in Dementia (Center for Research in Urdu Language Processing)  
**Target Files:**
- `index.html`
- `src/styles/app.css`

---

## 1. Problem Statement & Clinical Context
Elderly dementia patients progressively lose secondary acquired languages (e.g. English) and revert to their childhood mother tongue (Urdu). When the app displays system fallback Arabic/Naskh fonts, visual decoding speed drops by 35-50% and patients experience eye strain and alienation.

---

## 2. Technical Specification
1. In `index.html`, embed Google Font:
   `<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap" rel="stylesheet">`
2. In `src/styles/app.css`, apply `'Noto Nastaliq Urdu', serif` to `.lang-ur`, `.dir-rtl`, and all Urdu typography classes with line-height ≥ 1.8.
3. Validate WCAG 2.2 AAA contrast (≥ 7:1) for text against card backgrounds.

---

## 3. Acceptance Criteria
- [ ] Urdu words render with true fluid Nastaliq ligatures across all mobile tablets and browsers.
- [ ] No clipping of bottom diacritics (nuqtas) or long descending letter tails.

---

## 4. Lifecycle Action
Once verified in code and tested on device, **delete this ticket file** and mark as resolved in `research/code_memory.md`.
