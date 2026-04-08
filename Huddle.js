(function() {
var BASE = 'https://ray1--019d635f3b8c71ceb261f4dc334530c1.web.val.run';
var STORE_KEY = 'hud_token';
if (document.getElementById('huddle-host')) return;

var host = document.createElement('div');
host.id = 'huddle-host';
host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
document.body.appendChild(host);
var shadow = host.attachShadow({
mode: 'open'
});

var style = document.createElement('style');
style.textContent = [
'* ,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}',
'#hw{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(820px,96vw);height:min(520px,90vh);background:#0d0f18;border:1px solid #272b42;border-radius:16px;box-shadow:0 32px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(255,255,255,0.04);display:flex;flex-direction:column;overflow:hidden;pointer-events:all;}',
'#hd{background:#13161f;border-bottom:1px solid #272b42;padding:0 14px;height:42px;display:flex;align-items:center;justify-content:space-between;cursor:grab;border-radius:16px 16px 0 0;flex-shrink:0;user-select:none;}',
'#hl{font-size:14.7px;font-weight:800;background:linear-gradient(135deg,#818cf8,#a5b4fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-0.3px;}',
'#hx{all:unset;color:#7a8099;cursor:pointer;font-size:18px;padding:4px 8px;line-height:1;border-radius:6px;pointer-events:all;font-family:sans-serif;display:flex;align-items:center;justify-content:center;}',
'#hx:hover{color:#b0b8d8;background:rgba(255,255,255,0.07);}',
'#hf{flex:1;border:none;background:#0d0f18;width:100%;display:block;}',
'#hr{position:absolute;bottom:4px;right:4px;width:22px;height:22px;cursor:se-resize;z-index:10;pointer-events:all;opacity:0.45;}',
'#hr:hover{opacity:1;}'
].join('');
shadow.appendChild(style);

var w = document.createElement('div');
w.id = 'hw';
shadow.appendChild(w);

var drag = document.createElement('div');
drag.id = 'hd';

var lbl = document.createElement('span');
lbl.id = 'hl';
lbl.textContent = 'Huddle';

var closeBtn = document.createElement('button');
closeBtn.id = 'hx';
closeBtn.title = 'Close';
closeBtn.setAttribute('aria-label', 'Close Huddle');
closeBtn.textContent = '×';

drag.appendChild(lbl);
drag.appendChild(closeBtn);
w.appendChild(drag);

var frame = document.createElement('iframe');
frame.id = 'hf';
frame.src = BASE + '/?widget=1';
frame.allow = 'clipboard-write';
w.appendChild(frame);

var rh = document.createElement('div');
rh.id = 'hr';
rh.innerHTML = '<svg viewBox="0 0 18 18" fill="none"><line x1="3" y1="15" x2="15" y2="3" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="15" x2="15" y2="7" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="15" x2="15" y2="11" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/></svg>';
w.appendChild(rh);

var dragging = false,
startX = 0,
startY = 0;

function startDrag(cx, cy) {
var r = w.getBoundingClientRect();
w.style.transform = 'none';
w.style.left = r.left + 'px';
w.style.top = r.top + 'px';
startX = cx - r.left;
startY = cy - r.top;
dragging = true;
drag.style.cursor = 'grabbing';
}

function moveDrag(cx, cy) {
if (!dragging) return;
var nx = cx - startX,
ny = cy - startY;
var mw = document.documentElement.clientWidth,
mh = document.documentElement.clientHeight;
var rw = w.offsetWidth,
rh2 = w.offsetHeight;
nx = Math.max(0, Math.min(mw - rw, nx));
ny = Math.max(0, Math.min(mh - rh2, ny));
w.style.left = nx + 'px';
w.style.top = ny + 'px';
}

function endDrag() {
dragging = false;
drag.style.cursor = 'grab';
}
drag.addEventListener('mousedown', function(e) {
if (e.target !== closeBtn) {
e.preventDefault();
startDrag(e.clientX, e.clientY);
}
});
drag.addEventListener('touchstart', function(e) {
if (e.target !== closeBtn) {
var t = e.touches[0];
startDrag(t.clientX, t.clientY);
}
}, {
passive: true
});
document.addEventListener('mousemove', function(e) {
if (dragging) moveDrag(e.clientX, e.clientY);
});
document.addEventListener('touchmove', function(e) {
if (dragging) {
e.preventDefault();
var t = e.touches[0];
moveDrag(t.clientX, t.clientY);
}
}, {
passive: false
});
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

var resizing = false,
rsx = 0,
rsy = 0,
rsW = 0,
rsH = 0;

function startResize(cx, cy) {
resizing = true;
rsx = cx;
rsy = cy;
rsW = w.offsetWidth;
rsH = w.offsetHeight;
}

function moveResize(cx, cy) {
if (!resizing) return;
var nw = Math.max(480, rsW + (cx - rsx));
var nh = Math.max(320, rsH + (cy - rsy));
nw = Math.min(window.innerWidth * 0.97, nw);
nh = Math.min(window.innerHeight * 0.97, nh);
w.style.width = nw + 'px';
w.style.height = nh + 'px';
}
rh.addEventListener('mousedown', function(e) {
e.preventDefault();
e.stopPropagation();
startResize(e.clientX, e.clientY);
});
rh.addEventListener('touchstart', function(e) {
e.stopPropagation();
var t = e.touches[0];
startResize(t.clientX, t.clientY);
}, {
passive: true
});
document.addEventListener('mousemove', function(e) {
if (resizing) moveResize(e.clientX, e.clientY);
});
document.addEventListener('touchmove', function(e) {
if (resizing) {
e.preventDefault();
var t = e.touches[0];
moveResize(t.clientX, t.clientY);
}
}, {
passive: false
});
document.addEventListener('mouseup', function() {
resizing = false;
});
document.addEventListener('touchend', function() {
resizing = false;
});

var savedToken = localStorage.getItem(STORE_KEY) || '';
frame.addEventListener('load', function() {
try {
frame.contentWindow.postMessage({
type: 'HUDDLE_TOKEN',
token: savedToken
}, '*');
} catch (e) {}
});
window.addEventListener('message', function(e) {
if (e.data && e.data.type === 'HUDDLE_SAVE_TOKEN') {
localStorage.setItem(STORE_KEY, e.data.token || '');
savedToken = e.data.token || '';
}
if (e.data && e.data.type === 'HUDDLE_LOGOUT') {
localStorage.removeItem(STORE_KEY);
savedToken = '';
}
});

closeBtn.addEventListener('click', function() {
host.remove();
});
})();
