/* Read-aloud for the case pages. Plays pre-recorded audio saved with the page (free);
   falls back to ElevenLabs premium when a key is saved, otherwise the free browser voice. */
(function(){
if(window.__wajoTTS)return;window.__wajoTTS=true;
var API='https://api.elevenlabs.io/v1';
var FREE='__browser__';
var LS_KEY='el_reader_key',LS_VOICE='el_tts_voice';
var audio=null,stopped=false,queue=[],qi=0,si=0,cache={},voices=[],freeVoices=[],localCache={};
var style=document.createElement('style');
style.textContent=[
'.tts-bar{position:fixed;right:16px;bottom:16px;z-index:99998;display:flex;align-items:center;gap:8px;background:#13202a;color:#e5ecef;border:1px solid #29343a;border-radius:12px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.35);font:13px -apple-system,system-ui,sans-serif;max-width:calc(100vw - 32px)}',
'.tts-bar button{border:0;border-radius:8px;padding:7px 12px;font:600 13px -apple-system,system-ui,sans-serif;cursor:pointer;background:#4cc2b1;color:#06201c}',
'.tts-bar button.ghost{background:#1b252a;color:#e5ecef;border:1px solid #29343a}',
'.tts-bar select{background:#1b252a;color:#e5ecef;border:1px solid #29343a;border-radius:8px;padding:6px 8px;font:13px -apple-system,system-ui,sans-serif;max-width:150px}',
'.tts-status{color:#a8b4bb;font-size:12px;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.tts-active{outline:3px solid #4cc2b1 !important;outline-offset:3px;border-radius:4px;transition:outline-color .2s}',
'.tts-keybox{position:fixed;right:16px;bottom:70px;z-index:99998;background:#13202a;color:#e5ecef;border:1px solid #29343a;border-radius:12px;padding:12px;width:300px;box-shadow:0 6px 24px rgba(0,0,0,.35);font:13px -apple-system,system-ui,sans-serif}',
'.tts-keybox input{width:100%;box-sizing:border-box;margin:8px 0;padding:8px;border-radius:8px;border:1px solid #29343a;background:#1b252a;color:#e5ecef;font-size:13px}',
'.tts-keybox p{margin:0 0 6px;color:#a8b4bb;font-size:12px}',
'.tts-keybox button{border:0;border-radius:8px;padding:7px 12px;cursor:pointer;background:#4cc2b1;color:#06201c;font-weight:600}'
].join('');
document.head.appendChild(style);
function bar(){
 var b=document.createElement('div');b.className='tts-bar';b.id='tts-bar';
 b.innerHTML='<button id="tts-play" title="Reads your selection, or the whole case">▶ Read</button>'+
 '<button id="tts-stop" class="ghost" title="Stop">■</button>'+
 '<select id="tts-voice" title="Voice"><option>Loading voices…</option></select>'+
 '<span class="tts-status" id="tts-status"></span>';
 document.body.appendChild(b);
 document.getElementById('tts-play').addEventListener('click',toggle);
 document.getElementById('tts-stop').addEventListener('click',stopAll);
 var v=document.getElementById('tts-voice');
 v.addEventListener('change',function(){try{localStorage.setItem(LS_VOICE,v.value)}catch(e){}});
 return b;
}
function key(){try{return localStorage.getItem(LS_KEY)||''}catch(e){return ''}}
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
 function Utf8Encode(string){var utftext='',n,c;for(n=0;n<string.length;n++){c=string.charCodeAt(n);if(c<128)utftext+=String.fromCharCode(c);else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128)}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128)}}return utftext}
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
function collectBlocks(){
 var seen=[],out=[];
 document.querySelectorAll('p,li,h1,h2,h3,h4,h5,blockquote,figcaption').forEach(function(el){
  if(el.closest('#tts-bar,.tts-keybox,#chat-panel,#chat-fab'))return;
  if(el.closest('nav,header,footer,button'))return;
  if(!el.offsetParent)return;
  var t=(el.innerText||'').trim();
  if(t.length<2)return;
  if(seen.indexOf(el.parentElement)>=0)return;
  seen.push(el);out.push(el);
 });
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
function buildQueue(){
 var sel=(window.getSelection?window.getSelection().toString():'')||'';
 var q=[];
 if(sel.trim().length>10){
  q=chunk(sel.trim()).map(function(t){return{t:t,el:null,chunks:null}});
  return {q:q,whole:false};
 }
 collectBlocks().forEach(function(el){
  var t=(el.innerText||'').trim();
  q.push({t:t,el:el,chunks:chunk(t)});
 });
 return {q:q,whole:true};
}
function fetchAudio(text,cb){
 if(cache[text]){cb(null,cache[text]);return}
 fetch(API+'/text-to-speech/'+getVoice()+'?output_format=mp3_44100_128',{
  method:'POST',
  headers:{'xi-api-key':key(),'Content-Type':'application/json'},
  body:JSON.stringify({text:text,model_id:'eleven_turbo_v2_5'})
 }).then(function(r){
  if(!r.ok){return r.text().then(function(e){cb('TTS error '+r.status+': '+e.slice(0,120))})}
  return r.blob().then(function(b){cache[text]=b;cb(null,b)});
 }).catch(function(e){cb('Network error: '+e.message)});
}
function getVoice(){var v=document.getElementById('tts-voice');return v&&v.value?v.value:(function(){try{return localStorage.getItem(LS_VOICE)||''}catch(e){return ''}})()}
function isFree(){return getVoice()===FREE||(!key()&&!(function(){try{return localStorage.getItem(LS_VOICE)}catch(e){return null}})())}
function speakFree(text,el,done){
 var u=new SpeechSynthesisUtterance(text);
 u.rate=rate();
 var pick=freeVoices.filter(function(v){return v.name==='Samantha'})[0]||freeVoices[0];
 if(pick)u.voice=pick;
 u.onend=done;u.onerror=done;
 speechSynthesis.speak(u);
}
function playBlob(blob,done){
 if(audio)audio.pause();
 audio=new Audio(URL.createObjectURL(blob));
 audio.onended=done;
 audio.play().catch(function(){status('Press play again')});
}
function playChunks(item,done){
 var chunks=item.chunks||[item.t];
 function step(){
  if(stopped||si>=chunks.length){done();return}
  speakFree(chunks[si],item.el,function(){
   if(stopped)return;
   si++;step();
  });
 }
 step();
}
function playNext(){
 if(stopped)return;
 if(qi>=queue.length){status('Done');clearHi();return}
 var item=queue[qi];
 if(item.el){item.el.classList.add('tts-active');item.el.scrollIntoView({block:'center',behavior:'smooth'})}
 status('Reading '+(qi+1)+'/'+queue.length);
 if(item.el){
  fetchLocal(item.t,function(blob){
   if(stopped)return;
   if(blob){playBlob(blob,function(){if(item.el)item.el.classList.remove('tts-active');qi++;si=0;playNext()})}
   else{playChunks(item,function(){if(item.el)item.el.classList.remove('tts-active');qi++;si=0;playNext()})}
   if(queue[qi+1])fetchLocal(queue[qi+1].t,function(){});
  });
 }else{
  playChunks(item,function(){qi++;si=0;playNext()});
 }
}
function clearHi(){document.querySelectorAll('.tts-active').forEach(function(e){e.classList.remove('tts-active')})}
function stopAll(){
 stopped=true;queue=[];qi=0;si=0;
 try{speechSynthesis.cancel()}catch(e){}
 if(audio){audio.pause();audio=null}
 clearHi();status('');
 var p=document.getElementById('tts-play');if(p)p.textContent='▶ Read';
}
function toggle(){
 var p=document.getElementById('tts-play');
 if(audio&&!audio.paused){audio.pause();p.textContent='▶ Paused';status('Paused');return}
 if(audio&&audio.paused&&queue.length){audio.play();p.textContent='❚❚';return}
 try{
  if(isFree()&&speechSynthesis.speaking){speechSynthesis.pause();p.textContent='▶ Paused';status('Paused');return}
  if(isFree()&&speechSynthesis.paused){speechSynthesis.resume();p.textContent='❚❚';return}
 }catch(e){}
 stopped=false;cache={};si=0;
 var b=buildQueue();
 if(!b.q.length){status('Nothing to read');return}
 if(isFree()){status(b.whole?'Whole case, saved voices':'Reading your selection')}
 else if(b.whole){var n=b.q.reduce(function(a,c){return a+c.t.length},0);status('Whole case… starting')}
 else{status('Reading your selection')}
 queue=b.q;qi=0;p.textContent='❚❚';
 playNext();
}
function loadVoices(){
 var sel=document.getElementById('tts-voice');
 freeVoices=[];
 try{freeVoices=speechSynthesis.getVoices().filter(function(v){return /^en/i.test(v.lang)})||[]}catch(e){}
 sel.innerHTML='<option value="'+FREE+'">Saved voices (free)</option>';
 sel.value=FREE;
 try{localStorage.setItem(LS_VOICE,FREE)}catch(e){}
}
try{speechSynthesis.onvoiceschanged=function(){loadVoices()}}catch(e){}
bar();loadVoices();
})();
