# Overview

- “In the Original”: interlinear language-learning app. For people who want to enjoy the best literature their target language has to offer from the *beginning* of their relationship with it. Basically a sentence-by-sentence textual/audio display of existing (public domain and/or user provided)works and their translations and audiobooks. Various display options available, the default being:
    - Target language sentence (bigger and above);
    - Teaching language (smaller and below);
    - Audio: target language;
    - Rhythm: synched with audio (with optional inter-sentence pauses) or wait for swipe to proceed to next sentence.

# Inspiration

- closest thing : [https://beelinguapp.com/](https://beelinguapp.com/)
    - What’s missing: does not allow users to supply their own content
- [https://easyoriginal.com/ueber-easyoriginal/](https://easyoriginal.com/ueber-easyoriginal/)
    - much later, with a lot more human touch, perhaps a Ilya Frank-like method could be achieved?

# MVC Web App Feature overview

### Text only

- user uploads file or pastes text directly
- text is automatically split by sentence, then user-checked
- Easy UI for user editing split of 2 languages at a time
- English menu interface; Languages supported for pairing (minimally):
    - English
    - German
    - Russian
    - Italian
    - French
    - Koine Greek

### Out of Scope:

- multiple users with authorization, etc.
- mobile-specific UI
- mouse editing (equiv. to mobile UI)
- all textual niceties (italics, paragraph styles, bullets, etc)
- images
- copyright concerns
- hosting (limit to Github and personal use)
- exotic scripts, e.g. Chinese (if they have any special requirements)

# DRAFT Roadmap to MVC

## 0.0.1 Set up React on Rails app **✅**

- Client and API with separate repos
- Hello World from one to the other

## 0.0.2 Basic frontend **✅**

- Start with React frontend and then work back from there
    - UI ⇒ Frontend ⇒ Backend
    - SPA vs. `show` of Target L: (`/lang_1/Target_L_ID/lang_2/Teaching_L_ID`)
- Simply have two texts hard-coded in front end.
- pre-split (hard-coded) sentences from pre-paired texts displayed
- `Enter` or `Space` proceeds to next pair

## 0.0.3 Basic backend

- Set up Rails 7 Backend with a Text model and a Sentence model
    - Text `has many` Sentences
- Send text as pre-split batch of sentences to the front end
- Display

## 0.0.4 UrText and UrSentence entities

- Distinct class/models to which all instances of a text (or sentence) belong — including the original
    - has no instance of the text directly, just metadata
    - this avoids risk of *combinatorial explosion:*
        - if A&B are paired (texts or sentences) and B&C are paired, then A&C are paired
- one text per UrText is the `original` (boolean attribute; same goes for (Ur)sentences)

## 0.0.5 TextPair entity

- Every test pair that as actually been used instantiates a TextPair object
    - TextPair `has many` (2) Texts

## 0.1 Display multiple language pairs in succession

- Frontend provides interface for selecting from any other texts that belong to the same UrText
- End-to-end test: 1 UT with 3 T’s
    - e.g. *Philosophie der Freiheit* preface first paragraph: Deu, Eng, Rus
    - show all 3 pairs (1 pair at a time), switching between them as the text progresses
    - first time the 3rd language is requested:
        - TextPair is created
        - whole batch of its sentences is sent

## 0.1.1 Create TextSection entity

- Text > Section > Sentence (Text `has many` Sentences `through` Section)
- Each section has a maximum of 100 sentences.
    - Array holds sentences
    - Index of array is used to proceed from one sentence to the next (no DB queries)
    - If the sentence found in the next index of a section does not belong to the next sentence in the UrSection, throw an error.
- Each text is broken up into sections.
- One section is sent to the frontend at a time.
- `original` / UrSection needed
- Test with 3-sentence-long sections

### Questions at this point:

- Do Sentences (Sections?) know which sentence comes before/after (KSUID of each)?
- Do Texts have an array of Sections in order?
- Do Texts maintain the original (non-split) text data? Does it ever change?
- How many sections can there be in a text? Any limit?

## 0.1.2 Remember progress

- Return to where I left of for that text pair

## 0.2 Automatic Sentence Splitter

- auto-splitter splits files (hard-coded reference to text files / here-doc)
    - see my original sentence splitter project
    - and text alignment links (studies and libraries)
- before a text is added and split, user must choose the UrT it belongs to (default being new one is created)
- UrSentences are instantiated when UrText is.
    - I.e. automatically when sentences are split.
    - Each UrSentence `has_many` Sentences
        - in the first instance, the corresponding sentences of the texts being split

## 0.3 Index and New Views and JSON Import/Export

Administrate?

- `index` of all OriginalTexts — basic
- upload texts in user interface (`new`)
    - files and pasting
    - automatically splits upon uploading
- export/import JSON of split sentences
    - serialization

## 0.3.1 SentencePair entity

- Every sentence pair that as actually been used instantiates a SentencePair object

## 0.4 Pairing Texts, Checking Sentences

- select which texts to associate (`edit`)
- user edits split (auto-split first, then present to user for refinement)
    - There’s no reason to do one sentence at a time because everything you’d need to do is possible in the pair view.
    - numpad
        - <Enter> (or <space>) = save as is
        - bottom sentence
            1. back to previous punctuation
            2. back to previous word
            3. add next section (to new punctuation)
        - top sentence
            1. back to previous punctuation
            2. back to previous word
            3. add next section (to new punctuation)
- progress saved by SentencePair
- `checked` SentencePairs
    - For 0.4: if A&B are `checked` and B&C are `checked`, then A&C are `checked`
    - if all SentencePair in a text pair are `checked`, then TextPair is “ready”

## 0.5 Improved Index and Show Views

- `Index` shows available languages
    - each `show` includes matching texts (same text in another language or audio version)
- display whether the text is `ready` or not (already split and human-checked)
- each `show` shows progress towards being `ready` for each pair it is a part of
    - percentage of `checked` sentences

## 0.6 (Non-)Contagious Checking

- Can access `show` of non-OT’s vis OT’s `show`
    - from there, can choose another non-OT to pair with
- Override already `checked` sentence pairs. E.g.:
    - Deu (Original) &Eng = ready
    - Thus, Eng&Rus = 30% done ⇒ Deu&Rus = 30% done
    - Then, going through the first 30% of Deu&Rus, we adjust split, applying changes only to that particular pair.
        - warning: Sure you want to override already checked?
        - allow user to turn this off (per text pair or universally)
    - Where is this add’l data kept?
        - STI other than TranslationSentence and OriginalSentence: TranslationSentenceWithCustomMatches?
            - controller recognizes Class needs special handling
            - Implies that there are multiple “paths” (sets of split points) through any non-original sentence.
            - Any part that is pushed to the preceding and/or succeeding sentences makes those sentences new, unchecked matches
                - special case: pushing chunk back
                    - show two Target sentences (present and immediately preceding ones) and two Teaching sentences to support proper splitting

## 1.0 Optional: Hotwire or React (DOM manipulation w/out refresh)