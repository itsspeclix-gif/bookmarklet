javascript:(async function _main() {
    localStorage.setItem('_bookmarkletSrc', _main.toString());
    var sheetId = '1-fLK1EJH9TxtmaA9Cksy66XgK3u6imn1-CksGjQ7WWc';
    var vaultUrl = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/export?format=csv';
    var sessionLimit = 30 * 60 * 1000;
    var savedData = localStorage.getItem('gameLibSession');
    if (savedData) {
        try { var sess = JSON.parse(savedData); if (Date.now() - sess.time < sessionLimit) { loadLibrary(sess.games, sess.user || 'User', sess.time); return; } } catch(e) {}
    }

    var bg = document.createElement('div');
    bg.style = 'all:initial;position:fixed;inset:0;z-index:2147483647;display:block;';
    var shadow = bg.attachShadow({mode: 'open'});
    shadow.innerHTML = '<style>'+
        '*{box-sizing:border-box;margin:0;padding:0;font-family:"Courier New",monospace;}'+
        '.lroot{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;color:#fff;font-size:16px;line-height:1.5;background:#0b0c1c;}'+
        '#lbg{position:absolute;inset:0;background:radial-gradient(ellipse at center,#151730 0%,#0b0c1c 100%);}'+
        '#lbg::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.26) 2px 3px);z-index:1;}'+
        '#lcard{position:relative;width:420px;max-width:90vw;border:3px solid #000;background:#151730;padding:2.5rem 2.25rem;box-shadow:0 0 0 2px #2e3354,0 0 40px rgba(255,56,96,.4),inset 0 0 30px rgba(0,0,0,.5);border-radius:12px;}'+
        '.llabel{display:inline-block;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#ffd23f;animation:bl 1.3s steps(2) infinite;margin-bottom:1.5rem;}'+
        '@keyframes bl{50%{opacity:.1}}'+
        '.lt{font-family:"Arial Black",Arial,sans-serif;font-weight:900;font-size:2.4rem;line-height:1;letter-spacing:2px;margin-bottom:.5rem;color:#fff;text-shadow:0 0 10px #ff3860,0 0 30px rgba(255,56,96,.7),3px 3px 0 #000;}'+
        '.ls{color:#8b93c9;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:2rem;}'+
        '.lflabel{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8fe9ff;margin-bottom:.55rem;display:flex;justify-content:space-between;}'+
        '.lf{position:relative;margin-bottom:1.1rem;}'+
        '.lf input{display:block;width:100%;padding:.85rem 1rem;background:#0b0c1c;color:#fff;border:2px solid #2e3354;font-size:14px;font-weight:700;letter-spacing:1px;outline:none;transition:border-color .15s;border-radius:8px;font-family:"Courier New",monospace;}'+
        '.lf input:focus{border-color:#39c5ff;box-shadow:0 0 12px rgba(57,197,255,.5);outline:none;}'+
        '.lf input::placeholder{color:#5b6398;}'+
        '#lBtn{display:flex;width:100%;padding:.9rem;background:#ff3860;color:#fff;border:3px solid #000;font-family:"Arial Black",Arial,sans-serif;font-weight:900;font-size:16px;letter-spacing:2px;cursor:pointer;transition:all .15s;align-items:center;justify-content:center;gap:.5rem;border-radius:8px;box-shadow:0 0 20px rgba(255,56,96,.5);text-shadow:2px 2px 0 #000;}'+
        '#lBtn:hover:not(:disabled){background:#39c5ff;box-shadow:0 0 20px rgba(57,197,255,.5);text-shadow:none;}'+
        '#lBtn:disabled{opacity:.6;cursor:not-allowed;}'+
        '.lsp{display:none;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spn .7s linear infinite;}'+
        '@keyframes spn{to{transform:rotate(360deg);}}'+
        '#lMsg{margin-top:1rem;padding:.65rem .85rem;background:rgba(255,56,96,.1);border:2px solid #ff3860;color:#ff3860;font-size:11px;font-weight:700;letter-spacing:1px;display:none;text-align:center;border-radius:6px;}'+
        '</style>'+
        '<div class="lroot">'+
        '<div id="lbg"></div>'+
        '<div id="lcard">'+
            '<div class="llabel">● INSERT COIN</div>'+
            '<div class="lt">GAME VAULT</div>'+
            '<div class="ls">PLAYER 1 IDENTIFICATION</div>'+
            '<div class="lflabel"><span>USERNAME</span></div>'+
            '<div class="lf"><input id="u" type="text" placeholder="ENTER_NAME" autocomplete="off" spellcheck="false"></div>'+
            '<div class="lflabel"><span>PASSWORD</span></div>'+
            '<div class="lf"><input id="p" type="password" placeholder="********"></div>'+
            '<button id="lBtn"><span id="lBtnTxt">▶ AUTHENTICATE</span><div class="lsp" id="lSpin"></div></button>'+
            '<div id="lMsg">✖ INVALID CREDENTIALS</div>'+
        '</div>'+
        '</div>';
    document.body.appendChild(bg);
    shadow.getElementById('u').focus();
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
        }catch(e){setLoading(false);msg.style.display='block';}
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
        function aTh(t){document.body.classList.toggle('light',t==='light');localStorage.setItem(thK,t);}
        function gCrt(){return localStorage.getItem('arcadeCRT')||'on';}
        function aCrt(state){
            localStorage.setItem('arcadeCRT',state);
            document.body.classList.toggle('crt-off', state==='off');
            document.getElementById('gOver').classList.toggle('crt-off', state==='off');
            document.querySelectorAll('.crt-btn').forEach(function(b){b.classList.toggle('active',b.dataset.crt===state);});
        }
        function fmtT(ms){var s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;if(h>0)return h+'h '+m+'m';if(m>0)return m+'m '+sc+'s';return sc>0?sc+'s':'<1s';}
        function totT(){return Object.values(gSt()).reduce(function(a,b){return a+b;},0);}
        function mpGame(){var s=gSt(),k=Object.keys(s);return k.length?k.reduce(function(a,b){return s[a]>s[b]?a:b;}):null;}

        var icoUser='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        var icoHeart='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        var icoHeartFill='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        var icoClock='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        var icoStar='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        var icoController='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="0"/><path d="M6 3v4M18 3v4M8 21v-4M16 21v-4M10 11h4"/></svg>';
        var icoX='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        var icoXLg='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        var icoPlay='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 6,20 20,12"/></svg>';
        var icoImg='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="0"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
        var icoSearch='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

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
        document.write('<!DOCTYPE html><html><head><title>ARCADE_VAULT</title><meta name="viewport" content="width=device-width,initial-scale=1">');
        document.write('<style>');
        document.write(':root{color-scheme:dark;--bg:#0b0c1c;--bg2:#151730;--line:#2e3354;--line2:#3a4278;--ink:#fff;--ink-dim:#8b93c9;--pink:#ff3860;--cyan:#39c5ff;--yellow:#ffd23f;--grn:#3dfc8e;--purple:#c77dff;--arcade:"Arial Black",Arial,sans-serif;--mono:"Courier New",monospace;}');
        document.write('*{box-sizing:border-box;margin:0;padding:0;}');
        document.write('html,body{height:100%;}');
        document.write('body{font-family:var(--mono);background:var(--bg);color:var(--ink);line-height:1.5;overflow-x:hidden;position:relative;font-weight:700;}');
        
        document.write('body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.2) 2px 3px),radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%);mix-blend-mode:multiply;}');
        document.write('body::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,.15) 50%);background-size:100% 4px;pointer-events:none;z-index:9998;animation:fk 5s linear infinite;}');
        document.write('@keyframes fk{0%,90%,94%,100%{opacity:1}92%{opacity:.7}}');
        document.write('body.crt-off::before,body.crt-off::after{content:none!important;opacity:0!important;display:none!important;}');

        document.write('.container{max-width:1200px;margin:0 auto;padding:1.75rem 2.5rem 6rem;min-height:100vh;display:flex;flex-direction:column;}');

        document.write('header{display:flex;justify-content:space-between;align-items:center;padding-bottom:1.25rem;border-bottom:3px solid #000;margin-bottom:3rem;gap:1rem;}');
        document.write('.logo{font-family:var(--arcade);font-size:1.6rem;font-weight:900;letter-spacing:2px;color:#fff;text-shadow:0 0 10px #39c5ff,0 0 22px rgba(57,197,255,.8),2px 2px 0 #ff3860;}');
        document.write('.nav-right{display:flex;align-items:center;gap:.75rem;}');
        document.write('#npBadge{display:none;align-items:center;gap:.5rem;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--grn);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:900;}');
        document.write('#npBadge.on{display:flex;}');
        document.write('#npDot{width:8px;height:8px;background:var(--grn);border-radius:50%;flex-shrink:0;animation:npp 1.4s ease-in-out infinite;box-shadow:0 0 8px var(--grn);}');
        document.write('@keyframes npp{0%,100%{opacity:1;}50%{opacity:.2;}}');

        document.write('.umenu{position:relative;}');
        document.write('.uinfo{display:flex;align-items:center;gap:.6rem;background:var(--bg2);padding:.4rem .85rem;border:2px solid #000;font-size:11px;cursor:pointer;user-select:none;color:var(--ink);font-family:var(--mono);font-weight:900;letter-spacing:1px;box-shadow:0 0 0 2px var(--cyan);border-radius:6px;}');
        document.write('.uinfo:hover{box-shadow:0 0 12px var(--cyan);}');
        document.write('#pfpCircle{width:22px;height:22px;background:var(--bg);display:grid;place-items:center;font-family:var(--arcade);font-size:12px;overflow:hidden;border:2px solid #000;flex-shrink:0;}');
        document.write('#pfpCircle img{width:100%;height:100%;object-fit:cover;}');
        document.write('.dd{position:absolute;top:calc(100% + .5rem);right:0;background:var(--bg2);border:3px solid #000;width:220px;padding:.4rem;opacity:0;transform:translateY(-8px);pointer-events:none;transition:.15s;z-index:500;border-radius:8px;box-shadow:0 0 20px rgba(0,0,0,.5);}');
        document.write('.dd.open{opacity:1;transform:translateY(0);pointer-events:all;}');
        document.write('.di{padding:.6rem .75rem;cursor:pointer;font-size:11px;color:var(--ink);display:flex;align-items:center;gap:.6rem;font-weight:900;letter-spacing:1px;border-radius:4px;}');
        document.write('.di:hover{background:var(--bg);color:var(--cyan);box-shadow:inset 0 0 10px rgba(57,197,255,.2);}');
        document.write('.ddiv{border:none;border-top:2px solid var(--line);margin:.3rem 0;}');
        document.write('.dred{color:var(--pink);}');
        document.write('.dred:hover{color:#fff !important;background:var(--pink);box-shadow:0 0 12px var(--pink);}');

        document.write('.hero{display:grid;grid-template-columns:1fr;gap:2rem;align-items:end;margin-bottom:3rem;}');
        document.write('.hero-label{display:inline-block;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--yellow);font-weight:900;margin-bottom:1.25rem;animation:bl 1.3s steps(2) infinite;}');
        document.write('@keyframes bl{50%{opacity:.1}}');
        document.write('h1.greet{font-family:var(--arcade);font-weight:900;font-size:clamp(2rem,5vw,3.5rem);line-height:1;letter-spacing:2px;margin-bottom:.85rem;color:#fff;text-shadow:0 0 10px #ff3860,0 0 30px rgba(255,56,96,.7),3px 3px 0 #000;}');
        document.write('h1.greet em{font-style:normal;color:var(--cyan);text-shadow:0 0 10px #39c5ff,0 0 30px rgba(57,197,255,.7),3px 3px 0 #000;}');
        document.write('.lede{color:var(--ink-dim);font-size:12px;font-weight:700;letter-spacing:1px;}');
        document.write('.idx{font-family:var(--arcade);font-size:5.5rem;font-weight:900;line-height:1;color:var(--line);text-align:right;user-select:none;text-shadow:4px 4px 0 #000;}');
        document.write('.idx small{display:block;font-family:var(--mono);font-size:10px;letter-spacing:2px;color:var(--ink-dim);margin-top:.5rem;text-transform:uppercase;}');

        document.write('.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:3px solid #000;margin-bottom:2.5rem;border-radius:8px;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,.3);}');
        document.write('.dg>*+*{border-left:3px solid #000;}');
        document.write('.ditem{padding:1rem 1.25rem;position:relative;background:var(--bg2);}');
        document.write('.dl{color:var(--cyan);font-size:10px;font-weight:900;text-transform:uppercase;margin-bottom:.4rem;letter-spacing:2px;}');
        document.write('.dv{color:var(--ink);font-family:var(--arcade);font-size:1.05rem;font-weight:900;display:flex;align-items:center;gap:.4rem;text-shadow:0 0 8px rgba(255,255,255,.3);}');

        document.write('.sw-block{border:3px solid #000;background:var(--bg2);padding:1.5rem 1.75rem;margin-bottom:3rem;position:relative;border-radius:8px;box-shadow:0 0 0 2px var(--cyan);}');
        document.write('.sw-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--yellow);margin-bottom:.85rem;display:flex;justify-content:space-between;font-weight:900;}');
        document.write('.sw{position:relative;}');
        document.write('.sb-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--cyan);pointer-events:none;display:grid;place-items:center;}');
        document.write('.sbar{width:100%;padding:.85rem 2.6rem .85rem 2.6rem;background:var(--bg);border:2px solid var(--line2);color:var(--ink);font-family:var(--mono);font-size:14px;font-weight:700;letter-spacing:1px;outline:none;border-radius:6px;}');
        document.write('.sbar:focus{border-color:var(--cyan);box-shadow:0 0 12px rgba(57,197,255,.4);}');
        document.write('.sbar::placeholder{color:var(--ink-dim);}');
        document.write('.sclr{position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--pink);cursor:pointer;padding:.25rem;display:none;align-items:center;justify-content:center;}');
        document.write('.sclr.on{display:flex;}');

        document.write('#favSec,#recSec,#allSec{display:none;margin-bottom:3rem;}');
        document.write('.slbl{font-size:12px;font-weight:900;text-transform:uppercase;color:var(--yellow);letter-spacing:3px;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:baseline;padding-bottom:.75rem;border-bottom:3px dashed var(--line);font-family:var(--arcade);}');
        document.write('.slbl .accent{color:var(--pink);}');
        document.write('.slbl .scount{font-family:var(--mono);font-size:12px;color:var(--cyan);font-weight:900;}');

        document.write('#favGrid,#recGrid,#list{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem;}');
        document.write('.card{background:var(--bg2);border:3px solid #000;padding:1.5rem 1rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:.85rem;position:relative;opacity:0;animation:cIn .4s ease forwards;border-radius:10px;box-shadow:inset 0 0 20px rgba(0,0,0,.4);transition:.15s;}');
        document.write('.card:hover{transform:translateY(-4px);box-shadow:0 0 20px var(--cyan),inset 0 0 20px rgba(57,197,255,.1);border-color:var(--cyan);}');
        document.write('@keyframes cIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}');
        document.write('.ib{width:80px;height:80px;background:var(--bg);display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #000;position:relative;border-radius:8px;}');
        document.write('.ib img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s;position:absolute;inset:0;}');
        document.write('.play{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .15s;pointer-events:none;background:rgba(57,197,255,.9);color:#000;border-radius:6px;}');
        document.write('.card:hover .play{opacity:1;}');
        document.write('.cn{font-family:var(--arcade);font-weight:900;color:var(--ink);font-size:12px;text-align:center;line-height:1.3;letter-spacing:1px;text-shadow:2px 2px 0 #000;}');
        document.write('.hrt{position:absolute;top:.6rem;right:.6rem;background:none;border:none;cursor:pointer;padding:.3rem;color:var(--ink-dim);transition:.15s;display:grid;place-items:center;z-index:1;}');
        document.write('.hrt:hover{color:var(--pink);transform:scale(1.2);}');
        document.write('.hrt.on{color:var(--pink);filter:drop-shadow(0 0 4px var(--pink));}');

        document.write('#noRes{display:none;text-align:center;padding:3.5rem 1.25rem;color:var(--pink);border:3px dashed var(--pink);border-radius:8px;font-family:var(--arcade);letter-spacing:2px;}');

        document.write('#pOv{position:fixed;inset:0;background:rgba(11,12,28,.85);backdrop-filter:blur(4px);z-index:2999;opacity:0;pointer-events:none;transition:opacity .3s;}');
        document.write('#pOv.open{opacity:1;pointer-events:all;}');
        document.write('#pPanel{position:fixed;top:0;right:-440px;width:420px;max-width:100vw;height:100%;background:var(--bg);border-left:4px solid #000;z-index:3000;overflow-y:auto;transition:right .35s cubic-bezier(.4,0,.2,1);box-shadow:-10px 0 40px rgba(0,0,0,.5);}');
        document.write('#pPanel.open{right:0;}');

        document.write('.ph{padding:2rem 1.75rem 1.5rem;border-bottom:3px solid #000;position:relative;background:var(--bg2);}');
        document.write('.phClose{position:absolute;top:1.25rem;right:1.25rem;background:transparent;border:2px solid #000;color:var(--ink-dim);width:32px;height:32px;cursor:pointer;display:grid;place-items:center;transition:.15s;border-radius:6px;}');
        document.write('.phClose:hover{border-color:var(--pink);color:var(--pink);box-shadow:0 0 10px var(--pink);}');
        document.write('.phLabel{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--yellow);margin-bottom:.75rem;font-weight:900;}');
        document.write('.phRow{display:flex;align-items:center;gap:1rem;}');
        document.write('.phAv{width:64px;height:64px;background:var(--bg);border:3px solid #000;display:grid;place-items:center;font-family:var(--arcade);font-size:1.5rem;color:var(--cyan);overflow:hidden;cursor:pointer;flex-shrink:0;border-radius:8px;box-shadow:0 0 15px rgba(57,197,255,.3);}');
        document.write('.phAv img{width:100%;height:100%;object-fit:cover;}');
        document.write('.phName{font-family:var(--arcade);font-size:1.6rem;font-weight:900;letter-spacing:2px;line-height:1;margin-bottom:.3rem;color:#fff;text-shadow:0 0 8px #39c5ff;}');
        document.write('.phSub{font-size:10px;color:var(--ink-dim);letter-spacing:1px;font-weight:700;}');

        document.write('.ps{padding:1.5rem 1.75rem;border-bottom:3px solid #000;background:var(--bg2);}');
        document.write('.ps:last-child{border-bottom:none;}');
        document.write('.pst{font-size:10px;font-weight:900;text-transform:uppercase;color:var(--yellow);letter-spacing:3px;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--arcade);}');

        document.write('.trow{display:flex;border:2px solid #000;border-radius:6px;overflow:hidden;}');
        document.write('.tbtn{flex:1;padding:.65rem;border:none;cursor:pointer;font-size:11px;font-family:var(--mono);font-weight:900;letter-spacing:1px;text-transform:uppercase;background:var(--bg);color:var(--ink-dim);transition:.15s;}');
        document.write('.tbtn+.tbtn{border-left:2px solid #000;}');
        document.write('.tbtn.active{background:var(--cyan);color:#000;text-shadow:none;}');

        document.write('.sg{display:grid;grid-template-columns:1fr 1fr;border:2px solid #000;border-radius:6px;overflow:hidden;}');
        document.write('.sc{padding:.85rem 1rem;background:var(--bg);}');
        document.write('.sc:nth-child(2),.sc:nth-child(4){border-left:2px solid #000;}');
        document.write('.sc:nth-child(3),.sc:nth-child(4){border-top:2px solid #000;}');
        document.write('.sci{margin-bottom:.4rem;color:var(--pink);display:flex;}');
        document.write('.scv{font-family:var(--arcade);font-size:1.15rem;font-weight:900;color:var(--ink);margin-bottom:.15rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:1px;text-shadow:0 0 6px rgba(255,255,255,.2);}');
        document.write('.scl{font-size:9px;color:var(--ink-dim);text-transform:uppercase;font-weight:900;letter-spacing:2px;}');

        document.write('.pti{margin-bottom:.85rem;}');
        document.write('.pth{display:flex;justify-content:space-between;margin-bottom:.35rem;align-items:baseline;gap:.75rem;}');
        document.write('.ptn{font-size:12px;color:var(--ink);font-family:var(--arcade);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;letter-spacing:1px;}');
        document.write('.ptt{font-size:11px;color:var(--cyan);font-family:var(--mono);font-weight:900;flex-shrink:0;}');
        document.write('.ptbg{height:6px;background:var(--bg);border:2px solid #000;overflow:hidden;border-radius:4px;}');
        document.write('.ptb{height:100%;background:var(--pink);width:0;transition:width 1s cubic-bezier(.4,0,.2,1);box-shadow:0 0 8px var(--pink);}');

        document.write('.ach{display:flex;align-items:center;gap:.85rem;padding:.75rem .85rem;border:2px solid #000;margin-bottom:.4rem;transition:.2s;background:var(--bg);border-radius:6px;}');
        document.write('.ach.locked{opacity:.3;}');
        document.write('.ach:not(.locked){box-shadow:0 0 10px rgba(57,197,255,.2);}');
        document.write('.aci{color:var(--cyan);display:flex;flex-shrink:0;}');
        document.write('.ach.locked .aci{color:var(--ink-dim);}');
        document.write('.acn{font-family:var(--arcade);font-size:12px;font-weight:900;color:var(--ink);letter-spacing:1px;}');
        document.write('.acd{font-size:10px;color:var(--ink-dim);margin-top:.1rem;letter-spacing:1px;font-weight:700;}');

        document.write('.ri{display:flex;align-items:center;gap:.6rem;padding:.55rem .25rem;border-bottom:2px dashed var(--line);font-size:12px;}');
        document.write('.rin{font-family:var(--arcade);color:var(--pink);min-width:1.4rem;font-size:14px;}');
        document.write('.rim{flex:1;color:var(--ink);font-family:var(--arcade);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:1px;}');
        document.write('.rit{font-size:10px;color:var(--cyan);font-family:var(--mono);font-weight:900;flex-shrink:0;}');

        document.write('.fav-li{display:flex;align-items:center;gap:.55rem;padding:.55rem .25rem;border-bottom:2px dashed var(--line);font-size:12px;color:var(--ink);font-family:var(--arcade);letter-spacing:1px;}');
        document.write('.fav-li .fav-ico{color:var(--pink);display:flex;flex-shrink:0;}');

        document.write('.empty-msg{color:var(--ink-dim);font-size:11px;font-style:italic;}');

        document.write('#gOver{position:fixed;inset:0;background:#000;z-index:2000;display:none;flex-direction:column;opacity:0;transition:opacity .3s;}');
        document.write('#gOver.vis{opacity:1;}');
        document.write('#closeGame{position:absolute;top:1rem;right:1rem;z-index:2003;}');
        document.write('#closeBtn{background:rgba(11,12,28,.85);color:#fff;border:3px solid #000;width:50px;height:50px;cursor:pointer;display:grid;place-items:center;transition:.15s;padding:0;border-radius:8px;box-shadow:0 0 15px rgba(255,56,96,.4);backdrop-filter:blur(8px);}');
        document.write('#closeBtn:hover{background:var(--pink);border-color:#000;color:#fff;box-shadow:0 0 25px var(--pink);}');
        document.write('iframe{border:none;flex-grow:1;width:100%;height:100%;opacity:0;transition:opacity .4s;}');
        document.write('iframe.ld{opacity:1;}');
        
        document.write('#gOver::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2002;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.35) 2px 4px),radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%);animation:fk 5s linear infinite;}');
        document.write('#gOver.crt-off::after{content:none!important;opacity:0!important;display:none!important;}');

        document.write('footer{margin-top:auto;padding-top:1.5rem;border-top:3px solid #000;display:flex;justify-content:space-between;font-size:10px;letter-spacing:2px;color:var(--ink-dim);text-transform:uppercase;font-weight:900;}');

        document.write('.toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(60px);background:var(--bg2);border:3px solid #000;color:var(--ink);padding:.75rem 1.25rem;font-size:11px;z-index:9999;display:flex;align-items:center;gap:.6rem;font-family:var(--arcade);transition:.3s;opacity:0;white-space:nowrap;box-shadow:0 0 20px var(--cyan);letter-spacing:2px;border-radius:8px;}');
        document.write('.toast .toast-ico{color:var(--yellow);display:flex;}');

        document.write('</style></head><body>');
        document.write('<div class="container">');

        document.write('<header><div class="logo">◆ ARCADE_VAULT ◆</div>');
        document.write('<div class="nav-right">');
        document.write('<div id="npBadge"><div id="npDot"></div><span id="npTxt">NOW PLAYING</span></div>');
        document.write('<div class="umenu"><div class="uinfo" id="toggleM"><span id="uName"></span><div id="pfpCircle"></div></div>');
        document.write('<div class="dd" id="drp">'+
            '<div class="di" id="pdMi">'+icoUser+'<span>PROFILE</span></div>'+
            '<div class="di" id="avMi">'+icoImg+'<span>AVATAR</span></div>'+
            '<input type="file" id="pfpInp" style="display:none" accept="image/*">'+
            '<hr class="ddiv">'+
            '<div class="di dred" id="soBtn">'+icoX+'<span>EXIT</span></div>'+
        '</div></div>');
        document.write('</div></header>');

        document.write('<section class="hero"><div>');
        document.write('<div class="hero-label">● SELECT YOUR GAME</div>');
        document.write('<h1 class="greet" id="wg"></h1>');
        document.write('<p class="lede" id="ws"></p>');
        document.write('</div><div class="idx" id="idxNum">001<small>&mdash; VAULT</small></div></section>');

        document.write('<section class="dg">'+
            '<div class="ditem"><div class="dl">STATUS</div><div class="dv" style="color:var(--grn);">● ONLINE</div></div>'+
            '<div class="ditem"><div class="dl">ASSETS</div><div class="dv" id="rCount"></div></div>'+
            '<div class="ditem"><div class="dl">DATE</div><div class="dv" id="sDate"></div></div>'+
        '</section>');

        document.write('<section class="sw-block">');
        document.write('<div class="sw-label"><span>◆ SEARCH DATABASE</span><span>FILTER LIBRARY</span></div>');
        document.write('<div class="sw"><span class="sb-icon">'+icoSearch+'</span><input type="text" id="sb" class="sbar" placeholder="SEARCH..." autocomplete="off" spellcheck="false"><button class="sclr" id="sc">'+icoX+'</button></div>');
        document.write('</section>');

        document.write('<section id="favSec"><div class="slbl"><span><span class="accent">★</span> FAVORITES</span><span class="scount" id="favCount"></span></div><div id="favGrid"></div></section>');
        document.write('<section id="recSec"><div class="slbl"><span><span class="accent">▶</span> RECENTLY PLAYED</span><span class="scount" id="recCount"></span></div><div id="recGrid"></div></section>');
        document.write('<section id="allSec"><div class="slbl"><span><span class="accent">▤</span> ALL GAMES</span><span class="scount" id="allCount"></span></div><div id="list"></div></section>');

        document.write('<div id="noRes">✖ NO DATA FOUND.</div>');

        document.write('<footer><div>ARCADE_VAULT © ' + new Date().getUTCFullYear() + '</div><div id="ftYr"></div></footer>');

        document.write('</div>');

        document.write('<div id="pOv"></div><div id="pPanel">');
        document.write('<div class="ph"><button class="phClose" id="phClose">'+icoXLg+'</button>');
        document.write('<div class="phLabel">◆ PLAYER PROFILE</div>');
        document.write('<div class="phRow"><div class="phAv" id="phAv"></div><div><div class="phName" id="phName"></div><div class="phSub" id="phSub"></div></div></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ THEME</span><span>01</span></div><div class="trow"><button class="tbtn" data-theme="dark">DARK</button><button class="tbtn" data-theme="light">LIGHT</button></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ CRT FX</span><span>02</span></div><div class="trow"><button class="tbtn crt-btn" data-crt="on">ON</button><button class="tbtn crt-btn" data-crt="off">OFF</button></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ STATS</span><span>03</span></div><div class="sg" id="sg"></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ PLAYTIME</span><span>04</span></div><div id="ptList"></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ FAVORITES</span><span>05</span></div><div id="pFavs"></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ RECENT</span><span>06</span></div><div id="pRecent"></div></div>');
        document.write('<div class="ps"><div class="pst"><span>◆ ACHIEVEMENTS</span><span>07</span></div><div id="pAch"></div></div>');
        document.write('</div>');

        document.write('<div id="gOver"><div id="closeGame"><button id="closeBtn">'+icoXLg+'</button></div><iframe id="gFrame" allow="autoplay;fullscreen;keyboard"></iframe></div>');

        document.write('</body></html>');
        document.close();

        document.getElementById('rCount').innerText=gCount+' LOADED';
        document.getElementById('sDate').innerText=cDate;
        document.getElementById('uName').innerText=userName;
        document.getElementById('phName').innerText=userName;
        document.getElementById('ftYr').innerText=gCount+' GAMES IN VAULT';
        var hr=new Date().getHours(),gr=hr<12?'READY,':hr<17?'WELCOME BACK,':'AFTERNOON SESSION,';
        document.getElementById('wg').innerHTML=gr+' <em>'+userName+'</em>.';
        document.getElementById('ws').innerText='> '+gCount+' GAMES LOADED. SELECT A TITLE TO BEGIN.';
        var mbDate=new Date(parseInt(localStorage.getItem(mbK))).toLocaleDateString('en-US',{month:'long',year:'numeric'});
        document.getElementById('phSub').innerText='MEMBER SINCE '+mbDate;
        aTh(gTh());
        aCrt(gCrt());

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

        function chkAch(prev){var now=gAch();now.forEach(function(a,i){if(a.u&&!prev[i].u)setTimeout(function(){toast('UNLOCKED: '+a.name,a.icon);},400);});}

        function updPanel(){
            var st=gSt(),tot=totT(),fv=gFv(),rc=gRc(),mp=mpGame();
            document.getElementById('sg').innerHTML=
                '<div class="sc"><div class="sci">'+icoClock+'</div><div class="scv">'+fmtT(tot)+'</div><div class="scl">PLAYTIME</div></div>'+
                '<div class="sc"><div class="sci">'+icoController+'</div><div class="scv">'+Object.keys(st).length+'</div><div class="scl">GAMES</div></div>'+
                '<div class="sc"><div class="sci">'+icoStar+'</div><div class="scv" title="'+(mp||'')+'">'+((mp&&mp.length>10)?mp.slice(0,10)+'...':mp||'-')+'</div><div class="scl">TOP</div></div>'+
                '<div class="sc"><div class="sci">'+icoHeart+'</div><div class="scv">'+fv.length+'</div><div class="scl">FAVS</div></div>';
            var ents=Object.entries(st).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
            document.getElementById('ptList').innerHTML=ents.length?ents.map(function(e){return '<div class="pti"><div class="pth"><span class="ptn">'+e[0]+'</span><span class="ptt">'+fmtT(e[1])+'</span></div><div class="ptbg"><div class="ptb" data-w="'+Math.round(e[1]/ents[0][1]*100)+'%"></div></div></div>';}).join(''):'<div class="empty-msg">NO PLAYTIME YET.</div>';
            setTimeout(function(){document.querySelectorAll('.ptb').forEach(function(b){b.style.width=b.dataset.w;});},60);
            document.getElementById('pFavs').innerHTML=fv.length?fv.map(function(n){return '<div class="fav-li"><span class="fav-ico">'+icoHeartFill+'</span><span>'+n+'</span></div>';}).join(''):'<div class="empty-msg">NO FAVORITES YET.</div>';
            document.getElementById('pRecent').innerHTML=rc.length?rc.slice(0,5).map(function(n,i){var t2=st[n]?fmtT(st[n]):'';return '<div class="ri"><span class="rin">0'+(i+1)+'</span><span class="rim">'+n+'</span>'+(t2?'<span class="rit">'+t2+'</span>':'')+'</div>';}).join(''):'<div class="empty-msg">NO GAMES YET.</div>';
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
                var img=new Image();
                img.onload=function(){
                    var max=256,canvas=document.createElement('canvas');
                    var w=img.width,h=img.height;
                    if(w>h){if(w>max){h=h*(max/w);w=max;}}else{if(h>max){w=w*(max/h);h=max;}}
                    canvas.width=w;canvas.height=h;
                    canvas.getContext('2d').drawImage(img,0,0,w,h);
                    try{localStorage.setItem(pfpK,canvas.toDataURL('image/jpeg',0.85));rPfp();}catch(err){alert('Avatar too large.');}
                };
                img.src=r.result;
            };
            r.readAsDataURL(f);
        };
        document.querySelectorAll('.tbtn').forEach(function(b){
            if(b.dataset.theme) b.onclick=function(){aTh(b.dataset.theme);};
            if(b.dataset.crt) b.onclick=function(){aCrt(b.dataset.crt);};
        });

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
            if(isAllGames){c.querySelector('.hrt').onclick=function(e){e.stopPropagation();togFv(name);var on=isFv(name);document.querySelectorAll('.hrt[data-g="'+name+'"]').forEach(function(h){h.classList.toggle('on',on);h.innerHTML=on?icoHeartFill:icoHeart;});rFav();toast(on?'ADDED TO FAVS':'REMOVED FROM FAVS',icoHeart);};}
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
                        
                        // Inject CRT Overlay into the new window
                        var crtCss = '#__arcCrtOverlay{position:fixed;inset:0;pointer-events:none;z-index:2147483647;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.35) 2px 4px),radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%);mix-blend-mode:multiply;animation:arcFk 5s linear infinite;}@keyframes arcFk{0%,90%,94%,100%{opacity:1}92%{opacity:.7}}#__arcCrtOverlay.off{display:none!important;}';
                        try {
                            var styleEl = nw.document.createElement('style');
                            styleEl.textContent = crtCss;
                            nw.document.head.appendChild(styleEl);
                            var overlayEl = nw.document.createElement('div');
                            overlayEl.id = '__arcCrtOverlay';
                            if (localStorage.getItem('arcadeCRT') === 'off') overlayEl.classList.add('off');
                            nw.document.body.appendChild(overlayEl);
                            
                            // Listen for live toggle from main window
                            nw.addEventListener('storage', function(e) {
                                if (e.key === 'arcadeCRT') {
                                    var ol = nw.document.getElementById('__arcCrtOverlay');
                                    if (ol) {
                                        if (e.newValue === 'off') ol.classList.add('off');
                                        else ol.classList.remove('off');
                                    }
                                }
                            });
                        } catch(e) {}

                        setTimeout(function(){
                            var dw=false;
                            function wDelta(){if(dw)return;dw=true;try{localStorage.setItem('_gameTimeDelta',JSON.stringify({name:name,ms:Date.now()-t0,ts:Date.now()}));}catch(e){}}
                            var btn=nw.document.createElement('button');
                            btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
                            btn.style.cssText='position:fixed;top:1rem;right:1rem;z-index:99999999;background:#151730;color:#fff;border:3px solid #000;width:50px;height:50px;cursor:pointer;display:grid;place-items:center;transition:.15s;padding:0;border-radius:8px;box-shadow:0 0 15px rgba(255,56,96,.4);';
                            btn.onmouseover=function(){this.style.background='#ff3860';};
                            btn.onmouseout=function(){this.style.background='#151730';};
                            btn.onclick=function(){wDelta();try{opener.focus();}catch(e){}nw.close();};
                            nw.document.body.appendChild(btn);
                            nw.addEventListener('beforeunload',wDelta);
                        },300);
                    }else alert('Pop-up blocked.');
                }else{
                    curGame=name;curStart=Date.now();
                    document.body.style.overflow='hidden';
                    overlay.style.display='flex';
                    var npb=document.getElementById('npBadge'),npt=document.getElementById('npTxt');
                    if(npb)npb.classList.add('on');
                    if(npt)npt.innerText='NOW PLAYING: '+name;
                    requestAnimationFrame(function(){overlay.classList.add('vis');});
                    frame.srcdoc=h;
                    frame.onload=function(){frame.classList.add('ld');setTimeout(function(){try{frame.contentWindow.focus();}catch(e){}},100);};
                }
                chkAch(prev);
            }catch(e){alert('Failed to load asset.');}
        }

        rFav();
        rRec();
        rAll();
    }
})();
