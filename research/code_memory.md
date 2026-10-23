# 🧠 Lisan / Lisan: Research Memory & Clinical Implementation Audit

> **Original Genesis (April 1, 2026):**  
> *"Started this project on April 1, alhamdulillah, with a sincere effort to help Bade Ammi. Researched more on aphasia, dementia, shingles. What AI can do in aphasia? Checked out many present tools in the market like Spoken (lacked Urdu touch). Needed something dignified, personal touch, customisably adaptive, makes life easy. YAGNI just KISSed me: the multi-lingual was not required in version 1, at least not for my Naani to test. Built a word manager for it... but I still need to perfect the app for aphasia patients and elderly too, and do a complete code audit."*

---

## 🔬 Part 1: Comprehensive Synthesis of Completed Research

We have conducted a systematic literature review and established a dedicated academic research repository in [`research/`](./README.md) and [`research/papers/`](./papers/INDEX.md), covering:

1. **Computer Vision & Touchless Biomechanics:**
   * *Zhang et al. (2020, Google Research):* 21-point on-device 3D hand tracking via MediaPipe.
   * *Kartynnik et al. (2019, Google Research):* 468-point real-time facial surface mesh geometry.
   * *Medical HCI (2026):* Touchless optical gesture tracking in clinical infection-controlled environments.
2. **Aphasia & Speech-Language Pathology:**
   * *Adikari et al. (Scientific Reports, Nov 2025):* Reconstructing impaired language using generative AI; in-context few-shot intent reconstruction for aphasic speech fragments.
   * *Alhejji et al. (IJLCD, Sep 2026):* Systematic review of 67 studies (14 RCTs) identifying the clinical gap where drill exercises fail to generalize to real-world conversations without situational scaffolding.
   * *Auditing ASR in Aphasia (2025):* Demonstrating 68-85% Word Error Rates on aphasic speech, proving deterministic visual-iconic AAC is mandatory.
   * *Visual Scene Displays (Dietz et al., 2020; Light & McNaughton, 2014):* Cognitive superiority of contextual visual cues over decontextualized grid words.
   * *Communicative Drawing Therapy (CDT) (Sacchett 2002; Lyon 1995):* Non-verbal right-hemispheric semantic expression for severe anomia.
3. **Dementia, Speech Biomarkers & Geriatric Usability:**
   * *Journal of Voice Systematic Review (Sep 2026):* 63 studies, 18,540 participants. Proves that voice biomarker models fail external cross-validation when distinguishing MCI from normal aging. Consumer AI apps must avoid diagnostic claims.
   * *Peled-Cohen & Reichart (TACL, 2025):* 240+ paper review showing detection dominates academic literature while longitudinal caregiver support and patient assistance are severely neglected.
   * *Chlasta et al. (Frontiers in Neuroinformatics, Dec 2025):* Combining HuBERT + GPT-4o achieved F1 = 0.5521 on 3-class benchmark, proving foundation models cannot be relied upon for automated diagnosis.
   * *Cheng & Ng (JMIR Aging, Jan 2025):* Grounding AI in structured dementia caregiving manuals (*Positive Dementia Caregiving in 30 Days*) reduces caregiver burnout and anxiety.
   * *BMC Geriatrics Meta-Analysis (2025–2026):* 8 RCTs (611 participants). Proved generic chatbots do not reduce loneliness, while structured psychoeducational agents significantly reduce depressive symptoms (*g* = -0.25).
4. **Augmentative & Alternative Communication (AAC):**
   * *Benevento et al. (Frontiers in Communication, Oct 2025):* Ethical agency and user-device fit. Non-negotiable design principle: *"AI should suggest messages, not silently decide what a person meant."*
   * *India AAC Scoping Review (AAC Journal, June 2026):* 39 studies (1992–2022) validating low-cost, family-partnered, localized AAC interventions in South Asian clinics.
5. **Neuroprosthetics, Silent Speech & Sensory Accessibility:**
   * *Intelligent Throat (Nature Communications, Jan 2026):* Soft textile silent speech decoding + LLM in stroke dysarthria achieving 4.2% WER and 55% satisfaction surge.
   * *Auditory-Cognitive Training (npj Science of Learning, Nov 2025):* Dual-modality (visual captions + paced audio) improves speech comprehension in noise for older adults with presbycusis.

