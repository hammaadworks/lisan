# 🎫 Ticket: TICKET-001 Visual Pain & Shingles Dermatome Assessment Module
**Priority:** CRITICAL  
**Status:** OPEN  
**Clinical Grounding:** Wong-Baker FACES Scale & McGill Neuropathic Pain Questionnaire (Herpes Zoster / Shingles in Geriatric Aphasia)  
**Target Files:**
- `src/components/modals/PainAssessmentModal.tsx`
- `src/App.tsx`
- `src/lib/translations/en.json`
- `src/lib/translations/ur.json`

---

## 1. Problem Statement & Clinical Context
Patients recovering from acute stroke or elderly individuals suffering from shingles (postherpetic neuralgia) experience sharp, burning dermatomal pain but lack the expressive vocabulary to say where it hurts. The current SOS modal only triggers phone calls and loud alarms, which can cause severe distress without communicating pain localization to caregivers.

---

## 2. Technical Specification
1. Create a `PainAssessmentModal` featuring:
   * **Wong-Baker FACES Pain Rating Scale:** 6 levels (0: No Hurt, 2: Hurts Little Bit, 4: Hurts Little More, 6: Hurts Even More, 8: Hurts Whole Lot, 10: Hurts Worst) with intuitive color gradient (Green -> Yellow -> Deep Red).
   * **Interactive Anatomical Body Map:** Clickable zones for Head, Chest, Left Flank/Ribs (Shingles rash site), Right Flank, Abdomen, Back, Arms, Legs.
2. When a zone + pain level is confirmed:
   * Synthesize high-priority auditory phrase (e.g. "مجھے پسلی میں شدید درد ہے" / "I have severe pain in my ribs").
   * Highlight the affected area on screen with visual pulsation for the attending caregiver or nurse.

---

## 3. Acceptance Criteria
- [ ] Accessible via one-tap "درد / Pain" button from Header or WordGrid.
- [ ] Works completely offline.
- [ ] Full bilingual Nastaliq and English text.
- [ ] Visual dwell confirmation to prevent accidental taps.

---

## 4. Lifecycle Action
Once verified in code and tested on device, **delete this ticket file** and mark as resolved in `research/code_memory.md`.
