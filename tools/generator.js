/* Gerador do DAY & NIGHT: valida a configuração, resolve os módulos e monta JS, CSS e documentação.
   Roda no navegador (construtor) e no Node (build e testes). Não executa o código gerado: só combina módulos
   com dependências explícitas dentro de um modelo fixo e injeta a configuração como dados (JSON). */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DNGenerator = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var VERSION = '1.3.0', CREDIT = 'Eliseu Fernandes Laurindo · https://eliseuangelos.github.io/';
  var SPEEDS = { slow: 4200, normal: 2800, fast: 1600 };
  var MODS = { core: { file: 'core.js', deps: [] }, globe: { file: 'globe.js', deps: ['core'] }, clouds: { file: 'clouds.js', deps: ['globe'] } };
  var CSSF = { base: 'core.css', stage: 'stage.css' };
  var POS = { 'top-right': 'superior direito', 'top-left': 'superior esquerdo', 'bottom-right': 'inferior direito', 'bottom-left': 'inferior esquerdo', inline: 'dentro do conteúdo' };
  var DEF = {
    mode: 'cinematic', speed: 'normal', rotation: true, clouds: true, attribute: 'data-theme', themes: { light: 'light', dark: 'dark' },
    persistence: true, storageKey: 'dn-theme', respectSystem: true, label: 'Modo escuro',
    button: { shape: 'circle', icons: 'solid', size: 48, position: 'top-right', offset: 16, transition: 'smooth', colors: { dayBg: '#ffffff', dayFg: '#d5dee8', dayLine: '#d5dee8', nightBg: '#1b2a3a', nightFg: '#cfe0ff', nightLine: '#cfe0ff' } }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pick(v, list, d) { return list.indexOf(v) < 0 ? d : v; }
  function clamp(v, a, b, d) { v = Math.round(+v); return v >= a && v <= b ? v : d; }
  function nm(v, d) { return /^[a-z][a-z0-9-]{0,23}$/i.test(v || '') ? v : d; }
  function hx(v, d) { return /^#[0-9a-f]{6}$/i.test(v || '') ? v.toLowerCase() : d; }

  // Validação: devolve a configuração normalizada (valores seguros) e avisos de conflitos.
  function validate(inp) {
    inp = inp || {};
    var b = inp.button || {}, c = b.colors || {}, t = inp.themes || {}, w = [], DB = DEF.button, DC = DB.colors;
    var cfg = {
      mode: pick(inp.mode, ['button', 'cinematic'], DEF.mode), speed: pick(inp.speed, ['slow', 'normal', 'fast'], DEF.speed),
      rotation: inp.rotation !== false, clouds: inp.clouds !== false, attribute: inp.attribute === 'class' ? 'class' : 'data-theme',
      themes: { light: nm(t.light, 'light'), dark: nm(t.dark, 'dark') }, persistence: inp.persistence !== false,
      storageKey: /^[\w.-]{1,40}$/.test(inp.storageKey || '') ? inp.storageKey : DEF.storageKey, respectSystem: inp.respectSystem !== false, label: DEF.label,
      button: {
        shape: pick(b.shape, ['circle', 'rounded'], DB.shape), icons: pick(b.icons, ['solid', 'outline'], DB.icons), size: clamp(b.size, 24, 128, DB.size),
        position: pick(b.position, Object.keys(POS), DB.position), offset: clamp(b.offset, 0, 96, DB.offset), transition: pick(b.transition, ['smooth', 'fast', 'none'], DB.transition),
        colors: { dayBg: hx(c.dayBg, DC.dayBg), dayFg: hx(c.dayFg, DC.dayFg), dayLine: hx(c.dayLine, DC.dayLine), nightBg: hx(c.nightBg, DC.nightBg), nightFg: hx(c.nightFg, DC.nightFg), nightLine: hx(c.nightLine, DC.nightLine) }
      }
    };
    if (cfg.themes.light === cfg.themes.dark) { cfg.themes = { light: 'light', dark: 'dark' }; w.push('Os nomes dos temas eram iguais; usando light e dark.'); }
    if (cfg.mode === 'button') {
      if (inp.rotation === false || inp.clouds === false || (inp.speed && inp.speed !== 'normal')) w.push('No modo somente botões, as opções de efeito não se aplicam e foram ignoradas.');
      delete cfg.rotation; delete cfg.clouds; delete cfg.speed;
    }
    return { config: cfg, warnings: w };
  }

  // Resolução de dependências: devolve os módulos em ordem de carga (dependências primeiro).
  function resolve(list) {
    var out = [];
    function add(m) { if (!MODS[m]) throw new Error('Módulo desconhecido: ' + m); if (out.indexOf(m) < 0) { MODS[m].deps.forEach(add); out.push(m); } }
    list.forEach(add);
    return out;
  }

  function buildJs(c, mods, src, meta) {
    var D = { mode: c.mode, attribute: c.attribute, themes: c.themes, persistence: c.persistence, storageKey: c.storageKey, respectSystem: c.respectSystem, animation: true, label: c.label, button: { size: c.button.size, position: c.button.position, offset: c.button.offset } };
    if (c.mode === 'cinematic') { D.speed = c.speed; D.rotation = c.rotation; D.clouds = c.clouds; }
    var o = ['/*! DAY & NIGHT EXPERIENCE v' + VERSION + ' · modalidade: ' + c.mode + ' · módulos: ' + mods.join(', ') + (meta && meta.date ? ' · gerado em ' + meta.date : ''),
      ' * Desenvolvimento: ' + CREDIT + ' */', '(function (root) {', "  'use strict';", '  var DN = { v: ' + JSON.stringify(VERSION) + ', D: ' + JSON.stringify(D) + ' };'];
    mods.forEach(function (m) { o.push('', '  /* módulo: ' + m + ' */', '  (function (DN, root) {', src[MODS[m].file].replace(/\s+$/, ''), '  })(DN, root);'); });
    o.push('', '  root.DayNight = DN.api;', "  if (typeof module !== 'undefined' && module.exports) module.exports = DN.api;", "})(typeof window !== 'undefined' ? window : this);", '');
    return o.join('\n');
  }

  function buildCss(c, parts, src) {
    var b = c.button, k = b.colors, o = b.icons === 'outline', t = { smooth: '.8s', fast: '.3s', none: '0s' }[b.transition];
    var vars = ['.dn-btn {', '  --dn-size: ' + b.size + 'px;', '  --dn-offset: ' + b.offset + 'px;', '  --dn-radius: ' + (b.shape === 'rounded' ? '30%' : '50%') + ';',
      '  --dn-fill: ' + (o ? 'none' : 'currentColor') + ';', '  --dn-stroke: ' + (o ? 'currentColor' : 'none') + ';', '  --dn-t: ' + t + ';',
      '  --dn-bg: ' + k.dayBg + ';', '  --dn-fg: ' + k.dayFg + ';', '  --dn-line: ' + k.dayLine + ';',
      '  --dn-bg-dark: ' + k.nightBg + ';', '  --dn-fg-dark: ' + k.nightFg + ';', '  --dn-line-dark: ' + k.nightLine + ';', '}', ''].join('\n');
    return '/*! DAY & NIGHT EXPERIENCE v' + VERSION + ' · estilos · ' + CREDIT + ' */\n' + vars + parts.map(function (p) { return src[CSSF[p]].replace(/\s+$/, ''); }).join('\n') + '\n';
  }

  // Trechos de código usados pelo guia, pelo integracao.html e pelo manual (uma única fonte para todos).
  function snip(c) {
    var cls = c.attribute === 'class', A = c.attribute, T = c.themes, inl = c.button.position === 'inline',
      sys = c.respectSystem ? "matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'" : "'light'",
      set = cls ? `document.documentElement.classList.toggle('${T.dark}', t === 'dark');` : `document.documentElement.setAttribute('${A}', t === 'dark' ? '${T.dark}' : '${T.light}');`;
    return {
      init: inl ? "DayNight.init({ target: '#alternador' });" : 'DayNight.init();',
      slot: inl ? '<div id="alternador"></div>' : '',
      light: cls ? ':root {\n  --fundo: #ffffff;\n  --texto: #162638;\n}' : `:root,\n[${A}="${T.light}"] {\n  --fundo: #ffffff;\n  --texto: #162638;\n}`,
      dark: cls ? `.${T.dark} {\n  --fundo: #111c28;\n  --texto: #edf3f8;\n}` : `[${A}="${T.dark}"] {\n  --fundo: #111c28;\n  --texto: #edf3f8;\n}`,
      flash: `<script>\n(function () {\n  try {\n    var t = ${c.persistence ? `localStorage.getItem('${c.storageKey}')` : 'null'};\n    if (t !== 'light' && t !== 'dark') t = ${sys};\n    ${set}\n  } catch (e) {}\n})();\n</script>`
    };
  }

  // Passo a passo adaptado à versão gerada: [{ t: título, p: texto, c: código }]
  function guide(c) {
    var s = snip(c), cin = c.mode === 'cinematic', b = c.button, k = b.colors, cls = c.attribute === 'class', T = c.themes;
    var vars = '.dn-btn {\n  --dn-size: ' + b.size + 'px;\n  --dn-bg: ' + k.dayBg + ';\n  --dn-fg: ' + k.dayFg + ';\n  --dn-line: ' + k.dayLine + ';\n  --dn-bg-dark: ' + k.nightBg + ';\n  --dn-fg-dark: ' + k.nightFg + ';\n  --dn-line-dark: ' + k.nightLine + ';\n}';
    var fail = ['- O tema não muda: confirme que o seu CSS usa ' + (cls ? 'a classe .' + T.dark : '[data-theme="' + T.dark + '"]') + ' e que o day-night.js é carregado antes de DayNight.init().',
      '- O botão não aparece: confira o caminho do day-night.css e se nenhum elemento da página o cobre (z-index).',
      '- O tema errado aparece por um instante: inclua o script anti-flash no <head>.'];
    if (cin) fail.push('- A animação não aparece: o sistema pode estar com "reduzir movimento" ativado; nesse caso a troca é instantânea, por acessibilidade.');
    fail.push('- Aviso "já inicializado" no console: chame destroy() antes de iniciar de novo no mesmo escopo.');
    var g = [
      { t: 'Baixe os arquivos', p: 'Use "Baixar ZIP" ou baixe cada arquivo separadamente. Extraia tudo em uma pasta do seu site, por exemplo day-night/.' },
      { t: 'Coloque o JavaScript', p: 'Inclua o script no fim do <body>, depois do seu conteúdo.', c: '<script src="day-night/day-night.js"></script>' },
      { t: 'Coloque o CSS', p: 'Inclua a folha de estilos no <head>.', c: '<link rel="stylesheet" href="day-night/day-night.css">' },
      { t: 'Insira o botão no HTML', p: s.slot ? 'O botão é criado dentro do elemento que você indicar. Adicione um contêiner onde ele deve aparecer.' : 'Não é preciso escrever HTML: o botão é criado automaticamente e fica fixo no canto ' + POS[b.position] + ' da tela.', c: s.slot },
      { t: 'Inicialize o componente', p: 'Chame init() depois de carregar o script. As opções escolhidas no construtor já vêm embutidas no arquivo.', c: '<script>\n  ' + s.init + '\n</script>' },
      { t: 'Defina o tema claro', p: 'Declare as variáveis do tema claro. Troque --fundo e --texto pelas variáveis do seu site.', c: s.light },
      { t: 'Defina o tema escuro', p: 'Declare as mesmas variáveis para o tema escuro.', c: s.dark },
      { t: cls ? 'Entenda a classe do tema' : 'Entenda o atributo data-theme', p: cls ? 'No tema escuro o componente adiciona a classe "' + T.dark + '" ao <html>; no claro, remove. Estilize o escuro com .' + T.dark + '.' : 'O componente grava <html data-theme="' + T.light + '"> ou <html data-theme="' + T.dark + '">. Estilize cada tema por esse atributo, como nos blocos acima.' },
      { t: 'Armazene a preferência', p: c.persistence ? 'A escolha fica no localStorage, na chave "' + c.storageKey + '".' + (c.respectSystem ? ' Sem preferência salva, vale o tema do sistema (prefers-color-scheme).' : '') : 'Esta versão não salva a escolha: a cada visita vale ' + (c.respectSystem ? 'o tema do sistema.' : 'o tema claro.') },
      { t: 'Evite o flash no carregamento', p: 'Cole este script no <head>, antes do CSS do seu site, para aplicar o tema antes da primeira pintura.', c: s.flash },
      { t: 'Personalize o botão', p: 'Cores e tamanho são variáveis CSS (escreva-as depois do day-night.css). Posição e espaçamento também podem ser passados em init(), por exemplo: DayNight.init({ button: { size: 56, position: "bottom-left", offset: 24 } }).', c: vars }
    ];
    if (cin) g.push({ t: 'Ajuste a animação', p: 'Velocidades: lenta 4200 ms, normal 2800 ms, rápida 1600 ms (também aceita um número em ms). Exemplo com a rotação desativada' + (c.clouds ? ' e sem nuvens' : '') + ':', c: "DayNight.init({ speed: 'fast', rotation: false" + (c.clouds ? ', clouds: false' : '') + ' });' });
    g.push({ t: 'Teste a alternância', p: 'Abra o integracao.html, clique no botão, recarregue a página e confira se o tema se mantém' + (cin ? '. Teste também com "reduzir movimento" ativado no sistema.' : '.') });
    g.push({ t: 'Solucione problemas comuns', p: fail.join('\n') });
    return g;
  }

  function integration(c) {
    var s = snip(c), cin = c.mode === 'cinematic';
    return '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Integração · DAY &amp; NIGHT</title>\n' + s.flash + '\n<link rel="stylesheet" href="day-night.css">\n<style>\n' + s.light + '\n' + s.dark +
      '\nbody { margin: 0; padding: 4rem 1.5rem; font: 16px/1.6 system-ui, sans-serif; background: var(--fundo); color: var(--texto); }\nmain { max-width: 40rem; margin: 0 auto; }\n</style>\n</head>\n<body>\n<main>\n  <h1>Página de integração</h1>\n  <p>Clique no botão para alternar entre dia e noite' + (cin ? ' com a animação da Terra' : '') + '. Recarregue a página para conferir a preferência' + (c.persistence ? ' salva' : '') + '.</p>\n  ' + s.slot +
      '\n</main>\n<script src="day-night.js"></script>\n<script>\n  ' + s.init + '\n</script>\n</body>\n</html>\n';
  }

  function settings(c) {
    var b = c.button, k = b.colors, cin = c.mode === 'cinematic', r = ['Modalidade: ' + (cin ? 'experiência completa (animação da Terra)' : 'somente botões')];
    if (cin) r.push('Velocidade: ' + c.speed + ' (' + SPEEDS[c.speed] + ' ms)', 'Planeta girando: ' + (c.rotation ? 'sim' : 'não'), 'Nuvens: ' + (c.clouds ? 'sim' : 'não'));
    r.push('Botão: formato ' + b.shape + ', ícones ' + b.icons + ', ' + b.size + ' px, posição ' + b.position + (b.position === 'inline' ? '' : ' a ' + b.offset + ' px da borda') + ', transições ' + b.transition,
      'Cores do dia: fundo ' + k.dayBg + ', ícone ' + k.dayFg + ', linha ' + k.dayLine, 'Cores da noite: fundo ' + k.nightBg + ', ícone ' + k.nightFg + ', linha ' + k.nightLine,
      'Tema aplicado por: ' + (c.attribute === 'class' ? 'classe "' + c.themes.dark + '"' : 'atributo data-theme ("' + c.themes.light + '" / "' + c.themes.dark + '")'),
      'Persistência: ' + (c.persistence ? 'localStorage, chave "' + c.storageKey + '"' : 'desativada'), 'Tema do sistema (prefers-color-scheme): ' + (c.respectSystem ? 'respeitado' : 'ignorado'));
    return r;
  }

  function manual(c, mods, g, meta) {
    var L = [], bar = new Array(61).join('='), cin = c.mode === 'cinematic', pad = function (t, n) { return t.split('\n').map(function (x) { return new Array(n + 1).join(' ') + x; }).join('\n'); };
    L.push(bar, 'DAY & NIGHT EXPERIENCE · manual de instalação', bar, 'Versão: ' + VERSION);
    if (meta && meta.date) L.push('Gerado em: ' + meta.date);
    L.push('', 'CONFIGURAÇÕES ESCOLHIDAS');
    settings(c).forEach(function (r) { L.push('  - ' + r); });
    L.push('', 'ARQUIVOS DO PACOTE', '  day-night.js      lógica do componente (módulos: ' + mods.join(', ') + ')', '  day-night.css     estilos do ' + (cin ? 'botão e do palco da animação' : 'botão'), '  integracao.html   página de exemplo completa, pronta para copiar', '  instrucoes.txt    este manual', '  README.md         resumo técnico',
      '', 'ESTRUTURA', '  day-night-personalizado/', '    day-night.js', '    day-night.css', '    integracao.html', '    instrucoes.txt', '    README.md',
      '', 'REQUISITOS', '  Nenhum servidor, framework ou biblioteca. Funciona offline, abrindo o HTML no navegador.', '', 'PASSO A PASSO');
    g.forEach(function (s, i) { L.push('', (i + 1) + '. ' + s.t, pad(s.p, 3)); if (s.c) L.push('', pad(s.c, 7)); });
    L.push('', 'PERSONALIZAÇÃO VISUAL (VARIÁVEIS CSS DO BOTÃO)', '  --dn-size, --dn-offset, --dn-radius, --dn-bg, --dn-fg, --dn-bg-dark, --dn-fg-dark, --dn-line, --dn-line-dark, --dn-t', '  Exemplo: .dn-btn { --dn-size: 64px; --dn-bg: #ffffff; --dn-fg: #e8890c; }',
      '', 'COMPATIBILIDADE', '  Versões atuais de Chrome, Edge, Firefox e Safari.' + (cin ? ' A animação usa Canvas 2D e respeita "reduzir movimento".' : ''),
      '', 'CRÉDITOS', '  Desenvolvimento: Eliseu Fernandes Laurindo', '  Site pessoal e profissional: https://eliseuangelos.github.io/', '');
    return L.join('\n');
  }

  function readme(c, mods) {
    var s = snip(c), cin = c.mode === 'cinematic';
    return ['# DAY & NIGHT · componente personalizado', '', 'Gerado pelo DAY & NIGHT BUILDER (v' + VERSION + '). Modalidade: **' + (cin ? 'experiência completa' : 'somente botões') + '**. Módulos incluídos: ' + mods.join(', ') + '.', '',
      '## Arquivos', '', '- `day-night.js`: lógica do componente', '- `day-night.css`: estilos', '- `integracao.html`: exemplo completo de integração', '- `instrucoes.txt`: manual em português', '',
      '## Uso rápido', '', '```html', '<link rel="stylesheet" href="day-night.css">', '<script src="day-night.js"></script>', '<script>', '  ' + s.init, '</script>', '```', '',
      '## Configuração escolhida', '', '```json', JSON.stringify(c, null, 2), '```', '',
      '## API', '', '`DayNight.init(opções)` devolve `get()`, `set(tema, { animate, persist })`, `toggle()`, `saved()`, `clear()`, `config()` e `destroy()`' + (cin ? ', além de `setSpeed(valor)` e `setAnimation(bool)`' : '') + '. Evento global: `daynight:change`.', '',
      '## Créditos', '', 'Desenvolvimento: ' + CREDIT, ''].join('\n');
  }

  // Ponto de entrada: valida, resolve módulos, monta os 5 arquivos. `src` = { 'core.js': '...', 'core.css': '...', ... }
  function generate(input, src, meta) {
    var v = validate(input), c = v.config, cin = c.mode === 'cinematic';
    var mods = resolve(cin ? (c.clouds ? ['clouds'] : ['globe']) : ['core']), css = cin ? ['base', 'stage'] : ['base'], g = guide(c);
    mods.forEach(function (m) { if (typeof src[MODS[m].file] !== 'string') throw new Error('Fonte ausente: ' + MODS[m].file); });
    css.forEach(function (p) { if (typeof src[CSSF[p]] !== 'string') throw new Error('Fonte ausente: ' + CSSF[p]); });
    return {
      files: { 'day-night.js': buildJs(c, mods, src, meta), 'day-night.css': buildCss(c, css, src), 'integracao.html': integration(c), 'instrucoes.txt': manual(c, mods, g, meta), 'README.md': readme(c, mods) },
      config: c, modules: mods, css: css, guide: g, warnings: v.warnings
    };
  }

  return { VERSION: VERSION, SPEEDS: SPEEDS, POS: POS, defaults: function () { return clone(DEF); }, validate: validate, generate: generate };
});
