# Glance Eye Strong

## Overview of Game

Glance Eye Strong is a quick-reaction visual training game built for Reddit using Devvit Web. Each round sends an emoji sliding past a narrow opening in the curtains, giving the player only a brief glance at the item. The goal is to identify the emoji before it disappears.

The game is organized into emoji-themed levels. Each level contains three possible answers, and the challenge increases during play as rounds become faster and the visible gap becomes smaller.

## How to Play

1. Open the game and choose **Pick a Level**.
2. Select an unlocked level from the level list.
3. Watch the window carefully as an emoji passes by.
4. Press or tap the matching emoji button before the round ends.
5. Use keyboard shortcuts `1`, `2`, and `3` as an alternative to clicking the answer buttons.
6. Keep answering for the full level duration to build the highest score possible.

Levels unlock progressively. Level 1 is available immediately, and each later level unlocks after the previous level has a recorded score.

## What Data Is Persisted on Server

The server persists each Reddit user's best scores by level in Redis.

- Scores are stored under a username-scoped key: `scores:{username}`.
- The saved value is a JSON array of non-negative integer scores.
- Scores are loaded from `/api/init` when the app starts.
- Scores are saved to `/api/scores` when a level ends.
- The app keeps the highest score reached for each level rather than replacing it with a lower result.

The server also reads the current Reddit post ID and username from the Devvit context. If Reddit does not provide a username, the app falls back to `anonymous`.

## How User Engagement Is Achieved

Glance Eye Strong is designed around short, repeatable challenge loops that work well in Reddit's feed experience.

- **Fast onboarding**: the splash screen explains the core loop in three simple steps.
- **Progression**: locked levels encourage players to keep improving so they can reveal more emoji sets.
- **Personal bests**: saved level scores give players a reason to replay and beat their own records.
- **Increasing difficulty**: speed increases and the visible gap shrinks as a level continues.
- **Immediate feedback**: correct, wrong, and missed answers are reflected visually so players understand each result quickly.
- **Accessible controls**: players can answer by tapping/clicking or by using `1`, `2`, and `3` on a keyboard.
