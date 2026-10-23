# 🎫 Ticket: TICKET-009 Longitudinal Communication Journal & Clinical Visit Summary (Non-Diagnostic)
**Priority:** HIGH  
**Status:** OPEN  
**Clinical Grounding:**  
- *Journal of Voice*, 12 Sep 2026 (63 studies, 18,540 participants): Demonstrates that voice/speech biomarkers fail external cross-validation when distinguishing Mild Cognitive Impairment (MCI) from normal aging. Direct clinical apps must NOT claim to diagnose dementia.
- Peled-Cohen & Reichart, *Transactions of the Association for Computational Linguistics (TACL)*, 2025 (DOI: [10.1162/tacl.a.35](https://doi.org/10.1162/tacl.a.35)): 240+ paper review showing detection dominates the literature while longitudinal communication assistance and caregiver tools are severely neglected.
- Chlasta et al., *Frontiers in Neuroinformatics*, 5 Dec 2025 (DOI: [10.3389/fninf.2025.1485603](https://doi.org/10.3389/fninf.2025.1485603)): State-of-the-art multimodal speech + GPT-4o pipeline achieved F1 = 0.5521 on independent 3-class benchmark, proving algorithmic fallibility.
- Mentor Roadmap (2026): Position as a longitudinal communication journal for families and clinicians, strictly avoiding diagnostic claims.

**Target Files:**
- `src/lib/clinicalLogger.ts`
- `src/lib/universeDb.ts`
- `src/components/modals/CommunicationJournalModal.tsx`
- `src/components/SettingsPanel.tsx`
- `src/styles/modules/settings.css`

---

## 1. Problem Statement & Clinical Context

A dangerous trend in healthtech is marketing speech AI apps as automated "Dementia Screeners" or "Aphasia Diagnosticians". The latest 2025–2026 clinical literature (Journal of Voice, Frontiers in Neuroinformatics) conclusively proves that even combining multi-billion-parameter foundation models (HuBERT, GPT-4o) yields an F1 score of barely 0.55 on uncurated patient cohorts, carrying catastrophic false-positive risks and psychological trauma for families.

Instead, speech-language pathologists (SLPs), neurologists, and family caregivers urgently require a **Longitudinal Everyday Communication Journal**. Clinicians during 15-minute outpatient visits rely on vague family recollections ("He seemed quiet this week"). They lack objective, real-world behavioral telemetry on:
- How many intentional communications the patient initiates per day.
- What communicative domains dominate (e.g. escalating pain requests vs stable social banter).
- Cognitive motor processing speed: Time-to-Expression (TTE) in seconds.
- Whether the patient maintains communicative independence or depends purely on caregiver prompting.

---

## 2. Technical Specification

### 2.1 Regulatory Non-Diagnostic Framing
Every screen of the journal must carry an unambiguous clinical disclaimer:
> *"Notice: This communication journal records functional usage telemetry for personal review and speech-language therapy coordination. It does not diagnose, treat, or predict Alzheimer's disease, dementia, or neurological conditions."*

### 2.2 Telemetry Engine (`src/lib/clinicalLogger.ts`)
Record lightweight, privacy-preserving events in a local IndexedDB table `communicationJournal`:
```typescript
export interface JournalEntry {
  id: string;
  timestamp: number;
  durationMs: number; // Time-to-Expression from first interaction to speech output
  category: string; // 'pain' | 'nutrition' | 'comfort' | 'family' | 'urgent' | 'general'
  modality: 'touch' | 'intent_reconstruction' | 'gesture' | 'doodle';
  tokenCount: number;
  wasConfirmed: boolean;
  timeOfDayHour: number;
}
```
- **Zero Cloud Egress:** Stored exclusively in the patient's local browser database. Zero third-party telemetry or cloud sync.

### 2.3 User Interface: `CommunicationJournalModal.tsx`
1. **Summary Metrics Dashboard:**
   - **Daily Active Expressions:** Bar chart showing completed communication acts over the past 7 and 30 days.
   - **Average Time-to-Expression (TTE):** Trendline indicating whether communicative retrieval latency is improving, stable, or fatigued.
   - **Pragmatic Needs Breakdown:** Donut/pie chart illustrating balance across Pain, Mealtime, Comfort, and Social interactions.
   - **Modality Utilization:** Visual breakdown of touch vs intent reconstruction vs hands-free access.
2. **Clinical Export for Outpatient Visits:**
   - **One-Click Clinical Summary Generator:** Generates a structured Markdown / CSV summary formatted to ASHA Goal Attainment Scaling (GAS) standards.
   - Formatted for printing or sharing directly with visiting SLPs, Occupational Therapists, and Neurologists:
     - Total Sessions & Expression Volume (Last 30 Days)
     - Peak Communication Windows (Circadian rhythm distribution)
     - Latency Benchmarks (Median TTE)
     - High-Frequency Expression Inventory

---

## 3. Acceptance Criteria

- [ ] All communicative events log transparently into `universeDb.communicationJournal` without network requests.
- [ ] Prominent non-diagnostic disclaimer is permanently visible in the Journal header.
- [ ] 7-day and 30-day interactive charts render smoothly without performance lag.
- [ ] Generates clean, formatted CSV and printable summary for Speech-Language Pathologist review.
- [ ] Time-to-Expression (TTE) accurately measures milliseconds from first interaction to audio trigger.
- [ ] Tested across desktop and mobile tablet orientations.

---

## 4. Lifecycle Action
Once implemented, update `research/code_memory.md` and archive this ticket.
