const $ = id => document.getElementById(id);
const sets = {uppercase:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lowercase:'abcdefghijklmnopqrstuvwxyz',numbers:'0123456789',symbols:'!@#$%^&*()-_=+[]{};:,.?'};
const toggles = Object.keys(sets);
const colors = ['#86c88f','#5fae6f','#a8d5ab','#d4a5c9','#e8b4b8'];
const leafPath = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-7.5-.5-14 2.8-15 9.2-.5 3.1 1.5 5.8 4.7 5.8 6.5 0 10.3-7 10.3-15Z"/><path d="M4 21c2.5-5 6-8 12-11"/></svg>';
// The original React component generates 14 varied leaves; CSS handles the same falling, swaying rotation.
for(let i=0;i<14;i++){
  const el=document.createElement('div'); el.className='leaf';el.innerHTML=leafPath;
  const style=el.style;
  style.setProperty('--left',`${Math.random()*100}%`);
  style.setProperty('--size',`${14+Math.random()*16}px`);
  style.setProperty('--duration',`${9+Math.random()*10}s`);
  style.setProperty('--delay',`${-Math.random()*20}s`);
  style.setProperty('--sway',`${20+Math.random()*40}px`);
  style.setProperty('--rotate',`${Math.random()*360}deg`);
  style.setProperty('--color',colors[i%colors.length]);
  style.setProperty('--opacity',0.3+Math.random()*0.3);
  $('falling-leaves').append(el);
}
function randomIndex(max){
  const range=0x100000000,limit=range-(range%max),array=new Uint32Array(1);
  do{crypto.getRandomValues(array)}while(array[0]>=limit);
  return array[0]%max;
}
function shuffle(array){for(let i=array.length-1;i>0;i--){const j=randomIndex(i+1);[array[i],array[j]]=[array[j],array[i]]}return array}
function selected(){return toggles.filter(id=>$(id).checked)}
function generate(){
  const chosen=selected();if(!chosen.length)return;
  const pool=chosen.map(id=>sets[id]).join('');const length=Number($('length').value);
  const chars=chosen.map(id=>sets[id][randomIndex(sets[id].length)]);
  while(chars.length<length)chars.push(pool[randomIndex(pool.length)]);
  $('password').textContent=shuffle(chars).join('');$('copy-text').textContent='Copy';updateStrength();
}
function updateStrength(){
  const count=selected().length,length=Number($('length').value);
  const bits=length*Math.log2(selected().map(id=>sets[id].length).reduce((a,b)=>a+b,0));
  const score=bits<35?1:bits<55?2:bits<75?3:bits<95?4:5;
  const names=['Very weak','Weak','Fair','Strong','Very strong'];
  $('strength-text').textContent=names[score-1];
  $('meter').style.setProperty('--meter-color',['#d07778','#d49970','#c3a566','#7da57e','#63336d'][score-1]);
  [...$('meter').children].forEach((bar,i)=>bar.classList.toggle('active',i<score));
}
$('generate').addEventListener('click',generate);
$('copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('password').textContent);$('copy-text').textContent='Copied!';setTimeout(()=>$('copy-text').textContent='Copy',1800)}
  catch{const selection=getSelection(),range=document.createRange();range.selectNodeContents($('password'));selection.removeAllRanges();selection.addRange(range);document.execCommand('copy');selection.removeAllRanges();$('copy-text').textContent='Copied!';setTimeout(()=>$('copy-text').textContent='Copy',1800)}
});
$('length').addEventListener('input',()=>{$('length-value').textContent=$('length').value;generate()});
for(const id of toggles)$(id).addEventListener('change',e=>{if(!selected().length){e.target.checked=true;return}generate()});
generate();
