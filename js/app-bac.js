(function(){
  'use strict';
  var C = BacCalc, isNum = C.isNum, t = I18N.t;
  var KEY = 'simulador-bac-espana-v1';
  var TOP = (function(){ try { return window.self === window.top; } catch (e) { return false; } })();

  /* Asignaturas españolas que pueden salir del Bac (claves del listado de ponderaciones) */
  var SUBJ = ['bio', 'qui', 'fis', 'mat', 'mcs', 'emp', 'len', 'tec'].map(function(k){ return {k:k}; });
  var SUBJ_BY = {};
  SUBJ.forEach(function(s){ SUBJ_BY[s.k] = s; });
  /* Nombre oficial español: sirve para reconocer asignaturas importadas escritas a mano */
  var SUBJ_ES = {bio:'Biología', qui:'Química', fis:'Física', mat:'Matemáticas II', mcs:'Matemáticas Aplicadas a las Ciencias Sociales II', emp:'Empresa y Diseño de Modelos de Negocio', len:'Lengua Extranjera II (Inglés)', tec:'Tecnología e Ingeniería II'};
  function subjN(k){ return t('subj.' + k); }

  var SPECS = [
    {k:'svt', short:'SVT', name:'SVT · Sciences de la vie et de la Terre', es:'bio'},
    {k:'pc', short:'Physique-chimie', name:'Physique-chimie', es:'qui'},
    {k:'maths', short:'Mathématiques', name:'Mathématiques', es:'mat'},
    {k:'ses', short:'SES', name:'SES · Sciences économiques et sociales'},
    {k:'hggsp', short:'HGGSP', name:'HGGSP · Histoire-géographie, géopolitique et sciences politiques'},
    {k:'hlp', short:'HLP', name:'HLP · Humanités, littérature et philosophie'},
    {k:'llcer', short:'LLCER', name:'LLCER · Langues, littératures et cultures étrangères et régionales'},
    {k:'nsi', short:'NSI', name:'NSI · Numérique et sciences informatiques'},
    {k:'si', short:'Sciences de l’ingénieur', name:'Sciences de l’ingénieur'},
    {k:'bioeco', short:'Biologie-écologie', name:'Biologie-écologie'},
    {k:'llca', short:'LLCA', name:'LLCA · Littérature, langues et cultures de l’Antiquité'},
    {k:'arts', short:'Arts', name:'Arts'},
    {k:'eppcs', short:'EPPCS', name:'EPPCS · Éducation physique, pratiques et culture sportives'}
  ];
  /* lab y hint son claves de i18n */
  var BASE = [
    {id:'fre', ph:'p1x', coef:5, lab:'b.fre'},
    {id:'fro', ph:'p1x', coef:5, lab:'b.fro'},
    {id:'mta', ph:'p1x', coef:2, lab:'b.mta'},
    {id:'hg1', ph:'p1c', coef:3, lab:'b.hg'},
    {id:'es1', ph:'p1c', coef:3, lab:'b.es'},
    {id:'la1', ph:'p1c', coef:3, lab:'b.lva'},
    {id:'lb1', ph:'p1c', coef:3, lab:'b.lvb'},
    {id:'em1', ph:'p1c', coef:1, lab:'b.emc'},
    {id:'spd', ph:'p1c', coef:8, lab:'b.spd'},
    {id:'sp1', ph:'t2x', coef:16, lab:'b.spec', hint:'h.spe'},
    {id:'sp2', ph:'t2x', coef:16, lab:'b.spec', hint:'h.spe'},
    {id:'phi', ph:'t2x', coef:8, lab:'b.phi', hint:'h.phi'},
    {id:'gor', ph:'t2x', coef:8, lab:'b.gor', hint:'h.gor'},
    {id:'hg2', ph:'t2c', coef:3, lab:'b.hg', from:'hg1'},
    {id:'es2', ph:'t2c', coef:3, lab:'b.es', from:'es1'},
    {id:'la2', ph:'t2c', coef:3, lab:'b.lva', from:'la1'},
    {id:'lb2', ph:'t2c', coef:3, lab:'b.lvb', from:'lb1'},
    {id:'em2', ph:'t2c', coef:1, lab:'b.emc', from:'em1'},
    {id:'eps', ph:'t2c', coef:6, lab:'b.eps', hint:'h.eps'},
    /* Baccalauréat français international (BFI): evaluaciones específicas de Terminale */
    {id:'cdm', ph:'t2b', coef:20, lab:'b.cdm', bfi:true, hint:'h.cdm'},
    {id:'acle', ph:'t2b', coef:10, lab:'b.acl', bfi:true, hint:'h.acl'},
    {id:'aclo', ph:'t2b', coef:10, lab:'b.acl', bfi:true, hint:'h.acl'},
    {id:'dnle', ph:'t2b', coef:10, lab:'b.dnl', bfi:true, hint:'h.dnl'},
    {id:'dnlo', ph:'t2b', coef:10, lab:'b.dnl', bfi:true, hint:'h.dnl'},
    {id:'dnl2', ph:'t2b', coef:20, lab:'b.dnl2', bfi:true, hint:'h.dnl2'}
  ];
  var BASE_BY = {};
  BASE.forEach(function(b){ BASE_BY[b.id] = b; });
  var PHASES = ['p1x', 'p1c', 't2x', 't2c', 't2b', 'opt'];
  function phT(k){ return t('ph.' + k); }
  var WEIGHTS = [0, 0.1, 0.2];

  /* Pruebas que cuentan según el tipo de Bac. En el BFI, el ACL sustituye a una de las lenguas (LVA o LVB),
     la DNL1 sustituye a historia-geografía o a enseignement scientifique, y la DNL2 es opcional. */
  function isBfi(cfg){ return cfg.bac === 'bfi'; }
  function activeBase(cfg){
    if (!isBfi(cfg)) return BASE.filter(function(b){ return !b.bfi; });
    var drop = {};
    if (cfg.bfiAcl === 'lb'){ drop.lb1 = drop.lb2 = true; } else { drop.la1 = drop.la2 = true; }
    if (cfg.bfiDnl === 'es'){ drop.es1 = drop.es2 = true; } else { drop.hg1 = drop.hg2 = true; }
    if (!cfg.bfiDnl2) drop.dnl2 = true;
    return BASE.filter(function(b){ return !drop[b.id]; });
  }
  function baseTotal(cfg){ return activeBase(cfg).reduce(function(a, b){ return a + (isNum(cfg.coefs[b.id]) ? cfg.coefs[b.id] : b.coef); }, 0); }

  /* Utilidades */
  var $ = function(id){ return document.getElementById(id); };
  function uid(){ return Math.random().toString(36).slice(2, 8); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function fmt(x, d){ return Number(x).toLocaleString(I18N.locale(), {minimumFractionDigits:d, maximumFractionDigits:d}); }
  function signed(x){ return (x >= 0 ? '+' : '−') + fmt(Math.abs(x), 3); }
  function clamp20(x){ return Math.min(20, Math.max(0, Math.round(x * 10) / 10)); }
  function showNum(x){ return isNum(x) ? String(Math.round(x * 1000) / 1000).replace('.', ',') : ''; }
  function fmtCoef(c){ return String(Math.round(c * 100) / 100).replace('.', ','); }
  function parseNum(s){
    if (s == null) return null;
    s = String(s).trim().replace(',', '.');
    if (s === '') return null;
    if (!/^\d+(\.\d+)?$/.test(s) && !/^\.\d+$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function str(x, n){ return typeof x === 'string' ? x.slice(0, n) : ''; }
  function g20(x){ return (isNum(x) && x >= 0 && x <= 20) ? x : null; }
  function specOf(k){ for (var i = 0; i < SPECS.length; i++) if (SPECS[i].k === k) return SPECS[i]; return null; }
  function specShort(k){ var s = specOf(k); return s ? s.short : t('b.spec'); }
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function normKey(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function subjName(s){ return s.key && SUBJ_BY[s.key] ? subjN(s.key) : (s.name || t('subj.generic')); }
  function cleanW(o, keys){
    var w = {};
    if (o && typeof o === 'object') Object.keys(o).forEach(function(k){
      if (keys && !keys[k]) return;
      var x = o[k];
      if (isNum(x) && x >= 0 && x <= 1) w[k] = x;
    });
    return w;
  }

  /* Listado de universidades (js/data-bac.js) y buscador común (js/unisearch.js) */
  var US = UniSearch(window.UNIDB);
  var DB = US.DB, ROW_BY = US.ROW_BY, HAS_DB = US.HAS_DB;
  var placeParts = US.placeParts, cutText = US.cutText, detailOf = US.detailOf;
  function cutLabelOf(u){ return u.mode === 'list' ? US.cutLabel(ROW_BY[u.row]) : ''; }

  function labelOf(b, cfg){
    switch (b.id){
      case 'la1': case 'la2': return t('b.lva') + (cfg.lva ? ' · ' + cfg.lva : '');
      case 'lb1': case 'lb2': return t('b.lvb') + (cfg.lvb ? ' · ' + cfg.lvb : '');
      case 'spd': return t('b.spd', {s:specShort(cfg.spd)});
      case 'sp1': return specShort(cfg.sp1);
      case 'sp2': return specShort(cfg.sp2);
      case 'cdm': return t('b.cdm') + (cfg.lva ? ' · ' + cfg.lva : '');
      case 'acle': case 'aclo':
        var la = cfg.bfiAcl === 'lb' ? cfg.lvb : cfg.lva;
        return t('b.acl', {kind: t(b.id === 'acle' ? 'b.written' : 'b.oral')}) + (la ? ' · ' + la : '');
      case 'dnle': case 'dnlo':
        return t('b.dnl', {s: t(cfg.bfiDnl === 'es' ? 'b.es' : 'b.hg'), kind: t(b.id === 'dnle' ? 'b.written' : 'b.oral')});
      default: return t(b.lab);
    }
  }
  function suggestFor(slot, specKey){
    var s = specOf(specKey);
    return (s && s.es) ? {id:uid(), key:s.es, name:'', src:slot, auto:true} : null;
  }
  function suggestions(cfg){
    var out = [];
    ['sp1', 'sp2'].forEach(function(slot){ var s = suggestFor(slot, cfg[slot]); if (s) out.push(s); });
    return out;
  }

  /* Universidades de la configuración */
  function blankUni(){ return {mode: HAS_DB ? 'list' : 'manual', row:'', deg:'', name:'', degree:'', detail:'', wy:'', cut:null, cutRef:null, wl:null, w:{}}; }
  function clearRow(u){ u.row = ''; u.name = ''; u.degree = ''; u.detail = ''; u.wy = ''; u.cut = null; u.cutRef = null; u.wl = null; }
  function applyRow(u, r){
    u.mode = 'list'; u.row = r.key; u.deg = r.degree;
    u.name = r.u.name; u.degree = r.degree; u.detail = detailOf(r); u.wy = r.u.wy || '';
    u.cut = r.cut; u.cutRef = r.cut; u.wl = null;
  }
  function exampleUni(code, degree, fb){
    var u = blankUni(), r = US.findRow(code, degree);
    if (r){ applyRow(u, r); return u; }
    u.mode = 'manual'; u.name = fb.name; u.degree = degree; u.cut = fb.cut; u.w = {bio:0.2, qui:0.2};
    return u;
  }

  /* Configuraciones de partida */
  function exampleConfig(){
    return {
      example:true, student:'', bac:'gen', bfiAcl:'la', bfiDnl:'hg', bfiDnl2:false, lva:t('ex.lva'), lvb:t('ex.lvb'), sp1:'svt', sp2:'pc', spd:'maths',
      grades:{fre:14, fro:17, mta:17.5, hg1:17.4, es1:18.2, la1:18.6, lb1:18.9, em1:17.8, spd:17.9},
      coefs:{},
      options:[{id:'lat', name:t('f.opc.example'), coefP:2, gradeP:18.2, coefT:2, gradeT:null}],
      subjects:[{id:'bio', key:'bio', name:'', src:'sp1', auto:true}, {id:'qui', key:'qui', name:'', src:'sp2', auto:true}],
      unis:[
        exampleUni('UV', 'Medicina', {name:'Universitat de València', cut:13.171}),
        exampleUni('UAM', 'Medicina', {name:'Universidad Autónoma de Madrid', cut:12.950}),
        exampleUni('UPV', 'Ingeniería Biomédica', {name:'Universitat Politècnica de València', cut:12.498})
      ]
    };
  }
  function blankConfig(){
    var c = {example:false, student:'', bac:'gen', bfiAcl:'la', bfiDnl:'hg', bfiDnl2:false, lva:'', lvb:'', sp1:'svt', sp2:'pc', spd:'maths', grades:{}, coefs:{}, options:[], subjects:[], unis:[]};
    c.subjects = suggestions(c);
    for (var i = 0; i < 3; i++) c.unis.push(blankUni());
    return c;
  }
  function normalize(raw){
    var d = blankConfig();
    if (!raw || typeof raw !== 'object') return d;
    var specOk = function(k, def){ return specOf(k) ? k : def; };
    var idOk = function(x){ return (typeof x === 'string' && /^[a-z0-9]{1,12}$/i.test(x)) ? x : uid(); };
    var coefOk = function(x, def){ return (isNum(x) && x >= 0 && x <= 50) ? x : def; };
    var c = {
      example: !!raw.example,
      student: str(raw.student, 60), lva: str(raw.lva, 30), lvb: str(raw.lvb, 30),
      bac: raw.bac === 'bfi' ? 'bfi' : 'gen', bfiAcl: raw.bfiAcl === 'lb' ? 'lb' : 'la', bfiDnl: raw.bfiDnl === 'es' ? 'es' : 'hg', bfiDnl2: !!raw.bfiDnl2,
      sp1: specOk(raw.sp1, d.sp1), sp2: specOk(raw.sp2, d.sp2), spd: specOk(raw.spd, d.spd),
      grades:{}, coefs:{}, options:[], subjects:[], unis:[]
    };
    BASE.forEach(function(b){
      var g = raw.grades ? g20(raw.grades[b.id]) : null;
      if (g !== null) c.grades[b.id] = g;
      var k = raw.coefs ? raw.coefs[b.id] : null;
      if (isNum(k) && k >= 0 && k <= 50 && k !== b.coef) c.coefs[b.id] = k;
    });
    (Array.isArray(raw.options) ? raw.options : []).slice(0, 6).forEach(function(o){
      if (!o || typeof o !== 'object') return;
      c.options.push({id:idOk(o.id), name:str(o.name, 40), coefP:coefOk(o.coefP, 2), gradeP:g20(o.gradeP), coefT:coefOk(o.coefT, 2), gradeT:g20(o.gradeT)});
    });
    var subs = Array.isArray(raw.subjects) ? raw.subjects : d.subjects;
    subs.slice(0, 8).forEach(function(s){
      if (!s || typeof s !== 'object') return;
      var key = SUBJ_BY[s.key] ? s.key : '';
      if (!key && s.name){
        var nk = normKey(s.name);
        SUBJ.forEach(function(x){
          [SUBJ_ES[x.k], subjN(x.k)].forEach(function(n){
            var nn = normKey(n);
            if (nn === nk || nn.indexOf(nk) === 0 && nk.length > 5) key = key || x.k;
          });
        });
      }
      c.subjects.push({id:idOk(s.id), key:key, name: key ? '' : str(s.name, 60), src:str(s.src, 20), auto:!!s.auto});
    });
    var keySet = {};
    SUBJ.forEach(function(s){ keySet[s.k] = true; });
    for (var i = 0; i < 3; i++){
      var u = (Array.isArray(raw.unis) && raw.unis[i] && typeof raw.unis[i] === 'object') ? raw.unis[i] : {};
      var mode = u.mode === 'list' || u.mode === 'manual' ? u.mode : ((u.name || isNum(u.cut)) ? 'manual' : (HAS_DB ? 'list' : 'manual'));
      if (mode === 'list' && !HAS_DB && !u.row) mode = 'manual';
      var w = {}, cw = cleanW(u.w);
      Object.keys(cw).forEach(function(k){ w[k] = Math.min(0.2, Math.round(cw[k] * 10) / 10); });
      c.unis.push({
        mode: mode, row: str(u.row, 300), deg: str(u.deg, 160),
        name: str(u.name, 100), degree: str(u.degree, 160), detail: str(u.detail, 200), wy: str(u.wy, 20),
        cut: (isNum(u.cut) && u.cut >= 0 && u.cut <= 14) ? u.cut : null,
        cutRef: (isNum(u.cutRef) && u.cutRef >= 0 && u.cutRef <= 14) ? u.cutRef : null,
        wl: (u.wl && typeof u.wl === 'object') ? cleanW(u.wl, keySet) : null,
        w: w
      });
    }
    return c;
  }

  /* Estado */
  var state = {config:null, sim:{}, scen:{}, scenOn:false};
  function numMap(o){
    var out = {};
    if (o && typeof o === 'object') Object.keys(o).forEach(function(k){ if (isNum(o[k])) out[k] = clamp20(o[k]); });
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
    try { localStorage.setItem(KEY, JSON.stringify({v:2, config:state.config, sim:state.sim, scen:state.scen, scenOn:state.scenOn})); } catch (e) {}
  }
  /* Al mover un slider se guarda como mucho cada 300 ms */
  function persist(){
    if (persistTimer) return;
    persistTimer = setTimeout(function(){ persistTimer = null; persistNow(); }, 300);
  }
  window.addEventListener('pagehide', function(){ if (persistTimer){ clearTimeout(persistTimer); persistTimer = null; persistNow(); } });

  /* Modelo a partir de la configuración */
  function srcSpec(cfg, src){ return src === 'sp1' ? cfg.sp1 : src === 'sp2' ? cfg.sp2 : src === 'spd' ? cfg.spd : null; }
  /* La ponderación la indica siempre el usuario; por defecto, 0,2 */
  /* Ponderación: la que elija el usuario; si no, la precargada del grado (js/weights.js); si no, 0,2 */
  function uniWeight(u, s){
    if (isNum(u.w[s.id])) return u.w[s.id];
    if (u.mode === 'list'){
      var pw = US.prefillWeight(ROW_BY[u.row], s.key === 'len' ? 'len1' : s.key);
      if (pw !== null) return pw;
    }
    return 0.2;
  }
  function buildModel(cfg){
    var items = [];
    activeBase(cfg).forEach(function(b){
      var coef = isNum(cfg.coefs[b.id]) ? cfg.coefs[b.id] : b.coef;
      if (coef <= 0) return;
      items.push({id:b.id, ph:b.ph, from:b.from || null, hint:b.hint ? t(b.hint) : '', coef:coef, label:labelOf(b, cfg), grade: isNum(cfg.grades[b.id]) ? cfg.grades[b.id] : null});
    });
    cfg.options.forEach(function(o, i){
      var nm = o.name || t('opt.n', {n:i + 1});
      if (o.coefP > 0) items.push({id:'o' + o.id + 'p', ph:'opt', from:null, hint:'', coef:o.coefP, label:nm + ' · Première', grade: isNum(o.gradeP) ? o.gradeP : null});
      if (o.coefT > 0) items.push({id:'o' + o.id + 't', ph:'opt', from: o.coefP > 0 ? 'o' + o.id + 'p' : null, hint:'', coef:o.coefT, label:nm + ' · Terminale', grade: isNum(o.gradeT) ? o.gradeT : null});
    });
    var byId = {};
    items.forEach(function(it){ byId[it.id] = it; });
    var subjects = cfg.subjects.filter(function(s){ return byId[s.src]; }).map(function(s){
      return {id:s.id, key:s.key, name:subjName(s), src:s.src, srcLabel:byId[s.src].label, svt: srcSpec(cfg, s.src) === 'svt'};
    });
    var unis = [];
    cfg.unis.forEach(function(u, i){
      if (!isNum(u.cut)) return;
      if (u.mode === 'list' && !u.row) return;
      var w = {};
      subjects.forEach(function(s){ w[s.id] = uniWeight(u, s); });
      var rr = u.mode === 'list' ? ROW_BY[u.row] : null;
      unis.push({idx:i, list: u.mode === 'list', name:u.name || t('uni.fallback', {n:i + 1}), degree:u.degree, detail: rr ? detailOf(rr) : (u.mode === 'list' ? u.detail : ''), cut:u.cut, cutRef: u.mode === 'list' ? u.cutRef : null, cutLbl: cutLabelOf(u), w:w});
    });
    var esIds = (isBfi(cfg) && cfg.bfiDnl === 'es') ? ['dnle', 'dnlo'] : ['es1', 'es2'];
    return {items:items, byId:byId, subjects:subjects, unis:unis, esIds:esIds, bfi:isBfi(cfg)};
  }
  function avgKnown(model){
    var p = 0, tt = 0;
    model.items.forEach(function(it){ if (it.grade !== null){ p += it.grade * it.coef; tt += it.coef; } });
    return tt ? Math.round(p / tt * 2) / 2 : 15;
  }
  function guess(it, model, avg){
    var f = it.from && model.byId[it.from];
    if (f && f.grade !== null) return clamp20(f.grade);
    return clamp20(avg);
  }
  function syncState(model){
    var avg = avgKnown(model), sim = {}, scen = {};
    model.items.forEach(function(it){
      if (it.grade === null) sim[it.id] = isNum(state.sim[it.id]) ? clamp20(state.sim[it.id]) : guess(it, model, avg);
      else scen[it.id] = isNum(state.scen[it.id]) ? clamp20(state.scen[it.id]) : it.grade;
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

  Site.onLang(function(){ buildSources(); buildMain(); });

  /* Vista principal */
  var M = null, refs = {}, uniRefs = [];

  function sliderEl(it, mode){
    var d = document.createElement('div');
    d.className = 'sl';
    var rid = 'r-' + mode + '-' + it.id;
    var hint = '';
    if (mode === 'pending'){
      var f = it.from && M.byId[it.from];
      hint = (f && f.grade !== null) ? 'Première: ' + fmt(f.grade, 2) : it.hint;
    }
    var mark = mode === 'scen' ? '<span class="real-mark" style="left:calc(8px + (100% - 16px) * ' + (it.grade / 20) + ')" aria-hidden="true"></span>' : '';
    d.innerHTML =
      '<div class="sl-top"><label for="' + rid + '">' + esc(it.label) + '</label><span class="coef">' + t('coef') + ' ' + fmtCoef(it.coef) + '</span><output for="' + rid + '"></output></div>' +
      '<div class="sl-ctl"><button type="button" class="step" data-d="-0.1" aria-label="' + esc(t('sl.down', {x:it.label})) + '">−</button>' +
      '<div class="track"><input type="range" id="' + rid + '" min="0" max="20" step="0.1">' + mark + '</div>' +
      '<button type="button" class="step" data-d="0.1" aria-label="' + esc(t('sl.up', {x:it.label})) + '">+</button></div>' +
      '<div class="sl-hint"><span class="hint-txt">' + esc(hint) + '</span><span class="sens"></span></div>';
    var range = d.querySelector('input');
    var store = function(){ return mode === 'pending' ? state.sim : state.scen; };
    range.value = store()[it.id];
    range.addEventListener('input', function(){ store()[it.id] = clamp20(parseFloat(range.value)); schedule(); persist(); });
    d.querySelectorAll('.step').forEach(function(b){
      b.addEventListener('click', function(){
        var s = store();
        s[it.id] = clamp20(s[it.id] + parseFloat(b.getAttribute('data-d')));
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
      var its = list.filter(function(it){ return it.ph === ph; });
      if (!its.length) return;
      var coefSum = its.reduce(function(a, it){ return a + it.coef; }, 0);
      var sec = document.createElement('section');
      sec.className = 'panel group';
      sec.innerHTML = '<div class="group-head"><h3>' + esc(phT(ph)) + '</h3><span class="num">' + fmtCoef(coefSum) + ' ' + t('coef') + '</span></div><div class="sliders"></div>';
      var box = sec.querySelector('.sliders');
      its.forEach(function(it){ box.appendChild(sliderEl(it, mode)); });
      container.appendChild(sec);
    });
  }

  function buildPending(){
    var list = M.items.filter(function(it){ return it.grade === null; });
    var tot = M.items.reduce(function(a, it){ return a + it.coef; }, 0);
    var pc = list.reduce(function(a, it){ return a + it.coef; }, 0);
    var box = $('pending-groups');
    if (!list.length){
      $('pending-sub').textContent = t('pending.done');
      box.innerHTML = '';
      $('pending-actions').hidden = true;
      return;
    }
    $('pending-sub').textContent = t('pending.sub', {pc:fmtCoef(pc), tot:fmtCoef(tot)});
    $('pending-actions').hidden = false;
    groupPanels(box, list, 'pending');
  }

  function buildKnown(){
    Object.keys(refs).forEach(function(k){ if (refs[k].mode === 'scen') delete refs[k]; });
    var list = M.items.filter(function(it){ return it.grade !== null; });
    var box = $('known-groups');
    var tot = M.items.reduce(function(a, it){ return a + it.coef; }, 0);
    var kc = list.reduce(function(a, it){ return a + it.coef; }, 0);
    $('scen-switch').hidden = !list.length;
    $('scen-toggle').checked = state.scenOn;
    if (!list.length){
      $('known-sub').textContent = t('known.none');
      box.innerHTML = '';
      $('known-actions').hidden = true;
      return;
    }
    if (state.scenOn){
      $('known-sub').innerHTML = esc(t('known.scen', {kc:fmtCoef(kc), tot:fmtCoef(tot), mark:'\u0001'})).replace('\u0001', '<span class="mark-legend" aria-hidden="true"></span>');
      $('known-actions').hidden = false;
      groupPanels(box, list, 'scen');
      return;
    }
    var avg = list.reduce(function(a, it){ return a + it.grade * it.coef; }, 0) / kc;
    $('known-sub').textContent = t('known.sub', {kc:fmtCoef(kc), tot:fmtCoef(tot), avg:fmt(avg, 2)});
    $('known-actions').hidden = true;
    var rows = '';
    PHASES.forEach(function(ph){
      var its = list.filter(function(it){ return it.ph === ph; });
      if (!its.length) return;
      rows += '<tr class="grp"><th colspan="3">' + esc(phT(ph)) + '</th></tr>';
      its.forEach(function(it){
        rows += '<tr><td>' + esc(it.label) + '</td><td class="r' + (it.grade < 10 ? ' low' : '') + '">' + fmt(it.grade, 2) + '</td><td class="r coef-c">' + t('coef') + ' ' + fmtCoef(it.coef) + '</td></tr>';
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
      var deg = (u.degree || t('uni.nodeg')) + (u.detail ? ' · ' + u.detail : '');
      card.innerHTML =
        '<div class="uni-top"><div class="uni-id"><h3 class="uni-name">' + esc(u.name) + '</h3><p class="uni-deg">' + esc(deg) + '</p></div><span class="pill"></span></div>' +
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
    $('eyebrow').textContent = t(isBfi(cfg) ? 'head.eyebrow.bfi' : 'head.eyebrow.gen');
    $('example-note').hidden = !cfg.example;
    buildPending();
    buildKnown();
    buildUnis();
    update();
  }

  function sensText(c, it){
    var base = c.bac >= 10 && c.tot > 0 ? C.slope(c.bac) * it.coef / c.tot : 0;
    var arr = c.unis.map(function(ur){
      var extra = 0;
      ur.top.forEach(function(p){ if (p.sub.src === it.id) extra += p.w / 2; });
      return base + extra;
    });
    if (!arr.length) arr = [base];
    var mn = Math.min.apply(null, arr), mx = Math.max.apply(null, arr);
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
      r.out.textContent = fmt(v, 1);
      r.sens.textContent = sensText(c, r.it);
      if (r.mode === 'scen'){
        var ch = Math.abs(v - r.it.grade) > 1e-6;
        if (ch) changed++;
        r.el.setAttribute('data-changed', ch ? '1' : '0');
        r.hint.textContent = t('sl.real', {x:fmt(r.it.grade, 2)}) + (ch ? t('sl.changed') : '');
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
    $('mention').textContent = t('mention.' + C.mention(c.bac));
    $('c-bac').textContent = fmt(c.bac, 2) + ' / 20';
    $('c-acc').textContent = fmt(c.acc, 3);

    var count = c.unis.filter(function(u){ return u.ok; }).length;
    var reach = $('reach'), reachTxt;
    if (!c.unis.length){ reachTxt = t('reach.none'); reach.className = 'reach none'; }
    else { reachTxt = t(c.unis.length === 1 ? 'reach.one' : 'reach.many', {n:count, m:c.unis.length}); reach.className = 'reach ' + (count ? 'ok' : 'no'); }
    reach.textContent = reachTxt;

    $('scenario').hidden = !(state.scenOn && changed);
    $('scenario-txt').textContent = t(changed === 1 ? 'scen.one' : 'scen.many', {n:changed});

    var warns = [];
    if (c.bac < 10) warns.push(t('warn.fail'));
    if (!M.subjects.length) warns.push(t('warn.nosubj'));
    M.subjects.forEach(function(s){
      var g = vals[s.src];
      if (isNum(g) && g < 10) warns.push(t('warn.low', {s:s.name, src:s.srcLabel}));
      else if (s.svt && c.esAvg < 10) warns.push(t('warn.svt', {s:s.name}));
    });
    $('warn').hidden = !warns.length;
    $('warn').textContent = warns.filter(function(w, i){ return warns.indexOf(w) === i; }).join(' ');

    var pendSp = ['sp1', 'sp2'].filter(function(id){ return M.byId[id] && M.byId[id].grade === null; });
    var names = pendSp.map(function(id){ return M.byId[id].label; });
    c.unis.forEach(function(ur, k){
      var u = M.unis[k], R = uniRefs[k];
      if (!R) return;
      var gap = ur.score - u.cut;
      var cat = gap >= 0.5 ? 'hol' : gap >= -1e-9 ? 'jus' : gap >= -0.5 ? 'cer' : 'lej';
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
      var nd = C.needed(M, vals, pendSp, k), txt;
      var subj = names.length > 1 ? t('uni.need.and', {a:names[0], b:names[1]}) : names[0];
      if (nd.kind === 'fixed') txt = t('uni.need.fixed');
      else if (nd.kind === 'never') txt = t('uni.need.never', {s:subj});
      else if (nd.kind === 'always') txt = t('uni.need.always', {s:subj});
      else txt = t('uni.need.x', {x:fmt(nd.x, 1), s:subj});
      R.need.textContent = txt;
      R.parts.textContent = c.bac < 10 ? t('uni.parts.fail') : t('uni.parts', {x:fmt(c.acc, 3)}) + ur.top.map(function(p){ return ' + ' + p.sub.name + ' ' + fmt(p.v, 3); }).join('');
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
    var avg = avgKnown(M);
    M.items.forEach(function(it){ if (it.grade === null) state.sim[it.id] = guess(it, M, avg); });
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
  function shareData(){ return {config:normalize(state.config), sim:state.sim}; }
  $('share-btn').addEventListener('click', function(){ Site.share('bac', shareData()); });
  function buildPrint(){
    var vals = currentVals(M);
    Site.renderPrint({
      title: t('print.title'),
      subtitle: [state.config.student, t(isBfi(state.config) ? 'f.bac.bfi' : 'f.bac.gen')].filter(Boolean).join(' · '),
      groups: PHASES.map(function(ph){
        return {t:phT(ph), rows: M.items.filter(function(it){ return it.ph === ph; }).map(function(it){
          return {label:it.label + ' (' + t('coef') + ' ' + fmtCoef(it.coef) + ')', val:fmt(vals[it.id], 1) + ' / 20', est: it.grade === null};
        })};
      })
    });
  }
  $('print-btn').addEventListener('click', function(){ buildPrint(); window.print(); });
  window.addEventListener('beforeprint', buildPrint);
  $('example-start').addEventListener('click', function(){ startWizard(); });
  $('unis').addEventListener('click', function(e){
    var b = e.target.closest('[data-open]');
    if (b) openCfg(b.getAttribute('data-open'));
  });
  var mini = $('mini');
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(en){ mini.hidden = en.isIntersecting; });
    }).observe($('score-card'));
  }

  /* Panel de configuración */
  var dlg = $('cfg'), body = $('cfg-body'), draft = null, importSim = null;

  function fsec(id, title, html){ return '<section class="fsec" id="' + id + '"><h3>' + esc(title) + '</h3>' + html + '</section>'; }
  function field(label, control, cls){ return '<label class="field' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span>' + control + '</label>'; }
  function textIn(id, k, val, ph){
    return '<input class="in" type="text" id="' + id + '" data-k="' + k + '" value="' + esc(val) + '" placeholder="' + esc(ph || '') + '" autocomplete="off">';
  }
  function numIn(id, k, val, ph, aria){
    return '<input class="in num" type="text" inputmode="decimal" id="' + id + '" data-k="' + k + '" value="' + esc(showNum(val)) + '" placeholder="' + esc(ph || '') + '" autocomplete="off"' + (aria ? ' aria-label="' + esc(aria) + '"' : '') + '>';
  }
  function specSel(slot, val){
    return '<select class="in" id="f-spec-' + slot + '" data-k="spec:' + slot + '">' + SPECS.map(function(s){
      return '<option value="' + s.k + '"' + (s.k === val ? ' selected' : '') + '>' + esc(s.name) + '</option>';
    }).join('') + '</select>';
  }
  function sourceList(d){
    var out = [
      {id:'sp1', label:t('src.exam', {s:specShort(d.sp1)})},
      {id:'sp2', label:t('src.exam', {s:specShort(d.sp2)})},
      {id:'spd', label:t('src.spd', {s:specShort(d.spd)})}
    ];
    d.options.forEach(function(o, i){
      var nm = o.name || t('opt.n', {n:i + 1});
      if (o.coefT > 0) out.push({id:'o' + o.id + 't', label:nm + ' (Terminale)', opt:o.id});
      if (o.coefP > 0) out.push({id:'o' + o.id + 'p', label:nm + ' (Première)', opt:o.id});
    });
    return out;
  }
  function weightSel(i, s, u){
    var w = uniWeight(u, s);
    return '<label class="field"><span data-sublabel="' + s.id + '">' + esc(subjName(s)) + '</span><select class="in" id="f-uni-' + i + '-w-' + s.id + '" data-k="w:' + i + ':' + s.id + '">' +
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
    var seg = HAS_DB ? '<div class="seg" role="radiogroup" aria-label="' + esc(t('u.how', {n:i + 1})) + '">' +
      '<label><input type="radio" name="umode-' + i + '" id="' + p + 'm-list" value="list" data-k="umode:' + i + '"' + (u.mode === 'list' ? ' checked' : '') + '><span>' + esc(t('u.mode.list')) + '</span></label>' +
      '<label><input type="radio" name="umode-' + i + '" id="' + p + 'm-manual" value="manual" data-k="umode:' + i + '"' + (u.mode === 'manual' ? ' checked' : '') + '><span>' + esc(t('u.mode.manual')) + '</span></label></div>' : '';
    var h = '<fieldset class="ublock" id="ub-' + i + '"><legend>' + esc(t('u.legend', {n:i + 1})) + '</legend>' + seg;
    if (u.mode === 'list'){
      var rr = ROW_BY[u.row];
      if (!rr || u._edit){
        h += US.comboHtml(i, u._q != null ? u._q : (u.deg || ''));
        if (rr) h += '<div class="brow"><button type="button" class="btn small" data-act="keep-row" data-i="' + i + '">' + esc(t('cfg.cancel')) + '</button></div>';
      } else {
        h += US.pickedHtml(i, rr);
        h += '<div class="fgrid">' + field(t('u.cut'), numIn(p + 'cut', 'uni:' + i + ':cut', u.cut, isNum(u.cutRef) ? showNum(u.cutRef) : '')) + '</div>';
        if (!isNum(rr.cut)) h += '<p class="fnote warn-note">' + esc(t('u.cut.missing')) + '</p>';
        else h += '<p class="fnote">' + esc(t('u.cut.from', {lbl:cutLabelOf(u)})) + (isNum(u.cutRef) ? esc(': ' + (u.cutRef <= 5 ? t('u.cut.none5') : fmt(u.cutRef, 3))) : '') + esc(t('u.cut.update')) + '</p>';
        if (d.subjects.length){
          h += '<p class="fnote">' + (US.prefill(rr) ? US.weightsNote(rr) : esc(t('u.weights'))) + '</p>';
          h += '<div class="wgrid">' + d.subjects.map(function(s){ return weightSel(i, s, u); }).join('') + '</div>';
        }
      }
      h += '<div class="brow"><button type="button" class="btn small danger" data-act="clear-uni" data-i="' + i + '">' + esc(t('u.clear')) + '</button></div>';
    } else {
      h += '<div class="fgrid">' +
        field(t('u.name'), textIn(p + 'name', 'uni:' + i + ':name', u.name, t('u.name.ph'))) +
        field(t('u.degree'), textIn(p + 'degree', 'uni:' + i + ':degree', u.degree, t('u.degree.ph'))) +
        field(t('u.cut'), numIn(p + 'cut', 'uni:' + i + ':cut', u.cut, t('u.cut.ph'))) + '</div>';
      if (d.subjects.length) h += '<div class="wgrid">' + d.subjects.map(function(s){ return weightSel(i, s, u); }).join('') + '</div>';
      h += '<div class="brow"><button type="button" class="btn small danger" data-act="clear-uni" data-i="' + i + '">' + esc(t('u.clear')) + '</button></div>';
    }
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

  function renderForm(){
    var d = draft;
    var h = '';
    var bfi = isBfi(d);
    var bacSeg = '<div class="seg" role="radiogroup" aria-label="' + esc(t('f.bactype')) + '">' +
      '<label><input type="radio" name="bac-type" id="f-bac-gen" value="gen" data-k="bac"' + (bfi ? '' : ' checked') + '><span>' + esc(t('f.bac.gen')) + '</span></label>' +
      '<label><input type="radio" name="bac-type" id="f-bac-bfi" value="bfi" data-k="bac"' + (bfi ? ' checked' : '') + '><span>' + esc(t('f.bac.bfi')) + '</span></label></div>';
    var bfiBox = '';
    if (bfi){
      var opt = function(v, cur, txt){ return '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(txt) + '</option>'; };
      bfiBox = '<p class="fnote">' + esc(t('f.bfi.note')) + '</p>' +
        '<div class="fgrid">' +
          field(t('f.bfi.acl'), '<select class="in" id="f-bfi-acl" data-k="bfi:bfiAcl">' + opt('la', d.bfiAcl, t('b.lva') + (d.lva ? ' · ' + d.lva : '')) + opt('lb', d.bfiAcl, t('b.lvb') + (d.lvb ? ' · ' + d.lvb : '')) + '</select>') +
          field(t('f.bfi.dnl'), '<select class="in" id="f-bfi-dnl" data-k="bfi:bfiDnl">' + opt('hg', d.bfiDnl, t('b.hg')) + opt('es', d.bfiDnl, t('b.es')) + '</select>') +
          '<label class="field check"><input type="checkbox" id="f-bfi-dnl2" data-k="bfi:bfiDnl2"' + (d.bfiDnl2 ? ' checked' : '') + '><span>' + esc(t('f.bfi.dnl2')) + '</span></label>' +
        '</div>';
    }
    h += fsec('fs-alumno', t('f.alumno'),
      '<div class="fgrid">' +
        field(t('f.name'), textIn('f-student', 'student', d.student, t('f.name.ph'))) +
        field(t('f.lva'), textIn('f-lva', 'lva', d.lva, t('f.lva.ph'))) +
        field(t('f.lvb'), textIn('f-lvb', 'lvb', d.lvb, t('f.lvb.ph'))) +
      '</div>' +
      '<p class="fnote field-label">' + esc(t('f.bactype')) + '</p>' + bacSeg + bfiBox);
    h += fsec('fs-esp', t('f.esp'),
      '<p class="fnote">' + esc(t('f.esp.note')) + '</p>' +
      '<div class="fgrid">' +
        field(t('f.sp1'), specSel('sp1', d.sp1)) +
        field(t('f.sp2'), specSel('sp2', d.sp2)) +
        field(t('f.spd'), specSel('spd', d.spd)) +
      '</div>');
    h += fsec('fs-notas', t('f.notas'),
      '<p class="fnote">' + t('f.notas.note') + esc(t(bfi ? 'f.notas.bfi' : 'f.notas.gen', {x:fmtCoef(baseTotal(d))})) + esc(t('f.notas.end')) + '</p>' +
      PHASES.filter(function(ph){ return ph !== 'opt'; }).map(function(ph){
        var rows = activeBase(d).filter(function(b){ return b.ph === ph; }).map(function(b){
          var lab = labelOf(b, d);
          var coef = isNum(d.coefs[b.id]) ? d.coefs[b.id] : b.coef;
          return '<tr><th scope="row" data-lab="' + b.id + '">' + esc(lab) + '</th>' +
            '<td class="c-coef">' + numIn('f-coef-' + b.id, 'coef:' + b.id, coef, String(b.coef), t('f.coefof', {x:lab})) + '</td>' +
            '<td class="c-grade">' + numIn('f-grade-' + b.id, 'grade:' + b.id, d.grades[b.id], t('f.pending'), t('f.gradeof', {x:lab})) + '</td></tr>';
        }).join('');
        if (!rows) return '';
        return '<div class="tbl-wrap"><table class="gtable"><caption>' + esc(phT(ph)) + '</caption><thead><tr><th scope="col">' + esc(t('f.col.test')) + '</th><th scope="col" class="c-coef">' + esc(t('f.col.coef')) + '</th><th scope="col" class="c-grade">' + esc(t('f.col.grade')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      }).join(''));
    var opts = d.options.length ? d.options.map(function(o){
      var p = 'f-opt-' + o.id + '-';
      return '<div class="orow">' +
        field(t('f.opc.name'), textIn(p + 'name', 'opt:' + o.id + ':name', o.name, t('f.opc.name.ph')), 'wide') +
        field(t('f.opc.cp'), numIn(p + 'cp', 'opt:' + o.id + ':coefP', o.coefP, '0')) +
        field(t('f.opc.gp'), numIn(p + 'gp', 'opt:' + o.id + ':gradeP', o.gradeP, t('f.pending'))) +
        field(t('f.opc.ct'), numIn(p + 'ct', 'opt:' + o.id + ':coefT', o.coefT, '0')) +
        field(t('f.opc.gt'), numIn(p + 'gt', 'opt:' + o.id + ':gradeT', o.gradeT, t('f.pending'))) +
        '<button type="button" class="btn small danger" data-act="del-opt" data-id="' + o.id + '">' + esc(t('f.opc.del')) + '</button></div>';
    }).join('') : '<p class="fnote">' + esc(t('f.opc.none')) + '</p>';
    h += fsec('fs-opc', t('f.opc'),
      '<p class="fnote">' + esc(t('f.opc.note')) + '</p>' +
      opts + (d.options.length < 6 ? '<div class="brow"><button type="button" class="btn small" data-act="add-opt">' + esc(t('f.opc.add')) + '</button></div>' : ''));
    var srcs = sourceList(d);
    var fr = I18N.getLang() === 'fr';
    var subs = d.subjects.length ? d.subjects.map(function(s){
      var p = 'f-sub-' + s.id + '-';
      var found = srcs.some(function(o){ return o.id === s.src; });
      var keySel = '<select class="in" id="' + p + 'key" data-k="sub:' + s.id + ':key">' +
        SUBJ.map(function(x){ return '<option value="' + x.k + '"' + (x.k === s.key ? ' selected' : '') + '>' + esc(subjN(x.k) + (fr ? ' · ' + SUBJ_ES[x.k] : '')) + '</option>'; }).join('') +
        '<option value=""' + (!s.key ? ' selected' : '') + '>' + esc(t('f.asig.other')) + '</option></select>';
      var srcSel = '<select class="in" id="' + p + 'src" data-k="sub:' + s.id + ':src">' +
        (found ? '' : '<option value="" selected disabled>' + esc(t('f.asig.src.choose')) + '</option>') +
        srcs.map(function(o){ return '<option value="' + o.id + '"' + (o.id === s.src ? ' selected' : '') + (o.opt ? ' data-optsrc="' + o.opt + '"' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select>';
      return '<div class="srow">' +
        field(t('f.asig.es'), keySel) +
        (s.key ? '' : field(t('f.asig.name'), textIn(p + 'name', 'sub:' + s.id + ':name', s.name, t('f.asig.name.ph')))) +
        field(t('f.asig.src'), srcSel) +
        '<button type="button" class="btn small danger" data-act="del-sub" data-id="' + s.id + '">' + esc(t('f.asig.del')) + '</button></div>';
    }).join('') : '<p class="fnote">' + esc(t('f.asig.none')) + '</p>';
    h += fsec('fs-asig', t('f.asig'),
      '<p class="fnote">' + esc(t('f.asig.note')) + '</p>' +
      subs + '<div class="brow">' + (d.subjects.length < 8 ? '<button type="button" class="btn small" data-act="add-sub">' + esc(t('f.asig.add')) + '</button>' : '') +
      '<button type="button" class="btn small" data-act="suggest-sub">' + esc(t('f.asig.redo')) + '</button></div>');
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
  function setNum(el, min, max, apply){
    var n = parseNum(el.value);
    if ((n !== null && isNaN(n)) || (n !== null && (n < min || n > max))){
      el.classList.add('bad'); el.setAttribute('aria-invalid', 'true');
      return false;
    }
    el.classList.remove('bad'); el.removeAttribute('aria-invalid');
    apply(n);
    return true;
  }
  function findOpt(id){ for (var i = 0; i < draft.options.length; i++) if (draft.options[i].id === id) return draft.options[i]; return null; }
  function findSub(id){ for (var i = 0; i < draft.subjects.length; i++) if (draft.subjects[i].id === id) return draft.subjects[i]; return null; }

  function onField(e){
    var el = e.target;
    var k = el.getAttribute && el.getAttribute('data-k');
    if (!k || !draft) return;
    var p = k.split(':');
    draft.example = false;
    $('cfg-msg').textContent = '';
    switch (p[0]){
      case 'student': draft.student = el.value.slice(0, 60); break;
      case 'lva': case 'lvb':
        draft[p[0]] = el.value.slice(0, 30);
        body.querySelectorAll('[data-lab]').forEach(function(th){ th.textContent = labelOf(BASE_BY[th.getAttribute('data-lab')], draft); });
        break;
      case 'bac':
        if (e.type !== 'change' || !el.checked) return;
        draft.bac = el.value === 'bfi' ? 'bfi' : 'gen';
        rerender();
        break;
      case 'bfi':
        if (e.type !== 'change') return;
        if (p[1] === 'bfiDnl2') draft.bfiDnl2 = el.checked;
        else if (p[1] === 'bfiAcl') draft.bfiAcl = el.value === 'lb' ? 'lb' : 'la';
        else if (p[1] === 'bfiDnl') draft.bfiDnl = el.value === 'es' ? 'es' : 'hg';
        rerender();
        break;
      case 'spec':
        if (e.type !== 'change') return;
        draft[p[1]] = el.value;
        if (p[1] === 'sp1' || p[1] === 'sp2'){
          draft.subjects = draft.subjects.filter(function(s){ return !(s.auto && s.src === p[1]); });
          var sg = suggestFor(p[1], el.value);
          if (sg) draft.subjects.push(sg);
        }
        rerender();
        break;
      case 'grade':
        setNum(el, 0, 20, function(n){ if (n === null) delete draft.grades[p[1]]; else draft.grades[p[1]] = n; });
        break;
      case 'coef':
        setNum(el, 0, 50, function(n){ if (n === null || n === BASE_BY[p[1]].coef) delete draft.coefs[p[1]]; else draft.coefs[p[1]] = n; });
        break;
      case 'opt':
        var o = findOpt(p[1]);
        if (!o) return;
        if (p[2] === 'name'){
          o.name = el.value.slice(0, 40);
          body.querySelectorAll('option[data-optsrc="' + o.id + '"]').forEach(function(op){
            var nm = o.name || t('opt.n', {n:''}).trim();
            op.textContent = nm + (op.value.slice(-1) === 't' ? ' (Terminale)' : ' (Première)');
          });
        } else if (p[2] === 'coefP' || p[2] === 'coefT'){
          var ok = setNum(el, 0, 50, function(n){ o[p[2]] = n === null ? 0 : n; });
          if (ok && e.type === 'change') rerender();
        } else {
          setNum(el, 0, 20, function(n){ o[p[2]] = n; });
        }
        break;
      case 'sub':
        var s = findSub(p[1]);
        if (!s) return;
        if (p[2] === 'name'){
          s.name = el.value.slice(0, 60);
          s.auto = false;
          body.querySelectorAll('[data-sublabel="' + s.id + '"]').forEach(function(sp){ sp.textContent = s.name || t('subj.generic'); });
        } else if (p[2] === 'key' && e.type === 'change'){
          s.key = SUBJ_BY[el.value] ? el.value : ''; s.auto = false;
          rerender();
        } else if (p[2] === 'src' && e.type === 'change'){
          s.src = el.value; s.auto = false;
        }
        break;
      case 'umode':
        if (e.type !== 'change' || !el.checked) return;
        var um = draft.unis[+p[1]];
        if (!um) return;
        if (um.mode !== el.value){
          if (el.value === 'list'){ um.mode = 'list'; clearRow(um); um.deg = ''; delete um._q; }
          else { um.mode = 'manual'; um.cutRef = null; um.row = ''; um.detail = ''; um.wl = null; }
        }
        rerenderUni(+p[1]);
        break;
      case 'uni':
        var u = draft.unis[+p[1]];
        if (!u) return;
        if (p[2] === 'cut') setNum(el, 0, 14, function(n){ u.cut = n; });
        else u[p[2]] = el.value.slice(0, 100);
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
    return JSON.stringify({app:'simulador-bac-espana', v:2, config:normalize(draft || state.config), sim:state.sim}, null, 1);
  }
  function applyImport(text){
    var raw;
    try { raw = JSON.parse(text); } catch (e) { status(t('st.readerr'), true); return; }
    var cfg = raw && raw.config ? raw.config : raw;
    if (!cfg || typeof cfg !== 'object' || (!cfg.grades && !cfg.unis)){ status(t('st.nodata'), true); return; }
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
    if (draft.sp1 === draft.sp2) return {el:$('f-spec-sp2'), msg:t('v.samespec')};
    if (draft.spd === draft.sp1 || draft.spd === draft.sp2) return {el:$('f-spec-spd'), msg:t('v.spd')};
    for (var i = 0; i < draft.unis.length; i++){
      var u = draft.unis[i];
      if (u.mode === 'list'){
        if (u.row && !isNum(u.cut)) return {el:markBad($('f-uni-' + i + '-cut')), msg:t('v.nocut', {n:i + 1})};
      } else if ((u.name || u.degree) && !isNum(u.cut)){
        return {el:markBad($('f-uni-' + i + '-cut')), msg:t('v.nocut', {n:i + 1})};
      }
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
        if (v){ $('cfg-msg').textContent = v.msg; if (v.el){ v.el.scrollIntoView({block:'center'}); v.el.focus({preventScroll:true}); } return; }
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
      case 'add-opt':
        draft.example = false;
        draft.options.push({id:uid(), name:'', coefP:2, gradeP:null, coefT:2, gradeT:null});
        rerender();
        break;
      case 'del-opt':
        draft.example = false;
        var oid = b.getAttribute('data-id');
        draft.options = draft.options.filter(function(o){ return o.id !== oid; });
        rerender();
        break;
      case 'add-sub':
        draft.example = false;
        draft.subjects.push({id:uid(), key:'', name:'', src:'sp1', auto:false});
        rerender();
        break;
      case 'del-sub':
        draft.example = false;
        var sid = b.getAttribute('data-id');
        draft.subjects = draft.subjects.filter(function(s){ return s.id !== sid; });
        rerender();
        break;
      case 'suggest-sub':
        draft.example = false;
        draft.subjects = suggestions(draft);
        rerender();
        break;
      case 'clear-uni':
        draft.example = false;
        if (draft.unis[bi]) draft.unis[bi] = blankUni();
        rerenderUni(bi);
        break;
      case 'share-link':
        Site.share('bac', {config:normalize(draft), sim:state.sim});
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
        a.download = 'simulador-bac-' + nm + '.json';
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

  /* Primera visita: asistente en tres pasos, desde una configuración en blanco */
  var WIZ_KEY = 'simulador-bac-wizard-visto';
  Wizard.setup(dlg, body, [
    {t:'wiz.b1.t', d:'wiz.b1.d', secs:['fs-alumno', 'fs-esp']},
    {t:'wiz.b2.t', d:'wiz.b2.d', secs:['fs-notas', 'fs-opc']},
    {t:'wiz.b3.t', d:'wiz.b3.d', secs:['fs-unis']}
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
  Site.readShared('bac', !firstVisit, function(data){
    state.config = normalize(data.config);
    state.sim = numMap(data.sim);
    state.scen = {}; state.scenOn = false;
    buildMain(); persistNow();
  });
  var wizSeen = false;
  try { wizSeen = !!localStorage.getItem(WIZ_KEY); } catch (e) {}
  if (firstVisit && !wizSeen && !sharedOpen) startWizard();
})();
