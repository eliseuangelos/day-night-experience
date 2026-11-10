'use strict';
// Testes do gerador e dos pacotes exportados. Uso: node tools/test.js   (Node 18+, Python 3 para validar o ZIP)
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const G = require('./generator.js'), Z = require('./zip.js');
const R = path.join(__dirname, '..'), SRC = {}, TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'dn-')), out = [];
['core.js', 'globe.js', 'clouds.js', 'core.css', 'stage.css'].forEach(f => { SRC[f] = fs.readFileSync(path.join(R, 'component/src', f), 'utf8'); });
const T = (name, fn) => { try { out.push(['OK  ', name, fn() || '']); } catch (e) { out.push(['ERRO', name, e.message]); } };
const eq = (a, b, m) => { if (a !== b) throw new Error((m || '') + ': esperado ' + b + ', obtido ' + a); };
const no = (s, re, m) => { const x = s.match(re); if (x) throw new Error(m + ' contém "' + x[0] + '"'); };
const has = (s, re, m) => { if (!re.test(s)) throw new Error(m + ' não contém ' + re); };
const read = p => fs.readFileSync(p, 'utf8');

// Ambiente de navegador simulado (DOM mínimo, Canvas falso, rAF manual, localStorage, matchMedia)
function env(o) {
  o = o || {};
  const store = new Map(Object.entries(o.store || {})), q = [], warns = [], noop = () => {}; let t = 0;
  const ctx = () => ({
    createLinearGradient: () => ({ addColorStop: noop }), createRadialGradient: () => ({ addColorStop: noop }),
    getImageData: (x, y, w, h) => { const d = new Uint8ClampedArray(w * h * 4); for (let i = 0; i < d.length; i++) d[i] = i % 4 === 3 ? ((i >> 2) % 3 ? 0 : 255) : (i * 7) % 251; return { data: d }; },
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), beginPath: noop, moveTo: noop, lineTo: noop, fill: noop, fillRect: noop, clearRect: noop, drawImage: noop, putImageData: noop
  });
  const el = () => { const cl = new Set(), at = {}; return { style: { setProperty: noop }, classList: { add: (...a) => a.forEach(x => cl.add(x)), toggle: (x, f) => (f ? cl.add(x) : cl.delete(x)), contains: x => cl.has(x) }, at, cl, setAttribute: (k, v) => { at[k] = String(v); }, getAttribute: k => at[k], appendChild: noop, remove() { this.gone = true; }, addEventListener: noop, getContext: ctx }; };
  const doc = { createElement: el, body: el(), head: el(), documentElement: el(), dispatchEvent: noop, addEventListener: noop, querySelector: () => null };
  Object.assign(global, { window: global, document: doc, CustomEvent: function () {}, innerWidth: 390, innerHeight: 800, requestAnimationFrame: f => (q.push(f), q.length), cancelAnimationFrame: noop,
    localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
    matchMedia: m => ({ matches: /reduce/.test(m) ? !!o.reduced : !!o.dark, addEventListener: noop, removeEventListener: noop }) });
  console.warn = (...a) => warns.push(a.join(' '));
  return { store, doc, q, warns, drain() { let first, n = 0; while (q.length && n < 5000) { const f = q.shift(); t += 16; if (first === undefined) first = t; f(t); n++; } return first === undefined ? 0 : t - first; } };
}
const load = f => { delete require.cache[require.resolve(f)]; return require(f); };
const write = (dir, files) => { fs.mkdirSync(dir, { recursive: true }); Object.keys(files).forEach(n => fs.writeFileSync(path.join(dir, n), files[n])); };

