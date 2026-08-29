javascript:(async function () {
  'use strict';

  const ROOT_ID = '__buckshot_lazy_debug__';

  const previous = document.getElementById(ROOT_ID);
  if (previous) {
    if (typeof previous.__buckshotCleanup === 'function') {
      try {
        previous.__buckshotCleanup();
      } catch (_) {}
    } else {
      previous.remove();
    }
  }

  const BASE =
    'https://cdn.jsdelivr.net/gh/itsspeclix-gif/games@main/buckshot/';

  const PCK_SIZE = 344705792;
  const WASM_SIZE = 43444261;

  const PART_SIZES = [
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276812,
    20276800
  ];

  const BLOCK_SIZE = 2 * 1024 * 1024;
  const CACHE_LIMIT = 60 * 1024 * 1024;
  const MAX_CACHE_BLOCKS = Math.floor(CACHE_LIMIT / BLOCK_SIZE);

  const PART_STARTS = [];
  let runningPartOffset = 0;

  for (const size of PART_SIZES) {
    PART_STARTS.push(runningPartOffset);
    runningPartOffset += size;
  }

  if (runningPartOffset !== PCK_SIZE) {
    throw new Error(
      'Buckshot lazy debug: physical PCK part sizes do not add up to the logical PCK size.'
    );
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'background:#000'
  ].join(';');

  const frame = document.createElement('iframe');
  frame.allow = 'autoplay; fullscreen; gamepad';
  frame.allowFullscreen = true;
  frame.style.cssText = [
    'position:absolute',
    'inset:0',
    'width:100%',
    'height:100%',
    'border:0',
    'background:#000'
  ].join(';');

  frame.src = 'about:blank';

  const hud = document.createElement('pre');
  hud.style.cssText = [
    'position:absolute',
    'top:8px',
    'left:8px',
    'z-index:2147483647',
    'margin:0',
    'padding:8px 10px',
    'max-width:min(500px,calc(100vw - 16px))',
    'background:rgba(0,0,0,.76)',
    'border:1px solid rgba(255,255,255,.24)',
    'border-radius:6px',
    'color:#fff',
    'font:11px/1.42 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace',
    'white-space:pre-wrap',
    'word-break:break-word',
    'pointer-events:none',
    'backdrop-filter:blur(4px)',
    '-webkit-backdrop-filter:blur(4px)'
  ].join(';');

  hud.textContent =
    'BUCKSHOT ROULETTE — LAZY PCK DEBUG V3\n' +
    'Bootstrapping…';

  root.append(frame, hud);
  document.body.appendChild(root);

  let monitorTimer = null;
  let fpsRAF = null;
  let gameWindow = null;
  let gameDocument = null;
  let wasmBlobUrl = null;

  root.__buckshotCleanup = function () {
    if (monitorTimer !== null) {
      clearInterval(monitorTimer);
      monitorTimer = null;
    }

    try {
      if (fpsRAF !== null && gameWindow) {
        gameWindow.cancelAnimationFrame(fpsRAF);
      }
    } catch (_) {}

    try {
      if (wasmBlobUrl && gameWindow) {
        gameWindow.URL.revokeObjectURL(wasmBlobUrl);
      }
    } catch (_) {}

    try {
      frame.src = 'about:blank';
    } catch (_) {}

    root.remove();
  };

  function mb(bytes) {
    if (bytes === null || bytes === undefined) {
      return '—';
    }

    return (
      (bytes / 1048576).toFixed(
        bytes >= 100 * 1048576 ? 0 : 1
      ) + ' MB'
    );
  }

  function errorText(error) {
    if (error && error.message) {
      return error.message;
    }

    try {
      return String(error);
    } catch (_) {
      return 'Unknown error';
    }
  }

  function replaceExactly(source, regex, replacement, label) {
    const flags = regex.flags.includes('g')
      ? regex.flags
      : regex.flags + 'g';

    const counter = new RegExp(regex.source, flags);
    const matches = source.match(counter) || [];

    if (matches.length !== 1) {
      throw new Error(
        label +
        ': expected exactly one runtime patch anchor, found ' +
        matches.length
      );
    }

    return source.replace(regex, replacement);
  }

  function buildGameDocument(doc) {
    doc.open();

    doc.write(
      '<!doctype html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<meta name="viewport" ' +
      'content="width=device-width,user-scalable=no,initial-scale=1.0">' +
      '<title>Buckshot Roulette — Lazy PCK Debug</title>' +
      '<link rel="stylesheet" href="' +
      BASE +
      'style.css">' +
      '<style>' +
      'html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000;}' +
      '#loading-text{' +
      'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;' +
      'background:#000;color:#fff;font-family:Arial,sans-serif;font-size:18px;' +
      'white-space:pre-wrap;text-align:center;z-index:1000;' +
      '}' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<canvas id="canvas" tabindex="0">' +
      'Your browser does not support the canvas tag.' +
      '</canvas>' +
      '<noscript>Your browser does not support JavaScript.</noscript>' +
      '<div id="loading-text">Preparing Buckshot lazy PCK…</div>' +
      '<div id="status">' +
      '<progress id="status-progress"></progress>' +
      '<div id="status-notice"></div>' +
      '</div>' +
      '</body>' +
      '</html>'
    );

    doc.close();
  }

  function setLoadingText(text) {
    try {
      const element =
        gameDocument &&
        gameDocument.getElementById('loading-text');

      if (element) {
        element.textContent = text;
      }
    } catch (_) {}
  }

  function showFatalError(message) {
    try {
      let element =
        gameDocument &&
        gameDocument.getElementById('loading-text');

      if (!element && gameDocument) {
        element = gameDocument.createElement('div');
        element.id = 'loading-text';
        gameDocument.body.appendChild(element);
      }

      if (element) {
        element.style.display = 'flex';
        element.style.zIndex = '2147483646';
        element.textContent =
          'Buckshot lazy debug failed:\n\n' + message;
      }
    } catch (_) {}
  }

  try {
    await new Promise((resolve) => {
      if (
        frame.contentDocument &&
        frame.contentDocument.readyState === 'complete'
      ) {
        resolve();
        return;
      }

      frame.addEventListener('load', resolve, { once: true });
    });

    gameWindow = frame.contentWindow;
    gameDocument = frame.contentDocument;

    if (!gameWindow || !gameDocument) {
      throw new Error('Could not create the Buckshot game frame.');
    }

    buildGameDocument(gameDocument);

    const stats = gameWindow.__buckLazyStats = {
      stage: 'bootstrapping',

      blockSize: BLOCK_SIZE,
      cacheLimit: CACHE_LIMIT,
      cacheBytes: 0,
      cachePeak: 0,
      cacheBlocks: 0,
      cachePeakBlocks: 0,

      hits: 0,
      misses: 0,
      evictions: 0,

      readCalls: 0,
      readBytes: 0,

      mmapCalls: 0,
      mmapBytes: 0,
      largestMmap: 0,

      syncRangeRequests: 0,
      syncBytes: 0,

      asyncRangeRequests: 0,
      asyncBytes: 0,

      fetchedBytes: 0,

      activeBlock: null,
      prefetchBlock: null,
      lastBlock: null,

      prefetches: 0,
      prefetchFailures: 0,
      lastPrefetchError: '',

      transport: 'probing',
      rangeProbe: 'not tested',
      rangeHost: '',
      cacheUnit: 'not selected',

      wasmPartsLoaded: 0,
      wasmBlobBytes: 0,
      binaryTempBytes: 0,

      jsBaselineUsed: null,
      jsBaselineAllocated: null,
      jsDeltaNow: 0,
      jsDeltaPeak: 0,
      ramEstimateNow: 0,
      ramEstimatePeak: 0,

      failures: 0,
      lastError: ''
    };

    try {
      const baselineMemory =
        gameWindow.performance &&
        gameWindow.performance.memory;

      if (baselineMemory) {
        stats.jsBaselineUsed =
          baselineMemory.usedJSHeapSize;

        stats.jsBaselineAllocated =
          baselineMemory.totalJSHeapSize;
      }
    } catch (_) {}


    let fps = 0;
    let frames = 0;
    let fpsStart =
      gameWindow.performance.now();

    let peakJsRaw = 0;
    let peakWasm = 0;

    function hudUnitDescription(index) {
      if (
        index === null ||
        index === undefined
      ) {
        return '—';
      }

      if (stats.transport === 'part') {
        const start =
          PART_STARTS[index];

        const end =
          start + PART_SIZES[index];

        return (
          'part' +
          (index + 1) +
          ' [' +
          mb(start) +
          '–' +
          mb(end) +
          ']'
        );
      }

      const start =
        index * BLOCK_SIZE;

      const end =
        Math.min(
          PCK_SIZE,
          start + BLOCK_SIZE
        );

      return (
        '#' +
        index +
        ' [' +
        mb(start) +
        '–' +
        mb(end) +
        ']'
      );
    }

    function fpsTick(now) {
      frames++;

      const elapsed =
        now - fpsStart;

      if (elapsed >= 1000) {
        fps =
          frames *
          1000 /
          elapsed;

        frames = 0;
        fpsStart = now;
      }

      fpsRAF =
        gameWindow.requestAnimationFrame(
          fpsTick
        );
    }

    fpsRAF =
      gameWindow.requestAnimationFrame(
        fpsTick
      );

    monitorTimer =
      setInterval(() => {
        try {
          let jsUsed = null;
          let jsAllocated = null;
          let jsLimit = null;
          let jsUsedDelta = 0;
          let jsAllocatedDelta = 0;
          let jsResidentDelta = 0;

          const memory =
            gameWindow.performance &&
            gameWindow.performance.memory;

          if (memory) {
            jsUsed =
              memory.usedJSHeapSize;

            jsAllocated =
              memory.totalJSHeapSize;

            jsLimit =
              memory.jsHeapSizeLimit;

            peakJsRaw =
              Math.max(
                peakJsRaw,
                jsUsed || 0
              );

            if (stats.jsBaselineUsed !== null) {
              jsUsedDelta =
                Math.max(
                  0,
                  jsUsed -
                  stats.jsBaselineUsed
                );
            }

            if (stats.jsBaselineAllocated !== null) {
              jsAllocatedDelta =
                Math.max(
                  0,
                  jsAllocated -
                  stats.jsBaselineAllocated
                );
            }

            jsResidentDelta =
              Math.max(
                jsUsedDelta,
                jsAllocatedDelta
              );

            stats.jsDeltaNow =
              jsResidentDelta;

            stats.jsDeltaPeak =
              Math.max(
                stats.jsDeltaPeak,
                jsResidentDelta
              );
          }

          let wasmHeap = 0;

          try {
            const hudRuntime =
              gameWindow.__BUCKSHOT_RTENV;

            if (
              hudRuntime &&
              typeof hudRuntime.__buckshotHeap8 === 'function'
            ) {
              const heap =
                hudRuntime.__buckshotHeap8();

              if (
                heap &&
                heap.buffer
              ) {
                wasmHeap =
                  heap.buffer.byteLength;

                peakWasm =
                  Math.max(
                    peakWasm,
                    wasmHeap
                  );
              }
            }
          } catch (_) {}

          const ramNow =
            jsResidentDelta +
            wasmHeap +
            stats.cacheBytes +
            stats.binaryTempBytes;

          stats.ramEstimateNow =
            ramNow;

          stats.ramEstimatePeak =
            Math.max(
              stats.ramEstimatePeak,
              ramNow
            );

          const accesses =
            stats.hits +
            stats.misses;

          const hitRate =
            accesses > 0
              ? (
                  100 *
                  stats.hits /
                  accesses
                ).toFixed(1) + '%'
              : '—';

          const maxItems =
            stats.transport === 'part'
              ? 3
              : MAX_CACHE_BLOCKS;

          const lines = [
            'BUCKSHOT ROULETTE — LAZY PCK DEBUG V3',
            '',
            'Stage          ' + stats.stage,
            'FPS            ' +
              (
                fps
                  ? fps.toFixed(1)
                  : '—'
              ),
            '',
            'RAM EST NOW    ' +
              mb(stats.ramEstimateNow),
            'RAM EST PEAK   ' +
              mb(stats.ramEstimatePeak),
            '  JS delta     ' +
              mb(stats.jsDeltaNow),
            '  WASM linear  ' +
              mb(wasmHeap),
            '  PCK cache    ' +
              mb(stats.cacheBytes),
            '  Binary temp  ' +
              mb(stats.binaryTempBytes),
            '  not counted  GPU/native/audio',
            '',
            jsUsed !== null
              ? (
                  'JS raw heap    ' +
                  mb(jsUsed) +
                  '  raw peak ' +
                  mb(peakJsRaw)
                )
              : 'JS raw heap    unavailable',
            jsAllocated !== null
              ? (
                  'JS allocated   ' +
                  mb(jsAllocated)
                )
              : null,
            stats.jsBaselineUsed !== null
              ? (
                  'JS baseline    ' +
                  mb(stats.jsBaselineUsed)
                )
              : null,
            'JS delta peak  ' +
              mb(stats.jsDeltaPeak),
            jsLimit !== null
              ? (
                  'JS limit       ' +
                  mb(jsLimit)
                )
              : null,
            wasmHeap
              ? (
                  'WASM heap      ' +
                  mb(wasmHeap) +
                  '  peak ' +
                  mb(peakWasm)
                )
              : 'WASM heap      waiting/unavailable',
            '',
            'JS target      <150 MB delta',
            'PCK logical    ' + mb(PCK_SIZE),
            'PCK eager Blob NO',
            'Transport      ' + stats.transport,
            'Cache unit     ' + stats.cacheUnit,
            'Cache          ' +
              mb(stats.cacheBytes) +
              ' / ' +
              mb(CACHE_LIMIT),
            'Cache peak     ' +
              mb(stats.cachePeak),
            'Cache items    ' +
              stats.cacheBlocks +
              ' / ~' +
              maxItems,
            'Cache hits     ' + stats.hits,
            'Cache misses   ' + stats.misses,
            'Hit rate       ' + hitRate,
            'Evictions      ' + stats.evictions,
            '',
            'Read calls     ' + stats.readCalls,
            'Read bytes     ' + mb(stats.readBytes),
            'Fetched        ' + mb(stats.fetchedBytes),
            'Sync fetches   ' +
              stats.syncRangeRequests +
              ' / ' +
              mb(stats.syncBytes),
            'Prefetches     ' +
              stats.prefetches +
              '  failures ' +
              stats.prefetchFailures,
            'Async fetches  ' +
              stats.asyncRangeRequests +
              ' / ' +
              mb(stats.asyncBytes),
            '',
            'Active unit    ' +
              hudUnitDescription(
                stats.activeBlock
              ),
            'Prefetch unit  ' +
              hudUnitDescription(
                stats.prefetchBlock
              ),
            'Last unit      ' +
              hudUnitDescription(
                stats.lastBlock
              ),
            'Range probe    ' + stats.rangeProbe,
            stats.rangeHost
              ? (
                  'Range host     ' +
                  stats.rangeHost
                )
              : null,
            '',
            'WASM parts     ' +
              stats.wasmPartsLoaded +
              ' / 3',
            'WASM Blob      ' +
              mb(stats.wasmBlobBytes),
            '',
            'mmap calls     ' + stats.mmapCalls,
            'mmap bytes     ' + mb(stats.mmapBytes),
            'Largest mmap   ' + mb(stats.largestMmap),
            '',
            'Fatal failures ' + stats.failures,
            stats.lastError
              ? (
                  'Last error     ' +
                  stats.lastError
                    .slice(0, 240)
                )
              : null,
            stats.lastPrefetchError
              ? (
                  'Prefetch error ' +
                  stats.lastPrefetchError
                    .slice(0, 220)
                )
              : null
          ].filter(
            (line) => line !== null
          );

          hud.textContent =
            lines.join('\n');
        } catch (error) {
          hud.textContent =
            'BUCKSHOT ROULETTE — LAZY PCK DEBUG V3\n\n' +
            'HUD error: ' +
            errorText(error);
        }
      }, 100);

    function fail(message) {
      stats.failures++;
      stats.lastError = message;
      stats.stage = 'FAILED';
      throw new Error(message);
    }

    const nativeFetch = gameWindow.fetch.bind(gameWindow);

    let transport = 'range';
    let rangeBase = BASE;

    function parseProbeContentRange(value) {
      const match =
        /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(
          String(value || '').trim()
        );

      if (!match) {
        return null;
      }

      return {
        start: Number(match[1]),
        end: Number(match[2])
      };
    }

    function syncRangeProbe(base) {
      const xhr =
        new gameWindow.XMLHttpRequest();

      xhr.open(
        'GET',
        base +
        'buckshot-roulette.pck.part1',
        false
      );

      xhr.setRequestHeader(
        'Range',
        'bytes=0-63'
      );

      if (xhr.overrideMimeType) {
        xhr.overrideMimeType(
          'text/plain; charset=x-user-defined'
        );
      }

      xhr.send(null);

      if (xhr.status !== 206) {
        throw new Error(
          'HTTP ' +
          xhr.status
        );
      }

      const range =
        parseProbeContentRange(
          xhr.getResponseHeader(
            'Content-Range'
          )
        );

      if (
        !range ||
        range.start !== 0 ||
        range.end !== 63
      ) {
        throw new Error(
          'bad Content-Range: ' +
          (
            xhr.getResponseHeader(
              'Content-Range'
            ) || 'missing'
          )
        );
      }

      const text =
        xhr.responseText || '';

      if (text.length !== 64) {
        throw new Error(
          'body length ' +
          text.length +
          ' instead of 64'
        );
      }

      return true;
    }

    stats.stage = 'probing lazy transport';
    setLoadingText(
      'Testing lazy PCK transport…'
    );

    const candidateBases = [
      BASE,
      BASE.replace(
        'cdn.jsdelivr.net',
        'fastly.jsdelivr.net'
      )
    ];

    const probeErrors = [];
    let rangeSucceeded = false;

    for (const candidate of candidateBases) {
      try {
        syncRangeProbe(candidate);

        rangeBase = candidate;
        rangeSucceeded = true;
        break;
      } catch (error) {
        probeErrors.push(
          new URL(candidate).host +
          ': ' +
          errorText(error)
        );
      }
    }

    if (rangeSucceeded) {
      transport = 'range';
      stats.transport = 'range';
      stats.cacheUnit = '2 MiB blocks';
      stats.rangeProbe =
        'sync HTTP 206 confirmed';
      stats.rangeHost =
        new URL(rangeBase).host;
    } else {
      transport = 'part';
      stats.transport = 'part';
      stats.cacheUnit =
        '~19.3 MiB physical parts';
      stats.rangeProbe =
        'range unavailable → lazy whole parts';
      stats.rangeHost = '';

      console.warn(
        '[Buckshot lazy] Range transport unavailable; ' +
        'using lazy physical-part cache instead.',
        probeErrors
      );
    }

    stats.stage = 'fetching Godot runtime';
    setLoadingText('Fetching Godot runtime…');

    const runtimeResponse = await nativeFetch(
      BASE + 'buckshot-roulette.js',
      {
        cache: 'force-cache'
      }
    );

    if (!runtimeResponse.ok) {
      fail(
        'buckshot-roulette.js HTTP ' +
        runtimeResponse.status
      );
    }

    let runtimeSource = await runtimeResponse.text();

    runtimeSource = replaceExactly(
      runtimeSource,
      /me\.rtenv\s*=\s*module\s*;/,
      '$&globalThis.__BUCKSHOT_RTENV=module;',
      'Godot runtime export'
    );

    runtimeSource = replaceExactly(
      runtimeSource,
      /FS\.staticInit\(\)\s*;/,
      '$&' +
      'Module["__buckshotFS"]=FS;' +
      'Module["__buckshotMalloc"]=function(size){return _malloc(size);};' +
      'Module["__buckshotHeap8"]=function(){return HEAP8;};',
      'Emscripten FS export'
    );

    stats.stage = 'loading Godot runtime';

    const runtimeScript =
      gameDocument.createElement('script');

    runtimeScript.textContent = runtimeSource;
    gameDocument.head.appendChild(runtimeScript);
    runtimeScript.remove();

    runtimeSource = '';

    if (typeof gameWindow.Engine !== 'function') {
      fail(
        'Patched buckshot-roulette.js executed, but window.Engine was not created.'
      );
    }

    stats.stage = 'assembling WASM only';
    setLoadingText(
      'Loading Buckshot WASM…\n' +
      'PCK remains virtual; it is not being assembled.'
    );

    const wasmBlobs = [];
    let wasmStagingBytes = 0;

    for (let part = 1; part <= 3; part++) {
      setLoadingText(
        'Loading Buckshot WASM… ' +
        part +
        ' / 3\n' +
        'PCK remains virtual; it is not being assembled.'
      );

      const response = await nativeFetch(
        BASE +
        'buckshot-roulette.wasm.part' +
        part,
        {
          cache: 'force-cache'
        }
      );

      if (!response.ok) {
        fail(
          'buckshot-roulette.wasm.part' +
          part +
          ' HTTP ' +
          response.status
        );
      }

      const blob = await response.blob();

      wasmBlobs.push(blob);
      wasmStagingBytes += blob.size;
      stats.binaryTempBytes = wasmStagingBytes;
      stats.wasmPartsLoaded = part;
    }

    let wasmBlob = new gameWindow.Blob(
      wasmBlobs,
      {
        type: 'application/wasm'
      }
    );

    if (wasmBlob.size !== WASM_SIZE) {
      fail(
        'WASM size mismatch: got ' +
        wasmBlob.size +
        ', expected ' +
        WASM_SIZE
      );
    }

    stats.wasmBlobBytes = wasmBlob.size;
    stats.binaryTempBytes = wasmBlob.size;
    wasmBlobUrl =
      gameWindow.URL.createObjectURL(wasmBlob);

    wasmBlobs.length = 0;
    wasmStagingBytes = 0;

    gameWindow.fetch = function (input, init) {
      let url = '';

      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof gameWindow.URL) {
        url = input.href;
      } else if (input && input.url) {
        url = input.url;
      }

      let path = url;

      try {
        path = new gameWindow.URL(
          url,
          gameWindow.location.href
        ).pathname;
      } catch (_) {}

      if (
        path.endsWith('/buckshot-roulette.wasm') ||
        path === 'buckshot-roulette.wasm'
      ) {
        return nativeFetch(wasmBlobUrl, init);
      }

      return nativeFetch(input, init);
    };

    const GODOT_CONFIG = {
      args: [],
      canvasResizePolicy: 2,
      ensureCrossOriginIsolationHeaders: false,
      executable: 'buckshot-roulette',
      experimentalVK: false,

      fileSizes: {
        'buckshot-roulette.pck': PCK_SIZE,
        'buckshot-roulette.wasm': WASM_SIZE
      },

      focusCanvas: false,
      gdextensionLibs: []
    };

    const engine =
      new gameWindow.Engine(GODOT_CONFIG);

    stats.stage = 'initializing WASM';
    setLoadingText(
      'Initializing Godot WASM…\n' +
      'PCK cache: 0 / 60 MB'
    );

    await engine.init(
      BASE + 'buckshot-roulette'
    );

    gameWindow.fetch = nativeFetch;

    try {
      gameWindow.URL.revokeObjectURL(wasmBlobUrl);
      wasmBlobUrl = null;
    } catch (_) {}

    wasmBlob = null;
    stats.binaryTempBytes = 0;

    const runtime =
      gameWindow.__BUCKSHOT_RTENV;

    const FS =
      runtime &&
      runtime.__buckshotFS;

    if (!runtime || !FS) {
      fail(
        'Godot initialized, but the patched Emscripten FS was not exposed.'
      );
    }

    if (
      typeof runtime.__buckshotMalloc !== 'function' ||
      typeof runtime.__buckshotHeap8 !== 'function'
    ) {
      fail(
        'Godot initialized, but mmap helpers were not exposed.'
      );
    }

    const cache = new Map();
    let prefetchPromise = null;
    let prefetchIndex = null;

    function findPartIndex(logicalOffset) {
      for (
        let i = 0;
        i < PART_SIZES.length;
        i++
      ) {
        const start =
          PART_STARTS[i];

        const end =
          start +
          PART_SIZES[i];

        if (
          logicalOffset >= start &&
          logicalOffset < end
        ) {
          return i;
        }
      }

      return -1;
    }

    function physicalSegments(start, length) {
      const segments = [];
      const end =
        start + length;

      let logical = start;

      while (logical < end) {
        const partIndex =
          findPartIndex(logical);

        if (partIndex < 0) {
          fail(
            'Could not map logical PCK offset ' +
            logical +
            ' to a physical part.'
          );
        }

        const partStart =
          PART_STARTS[partIndex];

        const localOffset =
          logical - partStart;

        const available =
          PART_SIZES[partIndex] -
          localOffset;

        const take =
          Math.min(
            end - logical,
            available
          );

        segments.push({
          part: partIndex + 1,
          offset: localOffset,
          length: take
        });

        logical += take;
      }

      return segments;
    }

    function parseContentRange(value) {
      const match =
        /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(
          String(value || '').trim()
        );

      if (!match) {
        return null;
      }

      return {
        start: Number(match[1]),
        end: Number(match[2]),
        total:
          match[3] === '*'
            ? null
            : Number(match[3])
      };
    }

    function binaryTextToBytes(text) {
      const bytes =
        new Uint8Array(text.length);

      for (
        let i = 0;
        i < text.length;
        i++
      ) {
        bytes[i] =
          text.charCodeAt(i) & 255;
      }

      return bytes;
    }

    function syncRange(segment) {
      const start =
        segment.offset;

      const end =
        segment.offset +
        segment.length -
        1;

      const url =
        rangeBase +
        'buckshot-roulette.pck.part' +
        segment.part;

      const xhr =
        new gameWindow.XMLHttpRequest();

      try {
        xhr.open(
          'GET',
          url,
          false
        );

        xhr.setRequestHeader(
          'Range',
          'bytes=' +
          start +
          '-' +
          end
        );

        if (xhr.overrideMimeType) {
          xhr.overrideMimeType(
            'text/plain; charset=x-user-defined'
          );
        }

        xhr.send(null);
      } catch (error) {
        fail(
          'Sync PCK Range request failed for part ' +
          segment.part +
          ': ' +
          errorText(error)
        );
      }

      if (xhr.status !== 206) {
        fail(
          'Sync PCK Range returned HTTP ' +
          xhr.status +
          ' for part ' +
          segment.part
        );
      }

      const range =
        parseContentRange(
          xhr.getResponseHeader(
            'Content-Range'
          )
        );

      if (
        !range ||
        range.start !== start ||
        range.end !== end
      ) {
        fail(
          'Invalid Content-Range for part ' +
          segment.part +
          ': ' +
          xhr.getResponseHeader(
            'Content-Range'
          )
        );
      }

      let text =
        xhr.responseText || '';

      if (
        text.length !==
        segment.length
      ) {
        fail(
          'Range byte-count mismatch for part ' +
          segment.part +
          ': expected ' +
          segment.length +
          ', got ' +
          text.length
        );
      }

      const bytes =
        binaryTextToBytes(text);

      text = '';

      stats.syncRangeRequests++;
      stats.syncBytes +=
        bytes.byteLength;

      stats.fetchedBytes +=
        bytes.byteLength;

      return bytes;
    }

    async function asyncRange(segment) {
      const start =
        segment.offset;

      const end =
        segment.offset +
        segment.length -
        1;

      const response =
        await nativeFetch(
          rangeBase +
          'buckshot-roulette.pck.part' +
          segment.part,
          {
            headers: {
              Range:
                'bytes=' +
                start +
                '-' +
                end
            },
            cache: 'force-cache'
          }
        );

      if (response.status !== 206) {
        throw new Error(
          'prefetch HTTP ' +
          response.status +
          ' for part ' +
          segment.part
        );
      }

      const range =
        parseContentRange(
          response.headers.get(
            'Content-Range'
          )
        );

      if (
        !range ||
        range.start !== start ||
        range.end !== end
      ) {
        throw new Error(
          'prefetch invalid Content-Range for part ' +
          segment.part
        );
      }

      const bytes =
        new Uint8Array(
          await response.arrayBuffer()
        );

      if (
        bytes.byteLength !==
        segment.length
      ) {
        throw new Error(
          'prefetch byte-count mismatch for part ' +
          segment.part
        );
      }

      stats.asyncRangeRequests++;
      stats.asyncBytes +=
        bytes.byteLength;

      stats.fetchedBytes +=
        bytes.byteLength;

      return bytes;
    }

    function syncWholePart(index) {
      const part =
        index + 1;

      const url =
        BASE +
        'buckshot-roulette.pck.part' +
        part;

      const xhr =
        new gameWindow.XMLHttpRequest();

      try {
        xhr.open(
          'GET',
          url,
          false
        );

        if (xhr.overrideMimeType) {
          xhr.overrideMimeType(
            'text/plain; charset=x-user-defined'
          );
        }

        xhr.send(null);
      } catch (error) {
        fail(
          'Sync whole-part request failed for part ' +
          part +
          ': ' +
          errorText(error)
        );
      }

      if (
        !(
          xhr.status >= 200 &&
          xhr.status < 300
        ) &&
        xhr.status !== 304
      ) {
        fail(
          'Sync whole-part request returned HTTP ' +
          xhr.status +
          ' for part ' +
          part
        );
      }

      let text =
        xhr.responseText || '';

      if (
        text.length !==
        PART_SIZES[index]
      ) {
        fail(
          'Whole-part byte-count mismatch for part ' +
          part +
          ': expected ' +
          PART_SIZES[index] +
          ', got ' +
          text.length
        );
      }

      const bytes =
        binaryTextToBytes(text);

      text = '';

      stats.syncRangeRequests++;
      stats.syncBytes +=
        bytes.byteLength;

      stats.fetchedBytes +=
        bytes.byteLength;

      return bytes;
    }

    async function asyncWholePart(index) {
      const part =
        index + 1;

      const response =
        await nativeFetch(
          BASE +
          'buckshot-roulette.pck.part' +
          part,
          {
            cache: 'force-cache'
          }
        );

      if (!response.ok) {
        throw new Error(
          'part prefetch HTTP ' +
          response.status +
          ' for part ' +
          part
        );
      }

      const bytes =
        new Uint8Array(
          await response.arrayBuffer()
        );

      if (
        bytes.byteLength !==
        PART_SIZES[index]
      ) {
        throw new Error(
          'part prefetch byte-count mismatch for part ' +
          part +
          ': expected ' +
          PART_SIZES[index] +
          ', got ' +
          bytes.byteLength
        );
      }

      stats.asyncRangeRequests++;
      stats.asyncBytes +=
        bytes.byteLength;

      stats.fetchedBytes +=
        bytes.byteLength;

      return bytes;
    }

    function unitStart(index) {
      if (transport === 'part') {
        return PART_STARTS[index];
      }

      return index * BLOCK_SIZE;
    }

    function unitLength(index) {
      if (transport === 'part') {
        return PART_SIZES[index];
      }

      const start =
        index * BLOCK_SIZE;

      return Math.min(
        BLOCK_SIZE,
        PCK_SIZE - start
      );
    }

    function unitIndexForOffset(offset) {
      if (transport === 'part') {
        return findPartIndex(offset);
      }

      return Math.floor(
        offset / BLOCK_SIZE
      );
    }

    function validUnit(index) {
      if (transport === 'part') {
        return (
          index >= 0 &&
          index < PART_SIZES.length
        );
      }

      return (
        index >= 0 &&
        index * BLOCK_SIZE < PCK_SIZE
      );
    }

    function putUnit(index, bytes) {
      if (cache.has(index)) {
        const existing =
          cache.get(index);

        stats.cacheBytes -=
          existing.byteLength;

        cache.delete(index);
      }

      cache.set(
        index,
        bytes
      );

      stats.cacheBytes +=
        bytes.byteLength;

      stats.cachePeak =
        Math.max(
          stats.cachePeak,
          stats.cacheBytes
        );

      stats.cachePeakBlocks =
        Math.max(
          stats.cachePeakBlocks,
          cache.size
        );

      while (
        stats.cacheBytes >
        CACHE_LIMIT &&
        cache.size > 1
      ) {
        const oldest =
          cache.keys().next().value;

        const evicted =
          cache.get(oldest);

        cache.delete(oldest);

        stats.cacheBytes -=
          evicted.byteLength;

        stats.evictions++;
      }

      stats.cacheBlocks =
        cache.size;
    }

    function touchUnit(index) {
      const unit =
        cache.get(index);

      cache.delete(index);
      cache.set(index, unit);

      return unit;
    }

    function loadUnitSync(index) {
      if (!validUnit(index)) {
        fail(
          'Invalid PCK cache unit ' +
          index
        );
      }

      if (transport === 'part') {
        return syncWholePart(index);
      }

      const start =
        unitStart(index);

      const length =
        unitLength(index);

      const block =
        new Uint8Array(length);

      const segments =
        physicalSegments(
          start,
          length
        );

      let destination = 0;

      for (const segment of segments) {
        const bytes =
          syncRange(segment);

        block.set(
          bytes,
          destination
        );

        destination +=
          bytes.byteLength;
      }

      return block;
    }

    async function loadUnitAsync(index) {
      if (!validUnit(index)) {
        throw new Error(
          'Invalid PCK prefetch unit ' +
          index
        );
      }

      if (transport === 'part') {
        return asyncWholePart(index);
      }

      const start =
        unitStart(index);

      const length =
        unitLength(index);

      const block =
        new Uint8Array(length);

      const segments =
        physicalSegments(
          start,
          length
        );

      let destination = 0;

      for (const segment of segments) {
        const bytes =
          await asyncRange(segment);

        block.set(
          bytes,
          destination
        );

        destination +=
          bytes.byteLength;
      }

      return block;
    }

    function prefetch(index) {
      if (
        !validUnit(index) ||
        cache.has(index)
      ) {
        return;
      }

      if (prefetchPromise !== null) {
        return;
      }

      prefetchIndex = index;
      stats.prefetchBlock = index;
      stats.prefetches++;

      prefetchPromise =
        loadUnitAsync(index)
          .then((unit) => {
            if (!cache.has(index)) {
              putUnit(
                index,
                unit
              );
            }
          })
          .catch((error) => {
            stats.prefetchFailures++;
            stats.lastPrefetchError =
              errorText(error);
          })
          .finally(() => {
            prefetchPromise = null;
            prefetchIndex = null;
            stats.prefetchBlock = null;
          });
    }

    function getUnit(index) {
      if (cache.has(index)) {
        stats.hits++;

        const unit =
          touchUnit(index);

        stats.lastBlock = index;

        prefetch(index + 1);

        return unit;
      }

      stats.misses++;
      stats.activeBlock = index;

      let unit;

      try {
        unit =
          loadUnitSync(index);

        putUnit(
          index,
          unit
        );

        stats.lastBlock = index;
      } finally {
        stats.activeBlock = null;
      }

      prefetch(index + 1);

      return unit;
    }

    function readInto(
      buffer,
      destinationOffset,
      length,
      logicalPosition
    ) {
      if (
        logicalPosition >= PCK_SIZE ||
        length <= 0
      ) {
        return 0;
      }

      const size =
        Math.min(
          length,
          PCK_SIZE - logicalPosition
        );

      let remaining = size;
      let logical = logicalPosition;
      let destination =
        destinationOffset;

      while (remaining > 0) {
        const unitIndex =
          unitIndexForOffset(logical);

        if (unitIndex < 0) {
          fail(
            'Could not map logical read offset ' +
            logical
          );
        }

        const unit =
          getUnit(unitIndex);

        const start =
          unitStart(unitIndex);

        const inside =
          logical - start;

        const take =
          Math.min(
            remaining,
            unit.byteLength - inside
          );

        buffer.set(
          unit.subarray(
            inside,
            inside + take
          ),
          destination
        );

        remaining -= take;
        logical += take;
        destination += take;
      }

      return size;
    }

    stats.stage = 'installing virtual PCK';
    setLoadingText(
      'Installing 344.7 MB virtual PCK…\n' +
      'Cache cap: 60 MB'
    );

    let pckNode;

    try {
      FS.createDataFile(
        '/',
        'buckshot-roulette.pck',
        null,
        true,
        false
      );

      pckNode =
        FS.lookupPath(
          '/buckshot-roulette.pck'
        ).node;

      if (!pckNode) {
        fail(
          'Virtual PCK was created, but Emscripten did not return it from lookupPath().'
        );
      }
    } catch (error) {
      fail(
        'Could not create virtual PCK file: ' +
        errorText(error)
      );
    }

    pckNode.usedBytes = PCK_SIZE;

    const streamOps =
      Object.assign(
        {},
        pckNode.stream_ops
      );

    streamOps.llseek = function (
      stream,
      offset,
      whence
    ) {
      let position = offset;

      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        position += PCK_SIZE;
      }

      if (position < 0) {
        throw new FS.ErrnoError(28);
      }

      return position;
    };

    streamOps.read = function (
      stream,
      buffer,
      offset,
      length,
      position
    ) {
      stats.readCalls++;

      const read =
        readInto(
          buffer,
          offset,
          length,
          position
        );

      stats.readBytes += read;

      return read;
    };

    streamOps.mmap = function (
      stream,
      length,
      position,
      prot,
      flags
    ) {
      stats.mmapCalls++;
      stats.mmapBytes += length;
      stats.largestMmap =
        Math.max(
          stats.largestMmap,
          length
        );

      const pointer =
        runtime.__buckshotMalloc(
          length
        );

      if (!pointer) {
        fail(
          'Godot requested a PCK mmap of ' +
          mb(length) +
          ', but WASM malloc failed.'
        );
      }

      const heap =
        runtime.__buckshotHeap8();

      const read =
        readInto(
          heap,
          pointer,
          length,
          position
        );

      if (read !== length) {
        fail(
          'Short lazy PCK mmap: requested ' +
          length +
          ' bytes, read ' +
          read +
          '.'
        );
      }

      return {
        ptr: pointer,
        allocated: true
      };
    };

    pckNode.stream_ops = streamOps;

    stats.stage =
      transport === 'part'
        ? 'priming PCK part 1'
        : 'priming PCK block 0';

    setLoadingText(
      (
        transport === 'part'
          ? 'Priming first physical PCK part…\n'
          : 'Priming first 2 MiB PCK block…\n'
      ) +
      'Cache cap: 60 MiB'
    );

    if (transport === 'part') {
      for (let index = 0; index < 3; index++) {
        setLoadingText(
          'Priming PCK physical parts… ' +
          (index + 1) +
          ' / 3\n' +
          'Cache cap: 60 MiB'
        );

        const unit =
          await loadUnitAsync(index);

        putUnit(
          index,
          unit
        );
      }

      prefetch(3);
    } else {
      const firstUnit =
        await loadUnitAsync(0);

      putUnit(
        0,
        firstUnit
      );

      prefetch(1);
    }

    stats.stage = 'starting Godot';
    setLoadingText(
      'Starting Buckshot Roulette…\n' +
      'Lazy PCK active — 60 MB cache'
    );

    const statusOverlay =
      gameDocument.getElementById('status');

    const statusProgress =
      gameDocument.getElementById(
        'status-progress'
      );

    const loadingText =
      gameDocument.getElementById(
        'loading-text'
      );

    if (loadingText) {
      loadingText.remove();
    }

    if (statusOverlay) {
      statusOverlay.style.visibility =
        'visible';
    }

    const missing =
      gameWindow.Engine.getMissingFeatures({
        threads: false
      });

    if (missing.length !== 0) {
      fail(
        'Godot browser features missing: ' +
        missing.join(', ')
      );
    }

    await engine.start({
      args: [
        '--main-pack',
        'buckshot-roulette.pck'
      ],

      onProgress(current, total) {
        if (!statusProgress) {
          return;
        }

        if (
          current > 0 &&
          total > 0
        ) {
          statusProgress.value =
            current;

          statusProgress.max =
            total;
        } else {
          statusProgress.removeAttribute(
            'value'
          );

          statusProgress.removeAttribute(
            'max'
          );
        }
      }
    });

    if (statusOverlay) {
      statusOverlay.remove();
    }

    stats.stage = 'Running';

  } catch (error) {
    const message =
      errorText(error);

    try {
      if (
        gameWindow &&
        gameWindow.__buckLazyStats
      ) {
        const errorStats =
          gameWindow.__buckLazyStats;

        if (errorStats.stage !== 'FAILED') {
          errorStats.failures++;
        }

        errorStats.lastError =
          message;

        errorStats.stage =
          'FAILED';
      }
    } catch (_) {}

    showFatalError(message);

    hud.textContent =
      'BUCKSHOT ROULETTE — LAZY PCK DEBUG V3\n\n' +
      'FAILED\n' +
      message +
      '\n\n' +
      'No eager-PCK fallback was used.';
  }
})();
