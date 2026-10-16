const pane=document.querySelector('#kore-chat');
if (pane) {
 const log=pane.querySelector('#kore-messages');
 const form=pane.querySelector('#kore-form');
 const field=pane.querySelector('#kore-input');
 const send=pane.querySelector('#kore-send');
 const status=pane.querySelector('#kore-status');
 const history=[];
 function show(role,message){const p=document.createElement('p');const who=document.createElement('strong');who.textContent=role+': ';p.append(who,document.createTextNode(message));log.append(p);log.scrollTop=log.scrollHeight;}
 show('Kore','Welcome, Seeker. Would you like to choose a name, explore the six Lineages, or learn the four Virtues?');
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const message=field.value.trim();
  if(!message||message.length>700||send.disabled)return;
  field.value='';show('You',message);send.disabled=true;status.textContent='Kore is considering your question…';
  const next=[...history,{role:'user',content:message}].slice(-10);
  try {
   const res=await fetch('/api/kore',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:next})});
   const data=await res.json();
   if(!res.ok){show('System',data.error||'The Bridge is not open yet.');return;}
   if(typeof data.reply!=='string')throw new Error('Invalid Guide reply');
   show('Kore',data.reply);history.splice(0,history.length,...next,{role:'assistant',content:data.reply});
   if(history.length>10)history.splice(0,history.length-10);
  }catch{show('System','The Guide is unavailable right now. Try again later.');}
  finally{send.disabled=false;status.textContent='';field.focus();}
 });
}
