/* Cálculo puro: sin acceso al DOM */
var BacCalc = (function(){
  function isNum(x){ return typeof x === 'number' && isFinite(x); }
  function r2(x){ return Math.round(x * 100 + 1e-9) / 100; }
  function r3(x){ return Math.round(x * 1000 + 1e-9) / 1000; }
  function conv(b){
    if (b < 10) return 0;
    var v;
    if (b < 12) v = 0.8372 * b - 3.3714;
    else if (b < 14) v = 0.502 * b + 0.6579;
    else if (b < 16) v = 0.3719 * b + 2.479;
    else v = 0.394 * b + 2.123;
    return Math.min(10, v);
  }
  function slope(b){
    if (b < 10 || conv(b) >= 10) return 0;
    if (b < 12) return 0.8372;
    if (b < 14) return 0.502;
    if (b < 16) return 0.3719;
    return 0.394;
  }
  /* Devuelve una clave de mención; el texto lo pone i18n */
  function mention(b){
    if (b >= 18) return 'tbf';
    if (b >= 16) return 'tb';
    if (b >= 14) return 'b';
    if (b >= 12) return 'ab';
    if (b >= 10) return 'none';
    return 'fail';
  }
  /* model: {items:[{id,coef}], subjects:[{id,src,svt}], unis:[{cut,w:{subjectId:peso}}]} */
  function compute(model, vals){
    var pts = 0, tot = 0;
    model.items.forEach(function(it){
      var v = vals[it.id];
      if (!isNum(v)) return;
      pts += v * it.coef; tot += it.coef;
    });
    var bac = tot > 0 ? r2(pts / tot) : 0;
    var acc = r3(conv(bac));
    /* Media de enseignement scientifique (o de la DNL que la sustituye en el BFI), para la regla de SVT */
    var esVals = (model.esIds || ['es1', 'es2']).map(function(id){ return vals[id]; }).filter(isNum);
    var esAvg = esVals.length ? esVals.reduce(function(x, y){ return x + y; }, 0) / esVals.length : 20;
    var unis = model.unis.map(function(u){
      var parts = model.subjects.map(function(s){
        var w = isNum(u.w[s.id]) ? u.w[s.id] : 0;
        var g = vals[s.src];
        var p = {sub:s, w:w, g:g, v:0, ok:false};
        if (!isNum(g) || w <= 0 || g < 10 || (s.svt && esAvg < 10)) return p;
        p.ok = true;
        p.v = r3(g / 2 * w);
        return p;
      });
      var top = parts.filter(function(p){ return p.ok; }).sort(function(x, y){ return y.v - x.v; }).slice(0, 2);
      var add = 0;
      top.forEach(function(p){ add += p.v; });
      var score = bac >= 10 ? Math.min(14, r3(acc + add)) : 0;
      return {score:score, top:top, parts:parts, ok: score >= u.cut - 1e-9};
    });
    return {bac:bac, acc:acc, esAvg:esAvg, tot:tot, unis:unis};
  }
  /* Nota mínima, igual en todas las pruebas de ids, para que la universidad k llegue a su corte */
  function needed(model, vals, ids, k){
    if (!ids.length) return {kind:'fixed'};
    var cut = model.unis[k].cut;
    function at(x){
      var w = {};
      Object.keys(vals).forEach(function(key){ w[key] = vals[key]; });
      ids.forEach(function(id){ w[id] = x; });
      return compute(model, w).unis[k].score;
    }
    if (at(20) < cut - 1e-9) return {kind:'never'};
    if (at(0) >= cut - 1e-9) return {kind:'always'};
    var lo = 0, hi = 20;
    for (var i = 0; i < 34; i++){
      var m = (lo + hi) / 2;
      if (at(m) >= cut - 1e-9) hi = m; else lo = m;
    }
    return {kind:'x', x: Math.ceil(hi * 10 - 1e-6) / 10};
  }
  return {isNum:isNum, r2:r2, r3:r3, conv:conv, slope:slope, mention:mention, compute:compute, needed:needed};
})();
