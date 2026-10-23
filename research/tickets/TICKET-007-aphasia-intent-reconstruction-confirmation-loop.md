# 🎫 Ticket: TICKET-007 AI-Assisted Intent Reconstruction with Human-in-the-Loop Confirmation
**Priority:** CRITICAL  
**Status:** OPEN  
**Clinical Grounding:**  
- Adikari et al., *Scientific Reports*, 19 Nov 2025 (DOI: [10.1038/s41598-025-24725-x](https://doi.org/10.1038/s41598-025-24725-x)): *Reconstructing impaired language using generative AI for people with aphasia*.
- Alhejji et al., *International Journal of Language & Communication Disorders*, 8 Sep 2026 (DOI: [10.1111/1460-6984.70322](https://doi.org/10.1111/1460-6984.70322)): Systematic review of 67 studies demonstrating that drill improvements fail to generalize to daily conversations without pragmatic context support.
- Benevento et al., *Frontiers in Communication*, 28 Oct 2025 (DOI: [10.3389/fcomm.2025.1607531](https://doi.org/10.3389/fcomm.2025.1607531)): Ethical principles and user-device fit in AI-assisted AAC.

**Target Files:**
- `src/lib/aiProvider.ts`
- `src/hooks/useSentenceBuilder.ts`
- `src/components/SentenceBuilder.tsx`
- `src/components/modals/IntentConfirmationModal.tsx`
- `src/styles/modules/builder.css`

---

## 1. Problem Statement & Clinical Context

In post-stroke expressive aphasia (Broca's aphasia) and neurogenic dysarthria, patients know their intended communicative goal but face profound lexical retrieval deficits, telegraphic syntax, and paraphasias (word substitutions). 

Currently, `SentenceBuilder.tsx` operates as a rigid FIFO word accumulator that concatenates individual buttons and plays them in linear robotic sequence (e.g. `[چائے, پانی, درد]`). It cannot reconstruct a grammatically natural, socially dignified utterance from telegraphic fragments.

Furthermore, **a non-negotiable ethical finding from the 2025–2026 clinical literature is that AI must NEVER silently decide what a patient meant or speak on their behalf without confirmation**. Silently generating fluent sentences can misrepresent the patient's vital healthcare intentions (e.g., misinterpreting "pain... stop" as "pain stopped"), inducing catastrophic emotional distress and loss of autonomy.

---

## 2. Technical Specification

### 2.1 AI Prompt Engineering & In-Context Few-Shot Architecture
In `src/lib/aiProvider.ts`, implement `reconstructAphasicIntent(tokens: WordItem[], targetLang: string, config: AppConfig)`:
- Utilize few-shot contextual prompting (Adikari et al., 2025) rather than unconstrained generation.
- **Input:**
  - Token sequence: Primary text, secondary text, parts of speech.
  - Circadian context: Current hour (morning, afternoon, night).
  - High-frequency clinical categories involved (e.g. pain, nutrition, emotional state).
- **Output Schema:** Return strictly a JSON array of 3 distinct pragmatic candidate hypotheses:
  ```json
  {
    "candidates": [
      {
        "id": "cand_1",
        "primary": "براہ کرم مجھے تھوڑی چائے دے دیں۔",
        "secondary": "Please give me some tea.",
        "intent_type": "direct_request",
        "confidence": 0.92
      },
      {
        "id": "cand_2",
        "primary": "کیا چائے تیار ہے؟",
        "secondary": "Is the tea ready?",
        "intent_type": "inquiry",
        "confidence": 0.81
      },
      {
        "id": "cand_3",
        "primary": "مجھے گرم چائے پینی ہے۔",
        "secondary": "I would like to drink hot tea.",
        "intent_type": "state_expression",
        "confidence": 0.74
      }
    ]
  }
  ```
- **Fallback Rule:** If offline or API fails, trigger local deterministic rule-based expansion (combining tokens with polite request scaffolding in Urdu and English) within 50ms.

### 2.2 User Interface & Interaction Flow
1. **Trigger Button in `SentenceBuilder.tsx`:**
   - When `sentence.length >= 1`, render a prominent, accessible action button:
     - Icon: `Sparkles` (`Lucide-react`)
     - Label: Urdu: `بات مکمل کریں` / English: `Complete Sentence`
     - Accessible min-height: 48px, WCAG AAA contrast border.
2. **Confirmation Sheet (`IntentConfirmationModal.tsx`):**
   - Modal pops up cleanly with high-contrast backdrop blur.
   - Header: *"Is this what you want to say? / کیا آپ یہ کہنا چاہتے ہیں؟"*
   - Displays the 3 candidate options as large, separated tactile cards (minimum height 72px each).
   - Each card displays:
     - Large Nastaliq primary text (font size ≥ 20px, line-height ≥ 1.8).
     - Bold English/secondary transliteration (font size ≥ 14px).
     - Individual "Preview Voice / سنیں" audio button.
   - **Tapping the card confirms and speaks the full sentence aloud immediately via TTS**, records the successful interaction in clinical logs, and clears the sentence dock.
   - **Safety Options:**
     - Option: *"Speak Exact Words / اصل الفاظ بولیں"* (speaks raw tokens without AI modification).
     - Option: *"Cancel / منسوخ"* (returns to builder with tokens intact).

---

## 3. Acceptance Criteria

- [ ] When 1 or more words are added to `SentenceBuilder`, the `Complete Sentence / بات مکمل کریں` button appears.
- [ ] Tapping the button calls `reconstructAphasicIntent` and opens `IntentConfirmationModal` within <1.5s.
- [ ] Displays exactly 3 distinct candidate sentences, never speaking until the patient explicitly taps a candidate card.
- [ ] Audio preview button allows listening to a candidate before making the final public vocalization.
- [ ] When device is offline (airplane mode), fallback rule-based expansion activates instantly without error crashing.
- [ ] Card sizes meet touch ergonomics: minimum 72px card height, 2.5px contrast borders, full WCAG 2.2 AAA text contrast (≥ 7:1).
- [ ] Successfully tested in simulated viewport across Desktop PC (1280x800) and mobile tablet/phone (390x844).

---

## 4. Lifecycle Action
Once implemented, verified via unit/integration tests and visual review, update `research/code_memory.md` and archive this ticket.
