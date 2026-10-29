import roster from '../assets/cast/roster.json' with { type: 'json' };
import published from '../assets/cast/dna/manifest.json' with { type: 'json' };

export const CAST = roster;
// DNA characters published by artifacts/episode-1-cast/scripts/publish_cast.py (id -> entry).
export const DNA_CAST = published;

export function getCastMember(id) {
  const member = CAST.find(member => member.id === id || member.aliases.includes(id));
  if (member) return member;
  // Roles that exist only in the DNA cast (v4.0 pilot additions and background people).
  const entry = DNA_CAST[id];
  if (!entry) throw new Error(`Unknown cast member: ${id}`);
  return {
    id, name: entry.name, aliases: [], kind: entry.kind, episodes: entry.episodes, outfit: entry.wardrobe,
    age: entry.age, height: entry.heightM, relationships: [], behavior: entry.traits.join(' · '),
  };
}
