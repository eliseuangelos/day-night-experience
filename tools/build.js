'use strict';
// Gera component/day-night.js e component/day-night.css (experiência completa) a partir de component/src/.
// Uso: node tools/build.js        (grava)   |   node tools/build.js --check   (falha se estiverem fora de sincronia)
const fs = require('fs'), path = require('path'), G = require('./generator.js');
const R = path.join(__dirname, '..'), src = {};
['core.js', 'globe.js', 'clouds.js', 'core.css', 'stage.css'].forEach(f => { src[f] = fs.readFileSync(path.join(R, 'component/src', f), 'utf8'); });
const out = G.generate({}, src).files, check = process.argv.includes('--check');
let bad = 0;
['day-night.js', 'day-night.css'].forEach(n => {
  const p = path.join(R, 'component', n);
  if (check) { if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== out[n]) { console.error('Fora de sincronia: component/' + n + ' (rode: node tools/build.js)'); bad = 1; } }
  else { fs.writeFileSync(p, out[n]); console.log('gerado component/' + n + ' (' + out[n].length + ' caracteres)'); }
});
process.exit(bad);
