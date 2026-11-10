# Arquitetura

## Fonte única
`component/src/` guarda os módulos do componente:

| Módulo | Arquivo | Depende de | Função |
|---|---|---|---|
| core | `core.js` | – | configuração validada, tema, persistência, botão, ciclo de vida, API |
| globe | `globe.js` | core | motor da Terra em Canvas 2D (texturas, esfera, palco, rotação) |
| clouds | `clouds.js` | globe | nuvens (opcional) |
| CSS | `core.css`, `stage.css` | – | botão (variáveis CSS) e palco da animação |

## Gerador
`tools/generator.js` (navegador e Node) valida a configuração, resolve as dependências e monta cada arquivo dentro de um modelo fixo. Os módulos entram sem alteração de texto; a configuração entra como JSON. Não usa `eval` nem `new Function`. Desativar nuvens remove o módulo `clouds`; escolher "somente botões" remove também o motor da Terra e o CSS do palco.

## Distribuição e páginas
- `node tools/build.js` gera `component/day-night.js` e `component/day-night.css` (experiência completa), usados pela página inicial.
- O construtor gera os arquivos no navegador a partir de `component/src/` (via `fetch`) e carrega o resultado na prévia: a prévia executa os mesmos bytes que serão baixados.
- `tools/zip.js` grava o ZIP (sem compressão) no navegador, sem dependências.

## Ciclo de vida
`init()` cria a instância (uma por escopo, evita duplicação); `destroy()` cancela a animação, remove o botão e os listeners. O palco desenha com `requestAnimationFrame` e acumula o tempo por quadro com limite de 50 ms, o que pausa a animação com a aba oculta.

## Opções principais
`mode` (`button` | `cinematic`), `speed` (`slow` 4200 ms, `normal` 2800 ms, `fast` 1600 ms ou ms), `rotation`, `clouds`, `button { size, position, offset }`, `themes { light, dark }`, `attribute`, `persistence`, `storageKey`, `respectSystem`, `target`, `root`, `theme`, `apply`, `onChange`.
