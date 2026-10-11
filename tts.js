/* Read-aloud for the case pages. ElevenLabs TTS, key stays in your browser. */
(function(){
if(window.__wajoTTS)return;window.__wajoTTS=true;
var API='https://api.elevenlabs.io/v1';
var LS_KEY='el_reader_key',LS_VOICE='el_tts_voice';
var audio=null,stopped=false,queue=[],qi=0,cache={},voices=[],preflight=null;
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
  q=chunk(sel.trim()).map(function(t){return{t:t,el:null}});
  return {q:q,whole:false};
 }
 collectBlocks().forEach(function(el){
  chunk((el.innerText||'').trim()).forEach(function(t){q.push({t:t,el:el})});
 });
 return {q:q,whole:true};
}
function fetchAudio(text,cb){
 if(cache[text])return cb(null,cache[text]);
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
function playNext(){
 if(stopped)return;
 if(qi>=queue.length){status('Done');clearHi();return}
 var item=queue[qi];
 if(item.el){item.el.classList.add('tts-active');item.el.scrollIntoView({block:'center',behavior:'smooth'})}
 status('Reading '+(qi+1)+'/'+queue.length);
 fetchAudio(item.t,function(err,blob){
  if(err){status(err);return}
  if(stopped)return;
  if(audio)audio.pause();
  audio=new Audio(URL.createObjectURL(blob));
  audio.onended=function(){
   if(item.el)item.el.classList.remove('tts-active');
   qi++;playNext();
  };
  audio.play().catch(function(){status('Press play again')});
  if(queue[qi+1])fetchAudio(queue[qi+1].t,function(){});
 });
}
function clearHi(){document.querySelectorAll('.tts-active').forEach(function(e){e.classList.remove('tts-active')})}
function stopAll(){stopped=true;queue=[];qi=0;if(audio){audio.pause();audio=null}clearHi();status('');var p=document.getElementById('tts-play');if(p)p.textContent='▶ Read'}
function toggle(){
 var p=document.getElementById('tts-play');
 if(!key()){askKey();return}
 if(audio&&!audio.paused){audio.pause();p.textContent='▶ Paused';status('Paused');return}
 if(audio&&audio.paused&&queue.length){audio.play();p.textContent='❚❚';return}
 stopped=false;cache={};
 var b=buildQueue();
 if(!b.q.length){status('Nothing to read');return}
 if(b.whole){var n=b.q.reduce(function(a,c){return a+c.t.length},0);status('Whole case, ~'+n.toLocaleString()+' credits… starting')}
 else{status('Reading your selection')}
 queue=b.q;qi=0;p.textContent='❚❚';
 playNext();
}
function askKey(){
 if(document.getElementById('tts-keybox'))return;
 var k=document.createElement('div');k.className='tts-keybox';k.id='tts-keybox';
 k.innerHTML='<p>Paste your ElevenLabs API key (the same "Case Reader" key from the AI Reader page). It stays in this browser.</p>'+
 '<input id="tts-key-input" type="password" placeholder="sk_...">'+
 '<button id="tts-key-save">Save key</button>';
 document.body.appendChild(k);
 document.getElementById('tts-key-save').addEventListener('click',function(){
  var v=document.getElementById('tts-key-input').value.trim();
  if(v){try{localStorage.setItem(LS_KEY,v)}catch(e){}
   k.remove();loadVoices();}
 });
}
function loadVoices(){
 var sel=document.getElementById('tts-voice');
 if(!key()){sel.innerHTML='<option>Add key to pick voices</option>';return}
 fetch(API+'/voices',{headers:{'xi-api-key':key()}}).then(function(r){return r.json()}).then(function(d){
  voices=(d.voices||[]);
  if(!voices.length){sel.innerHTML='<option>No voices</option>';return}
  var saved=(function(){try{return localStorage.getItem(LS_VOICE)}catch(e){return null}})();
  sel.innerHTML=voices.map(function(v){return '<option value="'+v.voice_id+'">'+v.name+'</option>'}).join('');
  var pick=voices.filter(function(v){return v.voice_id===saved})[0]||voices.filter(function(v){return v.name==='Sarah'})[0]||voices[0];
  sel.value=pick.voice_id;
  try{localStorage.setItem(LS_VOICE,pick.voice_id)}catch(e){}
 }).catch(function(){sel.innerHTML='<option>Voices unavailable</option>'});
}
bar();loadVoices();
})();
