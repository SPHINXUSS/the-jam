# The Jam

An incremental game in three acts, about a small preserving business that does not know when to stop.

It is a deliberate homage to *Universal Paperclips* — not a reskin of a clicker. The structure that makes Paperclips work is the structure here: a nearly empty screen with one button, a real price/demand economy you have to actually manage, a computation currency you spend on one-time projects, and two genre changes that arrive without warning.

**Play it:** open `index.html` in a browser. No build step, no dependencies, one file.

---

## The three acts

**I — The Kitchen.** You stir a pot. Jars sell if the price is right and enough people have heard of you. Ovens make inspiration, notebooks decide how much you can hold, and whatever spills over becomes creativity. Inspiration buys recipes; recipes change how the kitchen behaves. Along the way: a fruit market that moves against you, a trading desk, an oscillating starter culture that pays out if you read it at the right moment, and a blind tasting panel that is really a strategy tournament.

**II — The Orchard.** The culture gets out. Money stops existing; jars become the currency and the machinery is built from them. Pickers, pressers, bottling lines, sun traps and cellars, and a swarm of bees that will leave if it is bored or overworked.

**III — The Spread.** Everything within reach is jam. Spores are launched with a fixed budget of trust to divide between speed, exploration, replication, hazard resistance, production and defence — and some of them stop answering.

There is an ending. It takes roughly an hour to reach.

## Design notes

- **Progressive disclosure is the pacing.** The game opens with one button and about four readouts. Every panel appears in response to something you did. This is the single biggest reason Paperclips works and the thing most clickers drop.
- **The economy is real.** Demand is a function of price, word-of-mouth level and its effectiveness; sales are demand^1.15, capped by what you can actually produce. The interesting decision is setting price so appetite matches output, then buying marketing to let you raise it again.
- **The palette moves with the story.** Enamel and jam-red in the kitchen, orchard green-black in Act II, void indigo in Act III. The ground shifts under you.
- **No dead ends.** The build was simulated end to end to catch states you can't escape — running out of both fruit and cash, entering Act III with too few jars to launch, or a recipe priced above the maximum inspiration you can hold. All three existed at some point and all three are fixed.

Typography is Bodoni Moda (jar labels are didone) against IBM Plex Sans and Plex Mono for readouts.

## Languages

Full English and French, switchable in the top bar at any time. Translation is keyed: the original text of every static node is snapshotted once at boot, and switching sets it from a dictionary. Nothing observes the DOM and rewrites it in place, so repeated switching cannot compound or duplicate text.

## Saving

Progress saves to `localStorage` every ten seconds and on demand. If the page is running somewhere storage is unavailable, the game detects it, keeps everything in memory for the session, and says so when you press Save.

## Choices

Two permanent forks. Neither is a wrong answer; each closes the other for the run.

- **Maker's Table / Corner Store** (Act I) — calmer demand and room to charge more, or a wider audience that minds the price.
- **Hedgerow / Factory Floor** (Act II) — quiet machines that sip power, or hard-driven ones that punish an outage.

## Files

- `index.html` — the whole game: markup, styles, and engine in one file. No build step, no runtime fetching, opens from disk.
