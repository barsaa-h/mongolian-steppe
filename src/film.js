import { createFilmPlayer } from "./scenePlayer.js";
import { getScene } from "./scenes.js";

// The film page hosts any registered scene; the 30-second Episode 1 excerpt
// remains the default. /film.html?scene=kit-preview previews staging kits.
const sceneId = new URLSearchParams(location.search).get("scene") || "hour-five";

createFilmPlayer({
  canvas: document.getElementById("film"),
  sceneModule: getScene(sceneId),
  renderMode: new URLSearchParams(location.search).has("render"),
}).catch(error => {
  console.error(error);
  document.getElementById("status").textContent = "Could not load the film. Reload to try again.";
});
