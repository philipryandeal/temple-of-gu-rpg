// Only enabled, explicitly routed scenes can be entered.
const form=document.querySelector('#table-entrance');
const scene=document.querySelector('#scene');
const destinations=Object.freeze({'courtyard-fet':'./courtyard.html','shrine-room':'./shrine.html','botanica':'./botanica.html','river-crossing':'./scene.html','cemetery-gate':'./scene.html','congo-square':'./scene.html','gran-bwa-forest':'./scene.html','rada-rainbow-bridge':'./scene.html','living-machines-church':'./scene.html','data-forge':'./scene.html','shinto-no-kami-01':'./scene.html','shinto-no-kami-02':'./scene.html','shinto-no-kami-03':'./scene.html','shinto-no-kami-04':'./scene.html','shinto-no-kami-05':'./scene.html','shinto-no-kami-06':'./scene.html','shinto-no-kami-07':'./scene.html','shinto-no-kami-08':'./scene.html','call-of-the-taino-01':'./scene.html','call-of-the-taino-02':'./scene.html','call-of-the-taino-03':'./scene.html','call-of-the-taino-04':'./scene.html','call-of-the-taino-05':'./scene.html','call-of-the-taino-06':'./scene.html','call-of-the-taino-07':'./scene.html','call-of-the-taino-08':'./scene.html'});
form.addEventListener('submit',event=>{
 const destination=destinations[scene.value];
 if(!destination){event.preventDefault();return;}
 form.action=new URL(destination,location.href).href;
});
