# DAY & NIGHT EXPERIENCE

Alternador de tema claro/escuro com transição cinematográfica: a Terra gira em 3D, a luz atravessa o planeta e o novo tema é revelado por uma abertura circular. O projeto inclui o **DAY & NIGHT BUILDER**, que gera versões personalizadas do componente para qualquer site.

## Objetivo
Oferecer um componente de alternância de temas independente (HTML, CSS e JavaScript puros), com demonstração pública e uma ferramenta para personalizar, gerar e baixar o componente.

## Demonstração online
Disponível depois da publicação no GitHub Pages. O endereço depende do nome do repositório, ainda não definido. Site pessoal e profissional do autor: https://eliseuangelos.github.io/

## Páginas
- **Página inicial** (`index.html`): demonstração original, com controles de teste, painel de informações e o acesso **CRIAR MEU ALTERNADOR**.
- **Construtor** (`construtor/index.html`): escolha a modalidade, personalize, visualize em tempo real, baixe os arquivos e consulte as instruções adaptadas à sua versão.

## Modalidades do construtor
- **Somente botões:** alternador leve, sem o motor da Terra no JavaScript nem o CSS do palco.
- **Experiência completa:** animação da Terra com rotação (liga/desliga), nuvens (liga/desliga) e velocidade lenta (4200 ms), normal (2800 ms) ou rápida (1600 ms).

O pacote baixado, `day-night-personalizado.zip`, contém `day-night.js`, `day-night.css`, `integracao.html`, `instrucoes.txt` e `README.md`. Cada arquivo também pode ser baixado separadamente.

## Tecnologias
HTML5, CSS3 (variáveis CSS), JavaScript moderno, Canvas 2D (somente na experiência completa), SVG. Sem dependências, sem backend, sem build para publicar. Fontes: Inter e IBM Plex Mono (Google Fonts, com alternativas do sistema).

## Estrutura de diretórios
```
index.html                  página inicial (demonstração)
construtor/                 DAY & NIGHT BUILDER (index.html, construtor.css, construtor.js)
component/
  src/                      fonte única: core.js, globe.js, clouds.js, core.css, stage.css
  day-night.js, .css        distribuição (gerada por tools/build.js)
tools/                      generator.js, zip.js, build.js, test.js
assets/                     css (tema dia, tema noite, base), js, ícones
docs/                       arquitetura.md, COMO-USAR.md
examples/minimal.html       integração em página limpa
```

## Executar localmente
- Página inicial: abra `index.html` no navegador.
- Construtor: precisa de um servidor, porque lê os módulos com `fetch`. Na pasta do projeto: `python3 -m http.server 8000` e abra http://localhost:8000/construtor/

## Publicar no GitHub Pages
1. Envie todos os arquivos para o repositório, com `index.html` na raiz.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Aguarde a publicação. Todos os caminhos são relativos, então funcionam em repositório de projeto (`usuario.github.io/repositorio/`) ou na raiz.

## Usar o componente em outros sites
Via link, baixando o arquivo ou gerando uma versão sob medida no construtor: veja `docs/COMO-USAR.md`.

```html
<link rel="stylesheet" href="component/day-night.css">
<script src="component/day-night.js"></script>
<script>DayNight.init({ position: 'top-right' });</script>
```

## Personalizar
Opções de `DayNight.init()`: `mode`, `speed`, `rotation`, `clouds`, `button { size, position, offset }`, `themes { light, dark }`, `attribute` (`data-theme` ou `class`), `persistence`, `storageKey`, `respectSystem`, `target`, `root`, `theme`, `apply`, `onChange`. Cores, tamanho e formato do botão são variáveis CSS (`--dn-*`). Detalhes em `docs/arquitetura.md`.

## Compatibilidade
Versões atuais de Chrome, Edge, Firefox e Safari. Respeita `prefers-reduced-motion` e `prefers-color-scheme`, tem suporte a teclado e atributos ARIA.

## Testes
`node tools/test.js` (Node 18+ e Python 3) valida a geração das modalidades, velocidades, persistência, ZIP, instalação externa e referências. Veja `CHANGELOG.md` para as versões.

## Manutenção
1. Edite apenas `component/src/` (componente) ou `tools/generator.js` (geração e textos).
2. `node tools/build.js` e `node tools/test.js`.
3. Atualize `docs/`, este README e o `CHANGELOG.md`.
4. Faça commit e push; o GitHub Pages publica a branch configurada.

## Licença
Ainda não definida: o repositório não inclui arquivo `LICENSE`. Antes de permitir reutilização por terceiros, defina a licença de forma consciente.

## Créditos
Desenvolvimento: Eliseu Fernandes Laurindo · Site pessoal e profissional: https://eliseuangelos.github.io/
