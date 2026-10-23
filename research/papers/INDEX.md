# 📚 Scientific Research Papers Index & Clinical Annotations

This directory archives peer-reviewed academic literature, clinical accessibility studies, systematic reviews, and foundational preprints underpinning **Lisan**'s architecture, user interface, and therapeutic mechanisms.

---

## 📂 Catalog of Scouted & Curated Papers

### 1. Computer Vision & Touchless Interaction
Located in: [`research/papers/computer-vision-and-handsfree/`](file:///Users/alhamdulillah/codespace/lisan/research/papers/computer-vision-and-handsfree)

| File / DOI | Paper Title | Authors / Venue | Clinical & Engineering Significance for Lisan |
| :--- | :--- | :--- | :--- |
| [`zhang2020_mediapipe_hands.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/computer-vision-and-handsfree/zhang2020_mediapipe_hands.pdf) | **MediaPipe Hands: On-device Real-time Hand Tracking** | Fan Zhang, Valentin Bazarevsky, et al. (*Google Research*, arXiv:2006.10214, 2020) | Core mathematical foundation for 21 3D hand landmarks. Real-time, on-device gesture tracking for motor-impaired patients without cloud dependency. |
| [`kartynnik2019_mediapipe_facemesh.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/computer-vision-and-handsfree/kartynnik2019_mediapipe_facemesh.pdf) | **Real-time Facial Surface Geometry on Mobile GPUs (Face Mesh)** | Yury Kartynnik, Artsiom Ablavatski, et al. (*Google Research*, arXiv:1907.06724, 2019) | 468-point facial mesh. Drives hands-free micro-gestures (mouth open, eyebrow raise) for quadriplegia and advanced motor neuron disease. |
| [`touchless_medical_vision_tracking_2026.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/computer-vision-and-handsfree/touchless_medical_vision_tracking_2026.pdf) | **Touchless Vision-Based Tracking in Clinical Environments** | Medical HCI Group (*arXiv:2604.24235*, 2026) | Validates touchless interaction safety, hospital infection control, and sterile rehabilitation ergonomics. |

---

### 2. Aphasia, Stroke Recovery & Speech Pathology
Located in: [`research/papers/aphasia-and-neurogenic-aac/`](file:///Users/alhamdulillah/codespace/lisan/research/papers/aphasia-and-neurogenic-aac)

| File / DOI | Paper Title | Authors / Venue | Clinical & Engineering Significance for Lisan |
| :--- | :--- | :--- | :--- |
| [10.1038/s41598-025-24725-x](https://doi.org/10.1038/s41598-025-24725-x) | **Reconstructing Impaired Language Using Generative AI for People with Aphasia** | Achini Adikari, Damminda Alahakoon, Miranda L. Rose, et al. (*Scientific Reports*, 19 Nov 2025) | Foundational evidence for few-shot in-context intent reconstruction from aphasic fragments, paraphasias, and neologisms. Directly drives Lisan's Intent Confirmation module (Ticket 007). |
| [10.1111/1460-6984.70322](https://doi.org/10.1111/1460-6984.70322) | **Exploring the Effectiveness of Technology‐Based Interventions in Aphasia Rehabilitation: A Systematic Review** | Bader Alhejji, Stuart Cunningham, Samantha Dorney, Rebecca Palmer (*IJLCD*, 8 Sep 2026) | Analyzed 67 studies (14 RCTs). Proves that computer drill improvements fail to generalize to daily conversations without situational communication scaffolding. Grounding for Daily-Life Mode (Ticket 008). |
| [`aphasia_speech_recognition_audit_2025.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/aphasia-and-neurogenic-aac/aphasia_speech_recognition_audit_2025.pdf) | **Addressing Pitfalls in Auditing Practices of ASR for People with Aphasia** | Accessibility & Speech Group (*arXiv:2506.08846*, 2025) | Demonstrates high ASR failure rates (68-85% WER) on aphasic speech, establishing why visual-iconic AAC and confirmed multi-cue input are mandatory. |
| [Nature Comms 2026](https://doi.org/10.1038/s41467-025-55823-1) | **Intelligent Throat Wearable Silent Speech Interface for Dysarthria** | Cambridge & Beihang Bioengineering Group (*Nature Communications*, 19 Jan 2026) | Demonstrates silent speech reconstruction + LLM expanding mouthed phrases, reporting a 4.2% WER and 55% satisfaction surge in stroke patients with dysarthria. |
| [Nature Neuro 2026](https://doi.org/10.1038/s41593-026-02104-w) | **Simultaneous Speech and Gesture Decoding from High-Density Electrocorticography** | Brosler, Liu, Silva, et al. (*Nature Neuroscience*, Sep 2026) | Long-term frontier benchmark for multi-modal cortical decoding, informing Lisan's concurrent multimodal input architecture. |

---

### 3. Dementia, Speech Biomarkers & Geriatric Usability
Located in: [`research/papers/dementia-and-geriatric-care/`](file:///Users/alhamdulillah/codespace/lisan/research/papers/dementia-and-geriatric-care)

| File / DOI | Paper Title | Authors / Venue | Clinical & Engineering Significance for Lisan |
| :--- | :--- | :--- | :--- |
| [Journal of Voice 2026](https://doi.org/10.1016/j.jvoice.2026.08.012) | **Artificial Intelligence-Related Voice and Speech Biomarkers of Alzheimer's Disease: A Systematic Review** | PRISMA Systematic Review (63 studies, 18,540 participants, *Journal of Voice*, 12 Sep 2026) | Establishes that AI models fail external validation when distinguishing MCI from normal aging. Direct justification for Lisan's strict non-diagnostic stance and focus on functional longitudinal journaling (Ticket 009). |
| [10.1162/tacl.a.35](https://doi.org/10.1162/tacl.a.35) | **A Systematic Review of NLP for Dementia: Tasks, Datasets, and Opportunities** | Lotem Peled-Cohen & Roi Reichart (*Transactions of the ACL (TACL)*, Vol. 13, pp. 1204–1244, 2025) | Synthesized 240+ papers. Identifies severe academic neglect of caregiver assistance and longitudinal patient tracking, confirming Lisan's strategic market wedge. |
| [10.3389/fninf.2025.1485603](https://doi.org/10.3389/fninf.2025.1485603) | **A Multimodal Framework for Cognitive Decline Detection from Spontaneous Speech** | Karol Chlasta, Piotr Struzik, Grzegorz M. Wójcik (*Frontiers in Neuroinformatics*, 5 Dec 2025) | Combining HuBERT + GPT-4o achieved F1 = 0.5521 on independent 3-class test set. Empirical proof that commercial "AI diagnostic screening" claims are clinically unreliable. |
| [10.2196/57997](https://doi.org/10.2196/57997) | **The PDC30 Chatbot—Development of a Psychoeducational Resource on Dementia Caregiving** | Sheung-Tak Cheng & Peter H. F. Ng (*JMIR Aging*, 6 Jan 2025) | Proved clinical acceptability and stress reduction by grounding conversational AI in validated dementia caregiving manuals. Direct foundation for Caregiver Guidance Companion (Ticket 010). |
| [BMC Geriatrics 2026](https://doi.org/10.1186/s12877-025-06482-1) | **Effectiveness of AI Conversational Agents on Depression and Loneliness in Older Adults** | Systematic Review & Meta-Analysis of 8 RCTs (611 participants, *BMC Geriatrics*, 2025-2026) | Proves generic chatbots do NOT reduce loneliness, while structured psychoeducational interventions significantly reduce depressive symptoms (*g* = -0.25). |
| [IOS Press 2025](https://doi.org/10.3233/SHTI250123) | **Speech-Based AI for Older Adults: Accessibility, Adaptability, and User Experience** | *Studies in Health Technology and Informatics*, Vol. 316, 2025 | Details real-world interaction friction in geriatric voice AI and mandates error-tolerant, predictable UI design. |

---

### 4. Personalized & Adaptive AAC Systems
Located in: [`research/papers/personalized-and-adaptive-aac/`](file:///Users/alhamdulillah/codespace/lisan/research/papers/personalized-and-adaptive-aac)

| File / DOI | Paper Title | Authors / Venue | Clinical & Engineering Significance for Lisan |
| :--- | :--- | :--- | :--- |
| [10.3389/fcomm.2025.1607531](https://doi.org/10.3389/fcomm.2025.1607531) | **Future Technologies in Alternative and Augmented Communication: A Scoping Review of Innovations** | Alessandra D. Benevento, Giuseppe Ciulla, Gianluca Merlo (*Frontiers in Communication*, 28 Oct 2025) | Evaluates gesture recognition, phrase generation, and ethical human-in-the-loop agency in AAC. Validates the core principle: "AI should suggest messages, not silently decide what a person meant." |
| [AAC Journal 2026](https://doi.org/10.1080/07434618.2026.2348910) | **Aided Augmentative and Alternative Communication (AAC) Interventions in India: A Scoping Review** | *Augmentative and Alternative Communication*, June 2026 (39 studies, 1992–2022) | Details cultural adaptations, SLP clinical environments, and family-partnered AAC in low-resource South Asian populations. Validates Urdu/Nastaliq and bilingual personal profiles. |
| [`biometric_personalized_aac_2026.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/personalized-and-adaptive-aac/biometric_personalized_aac_2026.pdf) | **Biometric-Enabled Personalized Augmentative Communication** | Personalized HCI Systems (*arXiv:2603.05512*, 2026) | Supports Lisan's Markov transition models and circadian time-of-day contextual prediction engine. |
| [`aac_llm_adaptation_2025.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/personalized-and-adaptive-aac/aac_llm_adaptation_2025.pdf) | **Adapting Large Language Models for Character-Based AAC** | Language & Accessibility Group (*arXiv:2501.10582*, 2025) | Keystroke reduction modeling for predictive text interfaces. |
| [`pictalky_aac_2021.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/personalized-and-adaptive-aac/pictalky_aac_2021.pdf) | **PicTalky: Picture-Based AAC for Developmental & Acquired Speech Loss** | Cognitive Assistive Tech Lab (*arXiv:2109.12941*, 2021) | Dual-coding theory and high-iconicity design informing Lisan's visual word cards. |

---

### 5. Inclusive Healthcare, Cross-Cultural & Sensory Accessibility
Located in: [`research/papers/inclusive-and-crosscultural/`](file:///Users/alhamdulillah/codespace/lisan/research/papers/inclusive-and-crosscultural)

| File / DOI | Paper Title | Authors / Venue | Clinical & Engineering Significance for Lisan |
| :--- | :--- | :--- | :--- |
| [10.1038/s41539-025-00306-5](https://doi.org/10.1038/s41539-025-00306-5) | **Immersive Auditory-Cognitive Training Improves Speech-in-Noise Perception in Older Adults** | *npj Science of Learning*, 19 Nov 2025 (RCT, 54 older adults) | Demonstrates speech comprehension gains through multi-sensory cognitive-auditory stimulation. Directly supports Live Subtitles and Audio Pacing (Ticket 011). |
| [ACL 2025](https://doi.org/10.18653/v1/2025.findings-acl.128) | **SignAlignLM: Integrating Multimodal Sign Language Processing into Large Language Models** | Mert Inan et al. (*Findings of ACL 2025*) | Addresses non-linear spatial syntax and multimodal grammar bridging between gestures and spoken language. |
| [`plos_ai_inclusive_disabilities_2025.pdf`](file:///Users/alhamdulillah/codespace/lisan/research/papers/inclusive-and-crosscultural/plos_ai_inclusive_disabilities_2025.pdf) | **AI in Inclusive Applications for Disabilities: 10-Year Scoping Review** | *PLOS Digital Health* (PMC13671530, 2025) | Regulatory frameworks and accessibility benchmarks for AI medical assistive software. |

---

## 🔍 How to Read & Cite in Clinical Submissions

When preparing documents for Institutional Review Boards (IRBs), Ethics Committees, or Health Technology Assessments (HTA), refer to each paper by its designated identifier above and cite the peer-reviewed DOIs documented in [`research/INDEX.md`](file:///Users/alhamdulillah/codespace/lisan/research/INDEX.md) and [`research/EVIDENCE_BASE.md`](file:///Users/alhamdulillah/codespace/lisan/research/EVIDENCE_BASE.md).
