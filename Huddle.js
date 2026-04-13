javascript:(function(){
  var BASE='https://santa--019d84e3573870fa8b1daeffe1cc2100.web.val.run';
  var STORE_KEY='kikko_token';
  var THEME_KEY='kikko_bm_theme';

  if(document.getElementById('kikko-host'))return;

  var host=document.createElement('div');
  host.id='kikko-host';
  host.style.cssText='position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(host);

  var shadow=host.attachShadow({mode:'open'});

  var DARK={bg:'#0b0c0f',surface:'#131417',border:'#272a35',close:'#7a8099'};
  var LIGHT={bg:'#faf9f2',surface:'#ffffff',border:'#e0dbc8',close:'#9a9178'};

  var isDark=true;
  try{
    var bmTheme=localStorage.getItem(THEME_KEY);
    if(bmTheme==='light'){isDark=false;}
    else if(bmTheme==='dark'){isDark=true;}
    else{
      var appTheme=localStorage.getItem('kik_theme');
      if(appTheme==='light'){isDark=false;}
    }
  }catch(e){}

  function applyTheme(dark){
    isDark=dark;
    try{localStorage.setItem(THEME_KEY,dark?'dark':'light');}catch(e){}
    var t=dark?DARK:LIGHT;
    var wEl=shadow.getElementById('hw');
    var dEl=shadow.getElementById('hd');
    var fEl=shadow.getElementById('hf');
    var xEl=shadow.getElementById('hx');
    if(wEl){wEl.style.background=t.bg;wEl.style.borderColor=t.border;}
    if(dEl){dEl.style.background=t.surface;dEl.style.borderBottomColor=t.border;}
    if(fEl){fEl.style.background=t.bg;}
    if(xEl){xEl.style.color=t.close;}
  }

  var t0=isDark?DARK:LIGHT;
  var style=document.createElement('style');
  style.textContent=[
    '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0;}',
    '#hw{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(820px,96vw);height:min(520px,90vh);background:'+t0.bg+';border:1px solid '+t0.border+';border-radius:16px;box-shadow:0 32px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(255,255,255,0.04);display:flex;flex-direction:column;overflow:hidden;pointer-events:all;transition:background .25s,border-color .25s;}',
    '#hd{background:'+t0.surface+';border-bottom:1px solid '+t0.border+';padding:0 14px;height:42px;display:flex;align-items:center;justify-content:space-between;cursor:grab;border-radius:16px 16px 0 0;flex-shrink:0;user-select:none;transition:background .25s,border-color .25s;}',
    '#hl{font-size:14.7px;font-weight:800;color:#FFDA4A;line-height:1;font-family:-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:-0.3px;}',
    '#hx{all:unset;color:'+t0.close+';cursor:pointer;font-size:18px;padding:4px 8px;line-height:1;border-radius:6px;pointer-events:all;font-family:sans-serif;display:flex;align-items:center;justify-content:center;transition:color .2s,background .2s;}',
    '#hx:hover{color:#b0b8d8;background:rgba(255,255,255,0.07);}',
    '#hf{flex:1;border:none;background:'+t0.bg+';width:100%;display:block;transition:background .25s;}',
    '#hr{position:absolute;bottom:4px;right:4px;width:22px;height:22px;cursor:se-resize;z-index:10;pointer-events:all;opacity:0.45;}',
    '#hr:hover{opacity:1;}'
  ].join('');
  shadow.appendChild(style);

  var w=document.createElement('div');
  w.id='hw';
  shadow.appendChild(w);

  var drag=document.createElement('div');
  drag.id='hd';

  var lbl=document.createElement('span');
  lbl.id='hl';
  lbl.textContent='';

  var closeBtn=document.createElement('button');
  closeBtn.id='hx';
  closeBtn.title='Close';
  closeBtn.setAttribute('aria-label','Close Kikko');
  closeBtn.textContent='×';

  drag.appendChild(lbl);
  drag.appendChild(closeBtn);
  w.appendChild(drag);

  var frame=document.createElement('iframe');
  frame.id='hf';
  frame.src=BASE+'/?widget=1';
  frame.allow='clipboard-write';
  w.appendChild(frame);

  var rh=document.createElement('div');
  rh.id='hr';
  rh.innerHTML='<svg viewBox="0 0 18 18" fill="none"><line x1="3" y1="15" x2="15" y2="3" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="15" x2="15" y2="7" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="15" x2="15" y2="11" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/></svg>';
  w.appendChild(rh);

  var dragging=false,startX=0,startY=0;
  function startDrag(cx,cy){
    var r=w.getBoundingClientRect();
    w.style.transform='none';
    w.style.left=r.left+'px';
    w.style.top=r.top+'px';
    startX=cx-r.left;startY=cy-r.top;
    dragging=true;drag.style.cursor='grabbing';
  }
  function moveDrag(cx,cy){
    if(!dragging)return;
    var nx=cx-startX,ny=cy-startY;
    var mw=document.documentElement.clientWidth,mh=document.documentElement.clientHeight;
    var rw=w.offsetWidth,rh2=w.offsetHeight;
    nx=Math.max(0,Math.min(mw-rw,nx));ny=Math.max(0,Math.min(mh-rh2,ny));
    w.style.left=nx+'px';w.style.top=ny+'px';
  }
  function endDrag(){dragging=false;drag.style.cursor='grab';}

  drag.addEventListener('mousedown',function(e){if(e.target!==closeBtn){e.preventDefault();startDrag(e.clientX,e.clientY);}});
  drag.addEventListener('touchstart',function(e){if(e.target!==closeBtn){var t=e.touches[0];startDrag(t.clientX,t.clientY);}},{passive:true});
  document.addEventListener('mousemove',function(e){if(dragging)moveDrag(e.clientX,e.clientY);});
  document.addEventListener('touchmove',function(e){if(dragging){e.preventDefault();var t=e.touches[0];moveDrag(t.clientX,t.clientY);}},{passive:false});
  document.addEventListener('mouseup',endDrag);
  document.addEventListener('touchend',endDrag);

  var resizing=false,rsx=0,rsy=0,rsW=0,rsH=0;
  function startResize(cx,cy){resizing=true;rsx=cx;rsy=cy;rsW=w.offsetWidth;rsH=w.offsetHeight;}
  function moveResize(cx,cy){
    if(!resizing)return;
    var nw=Math.max(480,rsW+(cx-rsx));var nh=Math.max(320,rsH+(cy-rsy));
    nw=Math.min(window.innerWidth*0.97,nw);nh=Math.min(window.innerHeight*0.97,nh);
    w.style.width=nw+'px';w.style.height=nh+'px';
  }

  rh.addEventListener('mousedown',function(e){e.preventDefault();e.stopPropagation();startResize(e.clientX,e.clientY);});
  rh.addEventListener('touchstart',function(e){e.stopPropagation();var t=e.touches[0];startResize(t.clientX,t.clientY);},{passive:true});
  document.addEventListener('mousemove',function(e){if(resizing)moveResize(e.clientX,e.clientY);});
  document.addEventListener('touchmove',function(e){if(resizing){e.preventDefault();var t=e.touches[0];moveResize(t.clientX,t.clientY);}},{passive:false});
  document.addEventListener('mouseup',function(){resizing=false;});
  document.addEventListener('touchend',function(){resizing=false;});

  var savedToken=localStorage.getItem(STORE_KEY)||'';
  frame.addEventListener('load',function(){try{frame.contentWindow.postMessage({type:'KIKKO_TOKEN',token:savedToken},'*');}catch(e){}});

  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='KIKKO_SAVE_TOKEN'){localStorage.setItem(STORE_KEY,e.data.token||'');savedToken=e.data.token||'';}
    if(e.data&&e.data.type==='KIKKO_LOGOUT'){localStorage.removeItem(STORE_KEY);savedToken='';}
    if(e.data&&e.data.type==='KIKKO_THEME'){applyTheme(e.data.dark);}
  });

  closeBtn.addEventListener('click',function(){host.remove();});
})();
