/* núcleo: configuração validada, tema, persistência, botão e ciclo de vida. Sem CSS e sem gráficos. */
var SPEED = { slow: 4200, normal: 2800, fast: 1600 }, POS = ['inline', 'top-right', 'top-left', 'bottom-right', 'bottom-left'], live = [],
  ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><g class="dn-sun"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3L7 7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></g><path class="dn-moon" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

function num(v, min, max, d) { v = +v; return v >= min && v <= max ? v : d; }

function configure(opt) { // padrões embutidos na versão gerada + opções de init, validados
  var D = DN.D, o = Object.assign({}, D, opt), b = Object.assign({}, D.button, opt && opt.button), t = Object.assign({}, D.themes, opt && opt.themes);
  if (opt && opt.size != null) b.size = opt.size; // compatível com a API 1.x
  if (opt && opt.position) b.position = opt.position;
  b.size = num(b.size, 24, 128, D.button.size); b.offset = num(b.offset, 0, 96, D.button.offset);
  if (POS.indexOf(b.position) < 0) b.position = D.button.position;
  t.light = String(t.light || 'light'); t.dark = String(t.dark || 'dark');
  if (!SPEED[o.speed] && !(+o.speed > 0)) o.speed = D.speed;
  if (!/^[A-Za-z_][\w:.-]*$/.test(o.attribute)) o.attribute = D.attribute;
  if (opt && opt.mode === 'cinematic' && !DN.fx) console.warn('[DayNight] este arquivo foi gerado sem o efeito da Terra; usando o modo botão.');
  o.mode = o.mode === 'cinematic' && DN.fx ? 'cinematic' : 'button';
  o.button = b; o.themes = t; o.persistence = o.persistence !== false; o.animation = o.animation !== false;
  return o;
}

function init(opt) {
  var o = configure(opt), b = o.button, D = DN.D, mq = matchMedia('(prefers-color-scheme: dark)'), rm = matchMedia('(prefers-reduced-motion: reduce)'),
    scope = o.root || null, btn, theme, busy, dead, stopFx, inst, i;
  for (i = 0; i < live.length; i++) if (live[i].scope === scope) { console.warn('[DayNight] já inicializado neste escopo; use destroy() antes de iniciar de novo.'); return live[i].inst; }

  function read() { if (!o.persistence) return null; try { var v = localStorage.getItem(o.storageKey); return v === 'dark' || v === 'light' ? v : null; } catch (e) { return null; } }
  function write(v) { if (!o.persistence) return; try { v ? localStorage.setItem(o.storageKey, v) : localStorage.removeItem(o.storageKey); } catch (e) {} }
  function commit(t) {
    var el = scope || document.documentElement;
    theme = t;
    if (o.apply) o.apply(t);
    else if (o.attribute === 'class') el.classList.toggle(o.themes.dark, t === 'dark');
    else { el.setAttribute(o.attribute, o.themes[t]); el.style.colorScheme = t; }
    if (btn) btn.setAttribute('aria-checked', t === 'dark');
  }
  function announce(t) {
    document.dispatchEvent(new CustomEvent('daynight:change', { detail: { theme: t, saved: !!read() } }));
    if (o.onChange) o.onChange(t, inst);
  }
  function set(t, s) {
    s = s || {};
    if (dead || busy || t === theme || (t !== 'dark' && t !== 'light')) return;
    if (s.persist !== false) write(t);
    if (o.mode === 'cinematic' && o.animation && s.animate !== false && !rm.matches) {
      busy = true;
      stopFx = DN.fx.play(t, SPEED[o.speed] || +o.speed, function () { commit(t); }, function () { busy = false; stopFx = null; announce(t); }, { root: scope, cfg: o });
    } else { commit(t); announce(t); }
  }
  function toggle() { set(theme === 'dark' ? 'light' : 'dark'); }
  function sys() { return mq.matches ? 'dark' : 'light'; }
  function onSys() { if (!read() && o.respectSystem) set(sys(), { persist: false, animate: false }); }
  function mount() {
    if (dead) return;
    var host = typeof o.target === 'string' ? document.querySelector(o.target) : o.target;
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'dn-btn';
    btn.setAttribute('role', 'switch'); btn.setAttribute('aria-label', o.label); btn.setAttribute('aria-checked', theme === 'dark'); btn.innerHTML = ICON;
    if (b.size !== D.button.size) btn.style.setProperty('--dn-size', b.size + 'px'); // inline só para valores dinâmicos
    if (b.offset !== D.button.offset) btn.style.setProperty('--dn-offset', b.offset + 'px');
    if (scope) btn.classList.add('dn-scoped');
    if (!host && b.position !== 'inline') btn.classList.add('dn-fixed', 'dn-' + b.position);
    (host || scope || document.body).appendChild(btn);
    btn.addEventListener('click', toggle);
  }

  commit(o.theme === 'dark' || o.theme === 'light' ? o.theme : read() || (o.respectSystem && mq.matches ? 'dark' : 'light'));
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  if (mq.addEventListener) mq.addEventListener('change', onSys);
  if (o.mode === 'cinematic') (root.requestIdleCallback || setTimeout)(function () { if (!dead) DN.fx.prewarm(scope); });
  inst = {
    get: function () { return theme; }, set: set, toggle: toggle, saved: function () { return !!read(); },
    clear: function () { write(null); announce(theme); if (o.respectSystem) set(sys(), { persist: false }); },
    setSpeed: function (v) { if (SPEED[v] || +v > 0) o.speed = v; }, setAnimation: function (v) { o.animation = !!v; },
    button: function () { return btn; },
    config: function () { var r = {}, k; for (k in o) if (typeof o[k] !== 'function' && !(o[k] && o[k].nodeType)) r[k] = o[k]; return r; },
    destroy: function () {
      dead = true; busy = false; if (stopFx) stopFx(); if (btn) btn.remove();
      if (mq.removeEventListener) mq.removeEventListener('change', onSys);
      live = live.filter(function (e) { return e.inst !== inst; });
    }
  };
  live.push({ scope: scope, inst: inst });
  return inst;
}

DN.api = { init: init, version: DN.v, durations: SPEED };
