export const levelsDuration = 80; // secs

export const maxSpeed = 1000; // px per second
export const startSpeed = 200; // px per second
export const accelerationPerRound = 25; // px per second

export const minGap = 10; // px
export const startGap = 100; // px
export const accelerateGapReduce = 5; // px

export const puzzles = [
  '🙈,🙉,🙊',
  '😜,😂,😉',
  '😳,😱,😭',
  '🔴,🟢,🔵',
  '💀,👻,👽',
  '🎅,👿,👾',
  '✊,✋,✌️',
  '🚶,🏃,🏂',
  '🐭,🐱,🐶',
  '🐰,🐷,🐮',
  '🐤,🐔,🐧',
  '🐠,🐙,🐳',
  '🐜,🐝,🐞',
  '🍓,🍒,🍎',
  '🍇,🍅,🍉',
  '🍌,🍊,🍈',
  '🍔,🍟,🍕',
  '🚕,🚌,🚃',
  '🚲,🚙,🚚',
  '⚽,🏀,🏈',
  '🎲,🔮,🎱',
  '👕,👗,👚',
  '👠,👞,👟',
  '📷,🎥,📺',
  '🕛,🕒,🕖',
  '🔐,🔒,🔓',
  '🟦,🔵,🔷',
].map((i) => i.split(','));

export const genRand = mulberry32(730965763097);

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
