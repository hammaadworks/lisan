# 🎫 Ticket: TICKET-006 Redundant Multi-Cue Accessibility for Color Vision Deficiency (CVD) & Dementia
**Priority:** CRITICAL  
**Status:** RESOLVED  
**Clinical Grounding:** [Kawas et al. 2024 / PMC; WCAG 2.2 SC 1.4.1 & SC 1.4.3; Research Index #13]  
**Target Files:**
- `src/components/Footer.tsx`
- `src/components/WordCard.tsx`
- `src/styles/modules/cards.css`
- `src/styles/modules/footer.css`
- `src/styles/modules/tokens.css`

## 1. Problem Statement & Clinical Context
In elderly patients with post-stroke aphasia and progressive neurodegeneration (Alzheimer's / vascular dementia), congenital and acquired color vision deficiencies (CVD) are widespread:
1. **Deuteranopia & Protanopia**: 8% of males and 0.5% of females have congenital red-green blindness. Furthermore, senile miosis, crystalline lens yellowing, and retinal ganglion cell loss significantly impair blue-green and red-green chromatic discrimination in elders.
2. **Clinical Danger of Monochromatic Cueing**: In healthcare and AAC, relying on color alone (e.g. green button for Yes, red button for No) violates WCAG 2.2 Success Criterion 1.4.1. Under deuteranopia/protanopia, red and green can render as indistinguishable murky brown or charcoal hues. For an anxious or cognitively fatigued patient, this causes catastrophic communicative hesitation or accidental miscommunication of vital healthcare consent (e.g. pain, hunger, medication).

## 2. Technical Specification
1. **Topological Shape Differentiation (Euler Characteristics)**:
   - Provide distinct vector icons inside communication pills:
     - **Yes (ہاں)**: Circle Checkmark (`CheckCircle`) with distinct diagonal stem and upward arm.
     - **No (نہیں)**: Circle Cross (`XCircle`) with dual intersecting 45° diagonal bars.
   - Enforce minimum 22px icon size with 2.5px accessible stroke width.
2. **Luminance & Border Encoding**:
   - Give Yes pill a 2.5px solid Deep Sage Green border (`#2D5A27`) with light green tint (`#E8F5E9`).
   - Give No pill a 2.5px solid Crimson border (`#C22020`) with light pink tint (`#FFEBEE`).
   - Standardize text contrast to high-contrast deep tones (`#1B3B17` and `#881337`), exceeding WCAG AAA 7:1 ratio.
3. **Procedural Spatial Consistency**:
   - Anchor Yes consistently to Dock Slot 1 (left) and No to Dock Slot 2, cementing procedural muscle memory independent of visual decoding.
4. **Elimination of Sub-13px Text**:
   - Set all card secondary transliterations to at least `0.85rem` (13.6px - 14px) bold charcoal (`#182218`).

## 3. Acceptance Criteria
- [x] Yes and No pills display distinct semantic vector icons (`CheckCircle` and `XCircle`) with 22px size.
- [x] Verified under simulated Deuteranopia and Protanopia: both options are immediately distinguishable by shape, luminance, text, and position.
- [x] Text contrast meets WCAG AAA (>= 7:1) across all card surfaces.
- [x] Zero sub-13px text across all cards and dock components.
- [x] Responsive on PC, Mac, iPhone (notch / safe-areas), and Android (100dvh).

## 4. Lifecycle Action
Implemented and visually verified via Playwright MCP across iPhone (390x844) and Desktop PC/Mac (1280x800).
