# ⚙️ Shukr Backend: The Data Universe Engine

The "backend" of Shukr is a specialized suite of data engineering tools and scripts designed to curate, validate, and evolve the **Data Universe**. Unlike traditional cloud-based backends, these tools are focused on preparing high-quality, localized linguistic data that lives entirely on the user's device.

This engine ensures that Shukr's vocabulary is not just a list of words, but a structured, intelligent system capable of prediction and cultural resonance.

## 🛠️ Tech Stack

- **Environment:** Python (managed via `uv`) for heavy linguistic processing
- **Linguistics:** `wordfreq` for analyzing word prevalence across languages
- **Automation:** Node.js (CommonJS/ESM) for data ingestion and vocabulary rebuilding
- **Validation:** Custom scripts to ensure the integrity of the Nastaliq and English datasets

## 🧩 Key Components

### 1. Vocabulary Rebuilder (`rebuild_vocab.cjs`)
The heart of the data pipeline. It processes raw linguistic data, applies frequency analysis, and generates the structured JSON that powers the frontend's search and prediction engines.

### 2. Universal Ingestor (`ingest.js`)
A robust script for bringing new linguistic datasets into the Shukr ecosystem. It handles mapping, normalization, and conflict resolution.

### 3. Word Manager (`update_wordmanager.py`)
A Python-driven utility that leverages `wordfreq` to provide intelligent data points for each word, ensuring the most common and relevant terms are prioritized for the user.

### 4. Validation Suite (`validate_vocab.cjs` & `vocab-checker.py`)
Guardians of data quality. These scripts check for structural errors, missing translations, and script inconsistencies before any data reaches the production frontend.

## 🚀 Workflow

To rebuild the Data Universe from source:

1. **Python Setup:**
   ```bash
   uv sync
   ```
2. **Rebuild Vocabulary:**
   ```bash
   node scripts/rebuild_vocab.cjs
   ```
3. **Validate:**
   ```bash
   node scripts/validate_vocab.cjs
   ```

## 🧠 Visionary Data Engineering

We believe that data is a form of care. By meticulously curating vocabularies that respect local dialects and cultural nuances, we provide users with a voice that feels like their own. Our backend mission is to make the "Data Universe" as expansive as human thought, yet as precise as a single gesture.

---

> "Data is the soul of communication."
