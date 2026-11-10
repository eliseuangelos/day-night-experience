// Página de demonstração: consome o MESMO componente de /component/day-night.js
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var dn = DayNight.init({ target: '#hero-btn', size: 76, onChange: sync });

  function sync(t) {
    t = t || dn.get();
    $('#state').textContent = $('#i-state').textContent = t === 'dark' ? 'Modo escuro (noite)' : 'Modo claro (dia)';
    $('#i-attr').textContent = 'data-theme="' + t + '"';
    $('#i-saved').textContent = dn.saved() ? 'Sim' : 'Não, segue o sistema';
  }
  function device() {
    $('#i-dev').textContent = (matchMedia('(pointer:coarse)').matches ? 'toque' : 'mouse+teclado') + ' · ' + innerWidth + 'px';
  }
  function test(from, to) { dn.set(from, { animate: false, persist: false }); setTimeout(function () { dn.set(to, { persist: false }); }, 150); }

  $('#c-toggle').onclick = function () { dn.toggle(); };
  $('#c-dn').onclick = function () { test('light', 'dark'); };
  $('#c-nd').onclick = function () { test('dark', 'light'); };
  $('#c-anim').onchange = function () { dn.setAnimation(this.checked); };
  $('#c-clear').onclick = function () { dn.clear(); };
  document.querySelectorAll('[name=speed]').forEach(function (r) { r.onchange = function () { dn.setSpeed(r.value); }; });
  addEventListener('resize', device); device(); sync();
})();
