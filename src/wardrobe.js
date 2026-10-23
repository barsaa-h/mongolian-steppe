export const GARMENTS = [
  { id: "classic-deel", name: "Classic deel", hem: 0.46, flare: 0.23, sleeves: true, collar: true },
  { id: "riding-deel", name: "Riding deel", hem: 0.54, flare: 0.24, sleeves: true, collar: true, split: true },
  { id: "winter-deel", name: "Winter deel", hem: 0.4, flare: 0.25, sleeves: true, collar: true, fur: true, padded: true },
  { id: "summer-deel", name: "Summer deel", hem: 0.52, flare: 0.215, sleeves: true, collar: false, light: true },
  { id: "ceremonial-deel", name: "Ceremonial deel", hem: 0.4, flare: 0.245, sleeves: true, collar: true, ornament: true },
  { id: "work-jacket", name: "Work jacket", hem: 0.72, flare: 0.18, sleeves: true, collar: true, jacket: true, pockets: true },
  { id: "quilted-jacket", name: "Quilted jacket", hem: 0.67, flare: 0.2, sleeves: true, collar: true, jacket: true, padded: true },
  { id: "waistcoat", name: "Wool waistcoat", hem: 0.74, flare: 0.18, sleeves: false, collar: false, jacket: true, pockets: true },
  { id: "long-coat", name: "Travel coat", hem: 0.43, flare: 0.24, sleeves: true, collar: true, jacket: true, split: true },
  { id: "herder-robe", name: "Herder robe", hem: 0.37, flare: 0.245, sleeves: true, collar: true, split: true, fur: true },
];

export const PALETTES = [
  { id: "indigo", name: "Indigo & brass", cloth: 0x284675, trim: 0xc6a15e, trousers: 0x333847, leather: 0x30251f, hat: 0x7b302f },
  { id: "teal", name: "Petrol & ochre", cloth: 0x2c6568, trim: 0xd1aa64, trousers: 0x363a3a, leather: 0x382b23, hat: 0x344844 },
  { id: "oxblood", name: "Oxblood & antique gold", cloth: 0x763c43, trim: 0xc7a162, trousers: 0x36303a, leather: 0x2c2425, hat: 0x493a50 },
  { id: "umber", name: "Walnut & cream", cloth: 0x685047, trim: 0xd6c4a0, trousers: 0x3d3831, leather: 0x35241c, hat: 0x58442e },
  { id: "sage", name: "Sage & rust", cloth: 0x65735e, trim: 0xb6754b, trousers: 0x393f37, leather: 0x48322a, hat: 0x664437 },
  { id: "oat", name: "Oat & tobacco", cloth: 0xbcb097, trim: 0x77513a, trousers: 0x535044, leather: 0x423026, hat: 0x775143 },
  { id: "charcoal", name: "Charcoal & silver", cloth: 0x424851, trim: 0xadb0a8, trousers: 0x30343b, leather: 0x25272c, hat: 0x464c58 },
  { id: "plum", name: "Plum & copper", cloth: 0x60506d, trim: 0xc18a62, trousers: 0x3c3848, leather: 0x372b2c, hat: 0x50384b },
];

export const HEADWEAR = [
  { id: "pointed", name: "Pointed hat" },
  { id: "felt", name: "Felt cap" },
  { id: "fur", name: "Winter cap" },
  { id: "none", name: "Bare head" },
];

export const OUTFITS = GARMENTS.flatMap((garment) => PALETTES.flatMap((palette) =>
  HEADWEAR.map((headwear) => ({
    id: `${garment.id}/${palette.id}/${headwear.id}`,
    garment: garment.id,
    palette: palette.id,
    headwear: headwear.id,
    name: `${garment.name} · ${palette.name} · ${headwear.name}`,
  }))));

const byId = new Map(OUTFITS.map((outfit) => [outfit.id, outfit]));
export const DEFAULT_OUTFIT = OUTFITS[0].id;

export function getOutfit(id = DEFAULT_OUTFIT) {
  const outfit = byId.get(id);
  if (!outfit) throw new Error(`Unknown outfit: ${id}`);
  return outfit;
}
