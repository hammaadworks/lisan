# 🎫 Ticket: TICKET-004 Forgiving Speech Delay Buffer & "Nevermind" Undo Loop
**Priority:** MEDIUM  
**Status:** OPEN  
**Clinical Grounding:** Errorless Learning Paradigm in Dementia (Clare et al., 2003)  
**Target Files:**
- `src/hooks/useAudio.ts`
- `src/components/SentenceBuilder.tsx`

---

## 1. Problem Statement & Clinical Context
In cognitive decline, accidental button clicks are frequent. If the app immediately vocalizes the mistake aloud at high volume, it provokes sensory panic and withdrawal. An errorless learning loop provides a brief window to cancel.

---

## 2. Technical Specification
1. In `useAudio.ts`, support an optional playback buffer delay (configurable: 0s, 1.5s, 3s).
2. During the delay window, render a prominent red "کبھی نہیں / Nevermind" button with a gentle visual countdown bar.
3. If tapped, cancel audio synthesis and restore the prior sentence state.

---

## 3. Acceptance Criteria
- [ ] User can cancel any mistaken sentence before audio plays aloud.
- [ ] Audio cancel operation is instantaneous and produces a quiet, soothing acknowledgement sound.

---

## 4. Lifecycle Action
Once verified in code and tested on device, **delete this ticket file** and mark as resolved in `research/code_memory.md`.
