# 🎫 Ticket: TICKET-011 Live Visual Caption Bar & Adaptive Audio Pacing for Hearing Loss & Dysarthria
**Priority:** MEDIUM  
**Status:** OPEN  
**Clinical Grounding:**  
- *npj Science of Learning*, 19 Nov 2025 (DOI: [10.1038/s41539-025-00306-5](https://doi.org/10.1038/s41539-025-00306-5)): *Immersive auditory-cognitive training improves speech-in-noise perception in older adults*. Demonstrates the clinical necessity of dual-modality (auditory + synchronized visual captions) for age-related presbycusis.
- *Nature Communications*, 19 Jan 2026: Intelligent throat silent speech decoding in post-stroke dysarthria showing a 55% surge in patient communication satisfaction when output articulation is clear, paced, and visually reinforced.
- Mentor Roadmap (2026): Live conversation captions with adjustable text size, speaker clarity, and 1-tap replayable snippets.

**Target Files:**
- `src/components/LiveCaptionsTicker.tsx`
- `src/hooks/useAudio.ts`
- `src/components/SettingsPanel.tsx`
- `src/styles/modules/builder.css`
- `src/App.tsx`

---

## 1. Problem Statement & Clinical Context

Over 65% of post-stroke survivors and geriatric dementia patients suffer from comorbid age-related sensorineural hearing loss (**presbycusis**) and central auditory processing delays. 

When Lisan synthesizes speech through the device speakers:
1. Standard TTS playback runs at conversational speeds (1.0x–1.2x) that sound rushed and unintelligible to an elderly ear in a noisy household.
2. There is no synchronized visual text display during vocalization. Once a synthesized sentence finishes playing, it vanishes from the auditory buffer. Hard-of-hearing patients cannot verify what was spoken, and family members standing across the room cannot read along.
3. If an utterance is misheard, the patient must laboriously re-select words to repeat the message.

---

## 2. Technical Specification

### 2.1 Live Visual Caption Ticker (`src/components/LiveCaptionsTicker.tsx`)
Create a persistent, floating or docked caption ticker:
- **Visual Styling:**
  - High-contrast charcoal/onyx backdrop (`rgba(17, 24, 39, 0.94)`) with crisp white or soft amber typography (`#F9FAFB` / `#FDE047`).
  - Font size configurable: Normal (18px), Large (24px), Extra Large (32px).
  - Authentic Nastaliq rendering for Urdu with generous line-height (`≥ 1.9`).
- **Synchronized Karaoke Word Highlight:**
  - Leverage Web Speech API `SpeechSynthesisUtterance.onboundary` event to highlight each word actively being pronounced.
- **Instant Replay Control:**
  - Include a prominent 1-tap `RotateCcw` / `Volume2` button ("Replay / دوبارہ سنیں") allowing instant re-articulation of the last spoken phrase without re-building the sentence.

### 2.2 Adaptive Audio Engine Extensions (`src/hooks/useAudio.ts`)
1. **Configurable Speech Rate Multiplier:**
   - Add selectable playback rates in `useAudio.ts` and `SettingsPanel.tsx`:
     - `0.6x`: Slow & Deliberate (Severe Dysarthria / Presbycusis rehabilitation).
     - `0.8x`: Gentle & Paced (Elderly Geriatric Default).
     - `1.0x`: Standard Pace.
2. **Audio Boundary Events:**
   - Emit `activeSpokenWordIndex` to drive visual caption highlights.
3. **Acoustic Clarity Filter:**
   - Boost formant mid-frequencies (1 kHz–3 kHz) using Web Audio API BiquadFilter to maximize consonant intelligibility against background domestic noise.

---

## 3. Acceptance Criteria

- [ ] Whenever speech is triggered (via card tap, sentence dock, or intent confirmation), `LiveCaptionsTicker` displays the exact phrase.
- [ ] Word-by-word visual highlight updates smoothly during vocalization.
- [ ] Replay button immediately repeats the phrase at the configured speed.
- [ ] Speech rate is configurable in Settings (0.6x, 0.8x, 1.0x) and persists across reloads.
- [ ] Caption text size is adjustable (18px, 24px, 32px) and compliant with WCAG 2.2 AAA contrast (≥ 7:1).
- [ ] Tested in landscape and portrait views.

---

## 4. Lifecycle Action
Once implemented, update `research/code_memory.md` and archive this ticket.
