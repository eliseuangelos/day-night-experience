// DAY & NIGHT BUILDER: coleta as escolhas, gera os arquivos com o gerador e mostra a prévia usando o MESMO
// JavaScript/CSS que será exportado (carregado como <script> a partir de um Blob, sem eval).
(function () {
  'use strict';
  var G = window.DNGenerator, Z = window.DNZip, $ = function (s) { return document.querySelector(s); };
  var FILES = ['core.js', 'globe.js', 'clouds.js', 'core.css', 'stage.css'], KEY = 'dn-builder-preview', MIME = { js: 'text/javascript', css: 'text/css', html: 'text/html', md: 'text/markdown', txt: 'text/plain' };
  var S = G.defaults(), SRC, OUT, inst, nodes, url, theme, seq = 0, timer;
  S.mode = null;

  var F = [
    { g: 'botao', k: 'button.shape', t: 'select', l: 'Formato', o: [['circle', 'Círculo'], ['rounded', 'Quadrado arredondado']] },
    { g: 'botao', k: 'button.icons', t: 'select', l: 'Ícones de sol e lua', o: [['solid', 'Sólidos'], ['outline', 'Contorno']] },
    { g: 'botao', k: 'button.size', t: 'range', l: 'Tamanho', min: 32, max: 96, u: 'px' },
    { g: 'botao', k: 'button.position', t: 'select', l: 'Posição', o: [['top-right', 'Canto superior direito'], ['top-left', 'Canto superior esquerdo'], ['bottom-right', 'Canto inferior direito'], ['bottom-left', 'Canto inferior esquerdo'], ['inline', 'Dentro do conteúdo']] },
    { g: 'botao', k: 'button.offset', t: 'range', l: 'Espaçamento da borda', min: 0, max: 48, u: 'px', w: function (s) { return s.button.position !== 'inline'; } },
    { g: 'botao', k: 'button.transition', t: 'select', l: 'Transições', o: [['smooth', 'Suaves'], ['fast', 'Rápidas'], ['none', 'Sem transição']] },
    { g: 'botao', k: 'button.colors.dayBg', t: 'color', l: 'Dia · fundo' },
    { g: 'botao', k: 'button.colors.dayFg', t: 'color', l: 'Dia · ícone' },
    { g: 'botao', k: 'button.colors.nightBg', t: 'color', l: 'Noite · fundo' },
    { g: 'botao', k: 'button.colors.nightFg', t: 'color', l: 'Noite · ícone' },
    { g: 'efeitos', k: 'rotation', t: 'check', l: 'Planeta girando' },
    { g: 'efeitos', k: 'clouds', t: 'check', l: 'Exibir nuvens' },
    { g: 'efeitos', k: 'speed', t: 'select', l: 'Velocidade da animação', o: [['slow', 'Lenta · 4,2 s'], ['normal', 'Normal · 2,8 s'], ['fast', 'Rápida · 1,6 s']] },
    { g: 'temas', k: 'attribute', t: 'select', l: 'Aplicar o tema por', o: [['data-theme', 'Atributo data-theme'], ['class', 'Classe "dark"']] },
    { g: 'temas', k: 'persistence', t: 'check', l: 'Lembrar a preferência (localStorage)' },
    { g: 'temas', k: 'respectSystem', t: 'check', l: 'Respeitar o tema do sistema' }
  ];

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { return k.split('.').reduce(function (o, p) { return o[p]; }, S); }
  function put(k, v) { var p = k.split('.'), l = p.pop(); p.reduce(function (o, x) { return o[x]; }, S)[l] = v; }
  function status(m, err) { var e = $('#status'); e.textContent = m; e.className = err ? 'err' : ''; }

  F.forEach(function (f, i) {
    var id = 'f' + i, d = document.createElement('div'), h;
    if (f.t === 'check') h = '<label class="chk"><input id="' + id + '" data-i="' + i + '" type="checkbox"> ' + f.l + '</label>';
    else {
      h = '<label for="' + id + '">' + f.l + (f.u ? ' <output id="o' + i + '" class="mono"></output>' : '') + '</label>';
      h += f.t === 'select' ? '<select id="' + id + '" data-i="' + i + '">' + f.o.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>'
        : '<input id="' + id + '" data-i="' + i + '" type="' + f.t + '"' + (f.t === 'range' ? ' min="' + f.min + '" max="' + f.max + '"' : '') + '>';
    }
    d.className = 'field'; d.id = 'w' + i; d.innerHTML = h; $('#g-' + f.g).appendChild(d);
  });

  function sync() { // reflete o estado nos controles e mostra só o que a modalidade escolhida usa
    F.forEach(function (f, i) {
      var e = $('#f' + i), v = get(f.k), o = $('#o' + i);
      if (f.t === 'check') e.checked = v; else e.value = v;
      if (o) o.textContent = v + f.u;
      $('#w' + i).hidden = f.w ? !f.w(S) : false;
    });
    document.querySelectorAll('[name=mode]').forEach(function (r) { r.checked = r.value === S.mode; });
    document.body.dataset.ready = S.mode ? '1' : '';
    $('#st-efeitos').hidden = S.mode !== 'cinematic';
  }
  function update() { sync(); clearTimeout(timer); timer = setTimeout(build, 150); }

  $('#form').addEventListener('input', function (e) {
    var i = e.target.dataset.i, f;
    if (i == null) return;
    f = F[i]; put(f.k, f.t === 'check' ? e.target.checked : f.t === 'range' ? +e.target.value : e.target.value); update();
  });
  document.querySelectorAll('[name=mode]').forEach(function (r) { r.addEventListener('change', function () { S.mode = r.value; update(); }); });

  function build() {
    if (!S.mode) return;
    var my = ++seq, ready = SRC ? Promise.resolve() : Promise.all(FILES.map(function (f) { return fetch('../component/src/' + f).then(function (x) { if (!x.ok) throw new Error(f + ' (' + x.status + ')'); return x.text(); }); })).then(function (r) { SRC = {}; FILES.forEach(function (f, i) { SRC[f] = r[i]; }); });
    status('Gerando arquivos…');
    ready.then(function () {
      if (my !== seq) return;
      OUT = G.generate(S, SRC, { date: new Date().toLocaleDateString('pt-BR') });
      list(); renderGuide(); preview(my); status('Arquivos prontos.');
    }).catch(function (e) { status('Não foi possível gerar os arquivos. Abra o construtor pelo GitHub Pages ou por um servidor local (os módulos são lidos com fetch). Detalhe: ' + e.message, true); });
  }

  function list() {
    $('#dl-list').innerHTML = Object.keys(OUT.files).map(function (n) {
      return '<li><span class="mono">' + n + '</span><span class="size">' + (new Blob([OUT.files[n]]).size / 1024).toFixed(1) + ' KB</span><button class="btn ghost" type="button" data-f="' + n + '">Baixar</button></li>';
    }).join('');
  }
  function save(name, blob) { // URL temporária liberada depois do clique
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  $('#dl-list').addEventListener('click', function (e) {
    var n = e.target.dataset.f;
    if (!n || !OUT) return;
    try { save(n, new Blob([OUT.files[n]], { type: MIME[n.split('.').pop()] || 'text/plain' })); status('Download iniciado: ' + n); } catch (x) { status('Falha ao baixar ' + n + ': ' + x.message, true); }
  });
  $('#dl-zip').addEventListener('click', function () {
    var b = $('#dl-zip'), names;
    if (!OUT) return;
    b.disabled = true; status('Preparando o pacote…');
    setTimeout(function () {
      try { names = Object.keys(OUT.files); save('day-night-personalizado.zip', new Blob([Z.build(OUT.files, 'day-night-personalizado')], { type: 'application/zip' })); status('Pacote gerado: day-night-personalizado.zip (' + names.length + ' arquivos).'); }
      catch (x) { status('Falha ao gerar o ZIP: ' + x.message, true); }
      b.disabled = false;
    }, 30);
  });

  function renderGuide() {
    $('#guide').innerHTML = OUT.guide.map(function (s, i) {
      return '<li><h3>' + esc(s.t) + '</h3><p>' + esc(s.p) + '</p>' + (s.c ? '<div class="code"><pre><code>' + esc(s.c) + '</code></pre><button type="button" class="copy" data-i="' + i + '">Copiar</button></div>' : '') + '</li>';
    }).join('');
  }
  $('#guide').addEventListener('click', function (e) {
    var i = e.target.dataset.i, btn = e.target, text;
    if (i == null || !OUT) return;
    text = OUT.guide[i].c;
    function done() { btn.textContent = 'Copiado ✓'; setTimeout(function () { btn.textContent = 'Copiar'; }, 1800); }
    function fallback() { var t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (x) { btn.textContent = 'Selecione e copie'; } t.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  });

  // Prévia: destrói a instância anterior, remove o JS/CSS antigos e carrega os recém-gerados (sem recarregar a página).
  function teardown() {
    if (inst) { theme = inst.get(); inst.destroy(); inst = null; }
    if (nodes) nodes.forEach(function (n) { n.remove(); });
    if (url) URL.revokeObjectURL(url);
    nodes = url = null;
  }
  function preview(my) {
    var st = document.createElement('style'), sc = document.createElement('script');
    teardown();
    st.textContent = OUT.files['day-night.css']; document.head.appendChild(st);
    url = URL.createObjectURL(new Blob([OUT.files['day-night.js']], { type: 'text/javascript' })); nodes = [st, sc];
    sc.onload = function () {
      if (my !== seq) return;
      inst = window.DayNight.init({ root: $('#pv'), target: OUT.config.button.position === 'inline' ? $('#pv-slot') : null, storageKey: KEY, theme: theme });
      info();
    };
    sc.src = url; document.head.appendChild(sc);
  }
  function info() {
    var c = OUT.config, t = ['modalidade: ' + (c.mode === 'cinematic' ? 'experiência completa' : 'somente botões'), 'botão: ' + c.button.shape + ', ' + c.button.size + 'px, ' + c.button.position, 'tema por ' + (c.attribute === 'class' ? 'classe' : 'data-theme')];
    if (c.mode === 'cinematic') t.push('velocidade: ' + c.speed + ' (' + G.SPEEDS[c.speed] + ' ms)', 'rotação: ' + (c.rotation ? 'sim' : 'não'), 'nuvens: ' + (c.clouds ? 'sim' : 'não'));
    $('#pv-info').textContent = t.join(' · ');
  }
  function test(a, b) { if (!inst) return; inst.set(a, { animate: false, persist: false }); setTimeout(function () { inst.set(b, { persist: false }); }, 150); }
  $('#pv-toggle').onclick = function () { if (inst) inst.toggle(); };
  $('#pv-dn').onclick = function () { test('light', 'dark'); };
  $('#pv-nd').onclick = function () { test('dark', 'light'); };
  addEventListener('pagehide', teardown);
  sync();
})();