// 17.1 / 17.3: modalidades e funcionamento
const CASES = { 'somente-botoes': { mode: 'button' }, 'completa': {}, 'sem-rotacao': { rotation: false }, 'sem-nuvens': { clouds: false }, 'sem-rotacao-sem-nuvens': { rotation: false, clouds: false } };
const GEN = {};
Object.keys(CASES).forEach(n => {
  const r = GEN[n] = G.generate(CASES[n], SRC, { date: 'teste' }), d = path.join(TMP, n); write(d, r.files);
  T('sintaxe do JS · ' + n, () => { cp.execFileSync(process.execPath, ['--check', path.join(d, 'day-night.js')]); return (r.files['day-night.js'].length / 1024).toFixed(1) + ' KB'; });
  T('CSS íntegro · ' + n, () => { const c = r.files['day-night.css']; eq((c.match(/{/g) || []).length, (c.match(/}/g) || []).length, 'chaves'); return (c.length / 1024).toFixed(1) + ' KB'; });
  T('alterna nos dois sentidos · ' + n, () => {
    const e = env(), D = load(path.join(d, 'day-night.js')), i = D.init(), cin = r.config.mode === 'cinematic';
    i.toggle(); const ms = e.drain(); eq(i.get(), 'dark', 'tema'); eq(e.doc.documentElement.at['data-theme'], 'dark', 'atributo'); eq(i.button().at['aria-checked'], 'true', 'botão');
    i.toggle(); e.drain(); eq(i.get(), 'light', 'volta'); eq(i.button().at['aria-checked'], 'false', 'botão (volta)');
    if (e.warns.length) throw new Error(e.warns[0]);
    if (cin) { eq(i.config().rotation, r.config.rotation, 'rotation'); eq(i.config().clouds, r.config.clouds, 'clouds'); }
    return cin ? 'transição de ' + ms + ' ms, sem avisos' : 'troca imediata, sem avisos';
  });
});

// 8.1 / 8.3: exclusão real de recursos
T('somente botões: sem motor gráfico, Canvas, rotação ou nuvens', () => {
  const j = GEN['somente-botoes'].files['day-night.js'], c = GEN['somente-botoes'].files['day-night.css'];
  no(j, /getImageData|createImageData|LAND|HUBS|requestAnimationFrame|fbm|canvas|rotation|clouds|DN\.fx = |dn-stage/i, 'JS'); no(c, /dn-stage|canvas/i, 'CSS');
  eq(GEN['somente-botoes'].modules.join(), 'core', 'módulos'); return 'módulos: core; ' + (j.length / 1024).toFixed(1) + ' KB contra ' + (GEN.completa.files['day-night.js'].length / 1024).toFixed(1) + ' KB';
});
T('somente botões: documentação sem planeta, Canvas ou nuvens', () => { Object.keys(GEN['somente-botoes'].files).forEach(n => { if (!/\.js$|\.css$/.test(n)) no(GEN['somente-botoes'].files[n], /Canvas|Terra|nuvens|rotaç|rotation|clouds|planeta/i, n); }); });
T('sem nuvens: módulo de nuvens ausente', () => ['sem-nuvens', 'sem-rotacao-sem-nuvens'].forEach(n => { const j = GEN[n].files['day-night.js']; no(j, /módulo: clouds|DN\.clouds = \{|\.46\) \/ \.22/, n); has(j, /módulo: globe/, n); eq(GEN[n].modules.join(), 'core,globe', n); }));
T('completa: núcleo, motor e nuvens, em ordem de dependência', () => { eq(GEN.completa.modules.join(), 'core,globe,clouds', 'ordem'); has(GEN.completa.files['day-night.css'], /dn-stage/, 'CSS do palco'); });
T('docs coerentes com a configuração', () => { has(GEN['sem-nuvens'].files['instrucoes.txt'], /Nuvens: não/, 'txt'); has(GEN.completa.files['instrucoes.txt'], /Nuvens: sim/, 'txt'); no(GEN['sem-nuvens'].files['instrucoes.txt'], /clouds: false/, 'txt (opção inexistente)'); });
T('validação e valores seguros', () => { const v = G.validate({ mode: 'x', speed: 'turbo', button: { size: 9999, position: 'meio', colors: { dayBg: 'red' } }, storageKey: 'a b', themes: { light: 'x', dark: 'x' } }).config; eq(v.mode, 'cinematic', 'mode'); eq(v.speed, 'normal', 'speed'); eq(v.button.size, 48, 'size'); eq(v.button.position, 'top-right', 'position'); eq(v.button.colors.dayBg, '#ffffff', 'cor'); eq(v.storageKey, 'dn-theme', 'chave'); eq(v.themes.dark, 'dark', 'temas'); });

