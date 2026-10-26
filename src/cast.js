import roster from '../assets/cast/roster.json' with { type: 'json' };

export const CAST = roster;

export function getCastMember(id) {
  const member = CAST.find(member => member.id === id || member.aliases.includes(id));
  if (!member) throw new Error(`Unknown cast member: ${id}`);
  return member;
}
