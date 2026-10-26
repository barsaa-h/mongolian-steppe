export const DURATION = 30;

export const SHOTS = [
  { id: "valley", start: 0, end: 1.6, lens: 48 },
  { id: "wrist", start: 1.6, end: 3, lens: 40 },
  { id: "tracking", start: 3, end: 6, lens: 44 },
  { id: "ganaa", start: 6, end: 13, lens: 46 },
  { id: "crossing", start: 13, end: 16, lens: 48 },
  { id: "sheep", start: 16, end: 17.6, lens: 42 },
  { id: "hunger", start: 17.6, end: 21, lens: 42 },
  { id: "resolve", start: 21, end: 28, lens: 42 },
  { id: "home", start: 28, end: 30, lens: 48 },
];

// Exact dialogue excerpts from the approved master, Episode 1, HOUR 5.
export const CUES = [
  { start: 3.1, end: 6.5, speaker: "РАДИО · МЭДЭЭНИЙ ХЭСЭГ", text: "Улирлын томуугийн шинж тэмдэг… Иргэд та бүхэн тайван байгаарай." },
  { start: 6.7, end: 9.8, speaker: "ГАНАА", text: "Томуу гэнэ ээ? Хүрэлийг тэр чинь хазаад..." },
  { start: 9.8, end: 12.9, speaker: "ГАНАА", text: "идчихсэн шүү дээ. Ямар алных нь томуу вэ..." },
  { start: 17, end: 20.9, speaker: "ГАНАА", text: "...Хонь... Мах нь... Ямар зөөлөн харагдаж байна аа..." },
  { start: 21.4, end: 23.8, speaker: "ГАНАА", text: "Боль, Ганаа! Боль!" },
  { start: 24, end: 27.8, speaker: "ГАНАА", text: "...Алтан хүлээж байгаа. Алтан." },
];

export function filmState(seconds) {
  if (!Number.isFinite(seconds)) throw new Error("Film time must be finite");
  const time = Math.max(0, Math.min(DURATION, seconds));
  let truckU;
  if (time < 12) truckU = 0.17 + time * 0.025;
  else if (time < 15) {
    const u = (time - 12) / 3;
    truckU = 0.47 + 0.075 * (u - u * u / 2);
  } else if (time < 28) truckU = 0.5075;
  else {
    const t = time - 28;
    truckU = 0.5075 + 0.025 * (t - 1 + Math.exp(-t));
  }
  const shot = SHOTS.find(shot => time >= shot.start && time < shot.end) || SHOTS.at(-1);
  return {
    time, truckU, shot,
    shotProgress: (time - shot.start) / (shot.end - shot.start),
    subtitle: CUES.find(cue => time >= cue.start && time < cue.end) || null,
    fade: time < 0.7 ? 1 - time / 0.7 : Math.max(0, Math.min(1, (time - 28.3) / 1.2)),
  };
}
