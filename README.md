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
- Left and Right arrows navigate
- `Enter` or `Space` also activate navigation buttons

## 0.0.3 Basic backend: Text and TextDisplayGroup Entities

- A single `"sentence chunk"` is exactly 1 sentence each in the case of the UrText, but less || more than 1 sentence for every other Text (not an object or model, simple a string at a certain index)
- Set up Rails 7 Backend with a `Text` model
    - `sentence_chunks`: `text` in postgreSQL contains a JSON array of individual sentence chunks of entire text (e.g. book)
    - DB seed:
        - Populate with 20-sentence-long pre-split / aligned `text`s (JSON arrays)
- create `TextDisplayGroup` model
    - TextDisplayGroup `has many` Texts
- create API to retrieve a `TextDisplayGroup` from backend
    - Upon API GET (show: `/text1_ID/text2_id` ? (query string?), first text is top (main target text), second is below that, third would be below that, etc.) `sentence_chunks` arrays
    - `TextDisplayGroup` object instantiates upon first API with a unique combination of Texts
        - holds data about user’s progress through

## 0.0.4 `TextSection` and`TextSectionDisplayBatch` entities

- create `TextSection` entity
    - holds **begin/end indexes** of where in Text string this was taken
        - allows easily grabbing next section in either direction
    - holds array of sentence chunk strings
- create `TextSectionDisplayBatch` entity
    - `has_many` TextSections
    - One `TextSectionDisplayBatch` JSON payload: { TextSection_1_KSUID: [”DEUstring1”, “DEUstring2”, …], TextSection_2_KSUID: [”ENGstring1”, “ENGstring2”, …]}
- Send `TextSectionDisplayBatch`es to frontend with DEFAULT_SENTENCE_CHUNK_BATCH_SIZE (5 for now) each

## 0.0.5 Remember progress

- Attribute of `TextDisplayGroup` : `current_sentence`
- Return to where I left of for that `TextDisplayGroup`

## 0.0.6 Display `TextSectionDisplayBatch` es as user moves through text

- Set SENTENCES_FROM_NEW_BATCH_REQUEST_DEFAULT (2)
- E.g. when user gets to sentence 3 (of original 5; i.e. there are 2 or less sentences after the current one), get additional `TextSectionDisplayBatch`
- Now there are 10. When sentence 8 is reached, 11-15 are loaded.

## 0.0.7 Retire `TextSectionDisplayBatches` and `TextSection`s when user is out of bounds

- Both are`TextSection` and `TextSectionDisplayBatch`are temporarily persisted:
- set TEXT_SECTIONS_FROM_CURRENT_SENTENCE_DEFAULT (2)
- when user is more than that many TextSections from the furthest point of a given TextSection, it is retired from memory and the DB.
    - e.g. 5 sentences * 2 sections = 10 sentences.
    - at sentence 11, the first TextSection (1-5) is retired.
    - Another explanation: Whenever the user progresses 2 TextSections away, the TextSection that is 1.0+ TextSections away from the current spot is retired

## 0.0.8 Create `UrText` entity

- Purpose: needed for editing and navigation between readings
    - associating all Texts with an UrText avoids risk of *combinatorial explosion:*
        - if A&B Texts are grouped and B&C are grouped, then A&C are grouped
- inherits from Text, but ***not*** STI
- attr. array: contains canonical sentence split
    - all other Texts conform to its sentences
- update DB seed to populate UrText with correct text
    - establish appropriate associations in seed too

## 0.0.9 Administrate gem

- `index` of all
    - UrTexts
        - shows length
        - Texts
    - Texts
        - shows length
        - `ready`
        - UrText
    - TextDisplayGroups
        - show
            - `current_sentence`
            - length (amount of sentences)
        - new
            - Canonical splitting: each `TextDisplayGroup` must have an UrText or a `ready` Text
- upload Texts and UrText
    - pasting for now
    - must choose UrText for Text

## 0.0.10 Checked Sentences, Ready Texts

- add`checked` array attribute to Texts
- Add `ready` attribute to UrText
    - array: holds boolean of whether one of its Texts has been fully `checked` against it, and is thus `ready`
        - ready = {DEU_1_KSUID: boolean, …}
- Canonical splitting: each `TextDisplayGroup` must have an UrText ***or*** a `ready` Text
- Add `checked` percentage of total length to Text show on Administrate

## 0.0.11 Checking Sentences

- user edits split
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
- checking progress saved by TextDisplayGroup’s Text’s `checked` array attributes (boolean at index corresponding to `sentence_chunks` array)
    - All Texts in current TextDisplayGroup set `checked` to `true` at `current_sentence` index once they have been *shown and then moved past*
- Update TextSection retirement flow:
    - if any edits have been made (boolean sent from frontend)
        - splice updated JSON array as string into the Texts’ “`sentence_chunks`" `text` datatype DB column
        - **The beginning/end indexes in the `text` of all currently loaded TextSections are adjusted so that, if any of them are also changed, they can be spliced into the `text` replacing exactly the right spots.**

## 0.0.12 Audio playback

- just simple keyboard / button navigation
- create `AudioText` entity
    - inherits from Text?
- administrate upload audio file
    - must choose Text it belongs to
    - Text must be `ready` or UrText

## 0.0.13 Audio split: manual only

- simple pausing (e.g. spacebar) then confirming (spacebar again)
- go back 1 second
- remember timestamp of file
    - store `begin` and `end` key:values in `audio_sentence_chunks`at index of UrText’s (or `ready` Text’s) `sentence_chunks` array

## 0.0.14 Automatic Sentence Splitter

- auto-splitter splits files (hard-coded reference to text files / here-doc)
    - see my original sentence splitter project
    - and text alignment links (studies and libraries)

## 0.1.0 Export JSON for backup / sharing

- TextDisplayGroup
- write (integrate into design) proper instructions to allow self-hosting and sharing

## 0.1.0 Convert Text to UrText

If a user wants to make a subordinate Text into its own UrText (to use its split as canonical), then a ***new*** UrText instance is made with a *copy* of the Text’s sentences

- later: either take directly as currently split **or** split from original text saved from original user input
- later still: all other texts associated with the previous UrText may be imported (copied and associated) with correct splitting conforming to new UrText automatically