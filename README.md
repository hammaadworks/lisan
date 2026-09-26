# 🌙 It's lisan Alhamdulillah: Empowering Silent Voices through Adaptive AAC

**Shukr** (Arabic: "Gratitude") is an open-source, offline-first Augmentative and Alternative Communication (AAC) platform designed to break communication barriers for seniors and individuals with speech challenges. Built with a focus on cultural localization and accessibility, Shukr leverages modern technology to restore dignity and independence through intuitive gesture, voice, and visual interfaces.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://shukr.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

![Shukr Banner](src/assets/hero.png)

### 🌈 Restoring Dignity Through Technology

Modern communication tools often fail those who need them most—the elderly and the speech-impaired—by imposing complex interfaces and foreign linguistic structures. Shukr exists to dismantle these invisible barriers. 

We believe that every individual deserves to express their needs, emotions, and thoughts with dignity. By combining cutting-edge AI with a deeply human-centric design, Shukr transforms a device from a complex piece of hardware into a familiar, empowering companion that understands the nuances of human expression—whether through a subtle gesture, a simple sketch, or a familiar voice.

## Targets (June 2026)
- [ ] complete lisan such that we can go live in July 1st week [type:: 🏆 MAJOR] [timetrack] [eta:: 2026-06-30]

### ✨ Core Innovation

Shukr is an adaptive ecosystem designed to evolve with the user's needs:

- **🌍 Cultural Localization:** Deep support for localized vocabularies, starting with Urdu-first Nastaliq script optimization.
- **🖐️ Gesture Control:** Hands-free navigation using MediaPipe-powered face and hand gestures (e.g., mouth open, pointing).
- **🎨 Doodle Mode:** Translate sketches into communication using local machine learning models.
- **🎙️ Voice Studio:** Personalize the app with familiar family voices through custom recordings.
- **🧠 Adaptive Prediction:** Learns user habits to suggest relevant words based on context and time.
- **♿ Inclusive Design:** Built on a comprehensive [Accessibility & Interaction Matrix](./docs/accessibility-matrix.md) that supports the intersection of speech loss, deafness, and illiteracy.
- **💾 Offline-First (PWA):** Secure, local-only data storage with zero cloud dependency.

### 🏗️ Built for Resilience and Privacy

The architecture of Shukr is a testament to the "Local-First" philosophy. We have engineered a platform that prioritizes human privacy and operational reliability above all else. 

By offloading all computational intelligence—from **MediaPipe gesture recognition** to **Doodle-to-Speech analysis**—directly to the user's device, we eliminate the need for cloud dependency. Using a resilient **IndexedDB-powered data store**, we ensure that a user's 'Data Universe' (their custom vocabularies, recorded voices, and behavioral patterns) remains strictly personal and always available, even in the most remote environments.

### 🚀 Begin the Journey

Whether you are a caregiver seeking a voice for a loved one or a developer looking to contribute to a global mission, getting started with Shukr is effortless.

- **Experience:** Visit the live platform at [shukr.vercel.app](https://shukr.vercel.app). We recommend "Adding to Home Screen" to install it as a PWA for a seamless, full-screen, and offline-ready experience.
- **Contribute:** Our mission is open-source and collaborative. Join us in building the future of accessible communication by setting up your local environment:
  ```bash
  pnpm install && pnpm dev
  ```

### 🌍 A Global Mission of Gratitude

Shukr is more than a codebase; it is a shared commitment to ensuring no one is left unheard. While our journey began with a focus on the Urdu language, our vision is boundaryless. We invite the global community to join us—help localize the platform, adapt vocabularies for different cultures, or refine our accessibility models. 

Together, we can bridge the silence and restore the power of connection for everyone, everywhere.

> [!TIP]
> Dive deeper into our [Full Documentation](./docs/architecture.md) to explore the technical heart of the Data Universe and our human-centric Design System.

---

Built with ❤️ by [hammaadworks](https://github.com/hammaadworks)
