(async function _main() {
    localStorage.setItem('_bookmarkletSrc', _main.toString());
    var sheetId = '1-fLK1EJH9TxtmaA9Cksy66XgK3u6imn1-CksGjQ7WWc';
    var vaultUrl = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/export?format=csv';
    var sessionLimit = 30 * 60 * 1000;

    var savedData = localStorage.getItem('gameLibSession');
    if (savedData) {
        var session = JSON.parse(savedData);
        if (Date.now() - session.time < sessionLimit) { loadLibrary(session.games, session.user || 'User', session.time); return; }
    }

    var bg = document.createElement('div');
    bg.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,10,10,0.98);z-index:999999;display:flex;justify-content:center;align-items:center;font-family:Inter,sans-serif;backdrop-filter:blur(15px);';
    bg.innerHTML = '<style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");</style><div style="background:#161616;padding:40px;border-radius:24px;border:1px solid rgba(255,255,255,0.1);width:300px;text-align:center;"><h2 style="color:#fff;margin:0 0 8px 0;font-weight:700;font-size:1.5rem;">Library Access</h2><p style="color:#666;margin:0 0 24px 0;font-size:0.9rem;">Secure Authentication</p><input id="u" type="text" placeholder="Username" style="width:100%;padding:14px;margin-bottom:12px;background:#000;color:#fff;border:1px solid #333;border-radius:12px;outline:none;box-sizing:border-box;"><input id="p" type="password" placeholder="Password" style="width:100%;padding:14px;margin-bottom:24px;background:#000;color:#fff;border:1px solid #333;border-radius:12px;outline:none;box-sizing:border-box;"><button id="loginBtn" style="width:100%;padding:14px;background:#3b82f6;color:#fff;border:none;border-radius:12px;cursor:pointer;font-weight:600;font-size:1rem;">Authorize</button><p id="msg" style="color:#ff4444;margin-top:15px;font-size:13px;display:none;">Invalid Credentials</p></div>';
    document.body.appendChild(bg);
    document.getElementById('u').focus();
    document.getElementById('p').onkeydown = function(e) { if (e.key === 'Enter') document.getElementById('loginBtn').click(); };
    document.getElementById('loginBtn').onclick = async function() {
        var uInput = document.getElementById('u').value.trim();
        var pInput = document.getElementById('p').value.trim();
        var loginTime = Date.now();
        try {
            var res = await fetch(vaultUrl + '&t=' + Date.now());
            if (!res.ok) throw new Error();
            var csvData = await res.text();
            var rows = csvData.split(/\r?\n/);
            var parsedRows = rows.map(function(r) {
                var row = r.trim(); var cols = []; var inQuote = false; var curVal = '';
                for(var i=0;i<row.length;i++){var ch=row[i];if(ch==='"'&&row[i+1]==='"'){curVal+='"';i++;}else if(ch==='"'){inQuote=!inQuote;}else if(ch===','&&!inQuote){cols.push(curVal);curVal='';}else{curVal+=ch;}}
                cols.push(curVal); return cols;
            });
            var config={};var games={};var jsDelivrPrefix='';
            parsedRows.forEach(function(cols){cols.forEach(function(cell){if(cell&&cell.trim().startsWith('http')&&cell.includes('jsdelivr')){jsDelivrPrefix=cell.trim();if(!jsDelivrPrefix.endsWith('/'))jsDelivrPrefix+='/';}});});
            parsedRows.forEach(function(cols){
                if(cols[0]&&cols[1]&&cols[0].trim()!=='')config[cols[0].trim().toLowerCase()]=cols[1].trim();
                if(cols[2]&&cols[3]&&cols[2].trim()!==''){var n=cols[2].trim();var p=cols[3].trim();games[n]={url:p.startsWith('http')?p:(jsDelivrPrefix+p),icon:(cols[4]||'').trim(),type:(cols[5]||'').trim().toLowerCase()};}
            });
            if(config[uInput.toLowerCase()]===pInput){localStorage.setItem('gameLibSession',JSON.stringify({time:loginTime,games:games,user:uInput}));bg.remove();loadLibrary(games,uInput,loginTime);}else throw new Error();
        }catch(err){document.getElementById('msg').style.display='block';}
    };

    function loadLibrary(games, userName, startTime) {
        var gameCount = Object.keys(games).length;
        var curDate = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        var pfpKey='userPfp_'+userName.toLowerCase(), statsKey='gameStats_'+userName.toLowerCase(), favsKey='gameFavs_'+userName.toLowerCase(), recentKey='gameRecent_'+userName.toLowerCase(), themeKey='gameTheme_'+userName.toLowerCase(), memberKey='gameMember_'+userName.toLowerCase();
        if(!localStorage.getItem(memberKey))localStorage.setItem(memberKey,Date.now().toString());

        function getStats(){try{return JSON.parse(localStorage.getItem(statsKey))||{};}catch(e){return{};}}
        function saveStats(s){localStorage.setItem(statsKey,JSON.stringify(s));}
        function addTime(n,ms){if(ms<500)return;var s=getStats();s[n]=(s[n]||0)+ms;saveStats(s);}
        function getFavs(){try{return JSON.parse(localStorage.getItem(favsKey))||[];}catch(e){return[];}}
        function saveFavs(f){localStorage.setItem(favsKey,JSON.stringify(f));}
        function toggleFav(n){var f=getFavs();var i=f.indexOf(n);if(i>-1)f.splice(i,1);else f.unshift(n);saveFavs(f);}
        function isFav(n){return getFavs().indexOf(n)>-1;}
        function getRecent(){try{return JSON.parse(localStorage.getItem(recentKey))||[];}catch(e){return[];}}
        function addRecent(n){var r=getRecent().filter(function(x){return x!==n;});r.unshift(n);localStorage.setItem(recentKey,JSON.stringify(r.slice(0,10)));}
        function getTheme(){return localStorage.getItem(themeKey)||'dark';}
        function applyTheme(t){document.body.classList.toggle('light',t==='light');localStorage.setItem(themeKey,t);document.querySelectorAll('.tbtn').forEach(function(b){b.classList.toggle('active',b.dataset.theme===t);});}
        function formatTime(ms){var s=Math.floor(ms/1000);var h=Math.floor(s/3600);var m=Math.floor((s%3600)/60);var sec=s%60;if(h>0)return h+'h '+m+'m';if(m>0)return m+'m '+sec+'s';return sec>0?sec+'s':'0s';}
        function getTotalTime(){return Object.values(getStats()).reduce(function(a,b){return a+b;},0);}
        function getMostPlayed(){var s=getStats();var k=Object.keys(s);return k.length?k.reduce(function(a,b){return s[a]>s[b]?a:b;}):null;}
        function getAchievements(){
            var s=getStats();var total=getTotalTime();var favs=getFavs();var recent=getRecent();
            return[
                {icon:'&#127918;',name:'First Game',desc:'Played your first game',unlocked:recent.length>=1},
                {icon:'&#127919;',name:'Explorer',desc:'Played 3 different games',unlocked:Object.keys(s).length>=3},
                {icon:'&#127758;',name:'Game Hopper',desc:'Played 5 different games',unlocked:Object.keys(s).length>=5},
                {icon:'&#9200;',name:'Dedicated',desc:'1 hour of total playtime',unlocked:total>=3600000},
                {icon:'&#127942;',name:'Marathon',desc:'5 hours of total playtime',unlocked:total>=18000000},
                {icon:'&#10084;',name:'Collector',desc:'Favorited 3 games',unlocked:favs.length>=3},
                {icon:'&#128142;',name:'Curator',desc:'Favorited 5 games',unlocked:favs.length>=5}
            ];
        }

        document.open();
        document.write('<!DOCTYPE html><html><head><title>Google</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>');
        document.write('@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");');
        document.write(':root{--bg:#080808;--s1:#0f0f0f;--s2:#161616;--s3:#1e1e1e;--b1:#1e1e1e;--b2:#2e2e2e;--t1:#fff;--t2:#888;--t3:#444;--ac:#3b82f6;--ac2:#60a5fa;--red:#f87171;--grn:#22c55e;}');
        document.write('body.light{--bg:#f0f2f5;--s1:#fff;--s2:#f1f3f5;--s3:#e9ecef;--b1:#dee2e6;--b2:#ced4da;--t1:#1a1a2e;--t2:#6c757d;--t3:#adb5bd;}');
        document.write('*{box-sizing:border-box;margin:0;padding:0;}body{background:var(--bg);color:var(--t1);font-family:Inter,sans-serif;min-height:100vh;transition:background .3s,color .3s;overflow-x:hidden;}');
        document.write('#tbar{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--ac),var(--ac2));z-index:9999;transition:width 1s linear;border-radius:0 2px 2px 0;}');
        document.write('nav{display:flex;justify-content:space-between;align-items:center;padding:12px 40px;border-bottom:1px solid var(--b1);background:rgba(8,8,8,.88);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100;}');
        document.write('body.light nav{background:rgba(255,255,255,.9);}');
        document.write('.nlogo{font-weight:700;color:var(--ac);font-size:1.1rem;animation:lp 3s ease-in-out infinite;cursor:default;}');
        document.write('@keyframes lp{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 14px rgba(59,130,246,.6)}}');
        document.write('.nr{display:flex;align-items:center;gap:10px;}');
        document.write('.ibtn{background:var(--s2);border:1px solid var(--b2);color:var(--t1);width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:.2s;}');
        document.write('.ibtn:hover{background:var(--ac);border-color:var(--ac);color:#fff;}');
        document.write('#settingsBtn:hover{transform:rotate(25deg);}');
        document.write('.umenu{position:relative;}');
        document.write('.uinfo{display:flex;align-items:center;gap:8px;background:var(--s2);padding:6px 14px;border-radius:20px;border:1px solid var(--b2);font-size:.85rem;cursor:pointer;transition:.2s;user-select:none;}');
        document.write('.uinfo:hover{border-color:var(--ac);}');
        document.write('#pfpCircle{width:22px;height:22px;background:var(--s3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;overflow:hidden;border:1px solid var(--b2);flex-shrink:0;}');
        document.write('#pfpCircle img{width:100%;height:100%;object-fit:cover;}');
        document.write('.dd{position:absolute;top:calc(100% + 10px);right:0;background:var(--s2);border:1px solid var(--b2);border-radius:16px;width:210px;padding:8px;box-shadow:0 14px 50px rgba(0,0,0,.7);opacity:0;transform:translateY(-10px) scale(.96);pointer-events:none;transition:opacity .2s,transform .2s;z-index:500;transform-origin:top right;}');
        document.write('.dd.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}');
        document.write('.di{padding:10px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:var(--t1);display:flex;align-items:center;gap:10px;transition:.15s;user-select:none;}');
        document.write('.di:hover{background:var(--s3);}');
        document.write('.ddiv{border:none;border-top:1px solid var(--b1);margin:5px 0;}');
        document.write('.dred{color:var(--red)!important;}');
        document.write('#pOv{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);z-index:2999;opacity:0;pointer-events:none;transition:opacity .3s;}');
        document.write('#pOv.open{opacity:1;pointer-events:all;}');
        document.write('#pPanel{position:fixed;top:0;right:-430px;width:400px;max-width:100vw;height:100%;background:var(--s1);border-left:1px solid var(--b2);z-index:3000;overflow-y:auto;transition:right .38s cubic-bezier(.4,0,.2,1);scrollbar-width:thin;}');
        document.write('#pPanel.open{right:0;}');
        document.write('.ph{background:linear-gradient(145deg,#1e3a8a,#3b82f6 55%,#7c3aed);padding:28px 22px 24px;text-align:center;position:relative;}');
        document.write('.phClose{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:.2s;}');
        document.write('.phClose:hover{background:var(--red);}');
        document.write('.phAv{width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#fff;margin:0 auto 14px;overflow:hidden;cursor:pointer;transition:.25s;}');
        document.write('.phAv:hover{border-color:rgba(255,255,255,.9);transform:scale(1.06);}');
        document.write('.phAv img{width:100%;height:100%;object-fit:cover;}');
        document.write('.phName{color:#fff;font-size:1.3rem;font-weight:700;margin-bottom:3px;}');
        document.write('.phSub{color:rgba(255,255,255,.55);font-size:.78rem;}');
        document.write('.ps{padding:20px 22px;border-bottom:1px solid var(--b1);}');
        document.write('.ps:last-child{border-bottom:none;}');
        document.write('.pst{font-size:9px;font-weight:700;text-transform:uppercase;color:var(--t3);letter-spacing:1.2px;margin-bottom:14px;}');
        document.write('.trow{display:flex;background:var(--s2);border:1px solid var(--b1);border-radius:12px;padding:4px;gap:4px;}');
        document.write('.tbtn{flex:1;padding:9px 6px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:.2s;background:transparent;color:var(--t2);}');
        document.write('.tbtn.active{background:var(--ac);color:#fff;}');
        document.write('.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}');
        document.write('.sc{background:var(--s2);border:1px solid var(--b1);border-radius:14px;padding:14px;}');
        document.write('.sci{font-size:20px;margin-bottom:6px;}');
        document.write('.scv{font-size:1rem;font-weight:700;color:var(--t1);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}');
        document.write('.scl{font-size:9px;color:var(--t2);text-transform:uppercase;font-weight:700;letter-spacing:.5px;}');
        document.write('.pti{margin-bottom:14px;}');
        document.write('.pth{display:flex;justify-content:space-between;margin-bottom:5px;}');
        document.write('.ptn{font-size:12px;color:var(--t1);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:62%;}');
        document.write('.ptt{font-size:12px;color:var(--ac);font-weight:600;}');
        document.write('.ptbg{height:5px;background:var(--b2);border-radius:3px;overflow:hidden;}');
        document.write('.ptb{height:100%;background:linear-gradient(90deg,var(--ac),var(--ac2));border-radius:3px;width:0;transition:width 1.1s cubic-bezier(.4,0,.2,1);}');
        document.write('.ach{display:flex;align-items:center;gap:12px;padding:11px 12px;background:var(--s2);border:1px solid var(--b1);border-radius:12px;margin-bottom:8px;transition:.2s;}');
        document.write('.ach.locked{opacity:.22;filter:grayscale(1);}');
        document.write('.ach:not(.locked):hover{border-color:var(--ac);}');
        document.write('.aci{font-size:24px;flex-shrink:0;}');
        document.write('.acn{font-size:13px;font-weight:600;color:var(--t1);}');
        document.write('.acd{font-size:11px;color:var(--t2);margin-top:1px;}');
        document.write('.ri{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;transition:.15s;}');
        document.write('.ri:hover{background:var(--s2);}');
        document.write('.rin{width:18px;font-size:11px;font-weight:700;color:var(--t3);}');
        document.write('.rim{flex:1;font-size:13px;color:var(--t1);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}');
        document.write('.rit{font-size:11px;color:var(--ac);font-weight:600;flex-shrink:0;}');
        document.write('main{padding:40px 24px 100px;max-width:1100px;margin:0 auto;text-align:center;}');
        document.write('.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:44px;}');
        document.write('@media(max-width:600px){.dg{grid-template-columns:1fr 1fr;}.dg>:last-child{grid-column:span 2;}h1{font-size:2rem!important;}}');
        document.write('.ditem{background:var(--s1);border:1px solid var(--b1);padding:16px;border-radius:18px;text-align:left;position:relative;overflow:hidden;transition:.2s;}');
        document.write('.ditem::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;}');
        document.write('.ditem:nth-child(1)::after{background:var(--grn);}');
        document.write('.ditem:nth-child(2)::after{background:var(--ac);}');
        document.write('.ditem:nth-child(3)::after{background:#a78bfa;}');
        document.write('.dl{color:var(--t3);font-size:9px;font-weight:700;text-transform:uppercase;margin-bottom:5px;letter-spacing:.8px;}');
        document.write('.dv{color:var(--t1);font-size:14px;font-weight:600;}');
        document.write('h1{font-size:2.8rem;font-weight:700;margin-bottom:24px;letter-spacing:-1.5px;}');
        document.write('.sw{position:relative;max-width:560px;margin:0 auto 48px;}');
        document.write('.sbar{width:100%;padding:16px 48px 16px 28px;background:var(--s1);border:1px solid var(--b2);border-radius:16px;color:var(--t1);outline:none;font-size:15px;font-family:inherit;transition:.25s;}');
        document.write('.sbar:focus{border-color:var(--ac);box-shadow:0 0 0 3px rgba(59,130,246,.1);}');
        document.write('.sbar::placeholder{color:var(--t3);}');
        document.write('.sclr{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:var(--b2);border:none;color:var(--t2);width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:11px;align-items:center;justify-content:center;display:none;transition:.15s;}');
        document.write('.sclr:hover{background:var(--ac);color:#fff;}');
        document.write('.sclr.on{display:flex;}');
        document.write('#noRes{display:none;text-align:center;padding:60px 20px;color:var(--t2);}');
        document.write('#favSec{display:none;margin-bottom:44px;text-align:left;}');
        document.write('.slbl{font-size:.78rem;font-weight:700;text-transform:uppercase;color:var(--t2);letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;gap:6px;}');
        document.write('#favGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;}');
        document.write('#list{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;text-align:left;}');
        document.write('.card{background:var(--s1);border:1px solid var(--b1);border-radius:24px;padding:22px;cursor:pointer;transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s,border-color .2s,background .2s,opacity .25s;display:flex;flex-direction:column;align-items:center;gap:14px;position:relative;opacity:0;animation:cIn .4s ease forwards;}');
        document.write('.card:hover{background:var(--s2);border-color:var(--ac);transform:translateY(-10px) scale(1.025);box-shadow:0 20px 50px rgba(59,130,246,.13);}');
        document.write('@keyframes cIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}');
        document.write('.ib{width:80px;height:80px;border-radius:20px;background:var(--s2);display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--b1);position:relative;}');
        document.write('.ib img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s;position:absolute;inset:0;}');
        document.write('.cn{font-weight:600;color:var(--t1);font-size:13px;text-align:center;line-height:1.4;}');
        document.write('.hrt{position:absolute;top:11px;right:11px;background:none;border:none;cursor:pointer;font-size:17px;line-height:1;padding:5px;opacity:.28;transition:opacity .2s,transform .2s;color:inherit;}');
        document.write('.hrt:hover{opacity:.9;transform:scale(1.28);}');
        document.write('.hrt.on{opacity:1;color:#f87171;}');
        document.write('#gOver{position:fixed;inset:0;background:#000;z-index:2000;display:none;flex-direction:column;opacity:0;transition:opacity .35s;}');
        document.write('#gOver.vis{opacity:1;}');
        document.write('#closeGame{position:absolute;top:18px;right:18px;z-index:2001;}');
        document.write('#closeBtn{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);transition:.2s;padding:0;}');
        document.write('#closeBtn:hover{background:var(--red);border-color:var(--red);}');
        document.write('iframe{border:none;flex-grow:1;width:100%;height:100%;opacity:0;transition:opacity .5s;}');
        document.write('iframe.ld{opacity:1;}');
        document.write('</style></head><body>');
        document.write('<div id="tbar"></div>');
        document.write('<nav><div class="nlogo">&#9881; Library</div><div class="nr">');
        document.write('<button class="ibtn" id="settingsBtn" title="Profile">&#128100;</button>');
        document.write('<div class="umenu"><div class="uinfo" id="toggleM"><span id="uName"></span><div id="pfpCircle"></div></div>');
        document.write('<div class="dd" id="drp">');
        document.write('<div class="di" id="pdMi">&#128100; Profile</div>');
        document.write('<div class="di" id="avMi">&#128247; Change Avatar</div>');
        document.write('<input type="file" id="pfpInp" style="display:none" accept="image/*">');
        document.write('<hr class="ddiv"><div class="di">&#9201;&nbsp;<span id="timer">30:00</span></div>');
        document.write('<hr class="ddiv"><div class="di dred" id="soBtn">&#10005; Sign Out</div>');
        document.write('</div></div></div></nav>');
        document.write('<div id="pOv"></div><div id="pPanel">');
        document.write('<div class="ph"><button class="phClose" id="phClose">&#10005;</button>');
        document.write('<div class="phAv" id="phAv"></div><div class="phName" id="phName"></div><div class="phSub" id="phSub"></div></div>');
        document.write('<div class="ps"><div class="pst">&#127775; Appearance</div><div class="trow"><button class="tbtn" data-theme="dark">&#127769; Dark</button><button class="tbtn" data-theme="light">&#9728; Light</button></div></div>');
        document.write('<div class="ps"><div class="pst">&#128202; Stats</div><div class="sg" id="sg"></div></div>');
        document.write('<div class="ps"><div class="pst">&#9201; Playtime Breakdown</div><div id="ptList"></div></div>');
        document.write('<div class="ps"><div class="pst">&#10084; Favorites</div><div id="pFavs"></div></div>');
        document.write('<div class="ps"><div class="pst">&#128336; Recently Played</div><div id="pRecent"></div></div>');
        document.write('<div class="ps"><div class="pst">&#127942; Achievements</div><div id="pAch"></div></div>');
        document.write('</div>');
        document.write('<div id="gOver"><div id="closeGame"><button id="closeBtn">&#10005;</button></div><iframe id="gFrame" allow="autoplay;fullscreen;keyboard"></iframe></div>');
        document.write('<main><div class="dg">');
        document.write('<div class="ditem"><div class="dl">Status</div><div class="dv" style="color:var(--grn)">&#9679; Online</div></div>');
        document.write('<div class="ditem"><div class="dl">Resources</div><div class="dv" id="rCount"></div></div>');
        document.write('<div class="ditem"><div class="dl">System Date</div><div class="dv" id="sDate"></div></div>');
        document.write('</div><h1>Game Library</h1>');
        document.write('<div class="sw"><input type="text" id="sb" class="sbar" placeholder="Search games..."><button class="sclr" id="sc">&#10005;</button></div>');
        document.write('<div id="favSec"><div class="slbl">&#10084; Favorites</div><div id="favGrid"></div></div>');
        document.write('<div id="noRes"><div style="font-size:50px;margin-bottom:14px;">&#127918;</div><div style="font-size:15px;">No games found</div></div>');
        document.write('<div id="list"></div></main></body></html>');
        document.close();

        // Setup
        document.getElementById('rCount').innerText = gameCount + ' Active';
        document.getElementById('sDate').innerText = curDate;
        document.getElementById('uName').innerText = userName;
        document.getElementById('phName').innerText = userName;
        var mDate = new Date(parseInt(localStorage.getItem(memberKey))).toLocaleDateString('en-US',{month:'long',year:'numeric'});
        document.getElementById('phSub').innerText = 'Member since ' + mDate;

        applyTheme(getTheme());

        function refreshPfp() {
            var p = localStorage.getItem(pfpKey);
            var c = document.getElementById('pfpCircle'), a = document.getElementById('phAv');
            if (p) { c.innerHTML = '<img src="'+p+'">'; a.innerHTML = '<img src="'+p+'">'; }
            else { c.innerText = userName.charAt(0).toUpperCase(); a.innerText = userName.charAt(0).toUpperCase(); }
        }
        refreshPfp();

        function updatePanel() {
            var stats = getStats(), total = getTotalTime(), favs = getFavs(), recent = getRecent(), mp = getMostPlayed();
            document.getElementById('sg').innerHTML =
                '<div class="sc"><div class="sci">&#9200;</div><div class="scv">'+formatTime(total)+'</div><div class="scl">Playtime</div></div>'+
                '<div class="sc"><div class="sci">&#127918;</div><div class="scv">'+Object.keys(stats).length+'</div><div class="scl">Games Played</div></div>'+
                '<div class="sc"><div class="sci">&#11088;</div><div class="scv" title="'+(mp||'')+'">'+((mp&&mp.length>10)?mp.slice(0,10)+'...':mp||'&#8212;')+'</div><div class="scl">Top Game</div></div>'+
                '<div class="sc"><div class="sci">&#10084;</div><div class="scv">'+favs.length+'</div><div class="scl">Favorites</div></div>';
            var entries = Object.entries(stats).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
            document.getElementById('ptList').innerHTML = entries.length ? entries.map(function(e){
                return '<div class="pti"><div class="pth"><span class="ptn">'+e[0]+'</span><span class="ptt">'+formatTime(e[1])+'</span></div><div class="ptbg"><div class="ptb" data-w="'+Math.round(e[1]/entries[0][1]*100)+'%"></div></div></div>';
            }).join('') : '<div style="color:var(--t2);font-size:13px;">No playtime yet</div>';
            setTimeout(function(){ document.querySelectorAll('.ptb').forEach(function(b){ b.style.width=b.dataset.w; }); }, 60);
            document.getElementById('pFavs').innerHTML = favs.length ? favs.map(function(n){
                return '<div style="padding:9px 12px;background:var(--s2);border-radius:10px;margin-bottom:6px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;">&#127918; '+n+'</div>';
            }).join('') : '<div style="color:var(--t2);font-size:13px;">No favorites yet</div>';
            document.getElementById('pRecent').innerHTML = recent.length ? recent.slice(0,5).map(function(n,i){
                var t = stats[n] ? formatTime(stats[n]) : '';
                return '<div class="ri"><span class="rin">'+(i+1)+'</span><span class="rim">'+n+'</span>'+(t?'<span class="rit">'+t+'</span>':'')+'</div>';
            }).join('') : '<div style="color:var(--t2);font-size:13px;">No games played yet</div>';
            document.getElementById('pAch').innerHTML = getAchievements().map(function(a){
                return '<div class="ach'+(a.unlocked?'':' locked')+'"><div class="aci">'+a.icon+'</div><div><div class="acn">'+a.name+'</div><div class="acd">'+a.desc+'</div></div></div>';
            }).join('');
        }

        function openPanel(){ updatePanel(); document.getElementById('pPanel').classList.add('open'); document.getElementById('pOv').classList.add('open'); drp.classList.remove('open'); }
        function closePanel(){ document.getElementById('pPanel').classList.remove('open'); document.getElementById('pOv').classList.remove('open'); }

        document.getElementById('settingsBtn').onclick = openPanel;
        document.getElementById('pdMi').onclick = openPanel;
        document.getElementById('phClose').onclick = closePanel;
        document.getElementById('pOv').onclick = closePanel;
        document.getElementById('avMi').onclick = function(){ document.getElementById('pfpInp').click(); drp.classList.remove('open'); };
        document.getElementById('phAv').onclick = function(){ document.getElementById('pfpInp').click(); };
        document.getElementById('pfpInp').onchange = function(e){
            var f=e.target.files[0]; if(!f) return;
            var r=new FileReader(); r.onloadend=function(){ localStorage.setItem(pfpKey,r.result); refreshPfp(); }; r.readAsDataURL(f);
        };
        document.querySelectorAll('.tbtn').forEach(function(b){ b.onclick=function(){ applyTheme(b.dataset.theme); }; });

        var drp = document.getElementById('drp');
        document.getElementById('toggleM').onclick = function(e){ e.stopPropagation(); drp.classList.toggle('open'); };
        document.getElementById('soBtn').onclick = function(){ localStorage.removeItem('gameLibSession'); location.reload(); };
        window.onclick = function(){ drp.classList.remove('open'); };

        var sbEl = document.getElementById('sb'), scEl = document.getElementById('sc');
        sbEl.oninput = function(){ scEl.classList.toggle('on', sbEl.value.length>0); doFilter(); };
        scEl.onclick = function(){ sbEl.value=''; scEl.classList.remove('on'); doFilter(); };

        function doFilter(){
            var v = sbEl.value.toLowerCase(); var vis = 0;
            document.querySelectorAll('#list .card').forEach(function(c){
                var show = c.dataset.name.toLowerCase().includes(v);
                if(show){ c.style.display='flex'; setTimeout(function(){c.style.opacity='1';},10); vis++; }
                else{ c.style.opacity='0'; setTimeout(function(){ if(!c.dataset.name.toLowerCase().includes(sbEl.value.toLowerCase())) c.style.display='none'; },250); }
            });
            document.getElementById('noRes').style.display=(vis===0&&v.length>0)?'block':'none';
        }

        function renderFavRow(){
            var favs=getFavs(), sec=document.getElementById('favSec'), grid=document.getElementById('favGrid');
            if(!favs.length){ sec.style.display='none'; return; }
            sec.style.display='block'; grid.innerHTML='';
            favs.forEach(function(name){
                if(!games[name]) return;
                var c=document.createElement('div'); c.className='card'; c.dataset.name=name;
                var ic=games[name].icon;
                c.innerHTML='<div class="ib">'+(ic?'<img src="https://drive.google.com/uc?export=view&id='+ic+'" onload="this.style.opacity=1">':'')+'</div><div class="cn">'+name+'</div>';
                c.onclick=function(){launchGame(name,games[name]);};
                grid.appendChild(c);
            });
        }

        var overlay=document.getElementById('gOver'), frame=document.getElementById('gFrame');
        var curGame=null, curStart=null;
        document.getElementById('closeBtn').onclick = function(){
            if(curGame&&curStart){ addTime(curGame,Date.now()-curStart); curGame=null; curStart=null; }
            overlay.classList.remove('vis');
            setTimeout(function(){ overlay.style.display='none'; frame.classList.remove('ld'); frame.srcdoc=''; document.body.style.overflow='auto'; },350);
        };

        async function launchGame(name, gameData){
            addRecent(name);
            try {
                var res=await fetch(gameData.url); if(!res.ok) throw new Error();
                var h=await res.text();
                if(gameData.type==='write'){
                    var t0=Date.now(), opener=window;
                    var nw=window.open('https://www.google.com','_blank');
                    if(nw){
                        nw.addEventListener('load',function(){
                            nw.document.open(); nw.document.write(h); nw.document.title=name; nw.document.close();
                            setTimeout(function(){
                                var btn=nw.document.createElement('button');
                                btn.innerHTML='\u2715';
                                btn.style.cssText='position:fixed;top:20px;right:20px;z-index:99999999;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);transition:.2s;padding:0;';
                                btn.onmouseover=function(){this.style.background='#f87171';this.style.borderColor='#f87171';};
                                btn.onmouseout=function(){this.style.background='rgba(255,255,255,.1)';this.style.borderColor='rgba(255,255,255,.2)';};
                                btn.onclick=function(){addTime(name,Date.now()-t0);try{opener.focus();}catch(e){}nw.close();};
                                nw.document.body.appendChild(btn);
                                nw.addEventListener('beforeunload',function(){addTime(name,Date.now()-t0);});
                            },500);
                        });
                    } else alert('Pop-up blocked! Please allow pop-ups.');
                } else {
                    curGame=name; curStart=Date.now();
                    document.body.style.overflow='hidden';
                    overlay.style.display='flex';
                    requestAnimationFrame(function(){ overlay.classList.add('vis'); });
                    frame.srcdoc=h;
                    frame.onload=function(){ frame.classList.add('ld'); setTimeout(function(){try{frame.contentWindow.focus();}catch(e){}},100); };
                }
            } catch(e){ alert('Failed to load asset. Please verify the link is active.'); }
        }

        var listDiv = document.getElementById('list');
        Object.keys(games).forEach(function(name, idx){
            var gd=games[name], card=document.createElement('div'); card.className='card'; card.dataset.name=name;
            card.style.animationDelay=(idx*0.045)+'s';
            var ic=gd.icon;
            card.innerHTML='<button class="hrt'+(isFav(name)?' on':'')+'" data-g="'+name+'">&#10084;</button><div class="ib">'+(ic?'<img src="https://drive.google.com/uc?export=view&id='+ic+'" onload="this.style.opacity=1">':'')+'</div><div class="cn">'+name+'</div>';
            card.querySelector('.hrt').onclick=function(e){
                e.stopPropagation(); toggleFav(name); var on=isFav(name);
                document.querySelectorAll('.hrt[data-g="'+name+'"]').forEach(function(h){h.classList.toggle('on',on);});
                renderFavRow();
            };
            card.onclick=function(){launchGame(name,gd);};
            listDiv.appendChild(card);
        });

        renderFavRow();

        setInterval(function(){
            var rem=Math.max(0,sessionLimit-(Date.now()-startTime));
            document.getElementById('tbar').style.width=(rem/sessionLimit*100)+'%';
            var m=Math.floor(rem/60000), s=Math.floor((rem%60000)/1000);
            document.getElementById('timer').innerText=m+':'+(s<10?'0':'')+s;
            if(rem===0){localStorage.removeItem('gameLibSession');location.reload();}
        },1000);
    }
})();
