/* Cálculo puro: sin acceso al DOM */
var PauCalc = (function(){
  function isNum(x){ return typeof x === 'number' && isFinite(x); }
  function r2(x){ return Math.round(x * 100 + 1e-9) / 100; }
  function r3(x){ return Math.round(x * 1000 + 1e-9) / 1000; }
  function mean(a){ return a.length ? a.reduce(function(x, y){ return x + y; }, 0) / a.length : 0; }
  /* model: {items:[{id,kind:'bach'|'acc'|'adm'}], subjects:[{id,src}], unis:[{cut,w:{subjectId:peso}}]} */
  function compute(model, vals){
    var b = [], a = [];
    model.items.forEach(function(it){
      var v = vals[it.id];
      if (!isNum(v)) return;
      if (it.kind === 'bach') b.push(v);
      else if (it.kind === 'acc') a.push(v);
    });
    var nmb = r2(mean(b));
    var cfa = r3(mean(a));
    var acc = r3(0.6 * nmb + 0.4 * cfa);
    var pass = b.length > 0 && a.length > 0 && cfa >= 4 - 1e-9 && acc >= 5 - 1e-9;
    var unis = model.unis.map(function(u){
      var parts = model.subjects.map(function(s){
        var w = isNum(u.w[s.id]) ? u.w[s.id] : 0;
        var g = vals[s.src];
        var p = {sub:s, w:w, g:g, v:0, ok:false};
        if (!isNum(g) || w <= 0 || g < 5) return p;
        p.ok = true;
        p.v = r3(g * w);
        return p;
      });
      var top = parts.filter(function(p){ return p.ok; }).sort(function(x, y){ return y.v - x.v; }).slice(0, 2);
      var add = 0;
      top.forEach(function(p){ add += p.v; });
      var score = pass ? Math.min(14, r3(acc + add)) : 0;
      return {score:score, top:top, parts:parts, ok: pass && score >= u.cut - 1e-9};
    });
    return {nmb:nmb, cfa:cfa, acc:acc, pass:pass, nB:b.length, nA:a.length, unis:unis};
  }
  /* Nota mínima, igual en todas las pruebas de ids, para que la universidad k llegue a su corte */
  function needed(model, vals, ids, k, step){
    if (!ids.length) return {kind:'fixed'};
    var cut = model.unis[k].cut;
    function at(x){
      var w = {};
      Object.keys(vals).forEach(function(key){ w[key] = vals[key]; });
      ids.forEach(function(id){ w[id] = x; });
      return compute(model, w).unis[k];
    }
    if (!at(10).ok) return {kind:'never'};
    if (at(0).ok) return {kind:'always'};
    var lo = 0, hi = 10;
    for (var i = 0; i < 34; i++){
      var m = (lo + hi) / 2;
      if (at(m).ok) hi = m; else lo = m;
    }
    var x = Math.ceil(hi / step - 1e-6) * step;
    return {kind:'x', x: Math.min(10, Math.round(x * 100) / 100)};
  }
  return {isNum:isNum, r2:r2, r3:r3, compute:compute, needed:needed};
})();
