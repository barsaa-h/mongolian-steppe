const profiles = await fetch('./cast.json').then(response => { if (!response.ok) throw Error('Cast manifest failed'); return response.json(); });
const byId = new Map(profiles.map(profile => [profile.id, profile]));
const phases = document.getElementById('phase');
const note = document.getElementById('character-note');
const board = document.getElementById('cast-board');
const expression=document.getElementById('expression');
const performance=document.getElementById('performance');
const labels = { healthy:'Before the bite', 'hour-five':'HOUR 5 · fever', turning:'Birthday · turning', unwell:'Hitchhiker · unwell', 'fed-runner':'Fed runner', fed:'Fed / RED', standing:'Burned out / standing', normal:'Normal appearance' };
function setPhase(value) {
  const actor = window.__master.getActor();
  actor.traverse(object => {
    if (!object.isMesh) return;
    if (object.userData.role === 'Story.ForearmBandage') object.visible = String(object.userData.states).split(',').includes(value);
    const skin = object.userData.role === 'Body' || object.userData.role?.startsWith('Hands.');
    if (!skin) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      material.color.setRGB(1, 1, 1);
      material.roughness = .93;
      if (value === 'hour-five' || value === 'unwell') material.color.setRGB(1, .86, .80);
      if (value === 'fed-runner' || value === 'fed') { material.color.setRGB(1, .59, .50); material.roughness = .48; }
      if (value === 'turning') material.color.setRGB(.96, .91, .85);
      if (value === 'standing') material.color.setRGB(.73, .76, .72);
    }
  });
  phases.value = value;
}
document.addEventListener('character-loaded', event => {
  const current = byId.get(event.detail.id);
  phases.replaceChildren(...current.states.map(state => { const option = document.createElement('option'); option.value = state; option.textContent = labels[state]; return option; }));
  phases.disabled = current.states.length === 1;
  note.textContent = `${current.scriptAge === null ? 'Exact age unstated' : `Script age ${current.scriptAge}`} · ${current.casting}. ${current.faceDesign || ''} ${current.ageNote}`;
  for (const button of board.children) button.setAttribute('aria-pressed', String(button.dataset.id === current.id));
  setPhase(current.states[0]);
  expression.value='neutral';performance.setAttribute('aria-pressed','false');
});
expression.addEventListener('change',()=>{window.__master.setExpression(expression.value);performance.setAttribute('aria-pressed','false');});
performance.addEventListener('click',()=>{const active=performance.getAttribute('aria-pressed')!=='true';window.__master.setPerformance(active);performance.setAttribute('aria-pressed',String(active));expression.value='neutral';});
phases.addEventListener('change', () => setPhase(phases.value));
for (const profile of profiles) {
  const button = document.createElement('button');
  button.className = 'cast-card'; button.dataset.id = profile.id; button.setAttribute('aria-pressed', 'false');
  const image = document.createElement('img'); image.src = `./${profile.id}/face.png`; image.alt = `${profile.name} portrait`; image.loading = 'lazy';
  const name = document.createElement('strong'); name.textContent = profile.name;
  const detail = document.createElement('span'); detail.textContent = profile.category === 'background' ? 'Anonymous birthday guest' : profile.scriptAge !== null ? `${profile.scriptAge} · ${profile.wardrobe}` : profile.wardrobe;
  button.append(image, name, detail); button.addEventListener('click', () => { window.__master.select(profile.id); document.querySelector('.stage').scrollIntoView({ behavior: 'smooth', block: 'start' }); }); board.append(button);
}
await import('../character-master/viewer.js?dna=1');
