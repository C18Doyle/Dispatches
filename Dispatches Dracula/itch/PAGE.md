# itch.io page for Dracula: The Passage

Everything below is ready to paste into the page's edit screen (dispatches.itch.io/dispatches-dracula). Nothing has been uploaded: the page is a draft, and pushing a build waits for an explicit instruction.

## Basics

- **Title:** Dracula: The Passage
- **Short description (under 100 characters):** You are the Count. A branching story of the weeks from the castle to the sea.
- **Classification:** Games
- **Kind of project:** HTML
- **Genre:** Interactive Fiction
- **Tags:** dracula, gothic, horror, interactive-fiction, branching-narrative, text-based, strategy, victorian, historical, atmospheric, mobile-friendly, singleplayer, short
- **Release status:** In development (a test build)
- **Pricing:** free ("no payments") while it is a test build
- **Community:** comments on (this is where feedback goes)
- **Cover image:** `itch/cover.png` (630x500)
- **Screenshots, in this order:** `itch/screenshots/01-title.png` to `09-share-card.png`

## Embed settings (Uploads)

- Channel `web-full` (the release pipeline pushes `dispatches-dracula-full.zip` there; the demo is not pushed).
- Tick **This file will be played in the browser** (once, after the first push).
- **Viewport:** 600 wide, 900 tall. Tick **Mobile friendly** and **Fullscreen button**. Leave "Automatically start on page load" off. Leave **Scrollbars** on.
- Orientation: portrait.

## Description

> **You are the Count.** It is April. A young solicitor is coming up the pass to witness the deeds to a house in England, and you have never been so tired of mountains.
>
> *Dracula: The Passage* is a short strategy-story of the weeks from the castle to the sea and what comes after, told from the Count's side of Bram Stoker's novel. You choose what to learn from your guest, how many boxes of earth to send, how to land at Whitby, and what to be once you are in London: a quiet neighbour, a host, or a storm. Three reserves (Strength, Secrecy, Dominion) rise and fall with every choice. If one runs out, the passage ends. There are fifteen endings.
>
> **A second seat.** On the title page, switch to **Mina Harker**: the same weeks from the other side, her journal, her typewriter, her choices. Forty scenes of her own, and fifteen more endings.
>
> ### What is in it
> - 45 scenes in three tracks (the Quiet Colony, the Court at Carfax, the Storm), 15 endings, and ventures whose odds you can see before you take them.
> - Documents the way the novel keeps them: letters, newspaper clippings, Dr Seward's phonograph, a notebook page, Mrs Harker's typescript. Which ones you meet depends on what you did.
> - Four looks (a light one among them), a score that follows the screen, sound effects for places and moods, and a share card for your ending.
> - Every claim the game makes about the book is checked against the 1897 text. Every line that is Stoker's own is marked.
>
> ### How to play
> Read the scene, pick a choice (tap once to arm it, tap again to confirm), and watch the three reserves. Locked choices say what they ask for. The Children of the Night (the wolves, the rats and the owls) will tell you what a choice costs, if you ask. Best on a phone, in the dark.
>
> ### Please read
> This is a **test build**. Nobody but its author has played it yet. The dialogue is imagined; the novel is public domain. The game does not show what the Count does to the people he feeds on and does not make a game of it. The novel is from 1897 and its attitudes belong to it: it is hard on women who step out of line, wary of foreigners and careless about people in asylums. The game does not agree with any of that.
>
> ### Tell me what you think
> Press **Copy Summary** or **Save Card** on any ending and paste it into a comment, with whatever you want to say. The most useful things: where you stopped reading, a choice whose odds felt wrong, a lock whose reason was unclear, and whether playing the Count felt too comfortable.
>
> ### Accessibility
> Four themes including cream paper and black ink; three text sizes; no flashing; motion stops if your device asks for reduced motion; every screen works at phone width; headings and meters are labelled for screen readers. Saves are kept in your browser only.
>
> *Credits: from Bram Stoker's Dracula (1897, public domain; text from Project Gutenberg). Fonts (Pirata One, Cinzel, Cinzel Decorative, IM Fell English, IM Fell English SC, Playfair Display, Special Elite) are under the SIL Open Font Licence. Part of the Dispatches series.*

## Update notes for 0.2.0

New: four looks, a picture for every ending, six more documents, Mina as a second seat, sound effects, a share card, embedded fonts. See `CHANGELOG.md`.

## Checklist for the day it goes up

1. Run the release (`git tag dracula-v0.2.0 && git push origin dracula-v0.2.0` does the pipeline: tests, zips, GitHub release, butler push) only when told to.
2. On the page: tick browser play on `web-full`, set the cover and screenshots, paste the text above, set the embed size.
3. Play the page itself once on an Android phone and an iPhone before making it public.
4. Change the page from Draft to Public only when ready for testers.
