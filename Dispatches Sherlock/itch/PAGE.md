# itch.io page for Sherlock Holmes: The Final Problem

Everything below is ready to paste into the page's edit screen (dispatches.itch.io/dispatches-sherlock). From 0.6.0 the release pushes the demo to this page (channel `web-demo`, played in the browser) and the full game as a download (channel `download-full`). The full web version goes to the confidential page (`dispatches/dispatchessherlockconfidential`, channel `web-full`). The old `web` channel (0.5.0, the full game in the browser) is no longer updated: delete that upload on this page when you are ready. The page is still a draft, so nothing here is public until you publish it.

## Basics

- **Title:** Sherlock Holmes: The Final Problem
- **Tagline (under 100 characters):** Hunt Professor Moriarty through London, Whitehall and the Alps. Every choice costs something.
- **Classification:** Games
- **Kind of project:** HTML
- **Genre:** Interactive Fiction
- **Tags:** sherlock-holmes, detective, mystery, victorian, interactive-fiction, branching-narrative, text-based, strategy, historical, atmospheric, mobile-friendly, singleplayer
- **Release status:** In development (a test build)
- **Pricing:** free ("no payments") while it is a test build
- **Community:** comments on (this is where feedback goes)
- **Cover image:** `itch/cover.png` (1260x1000, shown at 630x500)
- **Banner / header (if you use one):** `itch/banner.png` (1920x540)
- **Screenshots, in this order:** `itch/screenshots/01-title.png` to `10-the-paper-look.png` (each 1200x1800, the phone shape the game is built for)

## Embed settings (Uploads)

- Channel `web-demo` (`dispatches-sherlock-demo.zip`): tick **This file will be played in the browser** (once, after the first push). This is the demo.
- Channel `download-full` (`dispatches-sherlock-full.zip`): leave it as a download (an `index.html` and a README).
- On the confidential page, channel `web-full` (the same full zip): tick **This file will be played in the browser** there too.
- **Viewport:** 600 wide, 900 tall. Tick **Mobile friendly** and **Fullscreen button**. Leave "Automatically start on page load" off. Leave **Scrollbars** on.
- Orientation: portrait.

## Description

