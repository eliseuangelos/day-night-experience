// Aplica o tema salvo (ou do sistema) antes da primeira pintura: evita o "flash" no carregamento.
(function () {
  try {
    var t = localStorage.getItem('dn-theme');
    if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
