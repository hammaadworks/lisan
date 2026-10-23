# 🎫 Ticket: TICKET-010 Caregiver Psychoeducational Guidance & Communication Scaffolding Companion
**Priority:** MEDIUM  
**Status:** OPEN  
**Clinical Grounding:**  
- Cheng & Ng, *JMIR Aging*, 6 Jan 2025 (DOI: [10.2196/57997](https://doi.org/10.2196/57997)): *The PDC30 Chatbot—Development of a Psychoeducational Resource on Dementia Caregiving Among Family Caregivers: Mixed Methods Acceptability Study*.
- *BMC Geriatrics*, 2025–2026 Meta-Analysis (8 RCTs, 611 participants): Demonstrates that generic open-ended chatbots fail to alleviate loneliness, whereas structured psychoeducational scaffolding interventions produce statistically significant reductions in depressive symptoms.
- *Studies in Health Technology and Informatics*, 2025: Real-world usability, cognitive fatigue, and practical communication support for care partners.
- Mentor Roadmap (2026): A tailored caregiver assistant grounded strictly in trusted sources rather than an unconstrained hallucinating chatbot.

**Target Files:**
- `src/lib/data/caregiverGuidance.json`
- `src/components/modals/CaregiverGuideModal.tsx`
- `src/lib/aiProvider.ts`
- `src/components/SettingsPanel.tsx`
- `src/styles/modules/settings.css`

---

## 1. Problem Statement & Clinical Context

Family members caring for stroke survivors with aphasia and elders with dementia experience extreme emotional distress, compassion fatigue, and communication breakdown. When a patient stumbles on words or becomes agitated during evening sundowning, caregivers frequently commit natural but counterproductive mistakes:
- Forcing the patient to repeat mispronounced words (inducing catastrophic performance anxiety).
- Finishing sentences prematurely without patient consent.
- Contradicting or correcting a dementia patient's perceived reality.
- Missing non-verbal cues of intense physical discomfort (e.g. shingles rash, dental pain).

A generic AI chatbot is unsafe in this domain because hallucinated advice or unvetted medical guidance can cause severe harm. Instead, the evidence base (Cheng & Ng, 2025) requires **grounding assistive advice strictly in validated psychoeducational caregiving protocols** (Validation Therapy, Errorless Learning, Gentle Scaffolding, and De-escalation).

---

## 2. Technical Specification

### 2.1 Structured Offline Psychoeducational Library (`src/lib/data/caregiverGuidance.json`)
Pre-compile a self-contained, offline library containing clinical communication guides structured into 4 practical modules:
1. **Module 1: Scaffolding Aphasic Communication**
   - The Golden Rule: *Wait 5 seconds before speaking*.
   - Multi-modality cueing: Encourage gestures, drawings, and pointing.
   - Reducing binary pressure: Avoid rapid-fire "Yes/No" interrogation.
2. **Module 2: Sundowning & Dementia Agitation**
   - The Validation Protocol: Agree with the feeling, never argue with the fact.
   - Auditory grounding: Playing the family voice recordings from Voice Studio.
   - Environmental calming: Soft lighting and reducing television/radio chatter.
3. **Module 3: Non-Verbal Pain Recognition**
   - Identifying guarding postures, clenched fists, facial furrowing.
   - Utilizing Lisan's Visual Pain & Dermatome Map (Ticket 001).
4. **Module 4: Caregiver Respite & Self-Care**
   - Managing micro-burnout and emotional resetting techniques.

### 2.2 Grounded Conversational Caregiver Scaffolding (`src/lib/aiProvider.ts`)
Implement `getCaregiverGuidance(scenarioDescription: string, config: AppConfig)`:
- System prompt strictly constrains responses to psychoeducational principles (Cheng & Ng, 2025).
- **Safety Guardrails:**
  - Mandatory disclaimer: *"I am an assistive communication guide, not a medical doctor. For medical emergencies or drug changes, consult your physician."*
  - Refuses to diagnose or recommend medications.
  - Provides concise (under 120 words), actionable, step-by-step communication strategies.
  - Formatted in dignified, empathetic Urdu Nastaliq or English.

### 2.3 User Interface: `CaregiverGuideModal.tsx`
- Accessible from Header (Heart/Shield icon) and Settings Panel.
- Tabbed interface:
  - **Quick Clinical Cards:** 1-tap browse of the 4 offline modules.
  - **Ask the Scaffolding Companion:** Interactive conversational prompt input for specific communication dilemmas (e.g. *"My mother insists she needs to cook dinner right now, but it is midnight and she is frail. What should I say?"*).
  - High-contrast card layouts, generous spacing, and bookmarking capability.

---

## 3. Acceptance Criteria

- [ ] All 4 psychoeducational modules load and display 100% offline from `caregiverGuidance.json`.
- [ ] Grounded AI Companion prompt strictly rejects pharmaceutical and diagnostic inquiries with clinical disclaimers.
- [ ] Conversational responses deliver actionable communication techniques (Validation, Pacing, Redirection) within <2.0s.
- [ ] Available in both Urdu (Nastaliq typography) and English.
- [ ] Accessible modal layout tested on mobile screens and desktop monitors.

---

## 4. Lifecycle Action
Once implemented, update `research/code_memory.md` and archive this ticket.
