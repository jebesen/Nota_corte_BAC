/* Listado de universidades y buscador de carrera + universidad, común a las dos calculadoras.
   UniSearch(window.UNIDB) devuelve el listado preparado y las funciones del buscador. */
var UniSearch = function(rawDB){
  'use strict';
  var t = I18N.t, esc = Site.esc;
  function isNum(x){ return typeof x === 'number' && isFinite(x); }
  function fmt(x, d){ return Number(x).toLocaleString(I18N.locale(), {minimumFractionDigits:d, maximumFractionDigits:d}); }
  function normKey(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

  var DB = (rawDB && Array.isArray(rawDB.unis) && Array.isArray(rawDB.rows)) ? rawDB : {unis:[], rows:[]};
  var ROWS = [], ROW_BY = {}, DEG = {};
  DB.rows.forEach(function(r){
    var u = DB.unis[r[0]];
    if (!u || !r[1]) return;
    var row = {u:u, degree:r[1], center:r[2] || '', campus:r[3] || '', group:r[4] || '', cut: isNum(r[5]) ? r[5] : null};
    row.key = [u.code, row.degree, row.center, row.campus, row.group].join('|');
    if (ROW_BY[row.key]) return;
    row.nd = normKey(row.degree);
    /* Texto en el que se busca: carrera, universidad, siglas, centro, campus, grupo y comunidad */
    row.hay = ' ' + normKey([row.degree, u.name, u.code, row.center, row.campus, row.group, u.community].join(' ')) + ' ';
    /* Sin la comunidad: lo que coincide aquí (ciudad, universidad) pesa más que la comunidad */
    row.hay2 = ' ' + normKey([u.name, u.code, row.center, row.campus].join(' ')) + ' ';
    ROWS.push(row); ROW_BY[row.key] = row;
    if (!DEG[row.nd]) DEG[row.nd] = {name:row.degree, rows:[]};
    DEG[row.nd].rows.push(row);
  });
  ROWS.sort(function(a, b){
    return a.degree.localeCompare(b.degree, 'es') || a.u.name.localeCompare(b.u.name, 'es') || (a.campus + a.center + a.group).localeCompare(b.campus + b.center + b.group, 'es');
  });
  ROWS.forEach(function(r, i){ r.ord = i; });

  function placeParts(r){
    var p = [];
    if (r.center) p.push(r.center);
    if (r.campus && r.center.indexOf(r.campus) < 0) p.push(r.campus);
    return p;
  }
  function cutText(c){ return !isNum(c) ? t('cut.unknown') : c <= 5 ? t('cut.none') : fmt(c, 3); }
  function detailOf(r){ var p = placeParts(r); if (r.group) p.push(t('detail.group', {g:r.group})); return p.join(' · '); }
  function cutLabel(r){ return r ? I18N.ck(r.u.ck || '1.ª adjudicación 2026') : ''; }
  function findRow(code, degree){
    var d = DEG[normKey(degree)];
    return (d && d.rows.filter(function(x){ return x.u.code === code; })[0]) || null;
  }

  /* Todas las palabras deben aparecer (sin acentos; en francés se traducen algunas) */
  function search(q){
    var toks = normKey(q).split(' ').filter(function(x){ return x.length > 0; });
    if (!toks.length) return [];
    var alts = toks.map(function(tk){ return I18N.synonyms(tk); });
    var out = [];
    for (var i = 0; i < ROWS.length; i++){
      var r = ROWS[i], ok = true, score = 0;
      for (var j = 0; j < alts.length && ok; j++){
        var hit = false;
        for (var a = 0; a < alts[j].length; a++){
          var s = alts[j][a];
          if (r.hay.indexOf(' ' + s) >= 0){
            hit = true;
            if (r.nd.indexOf(s) >= 0) score -= (r.nd.indexOf(s) === 0 ? 6 : 4);
            else if (r.hay2.indexOf(' ' + s) >= 0) score -= 2;
            break;
          }
          if (s.length >= 4 && r.hay.indexOf(s) >= 0){ hit = true; break; }
        }
        ok = hit;
      }
      if (ok) out.push({r:r, s:score});
    }
    out.sort(function(x, y){ return x.s - y.s || x.r.ord - y.r.ord; });
    return out.map(function(x){ return x.r; });
  }

  /* HTML del buscador y de la carrera elegida */
  var MAX_RESULTS = 40;
  function comboHtml(i, q){
    var p = 'f-uni-' + i + '-';
    return '<div class="combo" data-i="' + i + '">' +
      '<label class="field wide" for="' + p + 'q"><span>' + esc(t('u.search')) + '</span></label>' +
      '<input class="in combo-in" type="search" id="' + p + 'q" value="' + esc(q || '') + '" placeholder="' + esc(t('u.search.ph')) + '"' +
      ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"' +
      ' role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + p + 'lb">' +
      '<p class="combo-msg" id="' + p + 'msg" aria-live="polite"></p>' +
      '<div class="combo-list" id="' + p + 'lb" role="listbox" hidden></div>' +
    '</div>';
  }
  function pickedHtml(i, r){
    var place = [r.u.name].concat(placeParts(r)).join(' · ');
    return '<div class="picked"><div class="picked-txt"><b>' + esc(r.degree) + (r.group ? ' · ' + esc(r.group) : '') + '</b><span>' + esc(place) + '</span><span class="picked-cm">' + esc(r.u.community) + '</span></div>' +
      '<button type="button" class="btn small" data-act="change-row" data-i="' + i + '">' + esc(t('u.change')) + '</button></div>';
  }
  function resultHtml(i, r, n){
    var place = [r.u.name].concat(placeParts(r)).join(' · ');
    return '<button type="button" class="opt" role="option" id="f-uni-' + i + '-o' + n + '" data-act="pick-row" data-i="' + i + '" data-key="' + esc(r.key) + '" aria-selected="false">' +
      '<span class="opt-main"><b>' + esc(r.degree) + '</b>' + (r.group ? ' <span class="opt-grp">' + esc(r.group) + '</span>' : '') + '<span class="opt-place">' + esc(place) + '</span></span>' +
      '<span class="opt-cut num">' + esc(cutText(r.cut)) + '</span></button>';
  }

  /* Comportamiento: se engancha al cuerpo del panel de configuración */
  var body = null, hooks = null, searchTimer = null;
  function refs(i){
    var p = 'f-uni-' + i + '-';
    return {inp:document.getElementById(p + 'q'), list:document.getElementById(p + 'lb'), msg:document.getElementById(p + 'msg')};
  }
  function fitList(list){
    /* Que la lista quepa por encima del teclado del móvil */
    if (!list || list.hidden) return;
    var vv = window.visualViewport;
    var bottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
    var top = list.getBoundingClientRect().top;
    list.style.maxHeight = Math.max(150, Math.min(420, bottom - top - 12)) + 'px';
  }
  function run(i){
    var R = refs(i);
    if (!R.inp) return;
    var q = R.inp.value;
    if (hooks && hooks.onQuery) hooks.onQuery(i, q);
    R.inp.removeAttribute('aria-activedescendant');
    var close = function(msg){ R.list.hidden = true; R.list.innerHTML = ''; R.inp.setAttribute('aria-expanded', 'false'); R.msg.textContent = msg; };
    if (normKey(q).length < 2) return close(t('u.search.hint'));
    var res = search(q);
    if (!res.length) return close(t('u.search.none', {q:q.trim()}));
    R.list.innerHTML = res.slice(0, MAX_RESULTS).map(function(r, n){ return resultHtml(i, r, n); }).join('');
    R.list.hidden = false;
    R.list.scrollTop = 0;
    R.inp.setAttribute('aria-expanded', 'true');
    R.msg.textContent = res.length > MAX_RESULTS ? t('u.search.more', {k:MAX_RESULTS, n:res.length}) : t(res.length === 1 ? 'u.search.count.one' : 'u.search.count', {n:res.length});
    fitList(R.list);
  }
  function runAll(){
    if (!body) return;
    body.querySelectorAll('.combo').forEach(function(c){ run(+c.getAttribute('data-i')); });
  }
  function moveActive(i, delta){
    var R = refs(i);
    var opts = R.list.querySelectorAll('.opt');
    if (R.list.hidden || !opts.length) return;
    var cur = -1;
    opts.forEach(function(o, n){ if (o.getAttribute('aria-selected') === 'true') cur = n; });
    var nx = Math.max(0, Math.min(opts.length - 1, cur + delta));
    if (cur >= 0) opts[cur].setAttribute('aria-selected', 'false');
    opts[nx].setAttribute('aria-selected', 'true');
    R.inp.setAttribute('aria-activedescendant', opts[nx].id);
    opts[nx].scrollIntoView({block:'nearest'});
  }
  /* Desplaza solo el cuerpo del panel (no la página) */
  function scrollInBody(el){
    if (!body || !el) return;
    var delta = el.getBoundingClientRect().top - body.getBoundingClientRect().top - 8;
    if (Math.abs(delta) > 2) body.scrollTop += delta;
  }
  function comboIndex(el){ var c = el.closest && el.closest('.combo'); return c ? +c.getAttribute('data-i') : -1; }

  /* hooks: {onPick(i, row), onQuery(i, q)} */
  function attach(bodyEl, h){
    body = bodyEl; hooks = h;
    body.addEventListener('input', function(e){
      var i = comboIndex(e.target);
      if (i < 0 || !e.target.classList.contains('combo-in')) return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function(){ run(i); }, 90);
    });
    body.addEventListener('click', function(e){
      var b = e.target.closest('[data-act="pick-row"]');
      if (b && ROW_BY[b.getAttribute('data-key')]) hooks.onPick(+b.getAttribute('data-i'), ROW_BY[b.getAttribute('data-key')]);
    });
    body.addEventListener('keydown', function(e){
      var el = e.target;
      if (!el.classList || !el.classList.contains('combo-in')) return;
      var i = comboIndex(el), R = refs(i);
      if (e.key === 'ArrowDown'){ e.preventDefault(); moveActive(i, 1); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); moveActive(i, -1); }
      else if (e.key === 'Enter'){
        e.preventDefault();
        var opts = R.list.querySelectorAll('.opt');
        var act = R.list.querySelector('.opt[aria-selected="true"]') || (opts.length === 1 ? opts[0] : null);
        if (act) hooks.onPick(i, ROW_BY[act.getAttribute('data-key')]);
        else el.blur();
      } else if (e.key === 'Escape' && !R.list.hidden){
        e.preventDefault(); e.stopPropagation();
        R.list.hidden = true; R.inp.setAttribute('aria-expanded', 'false');
      }
    });
    body.addEventListener('focusin', function(e){
      var el = e.target;
      if (!el.classList || !el.classList.contains('combo-in')) return;
      var i = comboIndex(el);
      if (refs(i).list.hidden) run(i);
      /* En el móvil, sube el buscador arriba del panel para dejar sitio a la lista sobre el teclado */
      if (window.matchMedia('(max-width: 700px), (pointer: coarse)').matches){
        setTimeout(function(){
          if (document.activeElement !== el) return;
          scrollInBody(el.closest('.combo'));
          fitList(refs(i).list);
        }, 320);
      }
    });
    if (window.visualViewport){
      window.visualViewport.addEventListener('resize', function(){
        var ae = document.activeElement;
        if (ae && ae.classList && ae.classList.contains('combo-in')) fitList(refs(comboIndex(ae)).list);
      });
    }
  }

  /* Ponderaciones precargadas (js/weights.js) para la fila elegida, o null si no las hay */
  function prefill(r){
    var W = window.WEIGHTS_DB;
    if (!W || !r) return null;
    var k = W.alias[r.nd] || r.nd;
    var w = W.deg[k] && W.deg[k][r.u.code];
    return w ? {w:w, src:W.src[k], year:W.year} : null;
  }
  /* Ponderación precargada de una materia (clave de weights.js); null si el grado no tiene tabla */
  function prefillWeight(r, key){
    var pf = prefill(r);
    if (!pf) return null;
    return key && typeof pf.w[key] === 'number' ? pf.w[key] : 0;
  }
  var SUBJ_KEYS = {
    'biologia':'bio', 'quimica':'qui', 'fisica':'fis', 'matematicas ii':'mat',
    'matematicas aplicadas a las ciencias sociales ii':'mcs', 'ciencias generales':'cg', 'dibujo tecnico ii':'dt',
    'dibujo tecnico aplicado a las artes plasticas y al diseno ii':'dta', 'diseno':'dis',
    'tecnicas de expresion grafico plastica':'tgp', 'empresa y diseno de modelos de negocio':'emp',
    'geologia y ciencias ambientales':'geo', 'tecnologia e ingenieria ii':'tec'
  };
  /* Clave de weights.js a partir del nombre español de una materia de la PAU */
  function subjKey(name, isAccLang){
    var n = normKey(name);
    if (SUBJ_KEYS[n]) return SUBJ_KEYS[n];
    if (n.indexOf('lengua extranjera ii') === 0) return isAccLang ? 'len1' : 'len2';
    return '';
  }
  function weightsNote(r){
    var pf = prefill(r);
    if (!pf) return '';
    var off = r.u.ws && r.u.ws[0];
    return esc(t('u.weights.auto', {y:pf.year, src:'\u0001', off:'\u0002'}))
      .replace('\u0001', '<a href="' + esc(pf.src) + '" target="_blank" rel="noopener">' + esc(t('u.weights.src')) + '</a>')
      .replace('\u0002', off ? '<a href="' + esc(off) + '" target="_blank" rel="noopener">' + esc(t('u.weights.off')) + '</a>' : esc(t('u.weights.off')));
  }

  return {
    prefill:prefill, prefillWeight:prefillWeight, subjKey:subjKey, weightsNote:weightsNote,
    DB:DB, ROWS:ROWS, ROW_BY:ROW_BY, DEG:DEG, HAS_DB: ROWS.length > 0, normKey:normKey,
    placeParts:placeParts, cutText:cutText, detailOf:detailOf, cutLabel:cutLabel, findRow:findRow, search:search,
    comboHtml:comboHtml, pickedHtml:pickedHtml, attach:attach, run:run, runAll:runAll, refs:refs, scrollInBody:scrollInBody
  };
};

