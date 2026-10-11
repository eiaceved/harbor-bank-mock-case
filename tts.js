/* Read-aloud for the case pages. Everything (whole case, your selection, each step's
   Listen button) runs through one queue of pre-recorded audio saved with the page.
   Drag the bar to jump anywhere; the free browser voice fills any gap. */
(function(){
if(window.__wajoTTS)return;window.__wajoTTS=true;
var audio=null,playing=false,armed=false,gen=0,queue=[],qi=0,si=0,dragWasPlaying=false,curBtn=null,localCache={},freeVoices=[];
var style=document.createElement('style');
style.textContent=[
'.tts-bar{position:fixed;right:16px;bottom:16px;z-index:99998;display:flex;align-items:center;gap:8px;background:#13202a;color:#e5ecef;border:1px solid #29343a;border-radius:12px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.35);font:13px -apple-system,system-ui,sans-serif;max-width:calc(100vw - 32px)}',
'.tts-bar button{border:0;border-radius:8px;padding:7px 12px;font:600 13px -apple-system,system-ui,sans-serif;cursor:pointer;background:#4cc2b1;color:#06201c}',
'.tts-bar button.ghost{background:#1b252a;color:#e5ecef;border:1px solid #29343a}',
'.tts-bar input[type=range]{width:min(300px,38vw);accent-color:#4cc2b1;margin:0;padding:0;cursor:pointer}',
'.tts-status{color:#a8b4bb;font-size:12px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.tts-active{outline:3px solid #4cc2b1 !important;outline-offset:3px;border-radius:4px;transition:outline-color .2s}'
].join('');
document.head.appendChild(style);
function bar(){
 var b=document.createElement('div');b.className='tts-bar';b.id='tts-bar';
 b.innerHTML='<button id="tts-play" title="Reads your selection, or the whole case. After a stop or a drag, resumes from the bar.">\u25b6 Read</button>'+
 '<button id="tts-stop" class="ghost" title="Stop">\u25a0</button>'+
 '<input id="tts-pos" type="range" min="0" max="0" value="0" step="1" title="Drag to jump anywhere in the read-aloud">'+
 '<span class="tts-status" id="tts-status"></span>';
 document.body.appendChild(b);
 document.getElementById('tts-play').addEventListener('click',toggle);
 document.getElementById('tts-stop').addEventListener('click',stopAll);
 var s=document.getElementById('tts-pos');
 s.addEventListener('pointerdown',function(){dragWasPlaying=playing;if(playing)hardStop();});
 s.addEventListener('input',onDrag);
 s.addEventListener('change',onDrop);
 return b;
}
function status(s){var el=document.getElementById('tts-status');if(el)el.textContent=s||''}
function rate(){
 var r=document.getElementById('rate');
 var n=r?parseFloat(r.value):1;
 return (n&&n>0.4&&n<2)?n:1;
}
/* sha1 (public-domain webtoolkit implementation, verified against test vectors) */
function sha1(str){
 var rotate_left=function(n,s){var t4=(n<<s)|(n>>>(32-s));return t4};
 var cvt_hex=function(val){var s='',i,v;for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;s+=v.toString(16)}return s};
 function Utf8Encode(string){var utftext='',n,c;for(n=0;n<string.length;n++){c=string.charCodeAt(n);if(c<128)utftext+=String.fromCharCode(c);else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128)}else{utftext+=String.fromCharCode(((c>>12)&224)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128)}}return utftext}
 var blockstart,i,j,W=new Array(80),H0=0x67452301,H1=0xEFCDAB89,H2=0x98BADCFE,H3=0x10325476,H4=0xC3D2E1F0,A,B,C,D,E,temp;
 str=Utf8Encode(str);
 var msg_len=str.length;
 var number_of_blocks=((msg_len+8)>>6)+1;
 var total_len=number_of_blocks*16;
 var words=new Array(total_len);
 for(var m=0;m<total_len;m++)words[m]=0;
 for(i=0;i<msg_len;i++){words[i>>2]|=str.charCodeAt(i)<<(24-(i%4)*8)}
 words[msg_len>>2]|=0x80<<(24-(msg_len%4)*8);
 words[total_len-1]=msg_len*8;
 for(j=0;j<number_of_blocks;j++){
  blockstart=j*16;
  for(i=0;i<16;i++)W[i]=words[blockstart+i];
  for(i=16;i<80;i++)W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
  A=H0;B=H1;C=H2;D=H3;E=H4;
  for(i=0;i<20;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp}
  for(i=20;i<40;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp}
  for(i=40;i<60;i++){temp=(rotate_left(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp}
  for(i=60;i<80;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp}
  H0=(H0+A)&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;H4=(H4+E)&0x0ffffffff;
 }
 return cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(H3)+cvt_hex(H4);
}
function textKey(t){return t.replace(/\s+/g,' ').trim().slice(0,100)}
function localURL(t){return 'audio/'+sha1(textKey(t))+'.mp3'}
function fetchLocal(t,cb){
 var u=localURL(t);
 if(localCache[u]!==undefined){cb(localCache[u]);return}
 fetch(u).then(function(r){
  if(!r.ok){localCache[u]=null;cb(null);return}
  return r.blob().then(function(b){localCache[u]=b;cb(b)});
 }).catch(function(){localCache[u]=null;cb(null)});
}
function hasUp(el){
 var n=el;
 while(n&&n.nodeType===1){
  var cs=window.getComputedStyle?getComputedStyle(n):null;
  if(cs&&cs.textTransform==='uppercase')return true;
  n=n.parentElement;
 }
 return false;
}
function collectIn(root,cb){
 root.querySelectorAll('p,li,h1,h2,h3,h4,h5,blockquote,figcaption,th').forEach(function(el){
  if(el.closest('#tts-bar,.tts-keybox,#chat-panel,#chat-fab'))return;
  if(el.closest('nav,header,footer,button'))return;
  if(!el.offsetParent)return;
  if(el.querySelector('p,li,h1,h2,h3,h4,h5,blockquote,figcaption,th'))return;
  var t=(el.innerText||'').trim();
  if(t.length<2)return;
  cb(hasUp(el)?t.toUpperCase():t,el);
 });
}
function collectBlocks(){
 var out=[];
 collectIn(document,function(t,el){out.push({t:t,el:el,chunks:chunk(t)})});
 return out;
}
function sectionBlocks(root){
 var out=[];
 collectIn(root,function(t,el){out.push({t:t,el:el,chunks:chunk(t)})});
 if(!out.length){
  root.querySelectorAll('[data-say]').forEach(function(el){
   if(el.parentElement&&el.parentElement.closest('[data-say]'))return;
   var t=(el.getAttribute('data-say')||el.innerText||'').replace(/\s+/g,' ').trim();
   if(t)out.push({t:t,el:el,chunks:chunk(t)});
  });
 }
 return out;
}
function chunk(text){
 var parts=text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g)||[text];
 var out=[],cur='';
 parts.forEach(function(s){
  if((cur+s).length>380&&cur){out.push(cur.trim());cur=''}
  cur+=s;
 });
 if(cur.trim())out.push(cur.trim());
 return out;
}
function speakFree(text,el,done){
 var u=new SpeechSynthesisUtterance(text);
 u.rate=rate();
 var pick=freeVoices.filter(function(v){return v.name==='Samantha'})[0]||freeVoices[0];
 if(pick)u.voice=pick;
 u.onend=done;u.onerror=done;
 speechSynthesis.speak(u);
}
function playBlob(blob,done){
 if(audio){audio.onended=null;audio.pause()}
 audio=new Audio(URL.createObjectURL(blob));
 audio.onended=done;
 audio.play().catch(function(){status('Press play again')});
}
function playChunks(item,done){
 var chunks=item.chunks||[item.t];
 function step(){
  if(!playing||si>=chunks.length){done();return}
  speakFree(chunks[si],item.el,function(){
   if(!playing)return;
   si++;step();
  });
 }
 step();
}
function playNext(){
 if(!playing)return;
 syncPos();
 if(qi>=queue.length){finish();return}
 var g=gen,item=queue[qi];
 if(item.el){item.el.classList.add('tts-active');item.el.scrollIntoView({block:'center',behavior:'smooth'})}
 status('Reading '+(qi+1)+' / '+queue.length);
 var advance=function(){
  if(gen!==g)return;
  if(item.el)item.el.classList.remove('tts-active');
  qi++;si=0;playNext();
 };
 if(item.el){
  fetchLocal(item.t,function(blob){
   if(gen!==g)return;
   if(blob)playBlob(blob,advance);
   else playChunks(item,advance);
   if(queue[qi+1])fetchLocal(queue[qi+1].t,function(){});
  });
 }else{
  playChunks(item,advance);
 }
}
function clearHi(){document.querySelectorAll('.tts-active').forEach(function(e){e.classList.remove('tts-active')})}
function syncPos(){
 var s=document.getElementById('tts-pos');if(!s)return;
 s.max=Math.max(0,queue.length-1);s.value=qi;
}
function setBtn(btn){
 if(curBtn&&curBtn!==btn&&curBtn.dataset.label)curBtn.textContent=curBtn.dataset.label;
 if(btn){btn.dataset.label=btn.dataset.label||btn.textContent;btn.textContent='Stop'}
 curBtn=btn;
 var p=document.getElementById('tts-play');
 if(p)p.textContent=playing?'\u275a\u275a':'\u25b6 Read';
}
function pauseAll(){
 playing=false;gen++;
 try{speechSynthesis.cancel()}catch(e){}
 if(audio){audio.onended=null;audio.pause()}
}
function hardStop(){pauseAll();clearHi()}
function stopAll(){
 pauseAll();playing=false;stopped=true;
 armed=queue.length>0&&qi<queue.length;
 clearHi();setBtn(null);
 status(armed?('Stopped at '+(qi+1)+' / '+queue.length+'. Drag the bar, then Read.'):'');
}
function finish(){
 playing=false;armed=false;setBtn(null);clearHi();
 status('Done. Read starts from the top.');
}
function toggle(){
 var p=document.getElementById('tts-play');
 if(playing){pauseAll();playing=false;stopped=true;p.textContent='\u25b6 Paused';status('Paused at '+(qi+1)+' / '+queue.length);return}
 if(queue.length&&stopped&&qi<queue.length){stopped=false;playing=true;p.textContent='\u275a\u275a';playNext();return}
 var sel=(window.getSelection?window.getSelection().toString():'')||'';
 stopped=false;playing=true;armed=false;
 if(sel.trim().length>10){
  queue=chunk(sel.trim()).map(function(t){return{t:t,el:null,chunks:chunk(t)}});
 }else{
  queue=collectBlocks();
 }
 qi=0;si=0;
 if(!queue.length){playing=false;status('Nothing to read');return}
 setBtn(null);p.textContent='\u275a\u275a';
 playNext();
}
function onDrag(){
 ensureQueue();
 var v=+document.getElementById('tts-pos').value;
 qi=v;si=0;armed=true;
 clearHi();
 var it=queue[v];
 if(it&&it.el){it.el.classList.add('tts-active');it.el.scrollIntoView({block:'center',behavior:'smooth'})}
 status('Jump to '+(v+1)+' / '+queue.length);
}
function onDrop(){
 if(dragWasPlaying&&queue.length){stopped=false;playing=true;armed=false;document.getElementById('tts-play').textContent='\u275a\u275a';playNext()}
 else status('Ready at '+(qi+1)+' / '+queue.length+'.');
 dragWasPlaying=false;
}
function ensureQueue(){
 if(queue.length)return;
 queue=collectBlocks();qi=0;si=0;stopped=true;
 syncPos();
}
/* Per-step Listen buttons: route through the same recordings instead of the page's old built-in voice. */
document.addEventListener('click',function(e){
 if(!window.speechSynthesis)return;
 var b=e.target&&e.target.closest?e.target.closest('.listen,.qlisten'):null;
 if(!b)return;
 e.preventDefault();e.stopPropagation();
 if(curBtn===b&&playing){stopAll();return}
 pauseAll();playing=false;stopped=true;
 var root=b.closest('.mc')||b.closest('section')||document;
 queue=sectionBlocks(root);
 if(!queue.length){status('Nothing to read here');return}
 qi=0;si=0;armed=false;playing=true;
 setBtn(b);
 syncPos();playNext();
},true);
function loadVoices(){
 freeVoices=[];
 try{freeVoices=speechSynthesis.getVoices().filter(function(v){return /^en/i.test(v.lang)})||[]}catch(e){}
}
try{speechSynthesis.onvoiceschanged=function(){loadVoices()}}catch(e){}
bar();loadVoices();
})();
