// Only enabled, explicitly routed scenes can be entered.
const form=document.querySelector('#table-entrance');
const scene=document.querySelector('#scene');
const destinations=Object.freeze({'courtyard-fet':'./courtyard.html','shrine-room':'./shrine.html','botanica':'./botanica.html','river-crossing':'./scene.html','cemetery-gate':'./scene.html','congo-square':'./scene.html','gran-bwa-forest':'./scene.html','rada-rainbow-bridge':'./scene.html','living-machines-church':'./scene.html','data-forge':'./scene.html'});
form.addEventListener('submit',event=>{
 const destination=destinations[scene.value];
 if(!destination){event.preventDefault();return;}
 form.action=new URL(destination,location.href).href;
});