// 17.2: velocidades nos dois sentidos
['slow', 'normal', 'fast'].forEach(sp => T('velocidade ' + sp, () => {
  const r = G.generate({ speed: sp }, SRC), d = path.join(TMP, 'v-' + sp); write(d, r.files);
  const e = env(), i = load(path.join(d, 'day-night.js')).init(); i.toggle(); const a = e.drain(); i.toggle(); const b = e.drain(), want = G.SPEEDS[sp];
  if (Math.abs(a - want) > 40 || Math.abs(b - want) > 40) throw new Error(a + ' / ' + b + ' ms, esperado ' + want);
  return 'dia→noite ' + a + ' ms · noite→dia ' + b + ' ms · alvo ' + want + ' ms';
}));

// 17.3: persistência, sistema, movimento reduzido, ciclo de vida
const BTN = path.join(TMP, 'somente-botoes', 'day-night.js'), FULL = path.join(TMP, 'completa', 'day-night.js');
T('persistência: grava e restaura', () => { let e = env(), i = load(BTN).init(); i.toggle(); eq(e.store.get('dn-theme'), 'dark', 'gravou'); e = env({ store: { 'dn-theme': 'dark' } }); i = load(BTN).init(); eq(i.get(), 'dark', 'restaurou'); eq(e.doc.documentElement.at['data-theme'], 'dark', 'atributo no carregamento'); });
T('persistência desativada: nada é gravado', () => { const r = G.generate({ mode: 'button', persistence: false }, SRC), d = path.join(TMP, 'sempers'); write(d, r.files); const e = env(), i = load(path.join(d, 'day-night.js')).init(); i.toggle(); eq(e.store.size, 0, 'itens no localStorage'); });
T('preferência do sistema (escuro) e opção desligada', () => { let e = env({ dark: true }); eq(load(BTN).init().get(), 'dark', 'sistema'); const r = G.generate({ mode: 'button', respectSystem: false }, SRC), d = path.join(TMP, 'semsis'); write(d, r.files); e = env({ dark: true }); eq(load(path.join(d, 'day-night.js')).init().get(), 'light', 'ignorado'); });
T('movimento reduzido: troca sem animação', () => { const e = env({ reduced: true }), i = load(FULL).init(); i.toggle(); eq(e.q.length, 0, 'quadros agendados'); eq(i.get(), 'dark', 'tema'); });
T('sem animações concorrentes', () => { const e = env(), i = load(FULL).init(); i.toggle(); i.toggle(); eq(e.q.length, 1, 'quadros agendados'); e.drain(); eq(i.get(), 'dark', 'tema'); });
T('sem inicialização duplicada; destroy libera', () => { const e = env(), D = load(BTN), a = D.init(), b = D.init(); eq(a === b, true, 'mesma instância'); eq(e.warns.length, 1, 'aviso'); a.destroy(); eq(a.button().gone, true, 'botão removido'); eq(D.init() === a, false, 'nova instância após destroy'); });
T('classe em vez de atributo', () => { const r = G.generate({ mode: 'button', attribute: 'class' }, SRC), d = path.join(TMP, 'cls'); write(d, r.files); const e = env(), i = load(path.join(d, 'day-night.js')).init(); i.toggle(); eq(e.doc.documentElement.cl.has('dark'), true, 'classe dark'); });
T('API 1.x preservada', () => { env(); const i = load(FULL).init({ size: 76, position: 'bottom-left' }); ['get', 'set', 'toggle', 'saved', 'clear', 'setSpeed', 'setAnimation', 'button', 'destroy'].forEach(m => eq(typeof i[m], 'function', m)); eq(i.config().button.size, 76, 'size'); });