---

## 🔎 Part 2: Codebase Audit — What Is Missing to Fully Back the Research

An audit of the codebase (`src/App.tsx`, `src/components/`, `src/hooks/`, `src/lib/`, `src/recognition/`) revealed critical gaps between what the scientific research mandates and what is currently implemented:

| Clinical / Scientific Need | Current Codebase State | The Missing Piece in Code | Research Justification & Ticket |
| :--- | :--- | :--- | :--- |
| **1. Dedicated Visual Pain & Dermatome Map (Shingles / Pain)** | `SOSModal.tsx` only handles emergency phone calls. `WordGrid.tsx` has generic words. | **Missing:** Interactive visual pain scale (Wong-Baker FACES 0–10) and clickable 2D body silhouette to pinpoint pain (head, chest, flank/shingles rash). | Patients with expressive aphasia or shingles cannot articulate "burning pain on my left ribcage". Standard clinical protocol. **[TICKET-001]** |
| **2. Mother Tongue Fallback & Complete RTL Nastaliq Font** | `src/hooks/useLanguage.tsx` hardcodes translations for `en` and `ur`. System depends on local OS Urdu fonts. | **Missing:** Self-contained `@font-face` embedding of *Noto Nastaliq Urdu* with explicit letter-spacing & line-height; missing translation dictionaries for elderly dialects. | If the patient's tablet lacks Urdu Nastaliq fonts, system degrades to Latin or fragmented glyphs, causing immediate cognitive alienation. **[TICKET-002]** |
| **3. Tremor Suppression & Visual Dwell Progress (MediaPipe)** | `src/recognition/engine.ts` detects gestures per-frame with a basic cooldown. | **Missing:** Exponential Moving Average (EMA) landmark smoothing and a visible circular dwell countdown ring before gesture executes. | Elderly stroke/Parkinson's patients exhibit 4–7 Hz resting tremors. Without smoothing and dwell feedback, involuntary spasms trigger wrong actions. **[TICKET-003]** |
| **4. Errorless Learning & Instant "Nevermind / Undo" Loop** | Words spoken immediately trigger TTS. `SentenceBuilder.tsx` only has delete/clear. | **Missing:** 2.5-second forgiving audio buffer with a prominent floating "Undo / کبھی نہیں (Nevermind)" button before speech plays aloud. | Clare et al. (2003): Dementia patients become severely distressed when an unintended button sounds loudly. Forgiving undo prevents anxiety spirals. **[TICKET-004]** |
| **5. Clinical Analytics & SLP Progress Export (GAS & TTE)** | `predictionsEngine.ts` stores only raw usage counts in `WordUniverseItem`. | **Missing:** Local-only clinical metric logger calculating Time-to-Expression (TTE), daily successful communicative interactions, and exportable PDF/CSV summary for doctors. | Medical insurance and speech therapists require objective progress metrics (Goal Attainment Scaling) to approve ongoing AAC usage. **[TICKET-005]** |
| **6. Multi-Cue Redundant Accessibility for Color Vision Deficiency (Deuteranopia/Protanopia) & Dementia** | Previous UI used color-only differentiation on Yes/No and category pills. | **Implemented & Solved:** Dual topological vector shapes (`CheckCircle` with 2.5px stroke for Yes vs `XCircle` for No) + 2.5px accessible contrast borders + luminance-differentiated backgrounds (`#E8F5E9` vs `#FFEBEE`) + spatial procedural consistency + WCAG AAA text contrast (>= 7:1). | Kawas et al. (2024); Wijk et al.; WCAG 2.2 SC 1.4.1. Elderly dementia and aphasia patients suffer from acquired macular/retinal color confusion; color alone induces critical cognitive friction. **[TICKET-006]** |
| **7. Aphasia Intent Reconstruction with Human-in-the-Loop Confirmation** | `SentenceBuilder.tsx` concatenates word tokens linearly without grammar completion. `aiProvider.ts` lacks aphasic intent expansion. | **Missing:** In-context few-shot intent reconstruction generating 3 candidate complete sentences from telegraphic fragments + accessible confirmation sheet before TTS playback. | Adikari et al. (Scientific Reports 2025); Benevento et al. (2025). AI must suggest messages, not silently decide or speak without consent. **[TICKET-007]** |
| **8. Personal Biographical Profile & Daily-Life Pragmatic Situations** | Generic word grid. No personal family tree, biographical anchors, or quick daily-life situational scenarios. | **Missing:** `PersonalCommunicationProfile` in IndexedDB + 1-tap `DailyLifeDock` (Mealtime, Comfort, Medical, Family, Urgent) with offline caching. | Alhejji et al. (IJLCD 2026); AAC India Scoping Review (2026). Overcomes the drill-to-daily-life gap by grounding communication in immediate personal realities. **[TICKET-008]** |
| **9. Longitudinal Functional Communication Journal & Non-Diagnostic Summary** | No functional interaction timeline or longitudinal tracking. | **Missing:** Client-side telemetry logging daily communication count, TTE latency, functional categories, and 1-click outpatient report for SLP/Neurologist (with strict non-diagnostic disclaimers). | Journal of Voice (2026); Peled-Cohen & Reichart (TACL 2025); Chlasta et al. (2025). Avoids dangerous fake diagnostic claims; provides clinically defensible behavioral tracking. **[TICKET-009]** |
| **10. Caregiver Psychoeducational Guidance & Communication Companion** | Zero caregiver support or psychoeducational communication tools in codebase. | **Missing:** Self-contained offline psychoeducational library (Validation therapy, Errorless learning, Sundowning de-escalation) + bounded AI advisor. | Cheng & Ng (JMIR Aging 2025); BMC Geriatrics (2026). Generic chatbots do not reduce loneliness; grounded psychoeducational guidance significantly reduces depression and caregiver burden. **[TICKET-010]** |
| **11. Live Synchronized Captions & Adaptive Audio Pacing (Presbycusis)** | TTS speaks at fixed standard rate without visual subtitle ticker. | **Missing:** Persistent high-contrast live subtitle ticker with word-by-word visual highlight + adjustable speech rate (0.6x, 0.8x, 1.0x) + 1-tap replay button. | npj Science of Learning (2025); Nature Communications (2026). Over 65% of elderly patients have comorbid hearing loss; dual-modality visual-auditory pacing is vital for comprehension. **[TICKET-011]** |

