# 🎫 Ticket: TICKET-003 MediaPipe Landmark EMA Smoothing & Visual Dwell-Time Ring
**Priority:** HIGH  
**Status:** OPEN  
**Clinical Grounding:** Zhang et al. (2020) MediaPipe Hands & Essential Tremor in Hemiplegia  
**Target Files:**
- `src/recognition/engine.ts`
- `src/components/GestureService.tsx`
- `src/components/CameraPreview.tsx`

---

## 1. Problem Statement & Clinical Context
Stroke survivors and Parkinsonian patients suffer from involuntary tremors (4–7 Hz). Raw coordinate tracking triggers multiple unintentional gesture recognitions, leading to cognitive fatigue and distress.

---

## 2. Technical Specification
1. Implement Exponential Moving Average (EMA) smoothing for 3D landmarks:
   `smoothedCoord = alpha * currentCoord + (1 - alpha) * previousCoord` (where `alpha = 0.35`).
2. Add an SVG radial countdown ring over `CameraPreview.tsx` that animates from 0% to 100% over 800ms when an intentional gesture is held.
3. Only trigger the registered action when the ring completes.

---

## 3. Acceptance Criteria
- [ ] Involuntary hand jitters do not accidentally trigger selections.
- [ ] Visual radial feedback clearly shows progress to the user.
- [ ] Dwell duration is configurable in Settings (500ms, 800ms, 1200ms).

---

## 4. Lifecycle Action
Once verified in code and tested on device, **delete this ticket file** and mark as resolved in `research/code_memory.md`.
