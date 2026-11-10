# Contribuindo

1. Edite o componente somente em `component/src/` (núcleo, motor, nuvens, CSS). Não edite `component/day-night.js` nem `component/day-night.css` à mão: são gerados.
2. Rode `node tools/build.js` para regenerar a distribuição e `node tools/test.js` para validar (Node 18+ e Python 3).
3. Mudou opções ou comportamento? Atualize `docs/`, o `README.md` e o `CHANGELOG.md`.
4. Mantenha uma única implementação do motor gráfico: o construtor e a página inicial usam o mesmo código.
5. Abra o pull request descrevendo o que mudou e como foi testado.
