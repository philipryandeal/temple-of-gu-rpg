// Only enabled, explicitly routed scenes can be entered.
const form=document.querySelector('#table-entrance');
const scene=document.querySelector('#scene');
const destinations=Object.freeze({'courtyard-fet':'./courtyard.html','shrine-room':'./shrine.html','botanica':'./botanica.html'});
form.addEventListener('submit',event=>{
 const destination=destinations[scene.value];
 if(!destination){event.preventDefault();return;}
 form.action=new URL(destination,location.href).href;
});
