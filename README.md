# The Jam 🍓

**The Jam** is a tactile incremental game about turning a tiny kitchen into an absurd preserve empire.

This version is designed around a tighter moment-to-moment loop than a traditional clicker: stir manually, build a groove, trigger **Jam Fever**, complete increasingly strange customer orders, react to market moods, and spend cash on upgrades that change the way the kitchen behaves.

## The loop

1. **Stir the pot** to make jars, cash, Spark, heat, and groove.
2. **Find the groove** by chaining quick stirs; reach ten to trigger **Jam Fever**.
3. **Tune the shelf price** to trade demand for stronger margins.
4. **Build the workshop** with projects that add automation, storage, quality, demand recovery, and new scale.
5. **Pack orders** before the courier leaves; machines can also fill them for you.
6. **Ride market events** such as Berry Boom, Food Blogger, Sticky Lids, and Perfect Weather.
7. **Level the kitchen** to improve resource flow and unlock more ambitious orders.
8. **Cross eras** from Kitchen → Neighborhood → City → National → Moon.
9. **Start a new batch** at 50,000 jars for a permanent sales bonus while keeping achievements and Spark.

## Design pillars

- **Tactile first:** the main action is always visible and immediately rewarding.
- **Choice before scale:** upgrades add new advantages, not just bigger numbers.
- **Short loops inside the long loop:** groove, orders, events, and level-ups create frequent reasons to act.
- **Readable chaos:** the economy can get large without becoming visually noisy.
- **A sense of place:** the kitchen, customers, journal, and market should make the numbers feel like a story.

## Systems

- Manual + automated jam production
- Groove and Jam Fever combo system
- Dynamic demand, pricing, heat, and quality
- Customer orders with timers and rewards
- Ten escalating production projects
- Random market events
- XP, levels, Spark, and achievement milestones
- Offline progress
- Local persistence through `localStorage`
- WebAudio feedback with a sound toggle
- Responsive desktop + mobile layouts
- No build step or framework required

## Files

- `index.html` — game shell, UI, workshop, order board, journal, and progression panels
- `style.css` — warm visual system, responsive layout, tactile cards, animation, and feedback
- `game.js` — simulation, economy, combo loop, orders, events, progression, achievements, prestige, audio, and persistence

Open `index.html` in a browser to play.