---

## 📋 Part 3: Strategic Instructions — Research Mentor to CEO

**To:** Chief Executive Officer, Lisan / Lisan  
**From:** Clinical Research & Scientific Advisory Lead  
**Subject:** 2025–2026 Scientific Roadmap: Communication Restoration vs Generic AI Pitfalls  

### 1. The Core Scientific Premise: Communication Restoration, Not a Chatbot
The advice from our clinical research mentor is profound: **Lisan must be approached as a communication-restoration platform, not simply an opportunity to build another AI chatbot.**

We must maintain clear neurocognitive distinctions across our patient cohorts:
* **Aphasia** is a cortical disruption of language production and/or comprehension (Broca's/Wernicke's). The patient knows what they want to say, but struggles to retrieve phonemes or syntax.
* **Dysarthria** is a neuromuscular motor execution impairment (slurred speech post-stroke), with language cognition often completely intact.
* **AAC** provides compensatory multi-modal pathways (pictures, large buttons, gestures, eye-dwell, text fragments) to express thought.
* **Dementia** involves memory decay, attention deficits, and gradual loss of recent languages, requiring reminiscence anchors, familiar voices, and mother-tongue stability.

### 2. Crossing the "Ecological Generalization Gap" (Alhejji et al., 2026)
The single most important finding for a software-first founder from the September 2026 systematic review in the *International Journal of Language & Communication Disorders* (67 studies, 14 RCTs) is that **technology can make intensive drill exercises accessible, but improvements on drills do not translate into better everyday conversations.**

Lisan's defensible product moat is built directly in that gap:
1. We do not build academic grammar tests.
2. We provide an **Everyday Life Situational Engine** (Mealtime, Comfort, Medical/Pain, Family, Urgent) paired with **In-Context Intent Reconstruction**.
3. When the patient taps two fragments (e.g. `[چائے, میٹھا]`), Lisan generates 3 natural pragmatic options, lets the patient confirm their true meaning, and speaks it aloud with dignity.