/* Campo de texto libre con sugerencias (sustituye a los <datalist> nativos, que en Android
   tapan el teclado). Mismo aspecto y teclado que el buscador de universidades.
   SuggestBox.html(inputHtml, listKey) envuelve el input; SuggestBox.attach(body, {listKey: [nombres]}) */
var SuggestBox = (function(){
  'use strict';
  var esc = Site.esc, lists = {}, body = null, n = 0;
  function norm(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  function html(inputHtml, key){
    var id = 'sg' + (++n);
    return '<div class="combo sug" data-sug="' + key + '">' +
      inputHtml.replace('<input ', '<input data-sug-in="1" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '" ') +
      '<div class="combo-list sug-list" id="' + id + '" role="listbox" hidden></div></div>';
  }
  function parts(el){
    var w = el.closest('.sug');
    return w ? {w:w, inp:w.querySelector('[data-sug-in]'), list:w.querySelector('.sug-list'), key:w.getAttribute('data-sug')} : null;
  }
  function close(P){ if (!P) return; P.list.hidden = true; P.list.innerHTML = ''; P.inp.setAttribute('aria-expanded', 'false'); P.inp.removeAttribute('aria-activedescendant'); }
  function fit(list){
    if (list.hidden) return;
    var vv = window.visualViewport;
    var bottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
    list.style.maxHeight = Math.max(140, Math.min(320, bottom - list.getBoundingClientRect().top - 12)) + 'px';
  }
  function open(P){
    var q = norm(P.inp.value), all = lists[P.key] || [];
    var res = all.filter(function(x){ var k = norm(x); return !q || (k.indexOf(q) >= 0 && k !== q); });
    res.sort(function(a, b){ return (norm(a).indexOf(q) === 0 ? 0 : 1) - (norm(b).indexOf(q) === 0 ? 0 : 1); });
    if (!res.length){ close(P); return; }
    P.list.innerHTML = res.map(function(x, i){
      return '<button type="button" class="opt opt-s" role="option" id="' + P.list.id + '-' + i + '" data-val="' + esc(x) + '" aria-selected="false"><span class="opt-main"><b>' + esc(x) + '</b></span></button>';
    }).join('');
    P.list.hidden = false; P.list.scrollTop = 0;
    P.inp.setAttribute('aria-expanded', 'true');
    fit(P.list);
  }
  function pick(P, val){
    P.inp.value = val;
    close(P);
    /* La app reacciona como si se hubiera escrito y confirmado */
    P.inp.dispatchEvent(new Event('input', {bubbles:true}));
    P.inp.dispatchEvent(new Event('change', {bubbles:true}));
  }
  function move(P, d){
    var opts = P.list.querySelectorAll('.opt');
    if (P.list.hidden || !opts.length) return;
    var cur = -1;
    opts.forEach(function(o, i){ if (o.getAttribute('aria-selected') === 'true') cur = i; });
    var nx = Math.max(0, Math.min(opts.length - 1, cur + d));
    if (cur >= 0) opts[cur].setAttribute('aria-selected', 'false');
    opts[nx].setAttribute('aria-selected', 'true');
    P.inp.setAttribute('aria-activedescendant', opts[nx].id);
    opts[nx].scrollIntoView({block:'nearest'});
  }
  function attach(bodyEl, ls){
    body = bodyEl; lists = ls;
    body.addEventListener('focusin', function(e){
      if (!e.target.hasAttribute || !e.target.hasAttribute('data-sug-in')) return;
      var P = parts(e.target), el = e.target;
      open(P);
      if (window.matchMedia('(max-width: 700px), (pointer: coarse)').matches){
        setTimeout(function(){
          if (document.activeElement !== el) return;
          var delta = P.w.getBoundingClientRect().top - body.getBoundingClientRect().top - 8;
          if (Math.abs(delta) > 2) body.scrollTop += delta;
          fit(P.list);
        }, 320);
      }
    });
    body.addEventListener('input', function(e){
      if (e.isTrusted && e.target.hasAttribute && e.target.hasAttribute('data-sug-in')) open(parts(e.target));
    });
    body.addEventListener('focusout', function(e){
      if (!e.target.hasAttribute || !e.target.hasAttribute('data-sug-in')) return;
      var P = parts(e.target);
      if (!e.relatedTarget || !P.w.contains(e.relatedTarget)) close(P);
    });
    /* Que el campo no pierda el foco al tocar una sugerencia: si lo perdiera, la app
       redibujaría el formulario antes del clic y la sugerencia no llegaría a elegirse */
    body.addEventListener('mousedown', function(e){ if (e.target.closest && e.target.closest('.sug-list')) e.preventDefault(); });
    body.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('.sug-list .opt');
      if (b) pick(parts(b), b.getAttribute('data-val'));
    });
    body.addEventListener('keydown', function(e){
      if (!e.target.hasAttribute || !e.target.hasAttribute('data-sug-in')) return;
      var P = parts(e.target);
      if (e.key === 'ArrowDown'){ e.preventDefault(); if (P.list.hidden) open(P); else move(P, 1); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); move(P, -1); }
      else if (e.key === 'Enter'){
        var act = P.list.querySelector('.opt[aria-selected="true"]');
        if (act){ e.preventDefault(); pick(P, act.getAttribute('data-val')); }
      } else if (e.key === 'Escape' && !P.list.hidden){ e.preventDefault(); e.stopPropagation(); close(P); }
    });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', function(){
      var ae = document.activeElement;
      if (ae && ae.hasAttribute && ae.hasAttribute('data-sug-in')) fit(parts(ae).list);
    });
  }
  return {html:html, attach:attach};
})();
