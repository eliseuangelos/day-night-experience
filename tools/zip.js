/* Gravador ZIP mínimo (método "stored", sem compressão), sem dependências. Navegador e Node. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DNZip = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function crc32(b) {
    var c, crc = 0xFFFFFFFF, i, k;
    for (i = 0; i < b.length; i++) { c = (crc ^ b[i]) & 0xFF; for (k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1; crc = (crc >>> 8) ^ c; }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  // files: { 'nome.ext': 'texto' } → Uint8Array de um .zip com todos os arquivos dentro de "folder/"
  function build(files, folder) {
    var enc = new TextEncoder(), parts = [], cd = [], off = 0, n = 0, d = new Date(), size = 0, p = 0, out, e = new DataView(new ArrayBuffer(22)),
      tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    Object.keys(files).forEach(function (f) {
      var name = enc.encode(folder + '/' + f), data = enc.encode(files[f]), crc = crc32(data), h = new DataView(new ArrayBuffer(30)), c = new DataView(new ArrayBuffer(46));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(10, tm, true); h.setUint16(12, dt, true);
      h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(12, tm, true); c.setUint16(14, dt, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      parts.push(new Uint8Array(h.buffer), name, data); cd.push(new Uint8Array(c.buffer), name); off += 30 + name.length + data.length; n++;
    });
    cd.forEach(function (x) { size += x.length; });
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, n, true); e.setUint16(10, n, true); e.setUint32(12, size, true); e.setUint32(16, off, true);
    out = new Uint8Array(off + size + 22);
    parts.concat(cd, [new Uint8Array(e.buffer)]).forEach(function (x) { out.set(x, p); p += x.length; });
    return out;
  }
  return { build: build, crc32: crc32 };
});
