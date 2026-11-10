# Como usar o DAY & NIGHT EXPERIENCE

O efeito é **um único arquivo**, `component/day-night.js`, sem dependências e sem build. Dia = tema `light`, noite = tema `dark`.

## 1. Via link
Publique o repositório (passo 6) e aponte para os arquivos. Troque `NOME-DO-REPOSITORIO` pelo nome real do repositório.

```html
<!-- GitHub Pages -->
<link rel="stylesheet" href="https://eliseuangelos.github.io/NOME-DO-REPOSITORIO/component/day-night.css">
<script src="https://eliseuangelos.github.io/NOME-DO-REPOSITORIO/component/day-night.js"></script>
<!-- jsDelivr com versão fixa (recomendado em produção) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/eliseuangelos/NOME-DO-REPOSITORIO@v1.2.0/component/day-night.css">
<script src="https://cdn.jsdelivr.net/gh/eliseuangelos/NOME-DO-REPOSITORIO@v1.2.0/component/day-night.js"></script>
```

## 2. Baixando o arquivo completo
Baixe o `.zip` do repositório (Code → Download ZIP), copie `component/day-night.js` e `component/day-night.css` para o seu projeto e use `<link rel="stylesheet" href="component/day-night.css">` e `<script src="component/day-night.js"></script>`.

## 3. Ativar o efeito
1. Inclua o CSS no `<head>` e o script no fim do `<body>` (veja acima).
2. Inicialize: `<script>DayNight.init({ position: 'top-right' });</script>`
3. Estilize cada tema pelo atributo que o componente grava: `<html data-theme="light">` (dia) ou `<html data-theme="dark">` (noite).

Botão dentro do seu menu: `DayNight.init({ target: '#menu', size: 40 })`. Todas as opções e a API estão no README.
Sites com classe `dark` (Tailwind): `DayNight.init({ attribute: 'class' })`.

## 4. Separar o CSS por dia e noite
Estrutura usada na demo:

```
css/
  main.css         importa os módulos
  theme-day.css    variáveis do DIA   → :root[data-theme="light"]
  theme-night.css  variáveis da NOITE → :root[data-theme="dark"]
  base.css         layout e componentes (só usam variáveis)
```

`main.css`:
```css
@import url("theme-day.css");
@import url("theme-night.css");
@import url("base.css");
```

`theme-day.css` e `theme-night.css` declaram **os mesmos nomes** de variáveis com valores diferentes:
```css
/* theme-day.css */
:root,:root[data-theme="light"]{ --color-background:#f4f7fb; --color-text:#162638; }
/* theme-night.css */
:root[data-theme="dark"]{ --color-background:#111c28; --color-text:#edf3f8; }
```
Regra de ouro: o `base.css` só usa `var(--color-...)`, nunca cores fixas. Para um ajuste que só existe em um tema, escreva-o no arquivo daquele tema.

### Opção A: os dois arquivos carregados (recomendada)
É o que a demo faz. A troca é instantânea e não pisca; basta incluir o `main.css` (ou os dois arquivos de tema) e o script anti-flash abaixo.

### Opção B: carregar um arquivo por vez
```html
<script>
  var t = localStorage.getItem('dn-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.write('<link id="theme-css" rel="stylesheet" href="css/theme-' + (t === 'dark' ? 'night' : 'day') + '.css">');
</script>
<script>
  DayNight.init({
    apply: function (theme) { // substitui a aplicação padrão do tema
      document.documentElement.setAttribute('data-theme', theme);
      document.getElementById('theme-css').href = 'css/theme-' + (theme === 'dark' ? 'night' : 'day') + '.css';
    }
  });
</script>
```
Com a animação ligada, a troca acontece escondida pelo palco da Terra. Com a animação desligada, pode haver um instante sem estilo; prefira a opção A.

## 5. Anti-flash (no `<head>`, antes do CSS)
```html
<script src="assets/js/theme-init.js"></script>
```
Ele lê `dn-theme` do localStorage (ou `prefers-color-scheme`) e define `data-theme` antes da primeira pintura.

## 6. Publicar no GitHub Pages
1. Crie o repositório e envie todos os arquivos, com `index.html` na raiz.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Em alguns minutos: `https://eliseuangelos.github.io/NOME-DO-REPOSITORIO/`.
4. Crie a tag `v1.2.0` (Releases) para usar a versão fixa no jsDelivr.

## 7. Checklist
- [ ] Script carregado antes do `DayNight.init`.
- [ ] CSS escrito com `[data-theme="dark"]` (ou classe `dark`).
- [ ] Anti-flash no `<head>`.
- [ ] Teste: os dois sentidos, recarregar a página, teclado (Tab, Enter, Espaço) e `prefers-reduced-motion`.

## 8. Versão sob medida
Não precisa de tudo? Use o **construtor** (`construtor/index.html`, servido por GitHub Pages ou servidor local): escolha "somente botões" ou "experiência completa", personalize e baixe um pacote com `day-night.js`, `day-night.css`, `integracao.html`, `instrucoes.txt` e `README.md`.
