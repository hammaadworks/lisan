# Accessibility & Interaction Matrix

This document maps human sensory and cognitive capabilities to Lisan's adaptive interface. It serves as a foundational guide for ensuring communication remains possible across a spectrum of physical and educational barriers.

## 1. The Core Discovery
During field testing in local masajid, we discovered a critical intersection of barriers:
> **Scenario:** A user who is **Deaf** (cannot hear), **Illiterate** (cannot read/write), but **Fluent in Sign Language**.

This realization shifted our focus from "Speech Loss" to "Total Communication Adaptive Design."

---

## 2. Comprehensive Capability Permutations

This matrix accounts for combinations of Sight (V), Hearing (A), Motor/Hands (M), and Literacy (L).

| Scenario | V | A | M | L | Primary Input | Primary Output | Lisan Strategy | External / Hybrid Aid |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **Standard AAC** | ✅ | ✅ | ✅ | ✅ | Screen / Audio | Touch / Gesture | Default Grid + TTS | - |
| **Illiterate Speaker** | ✅ | ✅ | ✅ | ❌ | **Icons** / Audio | Touch / Doodle | **Icon-Only Mode** + Audio Labels | - |
| **Deaf Speaker** | ✅ | ❌ | ✅ | ✅ | Screen / Text | Touch / Sign | Visual Flashes + Transliteration | Hearing Aid / Sign |
| **Deaf + Illiterate** | ✅ | ❌ | ✅ | ❌ | **Icons** / Visual | Sign / Doodle | **Sign-to-Icon** + Visual Feedback | Sign Language Interpreter |
| **Blind Speaker** | ❌ | ✅ | ✅ | ✅ | **Audio** / Haptic | Touch / Voice | Audio-Guided Grid + Haptic Cues | Braille / Cane |
| **Blind + Illiterate** | ❌ | ✅ | ✅ | ❌ | **Audio** / Haptic | Physical Tap | Audio-Tactile Fixed Grid | - |
| **Motor Impaired** | ✅ | ✅ | ❌ | ✅ | Screen / Audio | **Face Gesture** | Mouth/Eye Tracking Seleciton | Eye-Tracker / Joystick |
| **Motor + Illiterate**| ✅ | ✅ | ❌ | ❌ | Icons / Audio | **Face Gesture** | Icon-Only + Face Navigation | Specialized Mount |
| **Deaf-Blind** | ❌ | ❌ | ✅ | ✅ | **Haptic** | Touch / Sign | Morse-Haptic / Braille Input | Tactile Sign Language |
| **Deaf-Blind + Illit.**| ❌ | ❌ | ✅ | ❌ | **Haptic** | Physical Tap | Tactile Physical Switch Interface | Human Intervener |
| **Total Barrier** | ❌ | ❌ | ❌ | ❌ | **Haptic** | **Breath/Twitch** | Bio-Sensor Integration (Advanced) | Full Caregiver Reliance |
| **Cognitive Decline** | ⚠️ | ⚠️ | ✅ | ⚠️ | Simple Icons | Predictive Bar | **Naani Bar** + Minimal Choices | Routine & Familiarity |

**Key:** ✅ = Functional, ❌ = Not Functional, ⚠️ = Partial/Degraded

---

## 3. Interaction Senses Deep-Dive

### A. Input (How the User receives info)
- **Visual:** High-contrast icons, screen flashes (SOS), and large text.
- **Auditory:** Audio cues for navigation, text-to-speech feedback.
- **Haptic (The Silent Bridge):** Vibration patterns (long/short) for confirmation, navigation, or emergency alerts. Critical when V and A are both ❌.

### B. Output (How the User sends info)
- **Gestural:** Hand/Face movements (MediaPipe).
- **Visual:** Doodles and sketches mapped to vocabulary.
- **Physical:** Tactile tapping on high-aspect-ratio cards.
- **Micro-Motor:** Breath sensors or muscle twitches (Future scope).

---

## 4. Mitigations & Strategy

### For Illiteracy
- **Visual Anchors:** Every word MUST have a clear, high-contrast icon.
- **Audio Overlays:** Hovering or focusing on a word triggers its audio label in the user's primary language.

### For Deafness
- **Visual Feedback:** Replace "Speak" buttons with visual status indicators (e.g., a "Voice Wave" animation).
- **Haptic Alerts:** Use device vibration to signal that a message has been "sent" or "spoken" by the app.

### For Blindness
- **Screen Reader Optimization:** Proper ARIA labels and predictable focus order.
- **Audio Navigation:** "Scanning" mode where the app reads out categories as the user moves their finger.

### For Motor Impairment
- **Dwell Selection:** Selecting an item by looking at it or keeping the mouth open for a set duration (threshold).
- **Single-Switch Access:** Navigating the entire app using only one button (Next -> Select).

---

## 5. The "Deaf-Blind" Challenge
When a user cannot see or hear, the only bridge is **Haptics**. Lisan aims to implement a "Haptic Language" where different vibration patterns represent core needs (e.g., 3 short pulses = Water, 1 long pulse = SOS).

---

## 6. Future Research
We must investigate:
1. **Sign Language to TTS:** Real-time translation of hand signs for illiterate/deaf users.
2. **Tactile Overlays:** Physical 3D-printed grids that sit on top of the tablet screen to give "edges" to buttons for blind users.
