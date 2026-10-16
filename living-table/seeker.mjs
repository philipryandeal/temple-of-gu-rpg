// Validation rules derived from the published Second Edition, Books One and Two.
// This intentionally validates only fields confirmed in the published handbook.
export const LINEAGES = Object.freeze(['taino','yoruba','congo','indo-european','shinto','hindu']);
export const VIRTUES = Object.freeze(['suuru','oye','foriti','iwa']);
export function validateSeeker(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {ok:false,errors:['Character must be an object']};
  const errors=[];
  if (typeof value.name!=='string'||value.name.trim().length<1||value.name.length>80) errors.push('Name required (maximum 80 characters)');
  if (!LINEAGES.includes(value.lineage)) errors.push('Select a published Lineage');
  const scores=value.virtues;
  if (!scores || typeof scores!=='object' || Array.isArray(scores) || !VIRTUES.every(k=>Object.hasOwn(scores,k)&&Number.isInteger(scores[k]))) errors.push('Four Virtue modifiers required');
  else if ([...VIRTUES.map(k=>scores[k])].sort((a,b)=>a-b).join(',')!=='0,1,1,2') errors.push('Starting modifiers must be +2, +1, +1, +0');
  return {ok:errors.length===0,errors};
}