### 3. Rejecting the "AI Dementia Screener" Trap (Regulatory & Scientific Stance)
Founders frequently fall into the trap of claiming their app can "diagnose Alzheimer's from voice." The September 2026 *Journal of Voice* review (63 studies, 18,540 participants) and the December 2025 *Frontiers in Neuroinformatics* study (Chlasta et al., F1 = 0.5521) show that differentiating MCI from normal aging is clinically unreliable across diverse real-world populations.

**Our Regulatory & Product Strategy:**
* We explicitly **reject diagnostic claims**. Lisan does not claim to diagnose, screen, or stage dementia.
* Instead, we seize the massive uncrowded opportunity documented by Peled-Cohen & Reichart (*TACL 2025*, 240+ papers): **Longitudinal Functional Communication Journaling and Caregiver Assistance**.
* We log objective functional telemetry (Time-to-Expression, daily communicative acts, category balance) that Speech-Language Pathologists and Neurologists can actually use during outpatient evaluations.

### 4. The Non-Negotiable Human Agency Rule (Benevento et al., Frontiers in Comm 2025)
**"AI should suggest messages, not silently decide what a person meant."**
In every screen and algorithm across Lisan:
* Generative models present candidate choices.
* The patient or care partner remains the ultimate sovereign decision-maker via explicit tactile or hands-free confirmation.

---

## 🛠️ Part 4: Technical Tickets — Product Manager to Senior Engineer & Dev Team

