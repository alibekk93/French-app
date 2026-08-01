# Spec

Source: Notion — "French app" page. Captured 2026-08-01.

## Purpose
- Improve reading
- Improve vocabulary
- Improve grammar
- Improve general level

## Design
- Simplistic
- Minimalistic
- Lightweight
- No internal LLM / agentic AI use

## Integrated translation tool
- Lightweight
- Online connection possible if needed
- Has to be free
- Usage limits are fine, but no payment method required
- Translates to: 1) English, 2) Russian

## Modes

### 1. Reading mode
1. Provide a URL — app shows the text from it in a way convenient for reading.
2. Alternatively, paste plain text.
3. Any word or group of words can be selected; a translation to English and
   Russian is shown in a convenient popup.
4. The popup (original + both translations) can be saved into the dictionary.
5. Translation runs through the integrated translation tool; may require an
   internet connection.

### 2. Vocab mode
1. Uses the dictionary.
2. User can add words/phrases directly; translations to English and Russian
   are generated and stored.
3. A button starts vocab training using flashcards built from the dictionary.
4. Settings control:
   - Flashcard type: French with hidden translations / translations with
     hidden French / randomized mixture of both.
   - Input type: blank write-in / multiple-choice with 4 options.
5. Training runs indefinitely until the user ends it.

### 3. Grammar mode
- Currently a placeholder. Implemented later.