// 17.4 / 17.5: ZIP, arquivos individuais e instalação fora do projeto
['somente-botoes', 'completa'].forEach(n => {
  const z = path.join(TMP, n + '.zip'), x = path.join(TMP, 'ext-' + n), dir = path.join(x, 'day-night-personalizado');
  T('ZIP íntegro · ' + n, () => {
    fs.writeFileSync(z, Z.build(GEN[n].files, 'day-night-personalizado'));
    const t = cp.execFileSync('python3', ['-m', 'zipfile', '-t', z]).toString(); has(t, /Done testing/, 'zip'); no(t, /corrupt/i, 'zip');
    cp.execFileSync('python3', ['-m', 'zipfile', '-e', z, x]); Object.keys(GEN[n].files).forEach(f => eq(read(path.join(dir, f)) === GEN[n].files[f], true, f));
    return fs.readdirSync(dir).length + ' arquivos idênticos aos gerados';
  });
  T('instalação externa · ' + n, () => {
    const html = read(path.join(dir, 'integracao.html')); ['day-night.css', 'day-night.js'].forEach(f => { has(html, new RegExp('(href|src)="' + f + '"'), 'integracao.html → ' + f); if (!fs.existsSync(path.join(dir, f))) throw new Error('falta ' + f); });
    const js = read(path.join(dir, 'day-night.js')); no(js, /component\/|construtor|assets\/|tools\/|https?:\/\/(?!eliseuangelos)/, 'dependência do projeto'); no(js, /\bfetch\(|XMLHttpRequest|import\(/, 'rede');
    const e = env(), i = load(path.join(dir, 'day-night.js')).init({ target: null }); i.toggle(); e.drain(); eq(i.get(), 'dark', 'tema'); if (e.warns.length) throw new Error(e.warns[0]); return 'JS e CSS autônomos, sem caminhos do projeto';
  });
});

// 17.6: referências e sincronização
T('referências HTML do projeto', () => { let n = 0; ['index.html', 'construtor/index.html', 'examples/minimal.html'].forEach(f => { const p = path.join(R, f); (read(p).match(/(?:src|href)="[^"#]+"/g) || []).forEach(m => { const u = m.slice(m.indexOf('"') + 1, -1); if (/^(https?:|mailto:|data:)/.test(u)) return; if (!fs.existsSync(path.resolve(path.dirname(p), u.split('?')[0]))) throw new Error(f + ' → ' + u + ' inexistente'); n++; }); }); ['core.js', 'globe.js', 'clouds.js', 'core.css', 'stage.css'].forEach(f => { has(read(path.join(R, 'construtor/construtor.js')), new RegExp("'" + f.replace('.', '\\.') + "'"), 'construtor.js ' + f); }); return n + ' referências locais válidas (caminhos relativos)'; });
T('página inicial preservada e com acesso ao construtor', () => { const h = read(path.join(R, 'index.html')); ['DAY &amp; NIGHT EXPERIENCE', 'id="hero-btn"', 'Controles de teste', 'Interface de exemplo', 'Eliseu Fernandes Laurindo', 'href="construtor/"', 'CRIAR MEU ALTERNADOR', 'Crie seu próprio alternador de temas.'].forEach(s => { if (!h.includes(s)) throw new Error('falta: ' + s); }); has(read(path.join(R, 'construtor/index.html')), /href="\.\.\/"[^>]*>← Voltar ao DAY &amp; NIGHT EXPERIENCE/, 'link de retorno'); });
T('dist sincronizado com component/src', () => { cp.execFileSync(process.execPath, [path.join(__dirname, 'build.js'), '--check'], { stdio: 'pipe' }); });
T('sintaxe das ferramentas e do construtor', () => ['generator.js', 'zip.js', 'build.js', 'test.js'].forEach(f => cp.execFileSync(process.execPath, ['--check', path.join(__dirname, f)])) || cp.execFileSync(process.execPath, ['--check', path.join(R, 'construtor/construtor.js')]));

const w = Math.max.apply(null, out.map(r => r[1].length)); out.forEach(r => console.log(r[0] + ' ' + r[1].padEnd(w) + '  ' + r[2]));
const bad = out.filter(r => r[0] === 'ERRO').length; console.log('\n' + (out.length - bad) + '/' + out.length + ' verificações aprovadas');
process.exit(bad ? 1 : 0);
