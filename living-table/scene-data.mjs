// Reject missing or unknown scenes rather than showing another game's board.
import {SCENES} from './scene-registry.mjs';
export {SEEKERS} from './courtyard-data.mjs';
const id=new URLSearchParams(location.search).get('scene');
export const SCENE=SCENES[id];
if(!SCENE)throw new Error('Unknown scene. Select one from the tabletop entrance.');
export const ZONES=SCENE.zones;
export const OBJECTS=SCENE.objects;
export const SOLO_CHOICES=SCENE.choices;
