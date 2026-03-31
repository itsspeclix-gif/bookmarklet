(async function _main() {
    localStorage.setItem('_bookmarkletSrc', _main.toString());
    var sheetId = '1-fLK1EJH9TxtmaA9Cksy66XgK3u6imn1-CksGjQ7WWc';
    var vaultUrl = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/export?format=csv';
    var sessionLimit = 30 * 60 * 1000;
    var savedData = localStorage.getItem('gameLibSession');
    if (savedData) {
        try { var sess = JSON.parse(savedData); if (Date.now() - sess.time < sessionLimit) { loadLibrary(sess.games, sess.user || 'User', sess.time); return; } } catch(e) {}
    }
    var bg = document.createElement('div');
    bg.style = 'position:fixed;inset:0;z-index:999999;display:flex;justify-content:center;align-items:center;font-family:Inter,sans-serif;';
    bg.innerHTML = '<style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");*{box-sizing:border-box;margin:0;padding:0;}#lbg{position:absolute;inset:0;background:linear-gradient(135deg,#0a0a0f,#0f0f1a 40%,#0a0a0f);}.orb{position:absolute;border-radius:50%;filter:blur(80px);animation:orbf 8s ease-in-out infinite;}.orb1{width:400px;height:400px;background:rgba(59,130,246,.18);top:-100px;left:-100px;}.orb2{width:300px;height:300px;background:rgba(124,58,237,.15);bottom:-80px;right:-80px;animation-delay:-4s;}.orb3{width:200px;height:200px;background:rgba(16,185,129,.1);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:-2s;}@keyframes orbf{0%,100%{transform:scale(1)}50%{transform:scale(1.15) translate(15px,-15px)}}#lcard{position:relative;background:rgba(14,14,22,.85);backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.09);border-radius:28px;padding:44px 40px 40px;width:340px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.6);}.lion{width:54px;height:54px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:16px;display:grid;place-items:center;font-size:24px;margin:0 auto 20px;box-shadow:0 8px 24px rgba(59,130,246,.4);animation:lpop .6s cubic-bezier(.34,1.56,.64,1);}@keyframes lpop{from{transform:scale(0) rotate(-20deg);opacity:0;}to{transform:scale(1) rotate(0);opacity:1;}}.lt{color:#fff;font-size:1.45rem;font-weight:700;margin-bottom:4px;letter-spacing:-.5px;}.ls{color:rgba(255,255,255,.35);font-size:.82rem;margin-bottom:28px;}.lf{position:relative;margin-bottom:12px;}.lf input{width:100%;padding:14px 44px 14px 16px;background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:14px;outline:none;font-size:.9rem;font-family:inherit;transition:.25s;}.lf input:focus{border-color:rgba(59,130,246,.7);background:rgba(59,130,246,.06);box-shadow:0 0 0 3px rgba(59,130,246,.1);}.lf input::placeholder{color:rgba(255,255,255,.22);}.lico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);font-size:14px;cursor:pointer;user-select:none;transition:.2s;}.lico:hover{color:rgba(255,255,255,.7);}#lBtn{width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border:none;border-radius:14px;cursor:pointer;font-weight:700;font-family:inherit;font-size:.95rem;margin-top:10px;transition:.25s;letter-spacing:.3px;}#lBtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(59,130,246,.45);}#lBtn:disabled{opacity:.6;cursor:not-allowed;}#lBtn .lsp{display:none;width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto;}@keyframes spin{to{transform:rotate(360deg)}}#lMsg{color:#f87171;font-size:12px;margin-top:14px;display:none;animation:shake .35s ease;}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}</style><div id="lbg"><div class="orb orb1"></div><div class="orb orb2"></div><div class="orb orb3"></div></div><div id="lcard"><div class="lion"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div><div class="lt">Game Library</div><div class="ls">Enter your credentials to continue</div><div class="lf"><input id="u" type="text" placeholder="Username" autocomplete="off"><span class="lico"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span></div><div class="lf"><input id="p" type="password" placeholder="Password"><span class="lico" id="eyeBtn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span></div><button id="lBtn"><span id="lBtnTxt">Sign In</span><div class="lsp" id="lSpin"></div></button><div id="lMsg"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Invalid credentials</div></div>';
    document.body.appendChild(bg);
    document.getElementById('u').focus();
    document.getElementById('eyeBtn').onclick = function() {
        var p=document.getElementById('p');
        var isPass = p.type==='password';
        p.type = isPass ? 'text' : 'password';
        this.innerHTML = isPass ?
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    };
    function setLoading(on) { var b=document.getElementById('lBtn'),t=document.getElementById('lBtnTxt'),s=document.getElementById('lSpin'); b.disabled=on;t.style.display=on?'none':'block';s.style.display=on?'block':'none'; }
    document.getElementById('p').onkeydown = function(e){if(e.key==='Enter')document.getElementById('lBtn').click();};
    document.getElementById('lBtn').onclick = async function() {
        var uIn=document.getElementById('u').value.trim(), pIn=document.getElementById('p').value.trim();
        var msg=document.getElementById('lMsg'); msg.style.display='none'; setLoading(true); var lt=Date.now();
        try {
            var res=await fetch(vaultUrl+'&t='+Date.now()); if(!res.ok)throw new Error();
            var pr=(await res.text()).split(/\r?\n/).map(function(r){var row=r.trim(),cols=[],inQ=false,cur='';for(var i=0;i<row.length;i++){var c=row[i];if(c==='"'&&row[i+1]==='"'){cur+='"';i++;}else if(c==='"'){inQ=!inQ;}else if(c===','&&!inQ){cols.push(cur);cur='';}else cur+=c;}cols.push(cur);return cols;});
            var cfg={},gms={},jsp='';
            pr.forEach(function(c){c.forEach(function(x){if(x&&x.trim().startsWith('http')&&x.includes('jsdelivr')){jsp=x.trim();if(!jsp.endsWith('/'))jsp+='/';}});});
            pr.forEach(function(c){if(c[0]&&c[1]&&c[0].trim()!=='')cfg[c[0].trim().toLowerCase()]=c[1].trim();if(c[2]&&c[3]&&c[2].trim()!==''){var n=c[2].trim(),p=c[3].trim();gms[n]={url:p.startsWith('http')?p:(jsp+p),icon:(c[4]||'').trim(),type:(c[5]||'').trim().toLowerCase()};}});
            if(cfg[uIn.toLowerCase()]===pIn){localStorage.setItem('gameLibSession',JSON.stringify({time:lt,games:gms,user:uIn}));bg.style.transition='opacity .5s';bg.style.opacity='0';setTimeout(function(){bg.remove();loadLibrary(gms,uIn,lt);},500);}else throw new Error();
        } catch(e){setLoading(false);msg.style.display='block';msg.style.animation='none';requestAnimationFrame(function(){msg.style.animation='';});}
    };

    function loadLibrary(games, userName, startTime) {
        var gCount=Object.keys(games).length, cDate=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        var pfpK='userPfp_'+userName.toLowerCase(), stK='gameStats_'+userName.toLowerCase();
        var fvK='gameFavs_'+userName.toLowerCase(), rcK='gameRecent_'+userName.toLowerCase();
        var thK='gameTheme_'+userName.toLowerCase(), mbK='gameMember_'+userName.toLowerCase();
        if(!localStorage.getItem(mbK))localStorage.setItem(mbK,Date.now().toString());
        (function(){var p=localStorage.getItem('_gameTimeDelta');if(p){try{var d=JSON.parse(p);if(d&&d.name&&d.ms&&(Date.now()-(d.ts||0))<7200000){var s=JSON.parse(localStorage.getItem(stK)||'{}');s[d.name]=(s[d.name]||0)+d.ms;localStorage.setItem(stK,JSON.stringify(s));}localStorage.removeItem('_gameTimeDelta');}catch(e){}}})();
        function gSt(){try{return JSON.parse(localStorage.getItem(stK))||{};}catch(e){return{};}}
        function sSt(s){localStorage.setItem(stK,JSON.stringify(s));}
        function aTime(n,ms){if(!n||ms<500)return;var s=gSt();s[n]=(s[n]||0)+ms;sSt(s);}
        function gFv(){try{return JSON.parse(localStorage.getItem(fvK))||[];}catch(e){return[];}}
        function sFv(f){localStorage.setItem(fvK,JSON.stringify(f));}
        function togFv(n){var f=gFv();var i=f.indexOf(n);if(i>-1)f.splice(i,1);else f.unshift(n);sFv(f);}
        function isFv(n){return gFv().indexOf(n)>-1;}
        function gRc(){try{return JSON.parse(localStorage.getItem(rcK))||[];}catch(e){return[];}}
        function aRc(n){var r=gRc().filter(function(x){return x!==n;});r.unshift(n);localStorage.setItem(rcK,JSON.stringify(r.slice(0,10)));}
        function gTh(){return localStorage.getItem(thK)||'dark';}
        function aTh(t){document.body.classList.toggle('light',t==='light');localStorage.setItem(thK,t);document.querySelectorAll('.tbtn').forEach(function(b){b.classList.toggle('active',b.dataset.theme===t);});}
        function fmtT(ms){var s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;if(h>0)return h+'h '+m+'m';if(m>0)return m+'m '+sc+'s';return sc>0?sc+'s':'<1s';}
        function totT(){return Object.values(gSt()).reduce(function(a,b){return a+b;},0);}
        function mpGame(){var s=gSt(),k=Object.keys(s);return k.length?k.reduce(function(a,b){return s[a]>s[b]?a:b;}):null;}

        var icoUser='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
        var icoHeart='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        var icoHeartBtn='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        var icoClock='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        var icoStar='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
        var icoController='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M6 3v4"/><path d="M18 3v4"/><path d="M8 21v-4"/><path d="M16 21v-4"/><path d="M10 11h4"/></svg>';
        var icoControllerLg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M6 3v4"/><path d="M18 3v4"/><path d="M8 21v-4"/><path d="M16 21v-4"/><path d="M10 11h4"/></svg>';
        var icoMoon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        var icoX='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        var icoXwhite='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        var icoPlay='<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 8,19 19,12"/></svg>';
        var icoAdd='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16m8-8H4"/></svg>';
        var icoImg='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

        function gAch(){var s=gSt(),tot=totT(),fv=gFv(),rc=gRc();return[
            {icon:icoControllerLg,name:'First Launch',desc:'Opened your first game',u:rc.length>=1},
            {icon:icoControllerLg,name:'Explorer',desc:'Played 3 different games',u:Object.keys(s).length>=3},
            {icon:icoControllerLg,name:'Game Hopper',desc:'Played 5 different games',u:Object.keys(s).length>=5},
            {icon:icoClock,name:'Dedicated',desc:'1 hour total playtime',u:tot>=3600000},
            {icon:icoClock,name:'Marathon',desc:'5 hours total playtime',u:tot>=18000000},
            {icon:icoHeart,name:'Collector',desc:'Favorited 3 games',u:fv.length>=3},
            {icon:icoHeart,name:'Curator',desc:'Favorited 5 games',u:fv.length>=5},
            {icon:icoStar,name:'Regular',desc:'10 game sessions',u:rc.length>=10}
        ];}

        document.open();
        document.write('<!DOCTYPE html><html><head><title>Google</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>');
        document.write('@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");');
        document.write(':root{--bg:#080808;--s1:#0f0f0f;--s2:#161616;--s3:#1e1e1e;--b1:#1e1e1e;--b2:#2e2e2e;--t1:#fff;--t2:#888;--t3:#444;--ac:#3b82f6;--ac2:#60a5fa;--red:#f87171;--grn:#22c55e;}');
        document.write('body.light{--bg:#f0f2f5;--s1:#fff;--s2:#f1f3f5;--s3:#e9ecef;--b1:#dee2e6;--b2:#ced4da;--t1:#1a1a2e;--t2:#6c757d;--t3:#adb5bd;}');
        document.write('*{box-sizing:border-box;margin:0;padding:0;}body{background:var(--bg);color:var(--t1);font-family:Inter,sans-serif;min-height:100vh;transition:background .3s,color .3s;overflow-x:hidden;}');
        document.write('nav{display:flex;justify-content:space-between;align-items:center;padding:12px 40px;border-bottom:1px solid var(--b1);background:rgba(8,8,8,.9);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100;}body.light nav{background:rgba(255,255,255,.92);}');
        document.write('.nlogo{font-weight:700;color:var(--ac);font-size:1.1rem;cursor:default;display:flex;align-items:center;gap:6px;letter-spacing:-.3px;}.nlogo span{animation:lp 3s ease-in-out infinite;display:inline-block;}@keyframes lp{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 14px rgba(59,130,246,.7)}}');
        document.write('.nr{display:flex;align-items:center;gap:8px;}');
        document.write('.ibtn{background:var(--s2);border:1px solid var(--b2);color:var(--t1);width:36px;height:36px;border-radius:50%;cursor:pointer;display:grid;place-items:center;font-size:15px;transition:.2s;}.ibtn:hover{background:var(--ac);border-color:var(--ac);color:#fff;}');
        document.write('#npBadge{display:none;align-items:center;gap:6px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:var(--grn);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#npBadge.on{display:flex;}#npDot{width:6px;height:6px;border-radius:50%;background:var(--grn);flex-shrink:0;animation:npp 1.2s ease-in-out infinite;}@keyframes npp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}');
        document.write('.umenu{position:relative;}.uinfo{display:flex;align-items:center;gap:8px;background:var(--s2);padding:6px 14px;border-radius:20px;border:1px solid var(--b2);font-size:.85rem;cursor:pointer;transition:.2s;user-select:none;}.uinfo:hover{border-color:var(--ac);}');
        document.write('#pfpCircle{width:22px;height:22px;background:var(--s3);border-radius:50%;display:grid;place-items:center;font-size:9px;font-weight:700;overflow:hidden;border:1px solid var(--b2);flex-shrink:0;}#pfpCircle img{width:100%;height:100%;object-fit:cover;}');
        document.write('.dd{position:absolute;top:calc(100% + 10px);right:0;background:var(--s2);border:1px solid var(--b2);border-radius:16px;width:230px;padding:8px;box-shadow:0 14px 50px rgba(0,0,0,.7);opacity:0;transform:translateY(-10px) scale(.96);pointer-events:none;transition:opacity .2s,transform .2s;z-index:500;transform-origin:top right;}.dd.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}');
        document.write('.di{padding:10px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:var(--t1);display:flex;align-items:center;gap:10px;transition:.15s;user-select:none;}.di:hover{background:var(--s3);}.ddiv{border:none;border-top:1px solid var(--b1);margin:5px 0;}.dred{color:var(--red)!important;}');
        document.write('#pOv{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);z-index:2999;opacity:0;pointer-events:none;transition:opacity .3s;}#pOv.open{opacity:1;pointer-events:all;}');
        document.write('#pPanel{position:fixed;top:0;right:-430px;width:400px;max-width:100vw;height:100%;background:var(--s1);border-left:1px solid var(--b2);z-index:3000;overflow-y:auto;transition:right .38s cubic-bezier(.4,0,.2,1);scrollbar-width:thin;}#pPanel.open{right:0;}');
        document.write('.ph{background:linear-gradient(145deg,#1e3a8a,#3b82f6 50%,#7c3aed);padding:30px 22px 26px;text-align:center;position:relative;}.phClose{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:13px;display:grid;place-items:center;transition:.2s;}.phClose:hover{background:var(--red);}');
        document.write('.phAv{width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid rgba(255,255,255,.35);display:grid;place-items:center;font-size:32px;font-weight:700;color:#fff;margin:0 auto 14px;overflow:hidden;cursor:pointer;transition:.25s;}.phAv:hover{border-color:#fff;transform:scale(1.07);}.phAv img{width:100%;height:100%;object-fit:cover;}.phName{color:#fff;font-size:1.3rem;font-weight:700;margin-bottom:3px;}.phSub{color:rgba(255,255,255,.5);font-size:.78rem;}');
        document.write('.ps{padding:20px 22px;border-bottom:1px solid var(--b1);}.ps:last-child{border-bottom:none;}.pst{font-size:9px;font-weight:700;text-transform:uppercase;color:var(--t3);letter-spacing:1.2px;margin-bottom:14px;display:flex;align-items:center;gap:6px;}');
        document.write('.trow{display:flex;background:var(--s2);border:1px solid var(--b1);border-radius:12px;padding:4px;gap:4px;}.tbtn{flex:1;padding:9px 6px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:.2s;background:transparent;color:var(--t2);}.tbtn.active{background:var(--ac);color:#fff;}');
        document.write('.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.sc{background:var(--s2);border:1px solid var(--b1);border-radius:14px;padding:14px;}.sci{margin-bottom:6px;display:flex;align-items:center;}.scv{font-size:1rem;font-weight:700;color:var(--t1);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.scl{font-size:9px;color:var(--t2);text-transform:uppercase;font-weight:700;letter-spacing:.5px;}');
        document.write('.pti{margin-bottom:14px;}.pth{display:flex;justify-content:space-between;margin-bottom:5px;}.ptn{font-size:12px;color:var(--t1);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:62%;}.ptt{font-size:12px;color:var(--ac);font-weight:600;}.ptbg{height:5px;background:var(--b2);border-radius:3px;overflow:hidden;}.ptb{height:100%;background:linear-gradient(90deg,var(--ac),var(--ac2));border-radius:3px;width:0;transition:width 1.1s cubic-bezier(.4,0,.2,1);}');
        document.write('.ach{display:flex;align-items:center;gap:12px;padding:11px 12px;background:var(--s2);border:1px solid var(--b1);border-radius:12px;margin-bottom:8px;transition:.2s;}.ach.locked{opacity:.2;filter:grayscale(1);}.ach:not(.locked){border-color:rgba(59,130,246,.3);}.ach:not(.locked):hover{border-color:var(--ac);}.aci{display:flex;align-items:center;flex-shrink:0;}.acn{font-size:13px;font-weight:600;color:var(--t1);}.acd{font-size:11px;color:var(--t2);margin-top:1px;}');
        document.write('.ri{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;transition:.15s;}.ri:hover{background:var(--s2);}.rin{width:18px;font-size:11px;font-weight:700;color:var(--t3);flex-shrink:0;}.rim{flex:1;font-size:13px;color:var(--t1);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.rit{font-size:11px;color:var(--ac);font-weight:600;flex-shrink:0;}');
        document.write('main{padding:40px 24px 100px;max-width:1100px;margin:0 auto;text-align:center;}');
        document.write('.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:44px;}@media(max-width:600px){.dg{grid-template-columns:1fr 1fr;}.dg>:last-child{grid-column:span 2;}}');
        document.write('.ditem{background:var(--s1);border:1px solid var(--b1);padding:16px;border-radius:18px;text-align:left;position:relative;overflow:hidden;transition:.2s;}.ditem:hover{border-color:var(--b2);transform:translateY(-2px);}.ditem::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;}.ditem:nth-child(1)::after{background:var(--grn);}.ditem:nth-child(2)::after{background:var(--ac);}.ditem:nth-child(3)::after{background:#a78bfa;}.dl{color:var(--t3);font-size:9px;font-weight:700;text-transform:uppercase;margin-bottom:5px;letter-spacing:.8px;}.dv{color:var(--t1);font-size:14px;font-weight:600;}');
        document.write('.wt{text-align:center;margin-bottom:44px;}.wg{font-size:2.2rem;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,var(--t1),var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:wfI .7s ease forwards;opacity:0;}.ws{font-size:.9rem;color:var(--t2);margin-top:6px;animation:wfI .7s .15s ease forwards;opacity:0;}@keyframes wfI{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}');
        document.write('.sw{position:relative;max-width:560px;margin:0 auto 48px;}.sbar{width:100%;padding:16px 48px 16px 28px;background:var(--s1);border:1px solid var(--b2);border-radius:16px;color:var(--t1);outline:none;font-size:15px;font-family:inherit;transition:.25s;}.sbar:focus{border-color:var(--ac);box-shadow:0 0 0 3px rgba(59,130,246,.1);}.sbar::placeholder{color:var(--t3);}.sclr{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:var(--b2);border:none;color:var(--t2);width:28px;height:28px;border-radius:50%;cursor:pointer;display:none;align-items:center;justify-content:center;transition:.15s;}.sclr:hover{background:var(--ac);color:#fff;}.sclr.on{display:flex;}');
        document.write('#noRes{display:none;text-align:center;padding:60px 20px;color:var(--t2);}');
        document.write('#favSec,#recSec,#allSec{display:none;margin-bottom:44px;text-align:left;}.slbl{font-size:.78rem;font-weight:700;text-transform:uppercase;color:var(--t2);letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;gap:6px;}#favGrid,#recGrid,#list{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;}');
        document.write('.card{background:var(--s1);border:1px solid var(--b1);border-radius:24px;padding:22px;cursor:pointer;transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s,border-color .2s,background .2s,opacity .3s;display:flex;flex-direction:column;align-items:center;gap:14px;position:relative;opacity:0;animation:cIn .5s ease forwards;}.card:hover{background:var(--s2);border-color:var(--ac);transform:translateY(-10px) scale(1.025);box-shadow:0 20px 50px rgba(59,130,246,.13);}@keyframes cIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}');
        document.write('.ib{width:80px;height:80px;border-radius:20px;background:var(--s2);display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--b1);position:relative;}.ib img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s;position:absolute;inset:0;}.play{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .2s;pointer-events:none;}.card:hover .play{opacity:1;}.cn{font-weight:600;color:var(--t1);font-size:13px;text-align:center;line-height:1.4;}');
        document.write('.hrt{position:absolute;top:11px;right:11px;background:none;border:none;cursor:pointer;line-height:1;padding:5px;opacity:.25;transition:opacity .2s,transform .2s;color:inherit;z-index:1;display:grid;place-items:center;}.hrt:hover{opacity:.9;transform:scale(1.3);}.hrt.on{opacity:1;color:#f87171;}');
        document.write('#gOver{position:fixed;inset:0;background:#000;z-index:2000;display:none;flex-direction:column;opacity:0;transition:opacity .35s;}#gOver.vis{opacity:1;}#closeGame{position:absolute;top:18px;right:18px;}#closeBtn{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);width:40px;height:40px;border-radius:50%;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(8px);transition:.2s;padding:0;}#closeBtn:hover{background:var(--red);border-color:var(--red);}iframe{border:none;flex-grow:1;width:100%;height:100%;opacity:0;transition:opacity .5s;}iframe.ld{opacity:1;}');
        document.write('</style></head><body>');

        document.write('<nav><div class="nlogo"><span>Library</span></div>');
        document.write('<div id="npBadge"><div id="npDot"></div><span id="npTxt">Now Playing</span></div>');
        document.write('<div class="nr"><button class="ibtn" id="settingsBtn" title="Profile">'+icoUser+'</button>');
        document.write('<div class="umenu"><div class="uinfo" id="toggleM"><span id="uName"></span><div id="pfpCircle"></div></div>');
        document.write('<div class="dd" id="drp">');
        document.write('<div class="di" id="pdMi">'+icoUser+'&nbsp; Profile</div>');
        document.write('<div class="di" id="avMi">'+icoImg+'&nbsp; Change Avatar</div>');
        document.write('<input type="file" id="pfpInp" style="display:none" accept="image/*">');
        document.write('<hr class="ddiv">');
        document.write('<div class="di dred" id="soBtn">'+icoX+'&nbsp; Sign Out</div>');
        document.write('</div></div></div></nav>');

        document.write('<div id="pOv"></div><div id="pPanel">');
        document.write('<div class="ph"><button class="phClose" id="phClose">'+icoXwhite+'</button><div class="phAv" id="phAv"></div><div class="phName" id="phName"></div><div class="phSub" id="phSub"></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoMoon+' Appearance</div><div class="trow"><button class="tbtn" data-theme="dark">Dark</button><button class="tbtn" data-theme="light">Light</button></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoController+' Stats</div><div class="sg" id="sg"></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoClock+' Playtime Breakdown</div><div id="ptList"></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoHeart+' Favorites</div><div id="pFavs"></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoClock+' Recently Played</div><div id="pRecent"></div></div>');
        document.write('<div class="ps"><div class="pst">'+icoStar+' Achievements</div><div id="pAch"></div></div>');
        document.write('</div>');

        document.write('<div id="gOver"><div id="closeGame"><button id="closeBtn">'+icoXwhite+'</button></div><iframe id="gFrame" allow="autoplay;fullscreen;keyboard"></iframe></div>');

        document.write('<main><div class="dg">');
        document.write('<div class="ditem"><div class="dl">Status</div><div class="dv" style="color:var(--grn);display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#22c55e"><circle cx="12" cy="12" r="10"/></svg> Online</div></div>');
        document.write('<div class="ditem"><div class="dl">Resources</div><div class="dv" id="rCount"></div></div>');
        document.write('<div class="ditem"><div class="dl">System Date</div><div class="dv" id="sDate"></div></div>');
        document.write('</div>');
        document.write('<div class="wt"><div class="wg" id="wg"></div><div class="ws" id="ws"></div></div>');
        document.write('<div class="sw"><input type="text" id="sb" class="sbar" placeholder="Search games..."><button class="sclr" id="sc">'+icoXwhite+'</button></div>');
        document.write('<div id="favSec"><div class="slbl">'+icoHeart+' Favorites</div><div id="favGrid"></div></div>');
        document.write('<div id="recSec"><div class="slbl">'+icoClock+' Recently Played</div><div id="recGrid"></div></div>');
        document.write('<div id="allSec"><div class="slbl">'+icoController+' All Games</div><div id="list"></div></div>');
        document.write('<div id="noRes"><div style="margin-bottom:14px;">'+icoControllerLg.replace('18','70').replace('18','70')+'</div><div style="font-size:15px;font-weight:600;">No games found</div><div style="font-size:13px;margin-top:6px;color:var(--t3);">Try a different search</div></div>');
        document.write('</main></body></html>');
        document.close();

        document.getElementById('rCount').innerText = gCount + ' Active';
        document.getElementById('sDate').innerText = cDate;
        document.getElementById('uName').innerText = userName;
        document.getElementById('phName').innerText = userName;
        var hr=new Date().getHours(), gr=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
        document.getElementById('wg').innerText = gr + ', ' + userName;
        document.getElementById('ws').innerText = 'You have ' + gCount + ' games available. What are we playing today?';
        var mbDate=new Date(parseInt(localStorage.getItem(mbK))).toLocaleDateString('en-US',{month:'long',year:'numeric'});
        document.getElementById('phSub').innerText = 'Member since ' + mbDate;
        aTh(gTh());

        function rPfp(){var p=localStorage.getItem(pfpK),c=document.getElementById('pfpCircle'),a=document.getElementById('phAv');if(p){c.innerHTML='<img src="'+p+'">';a.innerHTML='<img src="'+p+'">';}else{c.innerText=userName.charAt(0).toUpperCase();a.innerText=userName.charAt(0).toUpperCase();}}
        rPfp();

        function toast(msg,icon){
            var t=document.createElement('div');
            t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(70px);background:var(--s2);border:1px solid var(--b2);color:var(--t1);padding:12px 20px;border-radius:14px;font-size:13px;font-weight:600;z-index:9999;display:flex;align-items:center;gap:8px;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .35s;opacity:0;white-space:nowrap;backdrop-filter:blur(10px);';
            t.innerHTML=(icon||icoController)+' '+msg;document.body.appendChild(t);
            requestAnimationFrame(function(){t.style.transform='translateX(-50%) translateY(0)';t.style.opacity='1';});
            setTimeout(function(){t.style.transform='translateX(-50%) translateY(70px)';t.style.opacity='0';setTimeout(function(){t.remove();},400);},2800);
        }

        function chkAch(prev){var now=gAch();now.forEach(function(a,i){if(a.u&&!prev[i].u)setTimeout(function(){toast('Achievement: '+a.name,a.icon);},400);});}

        function updPanel(){
            var st=gSt(),tot=totT(),fv=gFv(),rc=gRc(),mp=mpGame();
            document.getElementById('sg').innerHTML=
                '<div class="sc"><div class="sci">'+icoClock+'</div><div class="scv">'+fmtT(tot)+'</div><div class="scl">Playtime</div></div>'+
                '<div class="sc"><div class="sci">'+icoController+'</div><div class="scv">'+Object.keys(st).length+'</div><div class="scl">Games Played</div></div>'+
                '<div class="sc"><div class="sci">'+icoStar+'</div><div class="scv" title="'+(mp||'')+'">'+((mp&&mp.length>10)?mp.slice(0,10)+'...':mp||'—')+'</div><div class="scl">Top Game</div></div>'+
                '<div class="sc"><div class="sci">'+icoHeart+'</div><div class="scv">'+fv.length+'</div><div class="scl">Favorites</div></div>';
            var ents=Object.entries(st).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
            document.getElementById('ptList').innerHTML=ents.length?ents.map(function(e){return '<div class="pti"><div class="pth"><span class="ptn">'+e[0]+'</span><span class="ptt">'+fmtT(e[1])+'</span></div><div class="ptbg"><div class="ptb" data-w="'+Math.round(e[1]/ents[0][1]*100)+'%"></div></div></div>';}).join(''):'<div style="color:var(--t2);font-size:13px;">No playtime yet</div>';
            setTimeout(function(){document.querySelectorAll('.ptb').forEach(function(b){b.style.width=b.dataset.w;});},60);
            document.getElementById('pFavs').innerHTML=fv.length?fv.map(function(n){return '<div style="padding:9px 12px;background:var(--s2);border-radius:10px;margin-bottom:6px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;">'+icoHeart+' '+n+'</div>';}).join(''):'<div style="color:var(--t2);font-size:13px;">No favorites yet</div>';
            document.getElementById('pRecent').innerHTML=rc.length?rc.slice(0,5).map(function(n,i){var t2=st[n]?fmtT(st[n]):'';return '<div class="ri"><span class="rin">'+(i+1)+'</span><span class="rim">'+n+'</span>'+(t2?'<span class="rit">'+t2+'</span>':'')+'</div>';}).join(''):'<div style="color:var(--t2);font-size:13px;">No games yet</div>';
            document.getElementById('pAch').innerHTML=gAch().map(function(a){return '<div class="ach'+(a.u?'':' locked')+'"><div class="aci">'+a.icon+'</div><div><div class="acn">'+a.name+'</div><div class="acd">'+a.desc+'</div></div></div>';}).join('');
        }

        function openPanel(){updPanel();document.getElementById('pPanel').classList.add('open');document.getElementById('pOv').classList.add('open');drp.classList.remove('open');}
        function closePanel(){document.getElementById('pPanel').classList.remove('open');document.getElementById('pOv').classList.remove('open');}
        document.getElementById('settingsBtn').onclick=openPanel;
        document.getElementById('pdMi').onclick=openPanel;
        document.getElementById('phClose').onclick=closePanel;
        document.getElementById('pOv').onclick=closePanel;
        document.getElementById('avMi').onclick=function(){document.getElementById('pfpInp').click();drp.classList.remove('open');};
        document.getElementById('phAv').onclick=function(){document.getElementById('pfpInp').click();};
        document.getElementById('pfpInp').onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onloadend=function(){localStorage.setItem(pfpK,r.result);rPfp();};r.readAsDataURL(f);};
        document.querySelectorAll('.tbtn').forEach(function(b){b.onclick=function(){aTh(b.dataset.theme);};});

        var drp=document.getElementById('drp');
        document.getElementById('toggleM').onclick=function(e){e.stopPropagation();drp.classList.toggle('open');};
        document.getElementById('soBtn').onclick=function(){svCurTime();localStorage.removeItem('gameLibSession');location.reload();};
        window.onclick=function(){drp.classList.remove('open');};

        var sbEl=document.getElementById('sb'),scEl=document.getElementById('sc');
        sbEl.oninput=function(){scEl.classList.toggle('on',sbEl.value.length>0);doFilter();};
        scEl.onclick=function(){sbEl.value='';scEl.classList.remove('on');doFilter();};
        function doFilter(){var v=sbEl.value.toLowerCase(),vis=0;document.querySelectorAll('#list .card').forEach(function(c){var show=c.dataset.name.toLowerCase().includes(v);if(show){c.style.display='flex';setTimeout(function(){c.style.opacity='1';},10);vis++;}else{c.style.opacity='0';setTimeout(function(){if(!c.dataset.name.toLowerCase().includes(sbEl.value.toLowerCase()))c.style.display='none';},250);}});document.getElementById('noRes').style.display=(vis===0&&v.length>0)?'block':'none';}

        function mkCard(name,gd,container,isAllGames){
            var c=document.createElement('div');c.className='card';c.dataset.name=name;var ic=gd.icon;
            var heartHtml=isAllGames?'<button class="hrt'+(isFv(name)?' on':'')+'" data-g="'+name+'">'+icoHeartBtn+'</button>':'';
            c.innerHTML=heartHtml+'<div class="ib">'+(ic?'<img src="https://drive.google.com/uc?export=view&id='+ic+'" onload="this.style.opacity=1">':'')+'<div class="play">'+icoPlay+'</div></div><div class="cn">'+name+'</div>';
            if(isAllGames){c.querySelector('.hrt').onclick=function(e){e.stopPropagation();togFv(name);var on=isFv(name);document.querySelectorAll('.hrt[data-g="'+name+'"]').forEach(function(h){h.classList.toggle('on',on);});rFav();toast(on?'Added to favorites':'Removed from favorites',icoHeart);};}
            c.onclick=function(){launchGame(name,gd);};
            container.appendChild(c);
        }

        function rFav(){var fv=gFv(),sec=document.getElementById('favSec'),grid=document.getElementById('favGrid');if(!fv.length){sec.style.display='none';return;}sec.style.display='block';grid.innerHTML='';fv.forEach(function(n){if(games[n])mkCard(n,games[n],grid,false);});}
        function rRec(){var rc=gRc(),sec=document.getElementById('recSec'),grid=document.getElementById('recGrid');if(!rc.length){sec.style.display='none';return;}sec.style.display='block';grid.innerHTML='';rc.slice(0,6).forEach(function(n){if(games[n])mkCard(n,games[n],grid,false);});}
        function rAll(){var sec=document.getElementById('allSec'),listDiv=document.getElementById('list');sec.style.display='block';listDiv.innerHTML='';Object.keys(games).forEach(function(name,idx){var c=mkCard(name,games[name],listDiv,true);});}

        var overlay=document.getElementById('gOver'),frame=document.getElementById('gFrame');
        var curGame=null,curStart=null,writeGameOpen=false;
        function svCurTime(){if(curGame&&curStart){aTime(curGame,Date.now()-curStart);curStart=null;}}
        window.addEventListener('beforeunload',svCurTime);
        function consDelta(){var delta=localStorage.getItem('_gameTimeDelta');if(delta){try{var d=JSON.parse(delta);if(d&&d.name&&d.ms){var prev=gAch();aTime(d.name,d.ms);localStorage.removeItem('_gameTimeDelta');chkAch(prev);}}catch(e){}}}
        setInterval(consDelta,2000);
        window.addEventListener('focus',function(){writeGameOpen=false;consDelta();});

        document.getElementById('closeBtn').onclick=function(){
            var prev=gAch();svCurTime();curGame=null;chkAch(prev);
            overlay.classList.remove('vis');
            document.getElementById('npBadge').classList.remove('on');
            setTimeout(function(){overlay.style.display='none';frame.classList.remove('ld');frame.srcdoc='';document.body.style.overflow='auto';},350);
        };

        var lastAct=Date.now();
        function resetAct(){lastAct=Date.now();}
        ['click','keydown','mousemove','touchstart','scroll'].forEach(function(ev){window.addEventListener(ev,resetAct,{passive:true});});
        setInterval(function(){
            var playing=overlay&&overlay.style.display==='flex';
            if(playing||writeGameOpen)resetAct();
            var rem=Math.max(0,sessionLimit-(Date.now()-lastAct));
            if(rem===0){svCurTime();localStorage.removeItem('gameLibSession');location.reload();}
        },1000);

        async function launchGame(name,gd){
            var prev=gAch();aRc(name);rRec();
            try{
                var res=await fetch(gd.url);if(!res.ok)throw new Error();
                var h=await res.text();
                if(gd.type==='write'){
                    writeGameOpen=true;
                    var t0=Date.now(),opener=window;
                    var nw=window.open('https://www.google.com','_blank');
                    if(nw){
                        nw.addEventListener('load',function(){
                            nw.document.open();nw.document.write(h);nw.document.title=name;nw.document.close();
                            setTimeout(function(){
                                var dw=false;
                                function wDelta(){if(dw)return;dw=true;try{localStorage.setItem('_gameTimeDelta',JSON.stringify({name:name,ms:Date.now()-t0,ts:Date.now()}));}catch(e){}}
                                var btn=nw.document.createElement('button');
                                btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                                btn.style.cssText='position:fixed;top:20px;right:20px;z-index:99999999;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);width:40px;height:40px;border-radius:50%;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(5px);transition:.2s;padding:0;';
                                btn.onmouseover=function(){this.style.background='#f87171';this.style.borderColor='#f87171';};
                                btn.onmouseout=function(){this.style.background='rgba(255,255,255,.1)';this.style.borderColor='rgba(255,255,255,.2)';};
                                btn.onclick=function(){wDelta();try{opener.focus();}catch(e){}nw.close();};
                                nw.document.body.appendChild(btn);
                                nw.addEventListener('beforeunload',wDelta);
                            },500);
                        });
                    }else alert('Pop-up blocked! Please allow pop-ups.');
                }else{
                    curGame=name;curStart=Date.now();
                    document.body.style.overflow='hidden';
                    overlay.style.display='flex';
                    var npb=document.getElementById('npBadge'),npt=document.getElementById('npTxt');
                    if(npb)npb.classList.add('on');
                    if(npt)npt.innerText='Now Playing: '+name;
                    requestAnimationFrame(function(){overlay.classList.add('vis');});
                    frame.srcdoc=h;
                    frame.onload=function(){frame.classList.add('ld');setTimeout(function(){try{frame.contentWindow.focus();}catch(e){}},100);};
                }
                chkAch(prev);
            }catch(e){alert('Failed to load asset. Please verify the link is active.');}
        }

        rFav();
        rRec();
        rAll();
    }
})();
