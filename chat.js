/* AI case coach: chat panel that knows this case. Any OpenAI-compatible API, key stays in your browser. */
(function(){
if(window.__wajoChat)return;window.__wajoChat=true;
var LS_KEY='el_chat_key',LS_EP='el_chat_endpoint',LS_MODEL='el_chat_model';
var open=false,history=[],caseText=null;
var style=document.createElement('style');
style.textContent=[
'#chat-fab{position:fixed;left:16px;bottom:16px;z-index:99997;border:0;border-radius:999px;padding:11px 18px;background:#2a78d6;color:#fff;font:600 14px -apple-system,system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35)}',
'#chat-panel{position:fixed;left:16px;bottom:70px;z-index:99997;width:min(380px,calc(100vw - 32px));height:min(560px,72vh);background:#151c20;color:#e5ecef;border:1px solid #29343a;border-radius:14px;display:none;flex-direction:column;box-shadow:0 10px 32px rgba(0,0,0,.45);font:14px -apple-system,system-ui,sans-serif}',
'#chat-panel.open{display:flex}',
'.chat-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #29343a;font-weight:700}',
'.chat-head button{border:0;background:#1b252a;color:#e5ecef;border-radius:8px;padding:5px 9px;cursor:pointer;font-size:12px}',
'.chat-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}',
'.chat-msg{padding:9px 11px;border-radius:10px;max-width:92%;white-space:pre-wrap;word-wrap:break-word;font-size:13.5px;line-height:1.45}',
'.chat-msg.me{align-self:flex-end;background:#2a78d6;color:#fff}',
'.chat-msg.ai{align-self:flex-start;background:#1b252a;border:1px solid #29343a}',
'.chat-msg.err{align-self:flex-start;background:#2a1214;border:1px solid #d03b3b;color:#ff8484;font-size:12.5px}',
'.chips{display:flex;gap:6px;padding:0 12px 8px;flex-wrap:wrap}',
'.chips button{border:1px solid #29343a;background:#1b252a;color:#a8b4bb;border-radius:999px;padding:5px 10px;font-size:12px;cursor:pointer}',
'.chat-input{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #29343a}',
'.chat-input textarea{flex:1;resize:none;border-radius:10px;border:1px solid #29343a;background:#1b252a;color:#e5ecef;padding:9px;font:13.5px -apple-system,system-ui,sans-serif;min-height:40px;max-height:90px}',
'.chat-input button{border:0;border-radius:10px;background:#4cc2b1;color:#06201c;font-weight:700;padding:0 14px;cursor:pointer}',
'.chat-set{display:none;padding:10px 12px;border-bottom:1px solid #29343a;font-size:12px}',
'.chat-set.open{display:block}',
'.chat-set input{width:100%;box-sizing:border-box;margin:3px 0 8px;padding:7px;border-radius:8px;border:1px solid #29343a;background:#1b252a;color:#e5ecef;font-size:12.5px}',
'.chat-set p{margin:0 0 6px;color:#a8b4bb}'
].join('');
document.head.appendChild(style);
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function md(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function cfg(f){try{return localStorage.getItem(f)||''}catch(e){return ''}}
function setCfg(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function build(){
 if(document.getElementById('chat-panel'))return;
 var fab=document.createElement('button');fab.id='chat-fab';fab.textContent='AI coach';
 fab.addEventListener('click',toggle);document.body.appendChild(fab);
 var p=document.createElement('div');p.id='chat-panel';
 p.innerHTML=
 '<div class="chat-head">AI case coach<button id="chat-cfg-btn">settings</button><button id="chat-x" style="margin-left:auto">×</button></div>'+
 '<div class="chat-set" id="chat-set">'+
 '<p>Bring your own key: an OpenAI key, or a free one from Google AI Studio (endpoint below, model gemini-2.0-flash) or OpenRouter. It stays in this browser, never in the repo.</p>'+
 'API base URL<input id="chat-ep" placeholder="https://api.openai.com/v1">'+
 'API key<input id="chat-key" type="password" placeholder="sk-...">'+
 'Model<input id="chat-model" placeholder="gpt-4o-mini">'+
 '<button id="chat-save">Save</button></div>'+
 '<div class="chat-msgs" id="chat-msgs"></div>'+
 '<div class="chips"><button data-q="Explain this case to me simply, section by section.">Explain it</button>'+
 '<button data-q="Quiz me on this case, one question at a time. Wait for my answer, then grade it and explain.">Quiz me</button>'+
 '<button data-q="I will walk through my approach and math for this case. Check my numbers rigorously and flag every error.">Check my math</button></div>'+
 '<div class="chat-input"><textarea id="chat-in" placeholder="Ask about the case…"></textarea><button id="chat-send">Send</button></div>';
 document.body.appendChild(p);
 document.getElementById('chat-x').addEventListener('click',toggle);
 document.getElementById('chat-cfg-btn').addEventListener('click',function(){document.getElementById('chat-set').classList.toggle('open')});
 document.getElementById('chat-save').addEventListener('click',function(){
  setCfg(LS_EP,document.getElementById('chat-ep').value.trim()||'https://api.openai.com/v1');
  setCfg(LS_MODEL,document.getElementById('chat-model').value.trim()||'gpt-4o-mini');
  setCfg(LS_KEY,document.getElementById('chat-key').value.trim());
  document.getElementById('chat-set').classList.remove('open');
  push('ai','Saved. Settings live in this browser only.');
 });
 document.getElementById('chat-send').addEventListener('click',send);
 document.getElementById('chat-in').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
 document.querySelectorAll('.chips button').forEach(function(b){b.addEventListener('click',function(){document.getElementById('chat-in').value=b.getAttribute('data-q');send()})});
 if(!cfg(LS_EP))document.getElementById('chat-ep').value='https://api.openai.com/v1';else document.getElementById('chat-ep').value=cfg(LS_EP);
 document.getElementById('chat-model').value=cfg(LS_MODEL)||'gpt-4o-mini';
}
function toggle(){open=!open;var p=document.getElementById('chat-panel');if(!p){build();p=document.getElementById('chat-panel')}p.classList.toggle('open',open);if(open&&!caseText)prep()}
function prep(){
 var blocks=[];
 document.querySelectorAll('p,li,h1,h2,h3,h4,blockquote,figcaption,td,th').forEach(function(el){
  if(el.closest('#chat-panel,#chat-fab,.tts-bar'))return;
  if(el.closest('nav,header,footer,button,style,script'))return;
  if(!el.offsetParent)return;
  var t=(el.innerText||'').trim();
  if(t.length>1&&blocks.indexOf(el.parentElement)<0)blocks.push(el);
 });
 caseText=blocks.map(function(b){return b.innerText.trim()}).join('\n\n').slice(0,60000);
}
function push(role,text){
 var m=document.getElementById('chat-msgs');var d=document.createElement('div');
 d.className='chat-msg '+(role==='me'?'me':role==='err'?'err':'ai');
 if(role==='ai')d.innerHTML=md(text);else d.textContent=text;
 m.appendChild(d);m.scrollTop=m.scrollHeight;
}
function send(){
 var ta=document.getElementById('chat-in');var q=(ta.value||'').trim();if(!q)return;
 ta.value='';
 if(!cfg(LS_KEY)){document.getElementById('chat-set').classList.add('open');push('err','Add an API key in settings first.');return}
 push('me',q);history.push({role:'user',content:q});
 var sys='You are a friendly case-interview coach embedded in Evelyn\'s mock case page. Be concise and concrete. Explain concepts simply from scratch, quiz one question at a time, and check math rigorously step by step. Here is the full case text:\n\n'+(caseText||'(case text unavailable)');
 var msgs=[{role:'system',content:sys}].concat(history.slice(-14));
 var ep=(cfg(LS_EP)||'https://api.openai.com/v1').replace(/\/+$/,'');
 var body={model:cfg(LS_MODEL)||'gpt-4o-mini',messages:msgs,temperature:0.4};
 push('ai','…');
 var thinking=document.querySelector('#chat-msgs .chat-msg.ai:last-child');
 fetch(ep+'/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+cfg(LS_KEY),'Content-Type':'application/json'},body:JSON.stringify(body)})
 .then(function(r){return r.text().then(function(t){return {ok:r.ok,t:t}})})
 .then(function(res){
  var reply='';var errmsg='';
  try{var j=JSON.parse(res.t);if(j.choices&&j.choices[0]&&j.choices[0].message)reply=j.choices[0].message.content;else errmsg=(j.error&&j.error.message)||res.t.slice(0,160)}catch(e){errmsg=res.t.slice(0,160)}
  if(thinking)thinking.remove();
  if(reply){history.push({role:'assistant',content:reply});push('ai',reply)}
  else push('err','API error: '+errmsg);
 }).catch(function(e){if(thinking)thinking.remove();push('err','Network error: '+e.message)});
}
})();
