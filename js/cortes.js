/* Listado de notas de corte con filtros (estudios, comunidad, universidad) */
I18N.add('es', {
  'cuts.doc': 'Notas de corte · universidades públicas españolas',
  'cuts.desc': 'Notas de corte de todos los grados de las universidades públicas españolas, ordenadas de mayor a menor, con filtros por estudios, universidad y comunidad.',
  'cuts.eyebrow': 'Universidades públicas españolas',
  'cuts.title': 'Notas de corte',
  'cuts.lead': 'Todos los grados del listado, de mayor a menor nota de corte (sobre 14). Filtra por estudios, universidad o comunidad.',
  'cuts.filters': 'Filtros',
  'cuts.f.deg': 'Estudios',
  'cuts.f.deg.ph': 'Ej.: medicina, enfermería, ingeniería…',
  'cuts.f.com': 'Comunidad',
  'cuts.f.uni': 'Universidad',
  'cuts.f.all.com': 'Todas las comunidades',
  'cuts.f.all.uni': 'Todas las universidades',
  'cuts.f.nocut': 'Incluir grados sin nota de corte',
  'cuts.reset': 'Quitar filtros',
  'cuts.col.cut': 'Nota de corte',
  'cuts.col.deg': 'Grado',
  'cuts.col.uni': 'Universidad y centro',
  'cuts.col.com': 'Comunidad',
  'cuts.count': '{n} grados y centros',
  'cuts.count.one': '1 grado y centro',
  'cuts.count.none': 'Ningún resultado con estos filtros.',
  'cuts.more': 'Mostrar {k} más (quedan {n})',
  'cuts.nocut': 'sin nota de corte',
  'cuts.free': 'sin corte',
  'cuts.note': 'Las notas de corte son, salvo que se indique otra cosa, las de la primera adjudicación de julio de 2026, y suelen bajar en las listas siguientes. «Sin corte» significa que entraron todos los que lo pidieron (5,000). Comprueba siempre los datos oficiales de cada universidad.'
});
I18N.add('fr', {
  'cuts.doc': 'Seuils d’admission · universités publiques espagnoles',
  'cuts.desc': 'Seuils d’admission de toutes les formations des universités publiques espagnoles, du plus élevé au plus bas, avec des filtres par formation, université et communauté.',
  'cuts.eyebrow': 'Universités publiques espagnoles',
  'cuts.title': 'Seuils d’admission',
  'cuts.lead': 'Toutes les formations de la liste, du seuil le plus élevé au plus bas (sur 14). Filtrez par formation, université ou communauté.',
  'cuts.filters': 'Filtres',
  'cuts.f.deg': 'Formation',
  'cuts.f.deg.ph': 'Ex. : médecine, infirmier, ingénierie…',
  'cuts.f.com': 'Communauté',
  'cuts.f.uni': 'Université',
  'cuts.f.all.com': 'Toutes les communautés',
  'cuts.f.all.uni': 'Toutes les universités',
  'cuts.f.nocut': 'Inclure les formations sans seuil connu',
  'cuts.reset': 'Effacer les filtres',
  'cuts.col.cut': 'Seuil',
  'cuts.col.deg': 'Formation',
  'cuts.col.uni': 'Université et établissement',
  'cuts.col.com': 'Communauté',
  'cuts.count': '{n} formations et établissements',
  'cuts.count.one': '1 formation et établissement',
  'cuts.count.none': 'Aucun résultat avec ces filtres.',
  'cuts.more': 'Afficher {k} de plus (il en reste {n})',
  'cuts.nocut': 'seuil inconnu',
  'cuts.free': 'pas de seuil',
  'cuts.note': 'Sauf mention contraire, les seuils sont ceux de la première liste d’affectation de juillet 2026 et baissent souvent dans les listes suivantes. « Pas de seuil » signifie que tous les candidats ont été admis (5,000). Vérifiez toujours les données officielles de chaque université.'
});