> **London, January 1891.** A man who has never been charged with a crime is running the city. He sits at the centre of a web, and you are the only one who has noticed. You are Sherlock Holmes, and this is the winter and spring that Dr Watson would later call the final problem.
>
> *The Final Problem* is a branching detective story you steer one decision at a time. Read the dated report, choose how to answer, and live with what it costs. Some doors open only to a detective an ally still trusts. Some close for good.
>
> ### What you do
> - **Choose your road, early.** Within a few scenes you decide how to meet the Professor: through Scotland Yard, through Wiggins and the street boys, through your brother Mycroft's club in Whitehall, or by running for the Continent and the Reichenbach Falls. Each road has its own people, its own scenes and its own endings.
> - **Watch six meters.** Evidence, Standing and Nerve are what the case is made of. Under them runs **the Strand**: Hours, Hands and Wires, the time, the people and the reach you have left. Let one run dry and the Professor goes untouched.
> - **Pin it up.** A cork board of traces, people and moves; the Professor's web, with every arm you find and cut (he notices); a calendar that counts the days to Monday; a sketch map of where you have been.
> - **Spend trust carefully.** Watson, Lestrade, Mycroft and Wiggins each remember what you did. So, perhaps, does a certain lady from the opera.
> - **Run against the calendar.** The Monday raids, the tide on the Tuesday, the Professor's arrival at the Falls and the Cabinet's sitting come whether or not you are ready, and a short Hours line costs you on the day. The Professor answers the arms of his web that you cut, unless you made ready for it.
> - **Take a gambit.** Some choices are a gamble with the odds shown. Success and failure both have their own story.
> - **Pack a disguise.** The priest, the sailor or the clerk will open a choice that a man in his own face cannot have.
>
> ### Five volumes in the Case-Book
> The game opens on Holmes's shelf, which is split into the **major case** and the **minor cases**, and remembers which endings you have found. **The Final Problem** is the major case (101 scenes, 17 endings). Beside it lie four minor cases of four scenes each, which you can finish in one sitting: **The Speckled Band** (1883), **A Scandal in Bohemia** (1888), **The Blue Carbuncle** (Christmas, 1889) and **The Red-Headed League** (1890), each with four endings of its own (the fourth is hidden until you have made the right choices). They share nothing with the major case, so they are a good place to learn the game.
>
> ### How it looks and sounds
> A Victorian parlour in houndstooth tweed and cream paper (or, in Settings, the same parlour in daylight): telegrams, handwritten notes, calling cards, journal pages and guidebook leaves, instead of one newspaper. A drone of fog and a distant chime (off by default), a violin sting for the Falls, and the sound of the wire going down when you run short of Wires. Fonts are bundled, so it runs offline.
>
> ### How to play
> Read the scene. Tap a choice once to mark it and again to confirm it. Locked choices say what they ask for. On the easiest setting every choice shows its cost first; on the hardest, money is real and thin. Best on a phone, in the evening, with the lamp low.
>
> ### Please read
> This is a **test build**, and almost nobody but its author has played it. It follows the outline of Arthur Conan Doyle's *The Final Problem* (1893) and, at the end of one road, *The Empty House* (1903); the four minor cases follow *The Speckled Band*, *A Scandal in Bohemia*, *The Blue Carbuncle* and *The Red-Headed League*. The stories are public domain. Most of the scenes, the clerk Larch, Sergeant Pike, the boy Alf, Mrs Norton's letter of 1891 and every alternate ending are the game's own invention, and each ending says afterwards what Doyle's story does instead. Some of the claims about the stories rest on the author's memory and are waiting for a reader's check. The stories are of their time, and the game does not share all of its attitudes.
>
> ### Tell me what you think
> Press **Copy Summary** or **Save Card** on any ending and paste it into a comment, with whatever you want to say. The most useful things: where you stopped reading, which road you chose and why, a gambit that felt unfair, a lock whose reason was unclear, whether the Strand made you play differently, and whether the short cases were too easy.
>
> ### Accessibility
> Three text sizes; no flashing; motion stops if your device asks for reduced motion; every screen works at phone width; headings and meters are labelled for screen readers; contrast is checked on every colour pair. Saves are kept in your browser only.
>
> *Credits: from Arthur Conan Doyle's Sherlock Holmes stories (public domain). Fonts (Playfair Display, Rokkitt, Lora and Caveat) are under the SIL Open Font Licence. Part of the Dispatches series.*

## Update notes for 0.6.0

New: real deadlines (Hours decide what the dated days cost or give), the Professor's answers to a cut arm, a hidden fourth ending in each minor case, one saved case per volume, and a writing lint and canon check behind the scenes. See `CHANGELOG.md`.

## Update notes for 0.5.0

New: a shelf split into the major case and four minor ones, with a fifth volume (The Red-Headed League); two investigations each for the street and the flight; Mrs Norton's later scenes; a second chance at every finale; a picture for every ending; the Professor's answers on the board; Watson's remarks on the Strand; Hours on the calendar; a real houndstooth and a paper look. See `CHANGELOG.md`.

## Update notes for 0.4.0

New: the Houndstooth look; the Strand (Hours, Hands, Wires); a Board tab and a Calendar tab; disguises; a deeper Whitehall road with a cipher to break; Irene Adler's letter; the Case-Book shelf with three short cases. See `CHANGELOG.md`.

## Making the artwork again

`npm run build`, then `node itch/art/make.mjs` redraws the cover and banner. `node scripts/serve_dist.mjs` in one terminal, then `node itch/art/screenshots.mjs`, replays the game and saves the screenshots. The cover is drawn as SVG (a magnifying glass over the Reichenbach Falls, in the Professor's web), so changing a colour or the wording is a one-line edit in `itch/art/make.mjs`.

## Checklist for the day the page goes public

1. Upload `cover.png` and the screenshots in order; paste the tagline and description.
2. Tick the browser embed and set the viewport (above).
3. Play the embed once on a phone and once on a desktop.
4. Set the release status, then publish.
5. Any later build goes out by tag (`sherlock-vX.Y.Z`), and only when told to.
