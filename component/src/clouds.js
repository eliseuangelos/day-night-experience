/* nuvens (opcional): textura de ruído e mistura por pixel. Depende do motor gráfico. */
DN.clouds = {
  build: function (fbm, rnd, TW, TH) {
    var n = fbm(TW, TH, 5, rnd), C = new Uint8Array(TW * TH), i, v;
    for (i = 0; i < C.length; i++) { v = (n[i] - .46) / .22; v = v < 0 ? 0 : v > 1 ? 1 : v; C[i] = v * v * (3 - 2 * v) * 255; }
    return C;
  },
  shade: function (px, C, lon, a0, TW, k, sh) {
    var u = lon + .5, ca, c; u -= Math.floor(u);
    ca = C[a0 + (u * TW | 0)] / 255 * .9; c = (.07 + .93 * k) * (sh > 1 ? 1 : sh);
    px[0] += (240 * c - px[0]) * ca; px[1] += (244 * c - px[1]) * ca; px[2] += (250 * c - px[2]) * ca;
  }
};