(function(){
  'use strict';
  var t = I18N.t, esc = Site.esc;
  var US = UniSearch(window.UNIDB);
  var $ = function(id){ return document.getElementById(id); };
  var PAGE = 150, shown = PAGE, list = [];
  function fmt(x, d){ return Number(x).toLocaleString(I18N.locale(), {minimumFractionDigits:d, maximumFractionDigits:d}); }
  var norm = US.normKey;

  /* Todas las filas, de mayor a menor nota de corte; las que no tienen nota, al final */
  var ALL = US.ROWS.slice().sort(function(a, b){
    var ca = typeof a.cut === 'number' ? a.cut : -1, cb = typeof b.cut === 'number' ? b.cut : -1;
    return cb - ca || a.ord - b.ord;
  });
  var COMS = {};
  US.DB.unis.forEach(function(u){ (COMS[u.community] = COMS[u.community] || []).push(u); });

  function fillSelects(){
    var c = $('f-com'), u = $('f-uni'), cv = c.value, uv = u.value;
    c.innerHTML = '<option value="">' + esc(t('cuts.f.all.com')) + '</option>' +
      Object.keys(COMS).sort(function(a, b){ return a.localeCompare(b, 'es'); }).map(function(k){ return '<option value="' + esc(k) + '">' + esc(k) + '</option>'; }).join('');
    c.value = cv;
    var unis = (cv ? COMS[cv] : US.DB.unis).slice().sort(function(a, b){ return a.name.localeCompare(b.name, 'es'); });
    u.innerHTML = '<option value="">' + esc(t('cuts.f.all.uni')) + '</option>' +
      unis.map(function(x){ return '<option value="' + esc(x.code) + '">' + esc(x.name) + '</option>'; }).join('');
    u.value = unis.some(function(x){ return x.code === uv; }) ? uv : '';
  }

  /* Estudios: cada palabra debe aparecer en el nombre del grado (sin acentos; en francés se traducen algunas) */
  function degMatch(r, alts){
    var hay = ' ' + r.nd + ' ' + norm(r.group) + ' ';
    return alts.every(function(a){
      return a.some(function(s){ return hay.indexOf(' ' + s) >= 0 || (s.length >= 4 && hay.indexOf(s) >= 0); });
    });
  }
  function filter(){
    var q = norm($('f-deg').value), com = $('f-com').value, uni = $('f-uni').value, nocut = $('f-nocut').checked;
    var alts = q ? q.split(' ').map(function(x){ return I18N.synonyms(x); }) : [];
    list = ALL.filter(function(r){
      if (!nocut && typeof r.cut !== 'number') return false;
      if (com && r.u.community !== com) return false;
      if (uni && r.u.code !== uni) return false;
      return !alts.length || degMatch(r, alts);
    });
    shown = PAGE;
    render();
    saveUrl();
  }
  function cutCell(c){
    if (typeof c !== 'number') return '<span class="cut-na">' + esc(t('cuts.nocut')) + '</span>';
    if (c <= 5) return '<span class="cut-free">' + esc(t('cuts.free')) + '</span>';
    return '<b>' + fmt(c, 3) + '</b>';
  }
  function render(){
    var n = list.length;
    $('cuts-count').textContent = n ? t(n === 1 ? 'cuts.count.one' : 'cuts.count', {n:fmt(n, 0)}) : t('cuts.count.none');
    $('cuts-body').innerHTML = list.slice(0, shown).map(function(r){
      var place = US.placeParts(r).join(' · ');
      return '<tr><td class="r num c-cut">' + cutCell(r.cut) + '</td>' +
        '<td class="c-deg"><b>' + esc(r.degree) + '</b>' + (r.group ? ' <span class="opt-grp">' + esc(r.group) + '</span>' : '') + '</td>' +
        '<td class="c-uni">' + esc(r.u.name) + (place ? '<span>' + esc(place) + '</span>' : '') + '<span class="c-ck">' + esc(I18N.ck(r.u.ck || '')) + '</span></td>' +
        '<td class="c-com">' + esc(r.u.community) + '</td></tr>';
    }).join('');
    var rest = n - shown, more = $('cuts-more');
    more.hidden = rest <= 0;
    if (rest > 0) more.textContent = t('cuts.more', {k:Math.min(PAGE, rest), n:fmt(rest, 0)});
  }

  /* Los filtros quedan en la dirección, para poder compartir el listado filtrado */
  function saveUrl(){
    try {
      var url = new URL(location.href), p = url.searchParams;
      [['q', $('f-deg').value.trim()], ['c', $('f-com').value], ['u', $('f-uni').value], ['todas', $('f-nocut').checked ? '1' : '']].forEach(function(x){ if (x[1]) p.set(x[0], x[1]); else p.delete(x[0]); });
      history.replaceState(null, '', url);
    } catch (e) {}
  }
  function readUrl(){
    try {
      var p = new URLSearchParams(location.search);
      $('f-deg').value = p.get('q') || '';
      $('f-com').value = p.get('c') || '';
      fillSelects();
      $('f-uni').value = p.get('u') || '';
      $('f-nocut').checked = p.get('todas') === '1';
    } catch (e) {}
  }

  var timer = null;
  $('f-deg').addEventListener('input', function(){ clearTimeout(timer); timer = setTimeout(filter, 120); });
  $('f-com').addEventListener('change', function(){ fillSelects(); filter(); });
  $('f-uni').addEventListener('change', function(){
    /* Al elegir universidad, la comunidad se ajusta sola */
    var code = $('f-uni').value;
    if (code){ var u = US.DB.unis.filter(function(x){ return x.code === code; })[0]; if (u && $('f-com').value !== u.community){ $('f-com').value = u.community; fillSelects(); $('f-uni').value = code; } }
    filter();
  });
  $('f-nocut').addEventListener('change', filter);
  $('f-reset').addEventListener('click', function(){ $('f-deg').value = ''; $('f-com').value = ''; $('f-uni').value = ''; $('f-nocut').checked = false; fillSelects(); filter(); });
  $('cuts-more').addEventListener('click', function(){ shown += PAGE; render(); });
  Site.onLang(function(){ fillSelects(); render(); });

  Site.applyStatic();
  fillSelects();
  readUrl();
  filter();
})();
