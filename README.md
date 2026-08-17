# The Jam 🍓

A polished incremental game about making an unreasonable amount of jam. It borrows the satisfying escalation of classic incremental games while building its own economy, market pressure, contracts, events, achievements, and prestige loop.

## Core loop

1. **Stir** jam manually to start the economy.
2. **Sell** jars while balancing price against demand.
3. **Build** increasingly absurd production projects.
4. **Fulfil contracts** before the buyer disappears.
5. **React to events** such as berry booms, influencers, critics, and sticky disasters.
6. **Level up** the kitchen to improve its underlying resource engine.
7. **Reach new phases**: Kitchen → City → Global → Cosmic.
8. **Prestige** at 100,000 total jars to begin a new batch with a permanent sales multiplier.

## Systems

- Manual and automated production
- Dynamic demand and configurable pricing
- Berry and empty-jar regeneration with storage capacity
- Ten escalating production projects
- Contracts with targets, timers, and rewards
- Random market events
- XP, kitchen levels, and Spark rewards
- Eight achievements
- Prestige / new-batch progression
- Offline progress on return
- Local persistence through `localStorage`
- Responsive desktop and mobile UI
- No build step or framework required

## Files

- `index.html` — game shell and interface
- `style.css` — visual system, responsive layout, animation, and components
- `game.js` — simulation, economy, progression, events, achievements, contracts, prestige, and persistence

Open `index.html` in a browser to play.