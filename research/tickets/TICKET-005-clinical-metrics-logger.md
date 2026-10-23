# 🎫 Ticket: TICKET-005 Local-First Clinical Metrics Logger (TTE & Interaction Volume)
**Priority:** MEDIUM  
**Status:** OPEN  
**Clinical Grounding:** ASHA-FACS & Goal Attainment Scaling (GAS) for Insurance & Clinical Approvals  
**Target Files:**
- `src/lib/universeDb.ts`
- `src/lib/clinicalLogger.ts`
- `src/components/SettingsPanel.tsx`

---

## 1. Problem Statement & Clinical Context
Hospital review boards, medical insurance providers, and Speech-Language Pathologists (SLPs) require objective data on patient communication frequency, task completion time, and error rates to endorse AAC device adoption.

---

## 2. Technical Specification
1. Extend `universeDb.ts` with a `clinicalSessions` table storing:
   - `timestamp`: Date and time
   - `timeToExpressionMs`: Milliseconds from first touch/gesture to phrase vocalization
   - `modality`: 'touch' | 'gesture' | 'doodle'
   - `phraseLength`: Number of words composed
2. Add an "Export Clinical Summary (CSV)" button in `SettingsPanel.tsx` that downloads the report directly to the visiting SLP's device without cloud transmission.

---

## 3. Acceptance Criteria
- [ ] Logs saved strictly to local Dexie/IndexedDB with zero network calls.
- [ ] Export generates a clean CSV with calculated averages (Average TTE, Daily Communicative Turns).

---

## 4. Lifecycle Action
Once verified in code and tested on device, **delete this ticket file** and mark as resolved in `research/code_memory.md`.
