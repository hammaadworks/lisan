# 🎨 Shukr Frontend: The Interface of Empathy

The frontend of Shukr is where technology meets human need. It is a highly responsive, touch-optimized, and gesture-aware interface built with **React 19** and **Vite**. 

Our design philosophy is rooted in empathy. We aim to create a frictionless experience that feels natural to those who find traditional technology intimidating, using fluid motion, accessible color palettes, and intuitive layouts to guide the user through their communication journey.

## 🛠️ Tech Stack

- **Framework:** React 19 (using the latest concurrent features)
- **Build Tool:** Vite for lightning-fast development
- **Language:** TypeScript for robust, type-safe development
- **Icons:** Lucide React for a clean, consistent visual language
- **Database:** Dexie.js (IndexedDB) for resilient, local-first data persistence
- **AI/Vision:** MediaPipe for on-device gesture and facial landmark detection
- **Styling:** Vanilla CSS (optimized for performance and flexibility)

## 🧩 Core Architecture

The frontend is organized into functional domains:

- **`components/`**: Atomic and molecular UI components, including the `SentenceBuilder` for core communication and `CameraPreview` for gesture-based interaction.
- **`recognition/`**: Logic for gesture and vision processing, bridging MediaPipe with the UI.
- **`lib/data/`**: The static seed data for the "Data Universe," including the base vocabulary.
- **`hooks/`**: Custom React hooks for managing local state, gesture triggers, and the ambient listener.

## 🚀 Development

To start the frontend development server:

```bash
pnpm install
pnpm dev
```

The application is built as a **Progressive Web App (PWA)**. For the best experience during testing, use Chrome's DevTools to simulate mobile devices and test the offline capabilities.

## 🌈 Design Principles

1. **Clarity over Complexity:** Every pixel must serve a purpose. Avoid clutter.
2. **Motion with Meaning:** Transitions should guide the user's eye and provide feedback for gestures.
3. **Accessibility First:** High contrast, large touch targets, and Nastaliq script optimization are non-negotiable.

---

> "Technology is best when it brings people together."
