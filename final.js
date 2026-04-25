(async function _main() {
    localStorage.setItem('_bookmarkletSrc', _main.toString());
    var sheetId = '1-fLK1EJH9TxtmaA9Cksy66XgK3u6imn1-CksGjQ7WWc';
    var vaultUrl = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/export?format=csv';
    var sessionLimit = 30 * 60 * 1000;
    var savedData = localStorage.getItem('gameLibSession');
    if (savedData) {
        try { var sess = JSON.parse(savedData); if (Date.now() - sess.time < sessionLimit) { loadLibrary(sess.games, sess.user || 'User', sess.time); return; } } catch(e) {}
    }

    var fontsLink = document.createElement('link');
    fontsLink.rel = 'stylesheet';
    fontsLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(fontsLink);

    var bg = document.createElement('div');
    bg.style = 'all:initial;position:fixed;inset:0;z-index:2147483647;display:block;';
    var shadow = bg.attachShadow({mode: 'open'});
    shadow.innerHTML = '<style>'+
        '*{box-sizing:border-box;margin:0;padding:0;font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,monospace;}'+
        '.lroot{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;color:#f4ede4;font-size:16px;line-height:1.5;}'+
        '#lbg{position:absolute;inset:0;background:#0c0a09;}'+
        '#lbg::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.06;background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>");mix-blend-mode:overlay;}'+
        '#lbg::after{content:"";position:absolute;top:-20%;left:-10%;width:60%;height:70%;background:radial-gradient(ellipse,rgba(234,88,12,.18),transparent 60%);filter:blur(60px);pointer-events:none;}'+
        '#lcard{position:relative;width:380px;max-width:90vw;border:1px solid #44403c;background:linear-gradient(180deg,rgba(28,25,23,.85),rgba(12,10,9,.85));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:2.5rem 2.25rem;}'+
        '#lcard::before{content:"";position:absolute;top:-1px;left:-1px;width:40px;height:3px;background:#ea580c;}'+
        '.llabel{display:inline-block;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#ea580c;border:1px solid #ea580c;padding:.2rem .55rem;margin-bottom:1.5rem;}'+
        '.lt{font-family:"Fraunces",Georgia,serif;font-weight:300;font-size:2.4rem;line-height:1;letter-spacing:-.035em;margin-bottom:.5rem;color:#f4ede4;}'+
        '.lt em{font-style:italic;font-weight:500;color:#ea580c;}'+
        '.ls{color:#a8a29e;font-size:.82rem;margin-bottom:2rem;}'+
        '.lflabel{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#a8a29e;margin-bottom:.55rem;display:flex;justify-content:space-between;}'+
        '.lflabel .num{color:#ea580c;}'+
        '.lf{position:relative;margin-bottom:1.1rem;}'+
        '.lf input{display:block;width:100%;padding:.85rem 2.6rem .85rem 1rem;background:#0c0a09;color:#f4ede4;border:1px solid #44403c;font-size:.9rem;outline:none;transition:border-color .15s;line-height:1.4;border-radius:0;-webkit-appearance:none;appearance:none;}'+
        '.lf input:focus{border-color:#ea580c;}'+
        '.lf input::placeholder{color:#a8a29e;opacity:.5;}'+
        '.lico{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);color:#a8a29e;cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center;transition:color .15s;}'+
        '.lico:hover{color:#ea580c;}'+
        '#lBtn{display:flex;width:100%;padding:.9rem;background:#ea580c;color:#0c0a09;border:1px solid #ea580c;font-weight:600;font-size:.9rem;cursor:pointer;letter-spacing:.05em;transition:all .15s;align-items:center;justify-content:center;gap:.5rem;border-radius:0;-webkit-appearance:none;appearance:none;}'+
        '#lBtn:hover:not(:disabled){background:#f4ede4;border-color:#f4ede4;}'+
        '#lBtn:disabled{opacity:.6;cursor:not-allowed;}'+
        '.lsp{display:none;width:14px;height:14px;border:2px solid rgba(12,10,9,.3);border-top-color:#0c0a09;border-radius:50%;animation:spn .7s linear infinite;}'+
        '@keyframes spn{to{transform:rotate(360deg);}}'+
        '#lMsg{margin-top:1rem;padding:.65rem .85rem;background:rgba(220,38,38,.1);border-left:2px solid #dc2626;color:#fca5a5;font-size:.8rem;display:none;animation:shk .35s ease;}'+
        '@keyframes shk{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}'+
        'svg{display:block;}'+
        '</style>'+
        '<div class="lroot">'+
        '<div id="lbg"></div>'+
        '<div id="lcard">'+
            '<div class="llabel">Authentication</div>'+
            '<div class="lt">Welcome to the <em>library</em>.</div>'+
            '<div class="ls">Enter your credentials to continue.</div>'+
            '<div class="lflabel"><span><span class="num">§</span> Username</span><span>01</span></div>'+
            '<div class="lf"><input id="u" type="text" placeholder="username" autocomplete="off" spellcheck="false"><span class="lico"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>'+
            '<div class="lflabel"><span><span class="num">§</span> Password</span><span>02</span></div>'+
            '<div class="lf"><input id="p" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"><span class="lico" id="eyeBtn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span></div>'+
            '<button id="lBtn"><span id="lBtnTxt">Sign In</span><div class="lsp" id="lSpin"></div></button>'+
            '<div id="lMsg">\u26A0 Invalid credentials.</div>'+
        '</div>'+
        '</div>';
    document.body.appendChild(bg);
    shadow.getElementById('u').focus();
    shadow.getElementById('eyeBtn').onclick = function() {
        var p=shadow.getElementById('p'); var isPass=p.type==='password'; p.type=isPass?'text':'password';
        this.innerHTML=isPass?'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    };
    function setLoading(on){var b=shadow.getElementById('lBtn'),t=shadow.getElementById('lBtnTxt'),s=shadow.getElementById('lSpin');b.disabled=on;t.style.display=on?'none':'inline';s.style.display=on?'block':'none';}
    shadow.getElementById('p').onkeydown=function(e){if(e.key==='Enter')shadow.getElementById('lBtn').click();};
    shadow.getElementById('u').onkeydown=function(e){if(e.key==='Enter')shadow.getElementById('p').focus();};
    shadow.getElementById('lBtn').onclick=async function(){
        var uIn=shadow.getElementById('u').value.trim(),pIn=shadow.getElementById('p').value.trim();
        var msg=shadow.getElementById('lMsg');msg.style.display='none';setLoading(true);var lt=Date.now();
        try{
            var res=await fetch(vaultUrl+'&t='+Date.now());if(!res.ok)throw new Error();
            var pr=(await res.text()).split(/\r?\n/).map(function(r){var row=r.trim(),cols=[],inQ=false,cur='';for(var i=0;i<row.length;i++){var c=row[i];if(c==='"'&&row[i+1]==='"'){cur+='"';i++;}else if(c==='"'){inQ=!inQ;}else if(c===','&&!inQ){cols.push(cur);cur='';}else cur+=c;}cols.push(cur);return cols;});
            var cfg={},gms={},jsp='';
            pr.forEach(function(c){c.forEach(function(x){if(x&&x.trim().startsWith('http')&&x.includes('jsdelivr')){jsp=x.trim();if(!jsp.endsWith('/'))jsp+='/';}});});
            pr.forEach(function(c){if(c[0]&&c[1]&&c[0].trim()!=='')cfg[c[0].trim().toLowerCase()]=c[1].trim();if(c[2]&&c[3]&&c[2].trim()!==''){var n=c[2].trim(),p=c[3].trim();gms[n]={url:p.startsWith('http')?p:(jsp+p),icon:(c[4]||'').trim(),type:(c[5]||'').trim().toLowerCase()};}});
            if(cfg[uIn.toLowerCase()]===pIn){localStorage.setItem('gameLibSession',JSON.stringify({time:lt,games:gms,user:uIn}));bg.style.transition='opacity .4s';bg.style.opacity='0';setTimeout(function(){bg.remove();loadLibrary(gms,uIn,lt);},400);}else throw new Error();
        }catch(e){setLoading(false);msg.style.display='block';msg.style.animation='none';requestAnimationFrame(function(){msg.style.animation='';});}
    };

    function loadLibrary(games,userName,startTime){
        var gCount=Object.keys(games).length,cDate=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        var pfpK='userPfp_'+userName.toLowerCase(),stK='gameStats_'+userName.toLowerCase();
        var fvK='gameFavs_'+userName.toLowerCase(),rcK='gameRecent_'+userName.toLowerCase();
        var thK='gameTheme_'+userName.toLowerCase(),mbK='gameMember_'+userName.toLowerCase();
        if(!localStorage.getItem(mbK))localStorage.setItem(mbK,Date.now().toString());
        (function(){var p=localStorage.getItem('_gameTimeDelta');if(p){try{var d=JSON.parse(p);if(d&&d.name&&d.ms&&(Date.now()-(d.ts||0))<7200000){var s=JSON.parse(localStorage.getItem(stK)||'{}');s[d.name]=(s[d.name]||0)+d.ms;localStorage.setItem(stK,JSON.stringify(s));}localStorage.removeItem('_gameTimeDelta');}catch(e){}}})();
        function gSt(){try{return JSON.parse(localStorage.getItem(stK))||{};}catch(e){return{};}}
        function sSt(s){localStorage.setItem(stK,JSON.stringify(s));}
        function aTime(n,ms){if(!n||ms<500)return;var s=gSt();s[n]=(s[n]||0)+ms;sSt(s);}
        function gFv(){try{return JSON.parse(localStorage.getItem(fvK))||[];}catch(e){return[];}}
        function togFv(n){var f=gFv();var i=f.indexOf(n);if(i>-1)f.splice(i,1);else f.unshift(n);localStorage.setItem(fvK,JSON.stringify(f));}
        function isFv(n){return gFv().indexOf(n)>-1;}
        function gRc(){try{return JSON.parse(localStorage.getItem(rcK))||[];}catch(e){return[];}}
        function aRc(n){var r=gRc().filter(function(x){return x!==n;});r.unshift(n);localStorage.setItem(rcK,JSON.stringify(r.slice(0,10)));}
        function gTh(){return localStorage.getItem(thK)||'dark';}
        function aTh(t){document.body.classList.toggle('light',t==='light');localStorage.setItem(thK,t);document.querySelectorAll('.tbtn').forEach(function(b){b.classList.toggle('active',b.dataset.theme===t);});}
        function fmtT(ms){var s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;if(h>0)return h+'h '+m+'m';if(m>0)return m+'m '+sc+'s';return sc>0?sc+'s':'<1s';}
        function totT(){return Object.values(gSt()).reduce(function(a,b){return a+b;},0);}
        function mpGame(){var s=gSt(),k=Object.keys(s);return k.length?k.reduce(function(a,b){return s[a]>s[b]?a:b;}):null;}

        var icoUser='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        var icoHeart='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        var icoHeartFill='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        var icoClock='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        var icoStar='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        var icoController='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="0"/><path d="M6 3v4M18 3v4M8 21v-4M16 21v-4M10 11h4"/></svg>';
        var icoMoon='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        var icoX='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        var icoXLg='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        var icoPlay='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 6,20 20,12"/></svg>';
        var icoImg='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="0"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
        var icoSearch='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

        function gAch(){var s=gSt(),tot=totT(),fv=gFv(),rc=gRc();return[
            {icon:icoController,name:'First Launch',desc:'Opened your first game',u:rc.length>=1},
            {icon:icoController,name:'Explorer',desc:'Played 3 different games',u:Object.keys(s).length>=3},
            {icon:icoController,name:'Game Hopper',desc:'Played 5 different games',u:Object.keys(s).length>=5},
            {icon:icoClock,name:'Dedicated',desc:'1 hour total playtime',u:tot>=3600000},
            {icon:icoClock,name:'Marathon',desc:'5 hours total playtime',u:tot>=18000000},
            {icon:icoHeart,name:'Collector',desc:'Favorited 3 games',u:fv.length>=3},
            {icon:icoHeart,name:'Curator',desc:'Favorited 5 games',u:fv.length>=5},
            {icon:icoStar,name:'Regular',desc:'10 game sessions',u:rc.length>=10}
        ];}

        document.open();
        document.write('<!DOCTYPE html><html><head><title>Game Library</title><meta name="viewport" content="width=device-width,initial-scale=1">');
        document.write('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
        document.write('<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">');
        document.write('<style>');
        document.write(':root{color-scheme:dark;--bg:#0c0a09;--bg2:#1c1917;--line:#292524;--line2:#44403c;--ink:#f4ede4;--ink-dim:#a8a29e;--accent:#ea580c;--accent2:#fbbf24;--red:#f87171;--grn:#22c55e;--serif:"Fraunces",Georgia,"Times New Roman",serif;--mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;}');
        document.write('body.light{color-scheme:light;--bg:#f5f1ea;--bg2:#ebe5db;--line:#d6cdbf;--line2:#a8a29e;--ink:#1c1917;--ink-dim:#57534e;--accent:#c2410c;}');
        document.write('*{box-sizing:border-box;margin:0;padding:0;}');
        document.write('html,body{height:100%;}');
        document.write('body{font-family:var(--mono);background:var(--bg);color:var(--ink);line-height:1.5;overflow-x:hidden;position:relative;transition:background .25s,color .25s;}');
        document.write('body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.06;background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>");mix-blend-mode:overlay;}');
        document.write('body.light::before{opacity:.04;}');
        document.write('body::after{content:"";position:fixed;top:-20%;left:-10%;width:60%;height:70%;background:radial-gradient(ellipse,rgba(234,88,12,.18),transparent 60%);pointer-events:none;z-index:-1;filter:blur(60px);}');
        document.write('body.light::after{opacity:.4;}');

        document.write('.container{max-width:1200px;margin:0 auto;padding:1.75rem 2.5rem 6rem;min-height:100vh;display:flex;flex-direction:column;}');
        document.write('@media(max-width:640px){.container{padding:1.5rem 1.25rem 5rem;}}');

        // Top nav
        document.write('header{display:flex;justify-content:space-between;align-items:center;padding-bottom:1.25rem;border-bottom:1px solid var(--line);margin-bottom:3rem;gap:1rem;}');
        document.write('.logo{font-family:var(--serif);font-style:italic;font-size:1.4rem;font-weight:400;letter-spacing:-.02em;cursor:default;}');
        document.write('.logo b{font-weight:700;font-style:normal;color:var(--accent);}');
        document.write('.nav-right{display:flex;align-items:center;gap:.75rem;}');
        document.write('#npBadge{display:none;align-items:center;gap:.5rem;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}');
        document.write('#npBadge.on{display:flex;}');
        document.write('#npDot{width:7px;height:7px;background:var(--grn);border-radius:50%;flex-shrink:0;animation:npp 1.4s ease-in-out infinite;box-shadow:0 0 8px var(--grn);}');
        document.write('@keyframes npp{0%,100%{opacity:1;}50%{opacity:.4;}}');

        document.write('.umenu{position:relative;}');
        document.write('.uinfo{display:flex;align-items:center;gap:.6rem;background:transparent;padding:.4rem .85rem;border:1px solid var(--line2);font-size:.78rem;cursor:pointer;transition:all .15s;user-select:none;color:var(--ink);font-family:var(--mono);}');
        document.write('.uinfo:hover{border-color:var(--accent);color:var(--accent);}');
        document.write('#pfpCircle{width:22px;height:22px;background:var(--bg2);display:grid;place-items:center;font-family:var(--serif);font-size:.7rem;font-weight:600;overflow:hidden;border:1px solid var(--line2);flex-shrink:0;}');
        document.write('#pfpCircle img{width:100%;height:100%;object-fit:cover;}');
        document.write('.dd{position:absolute;top:calc(100% + .5rem);right:0;background:var(--bg);border:1px solid var(--line2);width:220px;padding:.4rem;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .15s,transform .15s;z-index:500;}');
        document.write('.dd.open{opacity:1;transform:translateY(0);pointer-events:all;}');
        document.write('.di{padding:.6rem .75rem;cursor:pointer;font-size:.78rem;color:var(--ink);display:flex;align-items:center;gap:.6rem;transition:.15s;font-family:var(--mono);}');
        document.write('.di:hover{background:var(--bg2);color:var(--accent);}');
        document.write('.ddiv{border:none;border-top:1px solid var(--line);margin:.3rem 0;}');
        document.write('.dred{color:var(--red);}');
        document.write('.dred:hover{color:#fff !important;background:#dc2626;}');

        // Hero
        document.write('.hero{display:grid;grid-template-columns:1fr;gap:2rem;align-items:end;margin-bottom:3rem;}');
        document.write('@media(min-width:880px){.hero{grid-template-columns:1.4fr 1fr;}}');
        document.write('.hero-label{display:inline-block;font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);padding:.2rem .55rem;margin-bottom:1.25rem;}');
        document.write('h1.greet{font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,6vw,4.4rem);line-height:1;letter-spacing:-.035em;margin-bottom:.85rem;}');
        document.write('h1.greet em{font-style:italic;font-weight:500;color:var(--accent);}');
        document.write('.lede{color:var(--ink-dim);font-size:.9rem;max-width:42ch;}');
        document.write('.idx{font-family:var(--serif);font-size:5.5rem;font-weight:300;line-height:1;color:var(--line2);text-align:right;user-select:none;}');
        document.write('.idx small{display:block;font-family:var(--mono);font-size:.62rem;letter-spacing:.2em;color:var(--ink-dim);margin-top:.5rem;text-transform:uppercase;}');
        document.write('@media(max-width:880px){.idx{display:none;}}');

        // Stat strip
        document.write('.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--line);margin-bottom:2.5rem;}');
        document.write('@media(max-width:600px){.dg{grid-template-columns:1fr;}.dg>*+*{border-top:1px solid var(--line);}}');
        document.write('@media(min-width:601px){.dg>*+*{border-left:1px solid var(--line);}}');
        document.write('.ditem{padding:1rem 1.25rem;position:relative;}');
        document.write('.ditem::before{content:"";position:absolute;top:-1px;left:-1px;width:24px;height:2px;background:var(--accent);}');
        document.write('.dl{color:var(--ink-dim);font-size:.62rem;font-weight:600;text-transform:uppercase;margin-bottom:.4rem;letter-spacing:.18em;}');
        document.write('.dv{color:var(--ink);font-family:var(--serif);font-size:1.05rem;font-weight:400;display:flex;align-items:center;gap:.4rem;}');

        // Search
        document.write('.sw-block{border:1px solid var(--line2);background:transparent;padding:1.5rem 1.75rem;margin-bottom:3rem;position:relative;}');
        document.write('.sw-block::before{content:"";position:absolute;top:-1px;left:-1px;width:36px;height:3px;background:var(--accent);}');
        document.write('.sw-label{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:.85rem;display:flex;justify-content:space-between;}');
        document.write('.sw-label .num{color:var(--accent);}');
        document.write('.sw{position:relative;}');
        document.write('.sb-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--ink-dim);pointer-events:none;display:grid;place-items:center;}');
        document.write('.sbar{width:100%;padding:.85rem 2.6rem .85rem 2.6rem;background:var(--bg);border:1px solid var(--line2);color:var(--ink);font-family:var(--mono);font-size:.9rem;outline:none;transition:border-color .15s;}');
        document.write('.sbar:focus{border-color:var(--accent);}');
        document.write('.sbar::placeholder{color:var(--ink-dim);opacity:.55;}');
        document.write('.sclr{position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--ink-dim);cursor:pointer;padding:.25rem;display:none;align-items:center;justify-content:center;}');
        document.write('.sclr:hover{color:var(--accent);}');
        document.write('.sclr.on{display:flex;}');

        // Section markers
        document.write('#favSec,#recSec,#allSec{display:none;margin-bottom:3rem;}');
        document.write('.slbl{font-size:.62rem;font-weight:600;text-transform:uppercase;color:var(--ink-dim);letter-spacing:.25em;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:baseline;padding-bottom:.75rem;border-bottom:1px solid var(--line);}');
        document.write('.slbl .accent{color:var(--accent);}');
        document.write('.slbl .scount{font-family:var(--mono);font-size:.62rem;color:var(--ink-dim);}');

        // Game grid
        document.write('#favGrid,#recGrid,#list{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:0;border-top:1px solid var(--line);border-left:1px solid var(--line);}');
        document.write('.card{background:transparent;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:1.5rem 1rem;cursor:pointer;transition:background .2s,color .2s;display:flex;flex-direction:column;align-items:center;gap:.85rem;position:relative;opacity:0;animation:cIn .4s ease forwards;}');
        document.write('.card:hover{background:var(--bg2);}');
        document.write('.card:hover .ib{border-color:var(--accent);}');
        document.write('.card:hover .cn{color:var(--accent);}');
        document.write('@keyframes cIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}');
        document.write('.ib{width:80px;height:80px;background:var(--bg2);display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--line2);position:relative;transition:border-color .2s;}');
        document.write('.ib img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s;position:absolute;inset:0;}');
        document.write('.play{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .15s;pointer-events:none;background:rgba(234,88,12,.85);color:#0c0a09;}');
        document.write('.card:hover .play{opacity:1;}');
        document.write('.cn{font-family:var(--serif);font-weight:400;color:var(--ink);font-size:.95rem;text-align:center;line-height:1.3;letter-spacing:-.01em;transition:color .2s;}');
        document.write('.hrt{position:absolute;top:.6rem;right:.6rem;background:none;border:none;cursor:pointer;padding:.3rem;color:var(--ink-dim);opacity:.5;transition:.15s;display:grid;place-items:center;z-index:1;}');
        document.write('.hrt:hover{opacity:1;color:var(--red);}');
        document.write('.hrt.on{opacity:1;color:var(--red);}');

        // No results
        document.write('#noRes{display:none;text-align:center;padding:3.5rem 1.25rem;color:var(--ink-dim);border:1px dashed var(--line2);}');
        document.write('#noRes .nr-title{font-family:var(--serif);font-size:1.4rem;font-weight:400;font-style:italic;color:var(--ink);margin-bottom:.4rem;}');
        document.write('#noRes .nr-sub{font-size:.78rem;color:var(--ink-dim);}');

        // Profile panel
        document.write('#pOv{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);z-index:2999;opacity:0;pointer-events:none;transition:opacity .3s;}');
        document.write('#pOv.open{opacity:1;pointer-events:all;}');
        document.write('#pPanel{position:fixed;top:0;right:-440px;width:420px;max-width:100vw;height:100%;background:var(--bg);border-left:1px solid var(--line2);z-index:3000;overflow-y:auto;transition:right .35s cubic-bezier(.4,0,.2,1);scrollbar-width:thin;}');
        document.write('#pPanel.open{right:0;}');
        document.write('#pPanel::-webkit-scrollbar{width:6px;}');
        document.write('#pPanel::-webkit-scrollbar-thumb{background:var(--line2);}');

        document.write('.ph{padding:2rem 1.75rem 1.5rem;border-bottom:1px solid var(--line);position:relative;}');
        document.write('.ph::before{content:"";position:absolute;top:0;left:0;width:48px;height:3px;background:var(--accent);}');
        document.write('.phClose{position:absolute;top:1.25rem;right:1.25rem;background:transparent;border:1px solid var(--line2);color:var(--ink-dim);width:32px;height:32px;cursor:pointer;display:grid;place-items:center;transition:.15s;}');
        document.write('.phClose:hover{border-color:var(--red);color:var(--red);}');
        document.write('.phLabel{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem;}');
        document.write('.phRow{display:flex;align-items:center;gap:1rem;}');
        document.write('.phAv{width:64px;height:64px;background:var(--bg2);border:1px solid var(--line2);display:grid;place-items:center;font-family:var(--serif);font-size:1.5rem;font-weight:500;color:var(--ink);overflow:hidden;cursor:pointer;flex-shrink:0;transition:border-color .15s;}');
        document.write('.phAv:hover{border-color:var(--accent);}');
        document.write('.phAv img{width:100%;height:100%;object-fit:cover;}');
        document.write('.phName{font-family:var(--serif);font-size:1.6rem;font-weight:400;letter-spacing:-.02em;line-height:1;margin-bottom:.3rem;}');
        document.write('.phSub{font-size:.7rem;color:var(--ink-dim);letter-spacing:.05em;}');

        document.write('.ps{padding:1.5rem 1.75rem;border-bottom:1px solid var(--line);}');
        document.write('.ps:last-child{border-bottom:none;}');
        document.write('.pst{font-size:.62rem;font-weight:600;text-transform:uppercase;color:var(--ink-dim);letter-spacing:.25em;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:baseline;}');
        document.write('.pst .accent{color:var(--accent);}');

        document.write('.trow{display:flex;border:1px solid var(--line2);}');
        document.write('.tbtn{flex:1;padding:.65rem;border:none;cursor:pointer;font-size:.7rem;font-family:var(--mono);font-weight:500;letter-spacing:.1em;text-transform:uppercase;background:transparent;color:var(--ink-dim);transition:.15s;}');
        document.write('.tbtn+.tbtn{border-left:1px solid var(--line2);}');
        document.write('.tbtn.active{background:var(--accent);color:var(--bg);}');

        document.write('.sg{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);}');
        document.write('.sc{padding:.85rem 1rem;}');
        document.write('.sc:nth-child(2),.sc:nth-child(4){border-left:1px solid var(--line);}');
        document.write('.sc:nth-child(3),.sc:nth-child(4){border-top:1px solid var(--line);}');
        document.write('.sci{margin-bottom:.4rem;color:var(--accent);display:flex;}');
        document.write('.scv{font-family:var(--serif);font-size:1.15rem;font-weight:400;color:var(--ink);margin-bottom:.15rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em;}');
        document.write('.scl{font-size:.6rem;color:var(--ink-dim);text-transform:uppercase;font-weight:500;letter-spacing:.18em;}');

        document.write('.pti{margin-bottom:.85rem;}');
        document.write('.pti:last-child{margin-bottom:0;}');
        document.write('.pth{display:flex;justify-content:space-between;margin-bottom:.35rem;align-items:baseline;gap:.75rem;}');
        document.write('.ptn{font-size:.78rem;color:var(--ink);font-family:var(--serif);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}');
        document.write('.ptt{font-size:.7rem;color:var(--accent);font-family:var(--mono);font-weight:500;flex-shrink:0;}');
        document.write('.ptbg{height:2px;background:var(--line);overflow:hidden;}');
        document.write('.ptb{height:100%;background:var(--accent);width:0;transition:width 1s cubic-bezier(.4,0,.2,1);}');

        document.write('.ach{display:flex;align-items:center;gap:.85rem;padding:.75rem .85rem;border:1px solid var(--line);margin-bottom:.4rem;transition:.2s;}');
        document.write('.ach:last-child{margin-bottom:0;}');
        document.write('.ach.locked{opacity:.3;}');
        document.write('.ach:not(.locked){border-color:var(--line2);}');
        document.write('.aci{color:var(--accent);display:flex;flex-shrink:0;}');
        document.write('.ach.locked .aci{color:var(--ink-dim);}');
        document.write('.acn{font-family:var(--serif);font-size:.85rem;font-weight:500;color:var(--ink);letter-spacing:-.01em;}');
        document.write('.acd{font-size:.68rem;color:var(--ink-dim);margin-top:.1rem;letter-spacing:.02em;}');

        document.write('.ri{display:flex;align-items:center;gap:.6rem;padding:.55rem .25rem;border-bottom:1px dashed var(--line);font-size:.78rem;}');
        document.write('.ri:last-child{border-bottom:none;}');
        document.write('.rin{font-family:var(--serif);font-style:italic;color:var(--ink-dim);min-width:1.4rem;font-size:.78rem;}');
        document.write('.rim{flex:1;color:var(--ink);font-family:var(--serif);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}');
        document.write('.rit{font-size:.68rem;color:var(--accent);font-family:var(--mono);flex-shrink:0;}');

        document.write('.fav-li{display:flex;align-items:center;gap:.55rem;padding:.55rem .25rem;border-bottom:1px dashed var(--line);font-size:.8rem;color:var(--ink);font-family:var(--serif);}');
        document.write('.fav-li:last-child{border-bottom:none;}');
        document.write('.fav-li .fav-ico{color:var(--red);display:flex;flex-shrink:0;}');

        document.write('.empty-msg{color:var(--ink-dim);font-size:.78rem;font-style:italic;font-family:var(--serif);}');

        // Game overlay
        document.write('#gOver{position:fixed;inset:0;background:#000;z-index:2000;display:none;flex-direction:column;opacity:0;transition:opacity .3s;}');
        document.write('#gOver.vis{opacity:1;}');
        document.write('#closeGame{position:absolute;top:1rem;right:1rem;z-index:2001;}');
        document.write('#closeBtn{background:rgba(244,237,228,.08);color:#f4ede4;border:1px solid rgba(244,237,228,.2);width:40px;height:40px;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(8px);transition:.15s;padding:0;}');
        document.write('#closeBtn:hover{background:#dc2626;border-color:#dc2626;color:#fff;}');
        document.write('iframe{border:none;flex-grow:1;width:100%;height:100%;opacity:0;transition:opacity .4s;}');
        document.write('iframe.ld{opacity:1;}');

        // Footer
        document.write('footer{margin-top:auto;padding-top:1.5rem;border-top:1px solid var(--line);display:flex;justify-content:space-between;font-size:.62rem;letter-spacing:.18em;color:var(--ink-dim);text-transform:uppercase;}');

        // Toast
        document.write('.toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(60px);background:var(--bg);border:1px solid var(--line2);color:var(--ink);padding:.75rem 1.25rem;font-size:.78rem;z-index:9999;display:flex;align-items:center;gap:.6rem;font-family:var(--mono);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s;opacity:0;white-space:nowrap;}');
        document.write('.toast::before{content:"";position:absolute;top:-1px;left:-1px;width:24px;height:2px;background:var(--accent);}');
        document.write('.toast .toast-ico{color:var(--accent);display:flex;}');

        document.write('</style></head><body>');
        document.write('<div class="container">');

        // Header
        document.write('<header><div class="logo">Library<b>.</b></div>');
        document.write('<div class="nav-right">');
        document.write('<div id="npBadge"><div id="npDot"></div><span id="npTxt">Now Playing</span></div>');
        document.write('<div class="umenu"><div class="uinfo" id="toggleM"><span id="uName"></span><div id="pfpCircle"></div></div>');
        document.write('<div class="dd" id="drp">'+
            '<div class="di" id="pdMi">'+icoUser+'<span>Profile</span></div>'+
            '<div class="di" id="avMi">'+icoImg+'<span>Change Avatar</span></div>'+
            '<input type="file" id="pfpInp" style="display:none" accept="image/*">'+
            '<hr class="ddiv">'+
            '<div class="di dred" id="soBtn">'+icoX+'<span>Sign Out</span></div>'+
        '</div></div>');
        document.write('</div></header>');

        // Hero
        document.write('<section class="hero"><div>');
        document.write('<div class="hero-label">Game Library</div>');
        document.write('<h1 class="greet" id="wg"></h1>');
        document.write('<p class="lede" id="ws"></p>');
        document.write('</div><div class="idx" id="idxNum">001<small>&mdash; Index</small></div></section>');

        // Stat strip
        document.write('<section class="dg">'+
            '<div class="ditem"><div class="dl">Status</div><div class="dv" style="color:var(--grn);"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Online</div></div>'+
            '<div class="ditem"><div class="dl">Resources</div><div class="dv" id="rCount"></div></div>'+
            '<div class="ditem"><div class="dl">System Date</div><div class="dv" id="sDate"></div></div>'+
        '</section>');

        // Search
        document.write('<section class="sw-block">');
        document.write('<div class="sw-label"><span><span class="num">§</span> Search</span><span>Type to filter your library</span></div>');
        document.write('<div class="sw"><span class="sb-icon">'+icoSearch+'</span><input type="text" id="sb" class="sbar" placeholder="Search games..." autocomplete="off" spellcheck="false"><button class="sclr" id="sc">'+icoX+'</button></div>');
        document.write('</section>');

        // Sections
        document.write('<section id="favSec"><div class="slbl"><span><span class="accent">§</span> Favorites</span><span class="scount" id="favCount"></span></div><div id="favGrid"></div></section>');
        document.write('<section id="recSec"><div class="slbl"><span><span class="accent">§</span> Recently Played</span><span class="scount" id="recCount"></span></div><div id="recGrid"></div></section>');
        document.write('<section id="allSec"><div class="slbl"><span><span class="accent">§</span> All Games</span><span class="scount" id="allCount"></span></div><div id="list"></div></section>');

        document.write('<div id="noRes"><div class="nr-title">Nothing found.</div><div class="nr-sub">Try a different query.</div></div>');

        // Footer
        document.write('<footer><div>GAME LIBRARY &middot; PERSONAL</div><div id="ftYr"></div></footer>');

        document.write('</div>');

        // Profile panel
        document.write('<div id="pOv"></div><div id="pPanel">');
        document.write('<div class="ph"><button class="phClose" id="phClose">'+icoXLg+'</button>');
        document.write('<div class="phLabel">&sect; User Profile</div>');
        document.write('<div class="phRow"><div class="phAv" id="phAv"></div><div><div class="phName" id="phName"></div><div class="phSub" id="phSub"></div></div></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Appearance</span><span>01</span></div><div class="trow"><button class="tbtn" data-theme="dark">Dark</button><button class="tbtn" data-theme="light">Light</button></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Stats</span><span>02</span></div><div class="sg" id="sg"></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Playtime Breakdown</span><span>03</span></div><div id="ptList"></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Favorites</span><span>04</span></div><div id="pFavs"></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Recently Played</span><span>05</span></div><div id="pRecent"></div></div>');
        document.write('<div class="ps"><div class="pst"><span><span class="accent">&sect;</span> Achievements</span><span>06</span></div><div id="pAch"></div></div>');
        document.write('</div>');

        // Game overlay
        document.write('<div id="gOver"><div id="closeGame"><button id="closeBtn">'+icoXLg+'</button></div><iframe id="gFrame" allow="autoplay;fullscreen;keyboard"></iframe></div>');

        document.write('</body></html>');
        document.close();

        document.getElementById('rCount').innerText=gCount+' Active';
        document.getElementById('sDate').innerText=cDate;
        document.getElementById('uName').innerText=userName;
        document.getElementById('phName').innerText=userName;
        document.getElementById('ftYr').innerText=new Date().getUTCFullYear()+' \u00B7 '+gCount+' GAMES';
        var hr=new Date().getHours(),gr=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
        document.getElementById('wg').innerHTML=gr+', <em>'+userName+'</em>.';
        document.getElementById('ws').innerText='You have '+gCount+' games available. What are we playing today?';
        var mbDate=new Date(parseInt(localStorage.getItem(mbK))).toLocaleDateString('en-US',{month:'long',year:'numeric'});
        document.getElementById('phSub').innerText='Member since '+mbDate;
        aTh(gTh());

        function rPfp(){var p=localStorage.getItem(pfpK),c=document.getElementById('pfpCircle'),a=document.getElementById('phAv');if(p){c.innerHTML='<img src="'+p+'">';a.innerHTML='<img src="'+p+'">';}else{c.innerText=userName.charAt(0).toUpperCase();a.innerText=userName.charAt(0).toUpperCase();}}
        rPfp();

        function toast(msg,icon){
            var t=document.createElement('div');
            t.className='toast';
            t.innerHTML='<span class="toast-ico">'+(icon||icoController)+'</span><span>'+msg+'</span>';
            document.body.appendChild(t);
            requestAnimationFrame(function(){t.style.transform='translateX(-50%) translateY(0)';t.style.opacity='1';});
            setTimeout(function(){t.style.transform='translateX(-50%) translateY(60px)';t.style.opacity='0';setTimeout(function(){t.remove();},350);},2600);
        }

        function chkAch(prev){var now=gAch();now.forEach(function(a,i){if(a.u&&!prev[i].u)setTimeout(function(){toast('Achievement: '+a.name,a.icon);},400);});}

        function updPanel(){
            var st=gSt(),tot=totT(),fv=gFv(),rc=gRc(),mp=mpGame();
            document.getElementById('sg').innerHTML=
                '<div class="sc"><div class="sci">'+icoClock+'</div><div class="scv">'+fmtT(tot)+'</div><div class="scl">Playtime</div></div>'+
                '<div class="sc"><div class="sci">'+icoController+'</div><div class="scv">'+Object.keys(st).length+'</div><div class="scl">Games Played</div></div>'+
                '<div class="sc"><div class="sci">'+icoStar+'</div><div class="scv" title="'+(mp||'')+'">'+((mp&&mp.length>10)?mp.slice(0,10)+'...':mp||'\u2014')+'</div><div class="scl">Top Game</div></div>'+
                '<div class="sc"><div class="sci">'+icoHeart+'</div><div class="scv">'+fv.length+'</div><div class="scl">Favorites</div></div>';
            var ents=Object.entries(st).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
            document.getElementById('ptList').innerHTML=ents.length?ents.map(function(e){return '<div class="pti"><div class="pth"><span class="ptn">'+e[0]+'</span><span class="ptt">'+fmtT(e[1])+'</span></div><div class="ptbg"><div class="ptb" data-w="'+Math.round(e[1]/ents[0][1]*100)+'%"></div></div></div>';}).join(''):'<div class="empty-msg">No playtime yet.</div>';
            setTimeout(function(){document.querySelectorAll('.ptb').forEach(function(b){b.style.width=b.dataset.w;});},60);
            document.getElementById('pFavs').innerHTML=fv.length?fv.map(function(n){return '<div class="fav-li"><span class="fav-ico">'+icoHeartFill+'</span><span>'+n+'</span></div>';}).join(''):'<div class="empty-msg">No favorites yet.</div>';
            document.getElementById('pRecent').innerHTML=rc.length?rc.slice(0,5).map(function(n,i){var t2=st[n]?fmtT(st[n]):'';return '<div class="ri"><span class="rin">0'+(i+1)+'</span><span class="rim">'+n+'</span>'+(t2?'<span class="rit">'+t2+'</span>':'')+'</div>';}).join(''):'<div class="empty-msg">No games yet.</div>';
            document.getElementById('pAch').innerHTML=gAch().map(function(a){return '<div class="ach'+(a.u?'':' locked')+'"><div class="aci">'+a.icon+'</div><div><div class="acn">'+a.name+'</div><div class="acd">'+a.desc+'</div></div></div>';}).join('');
        }

        function openPanel(){updPanel();document.getElementById('pPanel').classList.add('open');document.getElementById('pOv').classList.add('open');drp.classList.remove('open');}
        function closePanel(){document.getElementById('pPanel').classList.remove('open');document.getElementById('pOv').classList.remove('open');}
        document.getElementById('pdMi').onclick=openPanel;
        document.getElementById('phClose').onclick=closePanel;
        document.getElementById('pOv').onclick=closePanel;
        document.getElementById('avMi').onclick=function(){document.getElementById('pfpInp').click();drp.classList.remove('open');};
        document.getElementById('phAv').onclick=function(){document.getElementById('pfpInp').click();};
        document.getElementById('pfpInp').onchange=function(e){
            var f=e.target.files[0];if(!f)return;
            var r=new FileReader();
            r.onloadend=function(){
                // Resize to keep localStorage from blowing up
                var img=new Image();
                img.onload=function(){
                    var max=256,canvas=document.createElement('canvas');
                    var w=img.width,h=img.height;
                    if(w>h){if(w>max){h=h*(max/w);w=max;}}else{if(h>max){w=w*(max/h);h=max;}}
                    canvas.width=w;canvas.height=h;
                    canvas.getContext('2d').drawImage(img,0,0,w,h);
                    try{localStorage.setItem(pfpK,canvas.toDataURL('image/jpeg',0.85));rPfp();}catch(err){alert('Avatar too large to save.');}
                };
                img.src=r.result;
            };
            r.readAsDataURL(f);
        };
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
            var heartHtml=isAllGames?'<button class="hrt'+(isFv(name)?' on':'')+'" data-g="'+name+'">'+(isFv(name)?icoHeartFill:icoHeart)+'</button>':'';
            c.innerHTML=heartHtml+'<div class="ib">'+(ic?'<img src="https://drive.google.com/uc?export=view&id='+ic+'" onload="this.style.opacity=1">':'')+'<div class="play">'+icoPlay+'</div></div><div class="cn">'+name+'</div>';
            if(isAllGames){c.querySelector('.hrt').onclick=function(e){e.stopPropagation();togFv(name);var on=isFv(name);document.querySelectorAll('.hrt[data-g="'+name+'"]').forEach(function(h){h.classList.toggle('on',on);h.innerHTML=on?icoHeartFill:icoHeart;});rFav();toast(on?'Added to favorites':'Removed from favorites',icoHeart);};}
            c.onclick=function(){launchGame(name,gd);};
            container.appendChild(c);
        }

        function rFav(){var fv=gFv(),sec=document.getElementById('favSec'),grid=document.getElementById('favGrid'),cnt=document.getElementById('favCount');if(!fv.length){sec.style.display='none';return;}sec.style.display='block';grid.innerHTML='';fv.forEach(function(n){if(games[n])mkCard(n,games[n],grid,false);});cnt.innerText=String(fv.length).padStart(2,'0');}
        function rRec(){var rc=gRc(),sec=document.getElementById('recSec'),grid=document.getElementById('recGrid'),cnt=document.getElementById('recCount');if(!rc.length){sec.style.display='none';return;}sec.style.display='block';grid.innerHTML='';var slice=rc.slice(0,6);slice.forEach(function(n){if(games[n])mkCard(n,games[n],grid,false);});cnt.innerText=String(slice.length).padStart(2,'0');}
        function rAll(){var sec=document.getElementById('allSec'),listDiv=document.getElementById('list'),cnt=document.getElementById('allCount');sec.style.display='block';listDiv.innerHTML='';Object.keys(games).forEach(function(name){mkCard(name,games[name],listDiv,true);});cnt.innerText=String(gCount).padStart(2,'0');}

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
            setTimeout(function(){overlay.style.display='none';frame.classList.remove('ld');frame.srcdoc='';document.body.style.overflow='auto';},300);
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
                    var nw=window.open('about:blank','_blank');
                    if(nw){
                        nw.document.open();nw.document.write(h);nw.document.title=name;nw.document.close();
                        setTimeout(function(){
                            var dw=false;
                            function wDelta(){if(dw)return;dw=true;try{localStorage.setItem('_gameTimeDelta',JSON.stringify({name:name,ms:Date.now()-t0,ts:Date.now()}));}catch(e){}}
                            var btn=nw.document.createElement('button');
                            btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4ede4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
                            btn.style.cssText='position:fixed;top:1rem;right:1rem;z-index:99999999;background:rgba(244,237,228,.08);color:#f4ede4;border:1px solid rgba(244,237,228,.2);width:40px;height:40px;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(8px);transition:.15s;padding:0;';
                            btn.onmouseover=function(){this.style.background='#dc2626';this.style.borderColor='#dc2626';};
                            btn.onmouseout=function(){this.style.background='rgba(244,237,228,.08)';this.style.borderColor='rgba(244,237,228,.2)';};
                            btn.onclick=function(){wDelta();try{opener.focus();}catch(e){}nw.close();};
                            nw.document.body.appendChild(btn);
                            nw.addEventListener('beforeunload',wDelta);
                        },300);
                    }else alert('Pop-up blocked. Please allow pop-ups.');
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
