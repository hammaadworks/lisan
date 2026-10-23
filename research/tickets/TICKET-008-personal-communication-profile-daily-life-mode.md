# 🎫 Ticket: TICKET-008 Personal Communication Profile & Daily-Life Pragmatic Mode
**Priority:** HIGH  
**Status:** OPEN  
**Clinical Grounding:**  
- Alhejji et al., *International Journal of Language & Communication Disorders*, Sep 2026 (DOI: [10.1111/1460-6984.70322](https://doi.org/10.1111/1460-6984.70322)): Documented the persistent gap where speech drills do not translate into daily conversation without contextual pragmatic scaffolding.
- Augmentative and Alternative Communication Journal, June 2026 (*Aided AAC interventions in India: Scoping review and quality appraisal*): Highlights the necessity of family-partnered AAC personalization, cultural names, and high-frequency daily routines.
- Mentor Roadmap (2026): MVP Recommendation on personal communication profiles, essential everyday scenarios (eating, pain, appointments, family), and offline robustness.

**Target Files:**
- `src/types/index.ts`
- `src/lib/universeDb.ts`
- `src/components/modals/PersonalProfileModal.tsx`
- `src/components/DailyLifeDock.tsx`
- `src/components/Header.tsx`
- `src/components/SettingsPanel.tsx`
- `src/styles/modules/settings.css`

---

## 1. Problem Statement & Clinical Context

In aphasia and early-to-moderate dementia, generic vocabulary lists (e.g. "Cat", "Ball", "Run") generate cognitive disengagement. Communication in acute stroke recovery and geriatric care is deeply situational and centered around immediate personal anchors:
1. **Biographical Grounding:** The patient's preferred calling name (e.g., *Bade Ammi*, *Naani Jan*, *Dada Jan*), primary caregiver's name, grandchildren's names, and emergency clinical contacts.
2. **Everyday Functional Routines:** Over 85% of daily communicative interactions fall into 5 critical scenarios:
   - **Mealtime & Hydration** (*کھانا پینا*): "I want warm water", "Not hungry", "Food is too spicy", "Need tea with less sugar".
   - **Comfort & Body Care** (*آرام اور دیکھ بھال*): "Need to use the washroom", "Change my position", "Feeling too cold/hot", "Help me sit up".
   - **Medical & Pain** (*طبی اور دوا*): "It's time for medicine", "Dizziness", "Burning pain on flank/ribs", "Call the doctor".
   - **Family & Spiritual Connection** (*گھر اور دعا*): "Come sit with me", "Where is everyone?", "Read Quran/Dua", "I love you".
   - **Urgent Need** (*فوری ضرورت*): "Need immediate help", "Cannot breathe comfortably", "Please don't leave me alone".

Currently, Lisan lacks a unified biographical profile and a 1-tap "Daily-Life Pragmatic Mode" that provides instant situational phrases without requiring the patient to hunt through nested vocabulary grids.

---

## 2. Technical Specification

### 2.1 Data Models & Types (`src/types/index.ts`)
```typescript
export interface PersonalCommunicationProfile {
  id: string; // 'primary_profile'
  patientName: string; // e.g. "Bade Ammi"
  caregiverName: string; // e.g. "Fatima"
  caregiverPhone: string;
  preferredDialect: string; // 'ur' | 'en' | 'roman'
  allergies: string[]; // e.g. ["Penicillin", "Peanuts"]
  dietaryRestrictions: string[]; // e.g. ["Diabetic / Low Sugar", "Soft foods only"]
  familyMembers: Array<{
    id: string;
    name: string;
    relationship: string; // e.g. "Granddaughter / پوتی"
    photoUrl?: string;
  }>;
  customQuickPhrases: Array<{
    id: string;
    textPrimary: string;
    textSecondary: string;
    category: 'dining' | 'comfort' | 'medical' | 'family' | 'urgent';
  }>;
  updatedAt: number;
}

export type DailyLifeScenarioId = 'dining' | 'comfort' | 'medical' | 'family' | 'urgent';

export interface DailyLifeScenario {
  id: DailyLifeScenarioId;
  icon: string;
  labelPrimary: string;
  labelSecondary: string;
  phrases: Array<{
    id: string;
    textPrimary: string;
    textSecondary: string;
    audioCue?: string;
  }>;
}
```

### 2.2 IndexedDB Schema Extension (`src/lib/universeDb.ts`)
- Add `personalProfile` table: `id, patientName, updatedAt`.
- Seed with default dignified geriatric profile presets (Urdu Nastaliq + English).
- 100% on-device storage with zero external cloud sync.

### 2.3 User Interface Components
1. **Personal Profile Modal (`src/components/modals/PersonalProfileModal.tsx`):**
   - Accessible via Header or Settings.
   - Clean, large form fields designed for family members and visiting Speech-Language Pathologists (SLPs) to configure.
   - Allows uploading local avatar or selecting representative family icons.
2. **Daily-Life Situational Dock (`src/components/DailyLifeDock.tsx`):**
   - High-contrast segmented control or top horizontal ribbon with 5 clear semantic chips:
     - 🍲 **Mealtime / کھانا**
     - 🛏️ **Comfort / آرام**
     - 💊 **Medical / دوا**
     - 👨‍👩‍👧 **Family / گھر والے**
     - 🚨 **Urgent / فوری**
   - Tapping a chip immediately reveals 4–6 prominent, one-tap phrase cards.
   - Tapping a phrase card vocalizes immediately with high-fidelity TTS / recorded family voice, triggers visual highlight, and logs the communicative exchange.
   - Fully accessible via switch navigation and eye/mouth gesture tracking.

---

## 3. Acceptance Criteria

- [ ] `PersonalCommunicationProfile` is persisted locally in IndexedDB without external cloud dependency.
- [ ] Caregivers can edit patient profile name, caregiver name, and family members in `PersonalProfileModal`.
- [ ] Header displays the patient's personalized moniker (e.g., "Lisan — Bade Ammi") when configured.
- [ ] Daily-Life Dock provides immediate 1-tap situational phrases across 5 clinical scenarios (Mealtime, Comfort, Medical, Family, Urgent).
- [ ] All phrases are pre-loaded and execute 100% offline without network latency.
- [ ] Each phrase card is rendered with minimum 64px height and dual-language high-contrast typography (WCAG 2.2 AAA ≥ 7:1).
- [ ] Tested on tablet and phone viewports.

---

## 4. Lifecycle Action
Once implemented, update `research/code_memory.md` and archive this ticket.