```
================================================================================
TICKET ID: ENG-CLINICAL-001 | Priority: CRITICAL | Status: OPEN
Title: Implement Interactive Visual Pain & Shingles Dermatome Assessment Module
================================================================================
Target Files: `src/components/modals/PainAssessmentModal.tsx`, `src/App.tsx`
Acceptance Criteria:
  1. Wong-Baker FACES Scale (0-10) with high-contrast color and facial icons.
  2. Clickable 2D body silhouette with dermatome zones (head, flank/shingles, back).
  3. Synthesizes localized pain phrase in Urdu Nastaliq and English.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-002 | Priority: HIGH | Status: OPEN
Title: Embed Noto Nastaliq Urdu Web Font & High-Contrast Visual Balance
================================================================================
Target Files: `index.html`, `src/styles/app.css`
Acceptance Criteria:
  1. Embed Noto Nastaliq Urdu font locally/CDN with line-height >= 1.8.
  2. RTL layout direction adheres strictly across all cards without ligature clipping.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-003 | Priority: HIGH | Status: OPEN
Title: MediaPipe Landmark EMA Smoothing & Visual Dwell-Time Ring
================================================================================
Target Files: `src/recognition/engine.ts`, `src/components/GestureService.tsx`
Acceptance Criteria:
  1. Low-pass Exponential Moving Average (alpha = 0.35) suppresses 4-7 Hz tremors.
  2. Visual circular countdown ring (800ms) with 20ms haptic tick on completion.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-004 | Priority: MEDIUM | Status: OPEN
Title: Forgiving Speech Delay Buffer & "Nevermind / کبھی نہیں" Undo Loop
================================================================================
Target Files: `src/hooks/useAudio.ts`, `src/components/SentenceBuilder.tsx`
Acceptance Criteria:
  1. Configurable pacing delay (0s, 1.5s, 3s) before TTS speaks aloud.
  2. Prominent floating "کبھی نہیں / Nevermind" button instantly cancels speech.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-005 | Priority: MEDIUM | Status: OPEN
Title: Local-First Clinical Metrics Logger (TTE & Interaction Volume)
================================================================================
Target Files: `src/lib/universeDb.ts`, `src/lib/clinicalLogger.ts`
Acceptance Criteria:
  1. Local IndexedDB logging of Time-to-Expression (TTE) and communicative volume.
  2. One-click CSV/JSON export for Speech-Language Pathologist review.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-006 | Priority: CRITICAL | Status: RESOLVED
Title: Redundant Multi-Cue Accessibility for Color Vision Deficiency (CVD)
================================================================================
Target Files: `src/components/Footer.tsx`, `src/components/WordCard.tsx`
Acceptance Criteria:
  1. Dual topological shapes (CheckCircle vs XCircle) + 2.5px contrast borders.
  2. Verified under Deuteranopia/Protanopia: WCAG AAA text contrast (>= 7:1).
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-007 | Priority: CRITICAL | Status: OPEN
Title: AI-Assisted Intent Reconstruction with Human-in-the-Loop Confirmation
================================================================================
Clinical Grounding: Adikari et al. (Scientific Reports 2025); Benevento et al. (2025)
Target Files:
  - `src/lib/aiProvider.ts`
  - `src/hooks/useSentenceBuilder.ts`
  - `src/components/SentenceBuilder.tsx`
  - `src/components/modals/IntentConfirmationModal.tsx`
Acceptance Criteria:
  1. In-context few-shot prompt expands 1-3 telegraphic tokens into 3 distinct
     pragmatic candidate sentences (request, inquiry, state).
  2. Renders accessible IntentConfirmationModal with high-contrast candidate cards.
  3. Patient MUST tap to confirm before speech vocalizes (zero silent decisions).
  4. Instant rule-based fallback when offline (<50ms).
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-008 | Priority: HIGH | Status: OPEN
Title: Personal Biographical Communication Profile & Daily-Life Pragmatic Mode
================================================================================
Clinical Grounding: Alhejji et al. (IJLCD 2026); AAC India Scoping Review (2026)
Target Files:
  - `src/types/index.ts`
  - `src/lib/universeDb.ts`
  - `src/components/modals/PersonalProfileModal.tsx`
  - `src/components/DailyLifeDock.tsx`
Acceptance Criteria:
  1. `PersonalCommunicationProfile` stored in IndexedDB (calling name, caregiver,
     family members, allergies, dietary needs).
  2. Daily-Life Situational Dock provides 1-tap offline phrases for 5 scenarios:
     Mealtime, Comfort/Positioning, Medical/Pain, Family/Dua, and Urgent Needs.
  3. Header displays personalized patient moniker (e.g. "Lisan — Bade Ammi").
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-009 | Priority: HIGH | Status: OPEN
Title: Longitudinal Communication Journal & Non-Diagnostic Outpatient Summary
================================================================================
Clinical Grounding: Journal of Voice (2026); Peled-Cohen & Reichart (TACL 2025); Chlasta (2025)
Target Files:
  - `src/lib/clinicalLogger.ts`
  - `src/lib/universeDb.ts`
  - `src/components/modals/CommunicationJournalModal.tsx`
  - `src/components/SettingsPanel.tsx`
Acceptance Criteria:
  1. Permanently displays non-diagnostic clinical disclaimer.
  2. Local-only IndexedDB logging of daily communications, TTE latency, and
     functional category balance.
  3. 7-day and 30-day interactive trend visualizer.
  4. 1-click clinical summary formatted for visiting SLP and Neurologist visits.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-010 | Priority: MEDIUM | Status: OPEN
Title: Caregiver Psychoeducational Guidance & Communication Scaffolding Companion
================================================================================
Clinical Grounding: Cheng & Ng (JMIR Aging 2025); BMC Geriatrics Meta-Analysis (2026)
Target Files:
  - `src/lib/data/caregiverGuidance.json`
  - `src/components/modals/CaregiverGuideModal.tsx`
  - `src/lib/aiProvider.ts`
Acceptance Criteria:
  1. 4 offline clinical caregiving modules: Aphasia Scaffolding, Sundowning
     De-escalation, Non-Verbal Pain Recognition, Caregiver Respite.
  2. Grounded AI conversational advisor constrained strictly to psychoeducational
     guidelines with hardcoded refusal to diagnose or prescribe drugs.
  3. Available in Urdu Nastaliq and English with bookmarking capability.
================================================================================

================================================================================
TICKET ID: ENG-CLINICAL-011 | Priority: MEDIUM | Status: OPEN
Title: Live Visual Subtitle Ticker & Adaptive Audio Pacing for Hearing Loss
================================================================================
Clinical Grounding: npj Science of Learning (2025); Nature Communications (2026)
Target Files:
  - `src/components/LiveCaptionsTicker.tsx`
  - `src/hooks/useAudio.ts`
  - `src/components/SettingsPanel.tsx`
Acceptance Criteria:
  1. Synchronized high-contrast subtitle ticker with word-by-word visual highlight.
  2. Configurable speech rate (0.6x, 0.8x, 1.0x) for dysarthric and presbycusis pacing.
  3. 1-tap "Replay / دوبارہ سنیں" instant replay button for misheard sentences.
================================================================================
```
