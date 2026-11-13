(function(){
  'use strict';
  var C = PauCalc, isNum = C.isNum, t = I18N.t;
  var KEY = 'simulador-pau-espana-v1';
  var TOP = (function(){ try { return window.self === window.top; } catch (e) { return false; } })();

  /* Modalidades de bachillerato (LOMLOE): materias de partida, editables, y materia específica de la PAU.
     Los nombres de las materias son los oficiales en español. */
  var COMMON1 = ['Educación Física', 'Filosofía', 'Lengua Castellana y Literatura I', 'Lengua Extranjera I'];
  var COMMON2 = ['Historia de España', 'Historia de la Filosofía', 'Lengua Castellana y Literatura II', 'Lengua Extranjera II'];
  var MODS = [
    {k:'cyt', esp:'Matemáticas II',
      b1:['Matemáticas I', 'Física y Química', 'Biología, Geología y Ciencias Ambientales', 'Optativa'],
      b2:['Matemáticas II', 'Biología', 'Química', 'Optativa'], adm:['Biología', 'Química']},
    {k:'hcs', esp:'Matemáticas Aplicadas a las Ciencias Sociales II',
      b1:['Matemáticas Aplicadas a las Ciencias Sociales I', 'Economía', 'Historia del Mundo Contemporáneo', 'Optativa'],
      b2:['Matemáticas Aplicadas a las Ciencias Sociales II', 'Empresa y Diseño de Modelos de Negocio', 'Geografía', 'Optativa'], adm:['Empresa y Diseño de Modelos de Negocio', 'Geografía']},
    {k:'apl', esp:'Dibujo Artístico II',
      b1:['Dibujo Artístico I', 'Cultura Audiovisual', 'Proyectos Artísticos', 'Optativa'],
      b2:['Dibujo Artístico II', 'Diseño', 'Técnicas de Expresión Gráfico-Plástica', 'Optativa'], adm:['Diseño', 'Técnicas de Expresión Gráfico-Plástica']},
    {k:'mae', esp:'Análisis Musical II',
      b1:['Análisis Musical I', 'Artes Escénicas I', 'Lenguaje y Práctica Musical', 'Optativa'],
      b2:['Análisis Musical II', 'Historia de la Música y de la Danza', 'Literatura Dramática', 'Optativa'], adm:['Historia de la Música y de la Danza', 'Literatura Dramática']},
    {k:'gen', esp:'Ciencias Generales',
      b1:['Matemáticas Generales', 'Economía, Emprendimiento y Actividad Empresarial', 'Materia de modalidad', 'Optativa'],
      b2:['Ciencias Generales', 'Movimientos Culturales y Artísticos', 'Materia de modalidad', 'Optativa'], adm:[]}
  ];
  function modName(k){ return t('mod.' + k); }
  var ESP_SUGG = ['Matemáticas II', 'Matemáticas Aplicadas a las Ciencias Sociales II', 'Latín II', 'Dibujo Artístico II', 'Análisis Musical II', 'Artes Escénicas II', 'Ciencias Generales'];
  var ADM_SUGG = ['Biología', 'Química', 'Física', 'Matemáticas II', 'Dibujo Técnico II', 'Geología y Ciencias Ambientales', 'Tecnología e Ingeniería II',
    'Matemáticas Aplicadas a las Ciencias Sociales II', 'Latín II', 'Griego II', 'Empresa y Diseño de Modelos de Negocio', 'Geografía', 'Historia del Arte',
    'Literatura Dramática', 'Dibujo Artístico II', 'Diseño', 'Técnicas de Expresión Gráfico-Plástica', 'Fundamentos Artísticos', 'Análisis Musical II',
    'Artes Escénicas II', 'Coro y Técnica Vocal II', 'Historia de la Música y de la Danza', 'Ciencias Generales', 'Movimientos Culturales y Artísticos', 'Lengua Extranjera II (otro idioma)'];
  var ACC_KEYS = ['lcl', 'his', 'lex', 'esp', 'coo'];
  var PHASES = [{k:'b1', unit:'materia'}, {k:'b2', unit:'materia'}, {k:'pa', unit:'examen'}, {k:'pd', unit:'examen'}];
  function phT(k){ return t('ph.' + k); }
  var WEIGHTS = [0, 0.1, 0.2];
  var MAX_BACH = 14, MAX_ADM = 6;

  /* Utilidades */
  var $ = function(id){ return document.getElementById(id); };
  var esc = Site.esc;
  function uid(){ return Math.random().toString(36).slice(2, 8); }
  function fmt(x, d){ return Number(x).toLocaleString(I18N.locale(), {minimumFractionDigits:d, maximumFractionDigits:d}); }
  function signed(x){ return (x >= 0 ? '+' : '−') + fmt(Math.abs(x), 3); }
  function clamp10(x){ return Math.min(10, Math.max(0, Math.round(x * 100) / 100)); }
  function clampV(x, it){ return it.kind === 'bach' ? Math.min(10, Math.max(0, Math.round(x))) : clamp10(x); }
  function stepOf(it){ return it.kind === 'bach' ? 1 : 0.1; }
  function fmtG(x, it){ return it.kind === 'bach' ? fmt(x, Math.round(x) === x ? 0 : 2) : fmt(x, 2); }
  function showNum(x){ return isNum(x) ? String(Math.round(x * 1000) / 1000).replace('.', ',') : ''; }
  function parseNum(s){
    if (s == null) return null;
    s = String(s).trim().replace(',', '.');
    if (s === '') return null;
    if (!/^\d+(\.\d+)?$/.test(s) && !/^\.\d+$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function str(x, n){ return typeof x === 'string' ? x.slice(0, n) : ''; }
  function g10(x){ return (isNum(x) && x >= 0 && x <= 10) ? x : null; }
  function gInt(x){ return (isNum(x) && x >= 0 && x <= 10 && Math.round(x) === x) ? x : null; }
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function modOf(k){ for (var i = 0; i < MODS.length; i++) if (MODS[i].k === k) return MODS[i]; return MODS[0]; }
  function cleanW(o){
    var w = {};
    if (o && typeof o === 'object') Object.keys(o).forEach(function(k){
      var x = o[k];
      if (isNum(x) && x >= 0 && x <= 0.2 + 1e-9 && /^[a-z0-9_]{1,16}$/i.test(k)) w[k] = Math.round(x * 10) / 10;
    });
    return w;
  }
  function countTxt(n, unit){ return t('cnt.' + unit + (n === 1 ? '.one' : ''), {n:n}); }
  function matN(i){ return t('mat.n', {n:i + 1}); }

  /* Nombres de los exámenes de la fase de acceso */
  function accLabel(k, cfg){
    switch (k){
      case 'lcl': return 'Lengua Castellana y Literatura II';
      case 'his': return cfg.his === 'fil' ? 'Historia de la Filosofía' : 'Historia de España';
      case 'lex': return 'Lengua Extranjera II' + (cfg.lex ? ' · ' + cfg.lex : '');
      case 'esp': return (cfg.esp || t('acc.esp.ph'));
      case 'coo': return (cfg.cooName ? cfg.cooName + ' y Literatura II' : t('acc.coo'));
    }
    return '';
  }
  function accActive(cfg){ return ACC_KEYS.filter(function(k){ return k !== 'coo' || cfg.coo; }); }

  /* Listado de universidades (js/data-pau.js) y buscador común (js/unisearch.js) */
  var US = UniSearch(window.UNIDB);
  var DB = US.DB, ROW_BY = US.ROW_BY, HAS_DB = US.HAS_DB;
  function cutLabelOf(u){ return u.mode === 'list' ? US.cutLabel(ROW_BY[u.row]) : ''; }

  /* Configuraciones de partida */
  function bachRows(names){ return names.map(function(n){ return {id:uid(), name:n, grade:null}; }); }
  function templateBach(cfg){
    var m = modOf(cfg.mod);
    var c1 = COMMON1.slice(), c2 = COMMON2.slice();
    if (cfg.coo){
      var nm = cfg.cooName || 'Lengua cooficial';
      c1.push(nm + ' y Literatura I'); c2.push(nm + ' y Literatura II');
    }
    return {b1: bachRows(c1.concat(m.b1)), b2: bachRows(c2.concat(m.b2))};
  }
  function blankAcc(){ return {lcl:{grade:null, pond:false}, his:{grade:null, pond:false}, lex:{grade:null, pond:false}, esp:{grade:null, pond:true}, coo:{grade:null, pond:false}}; }
  function blankUni(){ return {mode: HAS_DB ? 'list' : 'manual', row:'', deg:'', name:'', degree:'', detail:'', cut:null, cutRef:null, w:{}}; }
  function clearRow(u){ u.row = ''; u.name = ''; u.degree = ''; u.detail = ''; u.cut = null; u.cutRef = null; }
  function applyRow(u, r){
    u.mode = 'list'; u.row = r.key; u.deg = r.degree;
    u.name = r.u.name; u.degree = r.degree; u.detail = US.detailOf(r);
    u.cut = r.cut; u.cutRef = r.cut;
  }
  function listUni(code, degree, fb, w){
    var u = blankUni(), r = US.findRow(code, degree);
    if (r){ applyRow(u, r); if (!US.prefill(r)) u.w = w; }
    else { u.mode = 'manual'; u.name = fb.name; u.degree = degree; u.cut = fb.cut; u.w = w; }
    return u;
  }
  function blankConfig(){
    var c = {example:false, student:'', mod:'cyt', coo:false, cooName:'', his:'esp', lex:'Inglés', esp:'Matemáticas II', b1:[], b2:[], acc:blankAcc(), adm:[], unis:[]};
    var tp = templateBach(c);
    c.b1 = tp.b1; c.b2 = tp.b2;
    c.adm = modOf(c.mod).adm.map(function(n){ return {id:uid(), name:n, grade:null}; });
    for (var i = 0; i < 3; i++) c.unis.push(blankUni());
    return c;
  }
  function exampleConfig(){
    var c = blankConfig();
    c.example = true;
    var g1 = [9, 8, 8, 9, 9, 9, 10, 9];
    c.b1.forEach(function(r, i){ r.grade = g1[i]; });
    c.b2[7].name = 'Psicología';
    var bio = c.adm[0].id, qui = c.adm[1].id;
    var w = function(x){ var o = {}; o['a' + bio] = 0.2; o['a' + qui] = 0.2; o.x_esp = x; return o; };
    c.unis = [
      listUni('UV', 'Medicina', {name:'Universitat de València', cut:13.171}, w(0.1)),
      listUni('UAM', 'Medicina', {name:'Universidad Autónoma de Madrid', cut:12.950}, w(0.1)),
      listUni('UPV', 'Ingeniería Biomédica', {name:'Universitat Politècnica de València', cut:12.498}, w(0.2))
    ];
    return c;
  }
  function normalize(raw){
    var d = blankConfig();
    if (!raw || typeof raw !== 'object') return d;
    var idOk = function(x){ return (typeof x === 'string' && /^[a-z0-9]{1,12}$/i.test(x)) ? x : uid(); };
    var c = {
      example: !!raw.example,
      student: str(raw.student, 60),
      mod: modOf(raw.mod).k,
      coo: !!raw.coo, cooName: str(raw.cooName, 30),
      his: raw.his === 'fil' ? 'fil' : 'esp',
      lex: typeof raw.lex === 'string' ? raw.lex.slice(0, 30) : d.lex,
      esp: typeof raw.esp === 'string' ? raw.esp.slice(0, 60) : d.esp,
      b1:[], b2:[], acc:blankAcc(), adm:[], unis:[]
    };
    ['b1', 'b2'].forEach(function(l){
      var src = Array.isArray(raw[l]) ? raw[l] : d[l];
      src.slice(0, MAX_BACH).forEach(function(r){
        if (!r || typeof r !== 'object') return;
        c[l].push({id:idOk(r.id), name:str(r.name, 60), grade:gInt(r.grade)});
      });
    });
    if (raw.acc && typeof raw.acc === 'object') ACC_KEYS.forEach(function(k){
      var a = raw.acc[k];
      if (!a || typeof a !== 'object') return;
      c.acc[k] = {grade:g10(a.grade), pond: typeof a.pond === 'boolean' ? a.pond : k === 'esp'};
    });
    var adm = Array.isArray(raw.adm) ? raw.adm : d.adm;
    adm.slice(0, MAX_ADM).forEach(function(r){
      if (!r || typeof r !== 'object') return;
      c.adm.push({id:idOk(r.id), name:str(r.name, 60), grade:g10(r.grade)});
    });
    for (var i = 0; i < 3; i++){
      var u = (Array.isArray(raw.unis) && raw.unis[i] && typeof raw.unis[i] === 'object') ? raw.unis[i] : {};
      var rw = ROW_BY[u.row];
      var mode = u.mode === 'list' || u.mode === 'manual' ? u.mode : ((str(u.name, 100) || isNum(u.cut)) ? 'manual' : (HAS_DB ? 'list' : 'manual'));
      if (mode === 'list' && !HAS_DB) mode = 'manual';
      var cu = (isNum(u.cut) && u.cut >= 0 && u.cut <= 14) ? u.cut : null;
      var nu = {mode:mode, row:'', deg:'', name:'', degree:'', detail:'', cut:cu, cutRef:null, w:cleanW(u.w)};
      if (mode === 'list'){
        nu.deg = str(u.deg, 160);
        if (rw){
          nu.row = rw.key; nu.name = rw.u.name; nu.degree = rw.degree; nu.detail = US.detailOf(rw); nu.deg = rw.degree;
          nu.cutRef = rw.cut;
          if (cu === null) nu.cut = rw.cut;
        } else nu.cut = null;
      } else {
        nu.name = str(u.name, 100); nu.degree = str(u.degree, 160);
      }
      c.unis.push(nu);
    }
    return c;
  }

  /* Estado */
  var state = {config:null, sim:{}, scen:{}, scenOn:false};
  function numMap(o){
    var out = {};
    if (o && typeof o === 'object') Object.keys(o).forEach(function(k){ if (isNum(o[k])) out[k] = clamp10(o[k]); });
    return out;
  }
  var firstVisit = false;
  function load(){
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      firstVisit = !(raw && raw.config);
      if (raw && raw.config){
        state.config = normalize(raw.config);
        state.sim = numMap(raw.sim);
        state.scen = numMap(raw.scen);
        state.scenOn = !!raw.scenOn;
        return;
      }
    } catch (e) {}
    state.config = exampleConfig();
  }
  var persistTimer = null;
  function persistNow(){
    try { localStorage.setItem(KEY, JSON.stringify({v:1, config:state.config, sim:state.sim, scen:state.scen, scenOn:state.scenOn})); } catch (e) {}
  }
  /* Al mover un slider se guarda como mucho cada 300 ms */
  function persist(){
    if (persistTimer) return;
    persistTimer = setTimeout(function(){ persistTimer = null; persistNow(); }, 300);
  }
  window.addEventListener('pagehide', function(){ if (persistTimer){ clearTimeout(persistTimer); persistTimer = null; persistNow(); } });

  /* Materias que pueden ponderar: las de la fase de admisión y las de la fase de acceso marcadas */
  function ponderables(cfg){
    var out = [];
    accActive(cfg).forEach(function(k){ if (cfg.acc[k].pond) out.push({id:'x_' + k, name:accLabel(k, cfg), acc:true}); });
    cfg.adm.forEach(function(a, i){ out.push({id:'a' + a.id, name:a.name || matN(i), acc:false}); });
    return out;
  }
  /* La ponderación la indica siempre el usuario; por defecto, 0,2 */
  /* Ponderación: la que elija el usuario; si no, la precargada del grado (js/weights.js); si no, 0,2 */
  function uniWeight(u, s){
    if (isNum(u.w[s.id])) return u.w[s.id];
    if (u.mode === 'list'){
      var pw = US.prefillWeight(ROW_BY[u.row], US.subjKey(s.name, s.id === 'x_lex'));
      if (pw !== null) return pw;
    }
    return 0.2;
  }

  /* Modelo a partir de la configuración */
  function buildModel(cfg){
    var items = [];
    ['b1', 'b2'].forEach(function(l){
      cfg[l].forEach(function(r, i){
        items.push({id:'b' + r.id, ph:l, kind:'bach', label:r.name || matN(i), grade: isNum(r.grade) ? r.grade : null});
      });
    });
    accActive(cfg).forEach(function(k){
      items.push({id:'x_' + k, ph:'pa', kind:'acc', label:accLabel(k, cfg), grade: isNum(cfg.acc[k].grade) ? cfg.acc[k].grade : null});
    });
    cfg.adm.forEach(function(a, i){
      items.push({id:'a' + a.id, ph:'pd', kind:'adm', label:a.name || matN(i), grade: isNum(a.grade) ? a.grade : null});
    });
    var byId = {};
    items.forEach(function(it){ byId[it.id] = it; });
    var subjects = ponderables(cfg).filter(function(s){ return byId[s.id]; }).map(function(s){
      byId[s.id].pond = true;
      return {id:s.id, name:s.name, src:s.id, srcLabel:byId[s.id].label};
    });
    var unis = [];
    cfg.unis.forEach(function(u, i){
      if (!isNum(u.cut)) return;
      if (u.mode === 'list' && !u.row) return;
      var w = {};
      subjects.forEach(function(s){ w[s.id] = uniWeight(u, s); });
      var rr = u.mode === 'list' ? ROW_BY[u.row] : null;
      unis.push({idx:i, name:u.name || t('uni.fallback', {n:i + 1}), degree:u.degree, detail: rr ? US.detailOf(rr) : '', cut:u.cut, cutRef: rr ? u.cutRef : null, cutLbl:cutLabelOf(u), w:w});
    });
    return {items:items, byId:byId, subjects:subjects, unis:unis};
  }
  function avgOf(list){
    var s = 0;
    list.forEach(function(it){ s += it.grade; });
    return list.length ? s / list.length : null;
  }
  function guess(it, model){
    var known = model.items.filter(function(x){ return x.grade !== null; });
    var bach = avgOf(known.filter(function(x){ return x.kind === 'bach'; }));
    var pau = avgOf(known.filter(function(x){ return x.kind !== 'bach'; }));
    var base = it.kind === 'bach' ? (bach !== null ? bach : pau) : (pau !== null ? pau : bach);
    if (base === null) base = 7;
    return it.kind === 'bach' ? clampV(base, it) : Math.round(base * 2) / 2;
  }
  function syncState(model){
    var sim = {}, scen = {};
    model.items.forEach(function(it){
      if (it.grade === null) sim[it.id] = isNum(state.sim[it.id]) ? clampV(state.sim[it.id], it) : guess(it, model);
      else scen[it.id] = isNum(state.scen[it.id]) ? clampV(state.scen[it.id], it) : it.grade;
    });
    state.sim = sim; state.scen = scen;
  }
  function currentVals(model){
    var v = {};
    model.items.forEach(function(it){
      v[it.id] = it.grade === null ? state.sim[it.id] : (state.scenOn ? state.scen[it.id] : it.grade);
    });
    return v;
  }

  /* Vista principal */
  var M = null, refs = {}, uniRefs = [];

  function sliderEl(it, mode){
    var d = document.createElement('div');
    d.className = 'sl';
    var rid = 'r-' + mode + '-' + it.id;
    var st = stepOf(it);
    var hint = mode === 'pending' ? t(it.kind === 'bach' ? 'h.bach' : it.kind === 'acc' ? 'h.acc' : 'h.adm') : '';
    var tag = it.kind === 'bach' ? '' : (it.pond ? '<span class="coef">' + esc(t('tag.pond')) + '</span>' : '');
    var mark = mode === 'scen' ? '<span class="real-mark" style="left:calc(8px + (100% - 16px) * ' + (it.grade / 10) + ')" aria-hidden="true"></span>' : '';
    var stTxt = st === 1 ? '1' : '0,1';
    d.innerHTML =
      '<div class="sl-top"><label for="' + rid + '">' + esc(it.label) + '</label>' + tag + '<output for="' + rid + '"></output></div>' +
      '<div class="sl-ctl"><button type="button" class="step" data-d="-' + st + '" aria-label="' + esc(t('sl.down', {x:it.label, s:stTxt})) + '">−</button>' +
      '<div class="track"><input type="range" id="' + rid + '" min="0" max="10" step="' + (st === 1 ? '1' : '0.05') + '">' + mark + '</div>' +
      '<button type="button" class="step" data-d="' + st + '" aria-label="' + esc(t('sl.up', {x:it.label, s:stTxt})) + '">+</button></div>' +
      '<div class="sl-hint"><span class="hint-txt">' + esc(hint) + '</span><span class="sens"></span></div>';
    var range = d.querySelector('input');
    var store = function(){ return mode === 'pending' ? state.sim : state.scen; };
    range.value = store()[it.id];
    range.addEventListener('input', function(){ store()[it.id] = clampV(parseFloat(range.value), it); schedule(); persist(); });
    d.querySelectorAll('.step').forEach(function(b){
      b.addEventListener('click', function(){
        var s = store();
        s[it.id] = clampV(s[it.id] + parseFloat(b.getAttribute('data-d')), it);
        range.value = s[it.id];
        update(); persist();
      });
    });
    refs[mode + ':' + it.id] = {el:d, range:range, out:d.querySelector('output'), sens:d.querySelector('.sens'), hint:d.querySelector('.hint-txt'), mode:mode, it:it};
    return d;
  }

  function groupPanels(container, list, mode){
    container.innerHTML = '';
    PHASES.forEach(function(ph){
      var its = list.filter(function(it){ return it.ph === ph.k; });
      if (!its.length) return;
      var sec = document.createElement('section');
      sec.className = 'panel group';
      sec.innerHTML = '<div class="group-head"><h3>' + esc(phT(ph.k)) + '</h3><span class="num">' + esc(countTxt(its.length, ph.unit)) + '</span></div><div class="sliders"></div>';
      var box = sec.querySelector('.sliders');
      its.forEach(function(it){ box.appendChild(sliderEl(it, mode)); });
      container.appendChild(sec);
    });
  }

  function buildPending(){
    var list = M.items.filter(function(it){ return it.grade === null; });
    var box = $('pending-groups');
    if (!list.length){
      $('pending-sub').textContent = t('pending.done');
      box.innerHTML = '';
      $('pending-actions').hidden = true;
      return;
    }
    $('pending-sub').textContent = t('pending.sub', {n:list.length, m:M.items.length});
    $('pending-actions').hidden = false;
    groupPanels(box, list, 'pending');
  }

  function buildKnown(){
    Object.keys(refs).forEach(function(k){ if (refs[k].mode === 'scen') delete refs[k]; });
    var list = M.items.filter(function(it){ return it.grade !== null; });
    var box = $('known-groups');
    $('scen-switch').hidden = !list.length;
    $('scen-toggle').checked = state.scenOn;
    if (!list.length){
      $('known-sub').textContent = t('known.none');
      box.innerHTML = '';
      $('known-actions').hidden = true;
      return;
    }
    if (state.scenOn){
      $('known-sub').innerHTML = esc(t('known.scen', {n:list.length, m:M.items.length, mark:'\u0001'})).replace('\u0001', '<span class="mark-legend" aria-hidden="true"></span>');
      $('known-actions').hidden = false;
      groupPanels(box, list, 'scen');
      return;
    }
    var kb = list.filter(function(it){ return it.kind === 'bach'; });
    var extra = kb.length ? t('known.extra', {x:fmt(avgOf(kb), 2)}) : '';
    $('known-sub').textContent = t('known.sub', {n:list.length, m:M.items.length, extra:extra});
    $('known-actions').hidden = true;
    var rows = '';
    PHASES.forEach(function(ph){
      var its = list.filter(function(it){ return it.ph === ph.k; });
      if (!its.length) return;
      rows += '<tr class="grp"><th colspan="3">' + esc(phT(ph.k)) + '</th></tr>';
      its.forEach(function(it){
        var low = it.kind === 'bach' || it.kind === 'adm' ? it.grade < 5 : false;
        rows += '<tr><td>' + esc(it.label) + '</td><td class="r' + (low ? ' low' : '') + '">' + fmtG(it.grade, it) + '</td><td class="r tag">' + (it.pond ? esc(t('tag.pond')) : '') + '</td></tr>';
      });
    });
    box.innerHTML = '<section class="panel"><div class="tbl-wrap"><table class="ktable"><tbody>' + rows + '</tbody></table></div></section>';
  }

  function buildUnis(){
    var box = $('unis');
    box.innerHTML = '';
    uniRefs = [];
    if (!M.unis.length){
      box.innerHTML = '<section class="panel empty"><p>' + esc(t('unis.empty')) + '</p><button class="btn primary" type="button" data-open="fs-unis">' + esc(t('unis.choose')) + '</button></section>';
      return;
    }
    M.unis.forEach(function(u){
      var card = document.createElement('article');
      card.className = 'uni';
      card.innerHTML =
        '<div class="uni-top"><div class="uni-id"><h3 class="uni-name">' + esc(u.name) + '</h3><p class="uni-deg">' + esc(u.degree || t('uni.nodeg')) + (u.detail ? ' · ' + esc(u.detail) : '') + '</p></div><span class="pill"></span></div>' +
        '<div class="uni-score"><b class="uni-num"></b><span class="unit">/ 14</span><span class="uni-gap"></span></div>' +
        '<p class="uni-line uni-cut"></p><p class="uni-line strong uni-need"></p><p class="uni-line uni-parts"></p>';
      box.appendChild(card);
      uniRefs.push({card:card, pill:card.querySelector('.pill'), num:card.querySelector('.uni-num'), gap:card.querySelector('.uni-gap'), cut:card.querySelector('.uni-cut'), need:card.querySelector('.uni-need'), parts:card.querySelector('.uni-parts')});
    });
  }

  function buildMain(){
    M = buildModel(state.config);
    syncState(M);
    refs = {};
    var cfg = state.config;
    $('h1').textContent = cfg.student ? t('head.h1.student', {name:cfg.student}) : t('head.h1');
    $('eyebrow').textContent = t('head.eyebrow', {mod:modName(cfg.mod)});
    $('example-note').hidden = !cfg.example;
    buildPending();
    buildKnown();
    buildUnis();
    update();
  }

  function sensText(c, it){
    var base = it.kind === 'bach' ? (c.nB ? 0.6 / c.nB : 0) : it.kind === 'acc' ? (c.nA ? 0.4 / c.nA : 0) : 0;
    var arr = c.unis.map(function(ur){
      var extra = 0;
      ur.top.forEach(function(p){ if (p.sub.src === it.id) extra += p.w; });
      return base + extra;
    });
    if (!arr.length) arr = [base];
    var mn = Math.min.apply(null, arr), mx = Math.max.apply(null, arr);
    if (mx < 0.0005) return it.kind === 'adm' ? t('sens.none') : '';
    return mx - mn > 0.0005 ? t('sl.sens.range', {a:fmt(mn, 3), b:fmt(mx, 3)}) : t('sl.sens', {a:fmt(mn, 3)});
  }

  /* Al arrastrar un slider, se recalcula una vez por fotograma */
  var rafId = 0;
  function schedule(){
    if (rafId) return;
    rafId = requestAnimationFrame(function(){ rafId = 0; update(); });
  }

  function update(){
    var vals = currentVals(M);
    var c = C.compute(M, vals);
    var changed = 0;
    Object.keys(refs).forEach(function(key){
      var r = refs[key];
      var v = (r.mode === 'pending' ? state.sim : state.scen)[r.it.id];
      r.out.textContent = r.it.kind === 'bach' ? fmt(v, 0) : fmt(v, 2);
      r.sens.textContent = sensText(c, r.it);
      if (r.mode === 'scen'){
        var ch = Math.abs(v - r.it.grade) > 1e-6;
        if (ch) changed++;
        r.el.setAttribute('data-changed', ch ? '1' : '0');
        r.hint.textContent = t('sl.real', {x:fmtG(r.it.grade, r.it)}) + (ch ? t('sl.changed') : '');
      }
    });

    var box = $('score-box');
    var scores = c.unis.map(function(u){ return u.score; });
    if (scores.length){
      var mn = Math.min.apply(null, scores), mx = Math.max.apply(null, scores);
      var same = mx - mn < 0.0005;
      $('score-label').textContent = t(same ? 'score.label' : 'score.label.range');
      $('score').textContent = same ? fmt(mn, 3) : fmt(mn, 3) + ' – ' + fmt(mx, 3);
      $('score-unit').textContent = '/ 14';
      box.className = 'score' + (same ? '' : ' range');
    } else {
      $('score-label').textContent = t('score.label.acc');
      $('score').textContent = fmt(c.acc, 3);
      $('score-unit').textContent = '/ 10';
      box.className = 'score';
    }
    $('mention').textContent = t(c.pass ? 'mention.pass' : 'mention.fail');
    $('c-nmb').textContent = fmt(c.nmb, 2);
    $('c-cfa').textContent = fmt(c.cfa, 3);
    $('c-acc').textContent = fmt(c.acc, 3);

    var count = c.unis.filter(function(u){ return u.ok; }).length;
    var reach = $('reach'), reachTxt;
    if (!c.unis.length){ reachTxt = t('reach.none'); reach.className = 'reach none'; }
    else { reachTxt = t(c.unis.length === 1 ? 'reach.one' : 'reach.many', {n:count, m:c.unis.length}); reach.className = 'reach ' + (count ? 'ok' : 'no'); }
    reach.textContent = reachTxt;

    $('scenario').hidden = !(state.scenOn && changed);
    $('scenario-txt').textContent = t(changed === 1 ? 'scen.one' : 'scen.many', {n:changed});

    var warns = [];
    if (!c.nB) warns.push(t('warn.nobach'));
    if (!c.nA) warns.push(t('warn.noacc'));
    var failed = M.items.filter(function(it){ return it.kind === 'bach' && isNum(vals[it.id]) && vals[it.id] < 5; });
    if (failed.length) warns.push(t(failed.length === 1 ? 'warn.failed.one' : 'warn.failed', {n:failed.length}));
    if (c.nA && c.cfa < 4) warns.push(t('warn.cfa'));
    else if (c.nB && c.nA && c.acc < 5) warns.push(t('warn.acc'));
    if (!M.subjects.length) warns.push(t('warn.nosubj'));
    M.subjects.forEach(function(s){
      var g = vals[s.src];
      if (isNum(g) && g < 5) warns.push(t('warn.low', {s:s.name}));
    });
    $('warn').hidden = !warns.length;
    $('warn').textContent = warns.join(' ');

    /* Nota necesaria: en los exámenes pendientes de la PAU; si no queda ninguno, en las materias pendientes de bachillerato */
    var pendPau = M.items.filter(function(it){ return it.kind !== 'bach' && it.grade === null; }).map(function(it){ return it.id; });
    var pendBach = M.items.filter(function(it){ return it.kind === 'bach' && it.grade === null; }).map(function(it){ return it.id; });
    var useBach = !pendPau.length && pendBach.length;
    var ids = useBach ? pendBach : pendPau;
    var where = t(useBach ? (ids.length === 1 ? 'wh.bach1' : 'wh.bachN') : (ids.length === 1 ? 'wh.pau1' : 'wh.pauN'));
    c.unis.forEach(function(ur, k){
      var u = M.unis[k], R = uniRefs[k];
      if (!R) return;
      var gap = ur.score - u.cut;
      var cat = !c.pass ? 'lej' : gap >= 0.5 ? 'hol' : gap >= -1e-9 ? 'jus' : gap >= -0.5 ? 'cer' : 'lej';
      R.card.setAttribute('data-ok', ur.ok ? '1' : '0');
      R.card.setAttribute('data-cat', cat);
      R.pill.textContent = t('uni.cat.' + cat);
      R.num.textContent = fmt(ur.score, 3);
      R.gap.textContent = signed(ur.score - u.cut);
      var cutTxt = t('uni.cut', {x:fmt(u.cut, 3)});
      if (isNum(u.cutRef)){
        var lbl = u.cutLbl || t('uni.cut.list');
        cutTxt += Math.abs(u.cut - u.cutRef) < 1e-9 ? ' · ' + lbl + (u.cut <= 5 ? t('uni.cut.none') : '') : t('uni.cut.manual', {lbl:lbl, x:fmt(u.cutRef, 3)});
      }
      R.cut.textContent = cutTxt;
      var nd = C.needed(M, vals, ids, k, useBach ? 1 : 0.1), txt;
      if (nd.kind === 'fixed') txt = t('need.fixed');
      else if (nd.kind === 'never') txt = t('need.never', {w:where});
      else if (nd.kind === 'always') txt = t('need.always', {w:where});
      else txt = t('need.x', {x:fmt(nd.x, useBach ? 0 : 1), w:where});
      R.need.textContent = txt;
      R.parts.textContent = !c.pass ? t('uni.parts.fail') : t('uni.parts', {x:fmt(c.acc, 3)}) + ur.top.map(function(p){ return ' + ' + p.sub.name + ' ' + fmt(p.v, 3); }).join('');
    });

    /* Carreras ordenadas de más a menos margen sobre la nota de corte */
    c.unis.map(function(ur, k){ return {k:k, g:ur.score - M.unis[k].cut}; })
      .sort(function(a, b){ return b.g - a.g || a.k - b.k; })
      .forEach(function(x, pos){ if (uniRefs[x.k]) uniRefs[x.k].card.style.order = pos; });
    $('uni-order').hidden = c.unis.length < 2;
    $('mini-score').textContent = $('score').textContent + ' ' + $('score-unit').textContent;
    $('mini-reach').textContent = reachTxt + (state.scenOn && changed ? t('scen.mini') : '');
  }

  function buildSources(){
    var box = $('db-sources');
    if (!box) return;
    if (!HAS_DB){ box.hidden = true; return; }
    var comms = {};
    DB.unis.forEach(function(u){ (comms[u.community] = comms[u.community] || []).push(u); });
    var h = '<summary>' + esc(t('src.summary', {n:fmt(US.ROWS.length, 0), u:DB.unis.length})) + '</summary><p>' + esc(t('src.intro')) + '</p><ul>';
    Object.keys(comms).sort(function(a, b){ return a.localeCompare(b, 'es'); }).forEach(function(cm){
      comms[cm].forEach(function(u){
        var links = [];
        (u.cs || []).forEach(function(l, i){ links.push('<a href="' + esc(l) + '" target="_blank" rel="noopener">' + esc(t('src.cuts')) + ((u.cs.length > 1) ? ' ' + (i + 1) : '') + '</a>'); });
        (u.ws || []).forEach(function(l, i){ links.push('<a href="' + esc(l) + '" target="_blank" rel="noopener">' + esc(t('src.weights')) + ((u.ws.length > 1) ? ' ' + (i + 1) : '') + '</a>'); });
        h += '<li><strong>' + esc(u.name) + '</strong> (' + esc(cm) + '). ' + esc(I18N.cl(u.code, u.cl || '')) + (links.length ? ' ' + esc(t('src.links')) + ' ' + links.join(' · ') + '.' : '') + '</li>';
      });
    });
    box.innerHTML = h + '</ul>';
  }

  /* Acciones de la vista principal */
  $('reset-sim').addEventListener('click', function(){
    M.items.forEach(function(it){ if (it.grade === null) state.sim[it.id] = guess(it, M); });
    Object.keys(refs).forEach(function(k){ var r = refs[k]; if (r.mode === 'pending') r.range.value = state.sim[r.it.id]; });
    update(); persist();
  });
  function restoreReal(){
    M.items.forEach(function(it){ if (it.grade !== null) state.scen[it.id] = it.grade; });
    Object.keys(refs).forEach(function(k){ var r = refs[k]; if (r.mode === 'scen') r.range.value = state.scen[r.it.id]; });
    update(); persist();
  }
  $('reset-scen').addEventListener('click', restoreReal);
  $('restore-top').addEventListener('click', restoreReal);
  $('scen-toggle').addEventListener('change', function(){
    state.scenOn = this.checked;
    buildKnown(); update(); persist();
  });
  $('open-cfg').addEventListener('click', function(){ openCfg(); });
  $('share-btn').addEventListener('click', function(){ Site.share('pau', {config:normalize(state.config), sim:state.sim}); });
  function buildPrint(){
    var vals = currentVals(M);
    Site.renderPrint({
      title: t('print.title'),
      subtitle: [state.config.student, modName(state.config.mod)].filter(Boolean).join(' · '),
      groups: PHASES.map(function(ph){
        return {t:phT(ph.k), rows: M.items.filter(function(it){ return it.ph === ph.k; }).map(function(it){
          return {label:it.label + (it.pond ? ' (' + t('tag.pond') + ')' : ''), val:fmtG(vals[it.id], it) + ' / 10', est: it.grade === null};
        })};
      })
    });
  }
  $('print-btn').addEventListener('click', function(){ buildPrint(); window.print(); });
  window.addEventListener('beforeprint', buildPrint);
  $('example-start').addEventListener('click', function(){ startWizard(); });
  /* Borrar todo: se eliminan los datos y la marca de la guía, y se recarga como en la primera visita */
  $('reset-btn').addEventListener('click', function(){
    if (!window.confirm(t('reset.ask'))) return;
    if (persistTimer){ clearTimeout(persistTimer); persistTimer = null; }
    try { localStorage.removeItem(KEY); localStorage.removeItem(WIZ_KEY); } catch (e) {}
    location.replace(location.pathname + location.search);
  });
  $('unis').addEventListener('click', function(e){
    var b = e.target.closest('[data-open]');
    if (b) openCfg(b.getAttribute('data-open'));
  });
  Site.onLang(function(){ buildSources(); buildMain(); });

  var mini = $('mini');
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(en){ mini.hidden = en.isIntersecting; });
    }).observe($('score-card'));
  }

  /* Panel de configuración */
  var dlg = $('cfg'), body = $('cfg-body'), draft = null, importSim = null;
  SuggestBox.attach(body, {esp: ESP_SUGG, adm: ADM_SUGG});

  function fsec(id, title, html){ return '<section class="fsec" id="' + id + '"><h3>' + esc(title) + '</h3>' + html + '</section>'; }
  function field(label, control, cls){ return '<label class="field' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span>' + control + '</label>'; }
  function textIn(id, k, val, ph, list, aria){
    return '<input class="in" type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val) + '" placeholder="' + esc(ph || '') + '" autocomplete="off"' + (list ? ' list="' + list + '"' : '') + (aria ? ' aria-label="' + esc(aria) + '"' : '') + '>';
  }
  function numIn(id, k, val, ph, aria){
    return '<input class="in num" type="text" inputmode="decimal" id="' + id + '" data-k="' + k + '" value="' + esc(showNum(val)) + '" placeholder="' + esc(ph || '') + '" autocomplete="off"' + (aria ? ' aria-label="' + esc(aria) + '"' : '') + '>';
  }
  function weightSel(i, s, u){
    var w = uniWeight(u, s);
    return '<label class="field"><span>' + esc(s.name + (s.acc ? t('w.accsuffix') : '')) + '</span><select class="in" id="f-uni-' + i + '-w-' + s.id + '" data-k="w:' + i + ':' + s.id + '">' +
      WEIGHTS.map(function(x){ return '<option value="' + x + '"' + (Math.abs(x - w) < 1e-9 ? ' selected' : '') + '>' + esc(x === 0 ? t('w.none') : t('w.x', {x:showNum(x)})) + '</option>'; }).join('') +
      '</select></label>';
  }

  /* Buscador de carrera y universidad: js/unisearch.js */
  function pickRow(i, r){
    var u = draft.unis[i];
    if (!u || !r) return;
    draft.example = false;
    applyRow(u, r);
    u.w = {};
    delete u._q; delete u._edit;
    rerenderUni(i);
    var blk = $('ub-' + i);
    if (blk){
      var focusEl = blk.querySelector('[data-act="change-row"]');
      if (focusEl) focusEl.focus({preventScroll:true});
      US.scrollInBody(blk);
    }
  }
  US.attach(body, {
    onPick: pickRow,
    onQuery: function(i, q){ if (draft && draft.unis[i]) draft.unis[i]._q = q; }
  });

  function uniBlock(d, u, i){
    var p = 'f-uni-' + i + '-';
    var subs = ponderables(d);
    var seg = HAS_DB ? '<div class="seg" role="radiogroup" aria-label="' + esc(t('u.how', {n:i + 1})) + '">' +
      '<label><input type="radio" name="umode-' + i + '" id="' + p + 'm-list" value="list" data-k="umode:' + i + '"' + (u.mode === 'list' ? ' checked' : '') + '><span>' + esc(t('u.mode.list')) + '</span></label>' +
      '<label><input type="radio" name="umode-' + i + '" id="' + p + 'm-manual" value="manual" data-k="umode:' + i + '"' + (u.mode === 'manual' ? ' checked' : '') + '><span>' + esc(t('u.mode.manual')) + '</span></label></div>' : '';
    var h = '<fieldset class="ublock" id="ub-' + i + '"><legend>' + esc(t('u.legend', {n:i + 1})) + '</legend>' + seg;
    var showW = true;
    if (u.mode === 'list'){
      var rr = ROW_BY[u.row];
      if (!rr || u._edit){
        showW = false;
        h += US.comboHtml(i, u._q != null ? u._q : (u.deg || ''));
        if (rr) h += '<div class="brow"><button type="button" class="btn small" data-act="keep-row" data-i="' + i + '">' + esc(t('cfg.cancel')) + '</button></div>';
      } else {
        h += US.pickedHtml(i, rr);
        h += '<div class="fgrid">' + field(t('u.cut'), numIn(p + 'cut', 'uni:' + i + ':cut', u.cut, isNum(u.cutRef) ? showNum(u.cutRef) : '')) + '</div>';
        if (!isNum(rr.cut)) h += '<p class="fnote warn-note">' + esc(t('u.cut.missing')) + '</p>';
        else h += '<p class="fnote">' + esc(t('u.cut.from', {lbl:cutLabelOf(u)})) + (isNum(u.cutRef) ? esc(': ' + (u.cutRef <= 5 ? t('u.cut.none5') : fmt(u.cutRef, 3))) : '') + esc(t('u.cut.update')) + '</p>';
      }
    } else {
      h += '<div class="fgrid">' +
        field(t('u.name'), textIn(p + 'name', 'uni:' + i + ':name', u.name, t('u.name.ph'))) +
        field(t('u.degree'), textIn(p + 'degree', 'uni:' + i + ':degree', u.degree, t('u.degree.ph'))) +
        field(t('u.cut'), numIn(p + 'cut', 'uni:' + i + ':cut', u.cut, t('u.cut.ph'))) + '</div>';
    }
    if (subs.length && showW){
      var prr = u.mode === 'list' ? ROW_BY[u.row] : null;
      h += '<p class="fnote">' + (prr && US.prefill(prr) ? US.weightsNote(prr) : esc(t('u.weights'))) + '</p>';
      h += '<div class="wgrid">' + subs.map(function(s){ return weightSel(i, s, u); }).join('') + '</div>';
    }
    h += '<div class="brow"><button type="button" class="btn small danger" data-act="clear-uni" data-i="' + i + '">' + esc(t('u.clear')) + '</button></div>';
    return h + '</fieldset>';
  }
  function rerenderUni(i){
    var old = $('ub-' + i);
    if (!old) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = uniBlock(draft, draft.unis[i], i);
    old.replaceWith(tmp.firstChild);
    if (US.refs(i).inp) US.run(i);
  }

  function bachTable(d, l){
    var title = phT(l);
    var rows = d[l].map(function(r, i){
      var p = 'f-' + l + '-' + r.id + '-';
      return '<tr><td class="c-name">' + textIn(p + 'name', 'bname:' + l + ':' + r.id, r.name, t('f.mat.ph'), null, t('f.mat.aria', {i:i + 1, title:title})) + '</td>' +
        '<td class="c-grade">' + numIn(p + 'grade', 'bgrade:' + l + ':' + r.id, r.grade, t('f.pending'), t('f.gradeof', {x: r.name || t('f.thesub', {i:i + 1})})) + '</td>' +
        '<td class="c-act"><button type="button" class="x-btn" data-act="del-b" data-l="' + l + '" data-id="' + r.id + '" aria-label="' + esc(t('f.del', {x: r.name || t('f.del.generic')})) + '">×</button></td></tr>';
    }).join('');
    return '<div class="tbl-wrap"><table class="gtable"><caption>' + esc(title + ' · ' + countTxt(d[l].length, 'materia')) + '</caption><thead><tr><th scope="col">' + esc(t('f.col.mat')) + '</th><th scope="col" class="c-grade">' + esc(t('f.col.grade')) + '</th><th scope="col" class="c-act"><span class="sr-file">' + esc(t('f.col.del')) + '</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      (d[l].length < MAX_BACH ? '<div class="brow"><button type="button" class="btn small" data-act="add-b" data-l="' + l + '">' + esc(t('f.addb', {title:title})) + '</button></div>' : '');
  }

  function renderForm(){
    var d = draft;
    var h = '';
    h += fsec('fs-alumno', t('f.alumno'),
      '<div class="fgrid">' +
        field(t('f.name'), textIn('f-student', 'student', d.student, t('f.name.ph'))) +
        field(t('f.mod'), '<select class="in" id="f-mod" data-k="mod">' + MODS.map(function(m){ return '<option value="' + m.k + '"' + (m.k === d.mod ? ' selected' : '') + '>' + esc(modName(m.k)) + '</option>'; }).join('') + '</select>') +
      '</div>' +
      '<div class="fgrid">' +
        '<label class="field check"><input type="checkbox" id="f-coo" data-k="coo"' + (d.coo ? ' checked' : '') + '><span>' + esc(t('f.coo')) + '</span></label>' +
        (d.coo ? field(t('f.cooname'), textIn('f-cooname', 'cooName', d.cooName, t('f.cooname.ph'))) : '') +
      '</div>' +
      '<p class="fnote">' + esc(t('f.coo.note')) + '</p>');
    h += fsec('fs-bach', t('f.bach'),
      '<p class="fnote">' + t('f.bach.note') + '</p>' +
      bachTable(d, 'b1') + bachTable(d, 'b2') +
      '<div class="brow"><button type="button" class="btn small" data-act="fill-b">' + esc(t('f.fillb')) + '</button></div>');
    var accRows = accActive(d).map(function(k){
      var a = d.acc[k], lab = accLabel(k, d), ctl;
      if (k === 'his') ctl = '<select class="in" id="f-acc-his-sel" data-k="his" aria-label="' + esc(t('f.his.aria')) + '"><option value="esp"' + (d.his === 'esp' ? ' selected' : '') + '>Historia de España</option><option value="fil"' + (d.his === 'fil' ? ' selected' : '') + '>Historia de la Filosofía</option></select>';
      else if (k === 'lex') ctl = '<div class="lbl-cell">Lengua Extranjera II</div>' + textIn('f-acc-lex', 'lex', d.lex, t('f.lex.ph'), null, t('f.lex.aria'));
      else if (k === 'esp') ctl = '<div class="lbl-cell">' + esc(t('acc.esp.ph')) + '</div>' + SuggestBox.html(textIn('f-acc-esp', 'esp', d.esp, t('f.esp.ph'), null, t('acc.esp.ph')), 'esp');
      else ctl = '<div class="lbl-cell">' + esc(lab) + '</div>';
      return '<tr><td class="c-name">' + ctl + '</td>' +
        '<td class="c-grade">' + numIn('f-acc-' + k + '-grade', 'xgrade:' + k, a.grade, t('f.pending'), t('f.gradeof', {x:lab})) + '</td>' +
        '<td class="c-pond"><input type="checkbox" id="f-acc-' + k + '-pond" data-k="xpond:' + k + '"' + (a.pond ? ' checked' : '') + ' aria-label="' + esc(t('f.pond.aria', {x:lab})) + '"></td></tr>';
    }).join('');
    h += fsec('fs-acc', t('f.acc'),
      '<p class="fnote">' + t('f.acc.note') + '</p>' +
      '<div class="tbl-wrap"><table class="gtable"><thead><tr><th scope="col">' + esc(t('f.col.exam')) + '</th><th scope="col" class="c-grade">' + esc(t('f.col.grade')) + '</th><th scope="col" class="c-pond">' + esc(t('f.col.pond')) + '</th></tr></thead><tbody>' + accRows + '</tbody></table></div>');
    var admRows = d.adm.map(function(a, i){
      var p = 'f-adm-' + a.id + '-';
      return '<tr><td class="c-name">' + SuggestBox.html(textIn(p + 'name', 'aname:' + a.id, a.name, t('f.adm.ph'), null, t('f.adm.aria', {i:i + 1})), 'adm') + '</td>' +
        '<td class="c-grade">' + numIn(p + 'grade', 'agrade:' + a.id, a.grade, t('f.pending'), t('f.gradeof', {x: a.name || t('f.thesub', {i:i + 1})})) + '</td>' +
        '<td class="c-act"><button type="button" class="x-btn" data-act="del-a" data-id="' + a.id + '" aria-label="' + esc(t('f.del', {x: a.name || t('f.del.generic')})) + '">×</button></td></tr>';
    }).join('');
    h += fsec('fs-adm', t('f.adm'),
      '<p class="fnote">' + esc(t('f.adm.note')) + '</p>' +
      (d.adm.length ? '<div class="tbl-wrap"><table class="gtable"><thead><tr><th scope="col">' + esc(t('f.col.mat')) + '</th><th scope="col" class="c-grade">' + esc(t('f.col.grade')) + '</th><th scope="col" class="c-act"><span class="sr-file">' + esc(t('f.col.del')) + '</span></th></tr></thead><tbody>' + admRows + '</tbody></table></div>' : '<p class="fnote">' + esc(t('f.adm.none')) + '</p>') +
      (d.adm.length < MAX_ADM ? '<div class="brow"><button type="button" class="btn small" data-act="add-a">' + esc(t('f.adm.add')) + '</button></div>' : ''));
    h += fsec('fs-unis', t('f.unis'),
      '<p class="fnote">' + esc(t(HAS_DB ? 'f.unis.note' : 'f.unis.note.nodb')) + '</p>' +
      d.unis.map(function(u, i){ return uniBlock(d, u, i); }).join(''));
    h += fsec('fs-datos', t('f.datos'),
      '<p class="fnote">' + esc(t('f.datos.note', {dl: TOP ? t('f.datos.dl') : ''})) + '</p>' +
      '<div class="brow"><button type="button" class="btn small primary" data-act="share-link">' + esc(t('f.sharelink')) + '</button><button type="button" class="btn small" data-act="copy">' + esc(t('f.copy')) + '</button>' +
      (TOP ? '<button type="button" class="btn small" data-act="download">' + esc(t('f.download')) + '</button>' : '') +
      '<label class="btn small">' + esc(t('f.importfile')) + '<input type="file" accept=".json,application/json" class="sr-file" id="f-file"></label></div>' +
      field(t('f.paste'), '<textarea class="in" id="f-paste" rows="3" spellcheck="false"></textarea>') +
      '<div class="brow"><button type="button" class="btn small" data-act="import-text">' + esc(t('f.importtext')) + '</button></div>' +
      '<div class="brow"><button type="button" class="btn small" data-act="example">' + esc(t('f.example')) + '</button><button type="button" class="btn small danger" data-act="blank">' + esc(t('f.blank')) + '</button></div>' +
      '<p class="fstatus" id="f-status" role="status"></p>');
    body.innerHTML = h;
    var fi = $('f-file');
    if (fi) fi.addEventListener('change', onFile);
    US.runAll();
    Wizard.apply();
  }

  function rerender(){
    var st = body.scrollTop;
    setTimeout(function(){
      var ae = document.activeElement;
      var act = ae && ae.id;
      var caret = (ae && typeof ae.selectionStart === 'number') ? ae.selectionStart : null;
      renderForm();
      body.scrollTop = st;
      if (act){
        var el = $(act);
        if (el){
          el.focus({preventScroll:true});
          if (caret !== null && typeof el.setSelectionRange === 'function'){ try { el.setSelectionRange(caret, caret); } catch (e) {} }
        }
      }
    }, 0);
  }
  function status(msg, err){
    var s = $('f-status');
    if (!s) return;
    s.textContent = msg;
    s.className = 'fstatus' + (err ? ' err' : '');
  }
  function setNum(el, min, max, apply, intOnly){
    var n = parseNum(el.value);
    if ((n !== null && isNaN(n)) || (n !== null && (n < min || n > max)) || (n !== null && intOnly && Math.round(n) !== n)){
      el.classList.add('bad'); el.setAttribute('aria-invalid', 'true');
      return false;
    }
    el.classList.remove('bad'); el.removeAttribute('aria-invalid');
    apply(n);
    return true;
  }
  function findIn(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  function onField(e){
    var el = e.target;
    var k = el.getAttribute && el.getAttribute('data-k');
    if (!k || !draft) return;
    var p = k.split(':');
    draft.example = false;
    $('cfg-msg').textContent = '';
    switch (p[0]){
      case 'student': draft.student = el.value.slice(0, 60); break;
      case 'mod':
        if (e.type !== 'change') return;
        var oldEsp = modOf(draft.mod).esp;
        draft.mod = modOf(el.value).k;
        if (!draft.esp || draft.esp === oldEsp) draft.esp = modOf(draft.mod).esp;
        rerender();
        break;
      case 'coo':
        if (e.type !== 'change') return;
        draft.coo = el.checked;
        rerender();
        break;
      case 'cooName':
        draft.cooName = el.value.slice(0, 30);
        if (e.type === 'change') rerender();
        break;
      case 'his':
        if (e.type !== 'change') return;
        draft.his = el.value === 'fil' ? 'fil' : 'esp';
        rerender();
        break;
      case 'lex': case 'esp':
        draft[p[0]] = el.value.slice(0, p[0] === 'lex' ? 30 : 60);
        if (e.type === 'change') rerender();
        break;
      case 'bname':
        var rb = findIn(draft[p[1]] || [], p[2]);
        if (rb) rb.name = el.value.slice(0, 60);
        break;
      case 'bgrade':
        var rg = findIn(draft[p[1]] || [], p[2]);
        if (rg) setNum(el, 0, 10, function(n){ rg.grade = n; }, true);
        break;
      case 'xgrade':
        var xa = draft.acc[p[1]];
        if (xa) setNum(el, 0, 10, function(n){ xa.grade = n; });
        break;
      case 'xpond':
        if (e.type !== 'change') return;
        if (draft.acc[p[1]]) draft.acc[p[1]].pond = el.checked;
        rerender();
        break;
      case 'aname':
        var an = findIn(draft.adm, p[1]);
        if (an) an.name = el.value.slice(0, 60);
        if (e.type === 'change') rerender();
        break;
      case 'agrade':
        var ag = findIn(draft.adm, p[1]);
        if (ag) setNum(el, 0, 10, function(n){ ag.grade = n; });
        break;
      case 'umode':
        if (e.type !== 'change' || !el.checked) return;
        var um = draft.unis[+p[1]];
        if (!um) return;
        if (um.mode !== el.value){
          if (el.value === 'list'){ um.mode = 'list'; clearRow(um); um.deg = ''; delete um._q; }
          else { um.mode = 'manual'; um.cutRef = null; um.row = ''; um.detail = ''; }
        }
        rerenderUni(+p[1]);
        break;
      case 'uni':
        var u = draft.unis[+p[1]];
        if (!u) return;
        if (p[2] === 'cut') setNum(el, 0, 14, function(n){ u.cut = n; });
        else u[p[2]] = el.value.slice(0, p[2] === 'degree' ? 160 : 100);
        break;
      case 'w':
        if (e.type !== 'change') return;
        var uu = draft.unis[+p[1]];
        if (uu) uu.w[p[2]] = parseFloat(el.value);
        break;
    }
  }
  body.addEventListener('input', onField);
  body.addEventListener('change', onField);

  function exportText(){
    return JSON.stringify({app:'simulador-pau-espana', v:1, config:normalize(draft || state.config), sim:state.sim}, null, 1);
  }
  function applyImport(text){
    var raw;
    try { raw = JSON.parse(text); } catch (e) { status(t('st.readerr'), true); return; }
    var cfg = raw && raw.config ? raw.config : raw;
    if (!cfg || typeof cfg !== 'object' || (!cfg.b1 && !cfg.acc && !cfg.unis)){ status(t('st.nodata'), true); return; }
    draft = normalize(cfg);
    importSim = raw && raw.sim ? numMap(raw.sim) : null;
    renderForm();
    status(t('st.imported'));
    $('fs-datos').scrollIntoView({block:'start'});
  }
  function onFile(e){
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function(){ applyImport(String(rd.result || '')); };
    rd.onerror = function(){ status(t('st.fileerr'), true); };
    rd.readAsText(f);
  }

  function markBad(el){ if (el){ el.classList.add('bad'); el.setAttribute('aria-invalid', 'true'); } return el; }
  function validate(){
    var bad = body.querySelector('.in.bad');
    if (bad) return {el:bad, msg:t('v.bad')};
    if (!draft.b1.length && !draft.b2.length) return {el:$('fs-bach'), msg:t('v.nobach')};
    for (var i = 0; i < draft.unis.length; i++){
      var u = draft.unis[i];
      if (u.mode === 'list'){
        if (u.row && !isNum(u.cut)) return {el:markBad($('f-uni-' + i + '-cut')), msg:t('v.nocut', {n:i + 1})};
      } else if ((u.name || u.degree) && !isNum(u.cut)) return {el:markBad($('f-uni-' + i + '-cut')), msg:t('v.nocut', {n:i + 1})};
    }
    return null;
  }

  dlg.addEventListener('click', function(e){
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var act = b.getAttribute('data-act');
    var bi = +b.getAttribute('data-i');
    switch (act){
      case 'nav':
        var tg = $(b.getAttribute('data-target'));
        if (tg) tg.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
        break;
      case 'cancel':
        draft = null; importSim = null;
        Wizard.stop();
        dlg.close();
        break;
      case 'save':
        var v = validate();
        if (v){ $('cfg-msg').textContent = v.msg; if (v.el){ v.el.scrollIntoView({block:'center'}); if (v.el.focus) v.el.focus({preventScroll:true}); } return; }
        state.config = normalize(draft);
        state.scen = {};
        if (importSim) state.sim = importSim;
        draft = null; importSim = null;
        Wizard.stop();
        dlg.close();
        buildMain(); persistNow();
        window.scrollTo(0, 0);
        break;
      case 'change-row':
        if (draft.unis[bi]){
          draft.unis[bi]._edit = true;
          draft.unis[bi]._q = draft.unis[bi].deg || '';
          rerenderUni(bi);
          var R = US.refs(bi);
          if (R.inp){ R.inp.focus(); try { R.inp.select(); } catch (er) {} }
        }
        break;
      case 'keep-row':
        if (draft.unis[bi]){ delete draft.unis[bi]._edit; delete draft.unis[bi]._q; rerenderUni(bi); }
        break;
      case 'add-b':
        draft.example = false;
        var l = b.getAttribute('data-l');
        if (draft[l] && draft[l].length < MAX_BACH) draft[l].push({id:uid(), name:'', grade:null});
        rerender();
        break;
      case 'del-b':
        draft.example = false;
        var dl = b.getAttribute('data-l'), did = b.getAttribute('data-id');
        if (draft[dl]) draft[dl] = draft[dl].filter(function(r){ return r.id !== did; });
        rerender();
        break;
      case 'fill-b':
        draft.example = false;
        var tpl = templateBach(draft);
        /* Conserva la nota de las materias que se llaman igual */
        ['b1', 'b2'].forEach(function(l2){
          tpl[l2].forEach(function(r){
            var old = draft[l2].filter(function(o){ return o.name.trim().toLowerCase() === r.name.toLowerCase(); })[0];
            if (old){ r.grade = old.grade; r.id = old.id; }
          });
          draft[l2] = tpl[l2];
        });
        rerender();
        break;
      case 'add-a':
        draft.example = false;
        if (draft.adm.length < MAX_ADM) draft.adm.push({id:uid(), name:'', grade:null});
        rerender();
        break;
      case 'del-a':
        draft.example = false;
        var aid = b.getAttribute('data-id');
        draft.adm = draft.adm.filter(function(a){ return a.id !== aid; });
        rerender();
        break;
      case 'clear-uni':
        draft.example = false;
        if (draft.unis[bi]) draft.unis[bi] = blankUni();
        rerenderUni(bi);
        break;
      case 'share-link':
        Site.share('pau', {config:normalize(draft), sim:state.sim});
        break;
      case 'copy':
        var txt = exportText();
        var fallback = function(){
          var ta = $('f-paste');
          ta.value = txt; ta.focus(); ta.select();
          status(t('st.copyfail'), true);
        };
        try {
          navigator.clipboard.writeText(txt).then(function(){ status(t('st.copied')); }, fallback);
        } catch (err) { fallback(); }
        break;
      case 'download':
        var blob = new Blob([exportText()], {type:'application/json'});
        var a = document.createElement('a');
        var nm = ((draft && draft.student) || 'datos').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'datos';
        a.href = URL.createObjectURL(blob);
        a.download = 'simulador-pau-' + nm + '.json';
        document.body.appendChild(a); a.click();
        setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        status(t('st.downloaded'));
        break;
      case 'import-text':
        applyImport($('f-paste').value);
        break;
      case 'example':
        draft = exampleConfig(); importSim = null;
        renderForm();
        status(t('st.example'));
        $('fs-datos').scrollIntoView({block:'start'});
        break;
      case 'blank':
        draft = blankConfig(); importSim = null;
        renderForm();
        body.scrollTop = 0;
        status('');
        break;
    }
  });
  /* Esc cierra sin guardar, igual que «Cancelar» */
  dlg.addEventListener('cancel', function(){ draft = null; importSim = null; Wizard.stop(); });

  /* Primera visita: asistente en cuatro pasos, desde una configuración en blanco */
  var WIZ_KEY = 'simulador-pau-wizard-visto';
  Wizard.setup(dlg, body, [
    {t:'wiz.p1.t', d:'wiz.p1.d', secs:['fs-alumno']},
    {t:'wiz.p2.t', d:'wiz.p2.d', secs:['fs-bach']},
    {t:'wiz.p3.t', d:'wiz.p3.d', secs:['fs-acc', 'fs-adm']},
    {t:'wiz.p4.t', d:'wiz.p4.d', secs:['fs-unis']}
  ]);
  function startWizard(){
    try { localStorage.setItem(WIZ_KEY, '1'); } catch (e) {}
    draft = blankConfig(); importSim = null;
    openCfg();
    Wizard.start();
  }
  dlg.addEventListener('close', function(){ document.documentElement.classList.remove('lock'); });

  function openCfg(section){
    if (!draft) draft = clone(state.config);
    renderForm();
    $('cfg-msg').textContent = '';
    document.documentElement.classList.add('lock');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    body.scrollTop = 0;
    if (section){ var s = $(section); if (s) s.scrollIntoView({block:'start'}); }
  }

  Site.applyStatic();
  load();
  buildSources();
  buildMain();
  var sharedOpen = /(?:^|[#&])d=/.test(location.hash);
  Site.readShared('pau', !firstVisit, function(data){
    state.config = normalize(data.config);
    state.sim = numMap(data.sim);
    state.scen = {}; state.scenOn = false;
    buildMain(); persistNow();
  });
  var wizSeen = false;
  try { wizSeen = !!localStorage.getItem(WIZ_KEY); } catch (e) {}
  if (firstVisit && !wizSeen && !sharedOpen) startWizard();
})();
