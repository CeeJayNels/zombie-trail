# Roblox Setup Guide — Zombie Trail

**Version:** 1.1 · **Last updated:** 2026-10-25

This guide explains how to bring Zombie Trail to Roblox: what you need to install, what to decide before building, and the order to build in. Nothing here has been built yet. It's the plan.

---

## Account details

| Item | Value |
|---|---|
| Roblox username | `Roadkill_Interactive` |
| Roblox group (studio) | _Not created yet. Optional: publish the game under a group so the page shows "By [Studio Name]"_ |

> Changing a Roblox username costs 1,000 Robux. The display name can be changed for free (about once a week).

---

## 1. Why the web version doesn't plug straight in

| | Web version (this repo) | Roblox |
|---|---|---|
| Language | TypeScript + React | **Luau** (Roblox's version of Lua) |
| Runs in | A web browser (GitHub Pages) | The Roblox app/engine |
| Screens built with | HTML/CSS | **ScreenGui** objects (Frames, TextLabels, ImageButtons) |
| Art format | SVG | PNG/JPG only |

Roblox can't run React or show a website inside a game, so the game has to be **ported**: rewritten in Luau. The game rules and event data translate almost directly.

### What each file becomes

| Current file | Roblox equivalent |
|---|---|
| `src/data/events.ts` | `Events.lua`, a ModuleScript with the same data in Lua table syntax |
| `src/store/gameStore.ts` | `GameState.lua`, a ModuleScript with the same logic (travel, choices, damage) |
| `src/types.ts` | Optional Luau type notes |
| `src/components/*.tsx` | ScreenGui screens: Start, Journey, Event, Game Over |
| `public/art/**/*.svg` | PNGs uploaded as Images; each gets an `rbxassetid://…` ID |

---

## 2. One-time setup checklist

- [x] **Roblox account.** Created as `Roadkill_Interactive`.
- [ ] **Verify your email** on the Roblox account.
- [ ] **Roblox Studio.** Free download from <https://create.roblox.com>. Runs on Windows and Mac.
- [ ] **Rojo.** Syncs code from this repo into Studio, so the Roblox code stays in Git with version control. You install it two ways:
  - the **Rojo plugin** inside Studio (Plugins tab → Manage Plugins / Creator Store), and
  - the **Rojo command-line tool**, installed through **Aftman** or **Rokit** so the version is pinned in the repo.
- [ ] **VS Code** and the **Luau Language Server** extension, which catches mistakes as you type.
- [ ] **ID verification** in Roblox account settings. Required for Paid Access and cashing out (DevEx), so do it early.

---

## 3. Decisions to make before building

| Decision | Options | Recommendation |
|---|---|---|
| Player mode | Single-player, or multiplayer (a group shares one van and votes on choices) | **Single-player first.** Much simpler, and the closest match to the web version |
| How to make money | Free to play with optional purchases, or Paid Access | **Free to play with Game Passes.** Paid-entry games from new creators rarely get visitors |
| Art conversion | Inkscape (free), Figma, or an online converter | **Inkscape** can batch-export all the SVGs to PNG |

---

## 4. Build order

1. **Scaffold.** Add a `roblox/` folder to this repo with a `default.project.json` (the file that tells Rojo where each script goes in Studio).
2. **Port data.** Convert `src/data/events.ts` to `roblox/src/shared/Events.lua`.
3. **Port logic.** Convert `src/store/gameStore.ts` to `roblox/src/shared/GameState.lua`.
4. **Build UI.** Create the ScreenGui screens, styled to match the web version.
5. **Upload art.** Export the SVGs to PNG and upload them in Studio's Asset Manager. Record each asset ID.
6. **Test.** Run `rojo serve`, click **Connect** in the Rojo plugin in Studio, then press **Play**.
7. **Publish.** File → Publish to Roblox. This is free.
8. **Monetize.** Set up Game Passes, Developer Products, or Paid Access in the Creator Dashboard.

> To start the build with Claude, open a session on this repo and say:
> **"Start the Roblox port, single-player"** (or multiplayer).

---

## 5. Making money: quick reference

Roblox changes these figures over time. Check the current numbers at <https://create.roblox.com/docs> before planning around them.

| Option | What it is | Zombie Trail idea |
|---|---|---|
| **Game Passes** | One-time permanent unlock | "Armored Van" (uses less fuel), "Extra Survivor" |
| **Developer Products** | Purchases that can be bought again and again | "Emergency Supply Drop" (+20 food), "Revive a Survivor" |
| **Paid Access** | Players pay once to enter (about 25–1,000 Robux) | Possible, but not recommended at launch |
| **Premium Payouts** | Roblox pays you automatically based on time Premium subscribers spend in your game | Automatic. No setup needed |
| **Private Servers** | Players pay monthly for a private server | Mostly useful for multiplayer |

**Cashing out (DevEx):**
- **Who can:** you must be 13 or older with a verified email and ID, and in good standing.
- **Minimum:** **30,000 earned Robux** (Robux you bought yourself don't count).
- **Roblox's cut:** Roblox keeps about **30%** of each sale.
- **Exchange rate:** about **$0.0035–$0.0038 per Robux**.
- **Example:** a 100-Robux Game Pass earns you about 70 Robux, roughly **$0.25**.

**Design tip:** if you plan to sell upgrades, build hooks for them into the game logic from the start (for example, a "fuel use per day" setting that a Game Pass can change).

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-25 | First version of the setup guide |
| 1.1 | 2026-10-25 | Added the Account details section (username `Roadkill_Interactive`) and ticked off account creation |
