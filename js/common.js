/* Común a todas las páginas: idioma (español/francés), barra superior con banderas y pie de página.
   Cada página añade sus propios textos con I18N.add('es', {...}) e I18N.add('fr', {...}). */
var I18N = (function(){
  'use strict';
  var DICT = {es:{}, fr:{}};
  var METHOD = {es:'', fr:''};
  var lang = 'es';
  /* Espacio fino antes de la puntuación doble en francés */
  function frSpace(s){ return String(s).replace(/ ([:;!?»])/g, '\u202f$1').replace(/« /g, '«\u202f'); }
  function add(l, d){ Object.keys(d).forEach(function(k){ DICT[l][k] = l === 'fr' ? frSpace(d[k]) : d[k]; }); }
  function setMethod(es, fr){ METHOD.es = es; METHOD.fr = frSpace(fr); }

  /* Traducción de los textos que vienen del listado de universidades */
  var ckFr = {
    '1.ª adjudicación 2026': '1re affectation 2026',
    '2.ª adjudicación 2026': '2e affectation 2026',
    'adjudicación de julio 2026': 'affectation de juillet 2026',
    'cierre 2026-27': 'clôture 2026-27',
    'cierre 2025-26': 'clôture 2025-26',
    'lista del 31 jul 2026': 'liste du 31 juil. 2026',
    'Educaweb, curso 2026-27': 'Educaweb, année 2026-27'
  };
  var first = 'Première liste d’affectation de juillet 2026.';
  var madrid = 'Première liste de juillet 2026 du district unique de Madrid. Cette liste n’indique pas la faculté.';
  var clFr = {
    UNIZAR: 'Affectation ordinaire de juillet 2026.',
    ULL: 'Seuils de clôture de l’année 2026-27, au 30 septembre 2026 : l’ULL ne publie pas ceux de la première affectation.',
    UCLM: 'Première affectation de juillet 2026, d’après la presse : l’UCLM ne la publie que dans un tableau interactif. Toutes ses formations y figurent, mais 65 d’entre elles n’ont pas de seuil.',
    UAM: first, UC3M: madrid, UCM: madrid, UPM: first, URJC: first, UAH: madrid,
    UMH: first, UA: first, UJI: first, UPV: first, UV: first,
    UEX: 'Deuxième affectation de juillet 2026 (15 juillet) : la première n’est pas publiée.',
    UIB: 'Seuils du 31 juillet 2026, après plusieurs listes : ils sont en général plus bas que ceux de la première affectation.',
    UPNA: first,
    EHU: 'Seuils de clôture de l’année 2025-26 : l’UPV/EHU ne publie pas ceux de la première affectation.',
    UNIOVI: first
  };

  var clTextFr = {
    'Notas de corte del curso 2026-27 recogidas por Educaweb; no indica a qué adjudicación corresponden. Las de 5,000 se muestran como «sin nota de corte».':
      'Seuils de l’année 2026-27 relevés par Educaweb, sans préciser à quelle liste d’affectation ils correspondent. Un 5,000 apparaît comme « pas de seuil ».'
  };

  /* Términos franceses → raíz española, para buscar carreras escribiendo en francés */
  var SYN = [
    ['medecin', 'medicina'], ['infirm', 'enfermeria'], ['pharmac', 'farmacia'], ['dentaire', 'odontologia'],
    ['dentist', 'odontologia'], ['odonto', 'odontologia'], ['kine', 'fisioterapia'], ['physiother', 'fisioterapia'],
    ['veterin', 'veterinaria'], ['psycho', 'psicologia'], ['droit', 'derecho'], ['biolog', 'biologia'],
    ['biomedical', 'biomedic'], ['ingenier', 'ingenieria'], ['ingenieur', 'ingenieria'], ['informati', 'informatica'],
    ['chimi', 'quimica'], ['physique', 'fisica'], ['mathemat', 'matematica'], ['maths', 'matematica'],
    ['econom', 'economia'], ['gestion', 'administracion'], ['entreprise', 'empresa'], ['architect', 'arquitectura'],
    ['journalis', 'periodismo'], ['histoire', 'historia'], ['philosoph', 'filosofia'], ['sport', 'deporte'],
    ['nutrition', 'nutricion'], ['dietet', 'dietetica'], ['orthophon', 'logopedia'], ['optique', 'optica'],
    ['optometr', 'optometria'], ['commerce', 'comercio'], ['tourisme', 'turismo'], ['traduct', 'traduccion'],
    ['donnees', 'datos'], ['environnement', 'ambientales'], ['aerospat', 'aeroespacial'], ['biotech', 'biotecnologia'],
    ['genetique', 'genetica'], ['enseign', 'maestro'], ['professeur', 'maestro'], ['educat', 'educacion'],
    ['sociolog', 'sociologia'], ['geograph', 'geografia'], ['agronom', 'agronomica'], ['alimentai', 'alimentos'],
    ['ergother', 'terapia ocupacional'], ['podolog', 'podologia'], ['biochim', 'bioquimica'], ['chimique', 'quimica'],
    ['electri', 'electrica'], ['electroni', 'electronica'], ['mecaniq', 'mecanica'], ['telecom', 'telecomunicacion'],
    ['civil', 'civil'], ['industri', 'industrial'], ['beaux arts', 'bellas artes'], ['lettres', 'filologia'],
    ['anglais', 'ingles'], ['langues', 'lenguas'], ['marketing', 'marketing'], ['publicite', 'publicidad'],
    ['communication', 'comunicacion'], ['audiovisuel', 'audiovisual'], ['criminolog', 'criminologia'],
    ['sciences', 'ciencias'], ['science', 'ciencia'], ['sante', 'salud'], ['soins', 'enfermeria'],
    ['sage femme', 'enfermeria'], ['statisti', 'estadistica'], ['physicien', 'fisica'], ['mer', 'mar']
  ];

  function t(k, p){
    var s = DICT[lang][k];
    if (s == null) s = DICT.es[k];
    if (s == null) return k;
    if (p) s = s.replace(/\{(\w+)\}/g, function(m, n){ return p[n] != null ? p[n] : m; });
    return s;
  }
  function setLang(l){ lang = l === 'fr' ? 'fr' : 'es'; }
  function getLang(){ return lang; }
  function locale(){ return lang === 'fr' ? 'fr-FR' : 'es-ES'; }
  function method(){ return METHOD[lang]; }
  function ck(s){ return lang === 'fr' ? (ckFr[s] || s) : s; }
  function cl(code, s){ return lang === 'fr' ? (clTextFr[s] || clFr[code] || s) : s; }
  function synonyms(tok){
    var out = [tok];
    if (tok.length < 3) return out;
    SYN.forEach(function(p){
      if (tok.indexOf(p[0]) === 0 || (tok.length >= 4 && p[0].indexOf(tok) === 0)) out.push(p[1]);
    });
    return out;
  }
  return {add:add, setMethod:setMethod, t:t, setLang:setLang, getLang:getLang, locale:locale, method:method, ck:ck, cl:cl, synonyms:synonyms};
})();

/* Textos comunes a las calculadoras y a la página de inicio */
I18N.add('es', {
  "lang.es": "Español",
  "lang.fr": "Français",
  "lang.group": "Idioma",
  "head.h1": "Simulador de nota de admisión",
  "head.h1.student": "Nota de admisión de {name}",
  "head.lead": "Las notas que ya tienes quedan fijas. Mueve las que faltan para ver la nota <strong>sobre 14</strong> en cada universidad y si llegas a su nota de corte.",
  "head.cfg": "Configurar datos",
  "score.label": "Nota de admisión",
  "score.label.range": "Nota de admisión, según la universidad",
  "score.label.acc": "Nota de acceso",
  "score.restore": "Restaurar notas reales",
  "results.foot": "Las notas de corte cambian cada año y suelen bajar en las listas que siguen a la primera.",
  "pending.title": "Notas por llegar",
  "pending.reset": "Volver a la estimación inicial",
  "pending.done": "Todas las notas están introducidas: la nota de admisión ya es definitiva.",
  "known.title": "Notas ya obtenidas",
  "known.switch": "Probar otros escenarios",
  "known.reset": "Restaurar las notas reales",
  "known.none": "Aún no hay notas fijadas. Añádelas en la configuración.",
  "sl.down": "Bajar {x} 0,1",
  "sl.up": "Subir {x} 0,1",
  "sl.sens": "1 punto = +{a}",
  "sl.sens.range": "1 punto = +{a} a +{b}",
  "sl.real": "Nota real: {x}",
  "sl.changed": " · cambiada",
  "coef": "coef.",
  "unis.choose": "Elegir universidades",
  "uni.nodeg": "Grado sin indicar",
  "uni.fallback": "Universidad {n}",
  "uni.ok": "Entra",
  "uni.no": "No llega",
  "uni.cut": "Nota de corte {x}",
  "uni.cut.none": " (sin corte)",
  "uni.cut.manual": " · cambiada a mano ({lbl}: {x})",
  "uni.cut.list": "listado",
  "uni.need.fixed": "Las notas de especialidad ya están fijadas",
  "uni.need.never": "No llega ni con un 20 en {s}",
  "uni.need.always": "Llega con cualquier nota en {s}",
  "uni.need.x": "Llega con un {x} en {s}",
  "uni.need.and": "{a} y en {b}",
  "uni.parts": "Acceso {x}",
  "uni.parts.fail": "Sin Bac aprobado no hay nota de admisión",
  "reach.none": "Elige universidades para comparar",
  "reach.one": "Llega a {n} de {m} opción",
  "reach.many": "Llega a {n} de {m} opciones",
  "scen.one": "Escenario: {n} nota obtenida cambiada",
  "scen.many": "Escenario: {n} notas obtenidas cambiadas",
  "scen.mini": " · escenario",
  "src.cuts": "notas de corte",
  "src.weights": "tabla de ponderaciones",
  "src.links": "Enlaces:",
  "cut.unknown": "sin nota de corte",
  "cut.none": "sin corte",
  "detail.group": "grupo {g}",
  "cfg.eyebrow": "Configuración",
  "cfg.title": "Datos del alumno",
  "cfg.close": "Cerrar sin guardar",
  "cfg.nav": "Secciones de la configuración",
  "nav.alumno": "Alumno",
  "nav.unis": "Universidades",
  "nav.datos": "Guardar y compartir",
  "cfg.cancel": "Cancelar",
  "cfg.save": "Guardar y ver",
  "f.alumno": "Alumno",
  "f.name": "Nombre (opcional)",
  "f.name.ph": "Ej.: Lucía",
  "f.unis.note.nodb": "Hasta tres grados con su nota de corte sobre 14 y la ponderación de cada asignatura.",
  "u.legend": "Universidad {n}",
  "u.how": "Cómo elegir la universidad {n}",
  "u.mode.list": "Elegir del listado",
  "u.mode.manual": "Escribir a mano",
  "u.search": "Carrera y universidad",
  "u.search.ph": "Ej.: medicina valencia",
  "u.search.hint": "Escribe la carrera y, si quieres, la ciudad, la universidad o la comunidad. Por ejemplo: «medicina valencia», «enfermería UAM», «biomédica».",
  "u.search.none": "No hay resultados para «{q}». Prueba con menos palabras o usa «Escribir a mano».",
  "u.search.count.one": "1 resultado",
  "u.search.count": "{n} resultados",
  "u.search.more": "Se muestran {k} de {n}: añade la ciudad o la universidad para afinar.",
  "u.change": "Cambiar",
  "u.cut": "Nota de corte (/14)",
  "u.cut.missing": "No tengo la nota de corte de este centro: escríbela tú. La encontrarás en la web de la universidad.",
  "u.cut.from": "Nota de corte del listado ({lbl})",
  "u.cut.none5": "5,000, es decir, sin corte",
  "u.cut.update": ". Puedes cambiarla si se publica una más reciente.",
  "u.weights": "Ponderación de cada asignatura en este grado: consúltala en la tabla oficial de la universidad.",
  "u.clear": "Vaciar",
  "u.name": "Universidad",
  "u.name.ph": "Ej.: Universitat de València",
  "u.degree": "Grado",
  "u.degree.ph": "Ej.: Medicina",
  "u.cut.ph": "Ej.: 12,720",
  "w.none": "No pondera",
  "w.x": "Pondera {x}",
  "f.datos": "Guardar y compartir",
  "f.datos.note": "Los datos se guardan automáticamente en este navegador. Para usarlos en otro equipo o pasárselos a otra persona, cópialos{dl} y luego impórtalos allí.",
  "f.datos.dl": " o descárgalos",
  "f.copy": "Copiar datos",
  "f.download": "Descargar archivo",
  "f.importfile": "Importar archivo",
  "f.paste": "O pega aquí unos datos copiados",
  "f.importtext": "Importar texto pegado",
  "f.example": "Cargar el ejemplo",
  "f.blank": "Empezar en blanco",
  "st.readerr": "No se ha podido leer: el texto no tiene el formato de datos del simulador.",
  "st.imported": "Datos importados. Revísalos y pulsa «Guardar y ver».",
  "st.fileerr": "No se ha podido abrir el archivo.",
  "st.copyfail": "No se ha podido copiar solo. El texto está seleccionado en el recuadro: cópialo con Ctrl+C o Cmd+C.",
  "st.copied": "Datos copiados. Pégalos en «Importar texto» en el otro equipo.",
  "st.downloaded": "Archivo descargado.",
  "st.example": "Ejemplo cargado. Pulsa «Guardar y ver» para usarlo.",
  "v.nocut": "Falta la nota de corte de la universidad {n}.",
  "ck.default": "1.ª adjudicación 2026",
  "home.doc": "Simulador de nota de admisión · universidad española",
  "home.desc": "Calcula la nota de admisión a la universidad española (sobre 14) con el bachillerato y la PAU o con el Bac francés, y compárala con las notas de corte.",
  "home.eyebrow": "Acceso a la universidad española",
  "home.title": "Simuladores de nota de admisión",
  "home.lead": "Calcula tu nota de admisión <strong>sobre 14</strong> y compárala con las notas de corte de las universidades públicas españolas. Elige tu caso:",
  "home.pau.t": "Nota de admisión con Bachillerato + PAU",
  "home.pau.s": "Bachillerato español y Prueba de Acceso a la Universidad (PAU)",
  "home.pau.d": "Media de bachillerato, fase de acceso y fase de admisión de la PAU.",
  "home.bac.t": "Nota de admisión con BAC",
  "home.bac.s": "Baccalauréat francés (Bac general o BFI)",
  "home.bac.d": "Media del Bac pasada a la escala española y asignaturas reconocidas por UNEDasiss.",
  "home.go": "Abrir la calculadora",
  "home.note": "Las dos calculadoras guardan tus datos por separado, solo en este navegador.",
  "nav.home": "Inicio",
  "nav.bac": "Calculadora Bac",
  "nav.pau": "Calculadora PAU",
  "nav.site": "Calculadoras",
  "foot.disclaimer": "Herramienta orientativa: no sustituye a la información oficial de las universidades, de UNEDasiss ni de la comisión de la PAU de cada comunidad. Los datos que introduces se guardan solo en este navegador."
  });
I18N.add('fr', {
  "lang.es": "Español",
  "lang.fr": "Français",
  "lang.group": "Langue",
  "head.h1": "Simulateur de note d’admission",
  "head.h1.student": "Note d’admission de {name}",
  "head.lead": "Les notes déjà obtenues restent fixes. Faites varier celles qui manquent pour voir la note <strong>sur 14</strong> dans chaque université et si vous atteignez son seuil d’admission.",
  "head.cfg": "Configurer",
  "score.label": "Note d’admission",
  "score.label.range": "Note d’admission, selon l’université",
  "score.label.acc": "Note d’accès",
  "score.restore": "Rétablir les notes réelles",
  "results.foot": "Les seuils d’admission changent chaque année et baissent souvent dans les listes qui suivent la première.",
  "pending.title": "Notes à venir",
  "pending.reset": "Revenir à l’estimation initiale",
  "pending.done": "Toutes les notes sont saisies : la note d’admission est définitive.",
  "known.title": "Notes déjà obtenues",
  "known.switch": "Tester d’autres scénarios",
  "known.reset": "Rétablir les notes réelles",
  "known.none": "Aucune note saisie pour l’instant. Ajoutez-les dans la configuration.",
  "sl.down": "Baisser {x} de 0,1",
  "sl.up": "Augmenter {x} de 0,1",
  "sl.sens": "1 point = +{a}",
  "sl.sens.range": "1 point = +{a} à +{b}",
  "sl.real": "Note réelle : {x}",
  "sl.changed": " · modifiée",
  "coef": "coef.",
  "unis.choose": "Choisir des universités",
  "uni.nodeg": "Formation non indiquée",
  "uni.fallback": "Université {n}",
  "uni.ok": "Atteint",
  "uni.no": "Pas atteint",
  "uni.cut": "Seuil {x}",
  "uni.cut.none": " (pas de seuil)",
  "uni.cut.manual": " · modifié à la main ({lbl} : {x})",
  "uni.cut.list": "liste",
  "uni.need.fixed": "Les notes de spécialité sont déjà saisies",
  "uni.need.never": "Pas atteint, même avec 20 en {s}",
  "uni.need.always": "Atteint avec n’importe quelle note en {s}",
  "uni.need.x": "Atteint avec {x} en {s}",
  "uni.need.and": "{a} et en {b}",
  "uni.parts": "Accès {x}",
  "uni.parts.fail": "Sans Bac obtenu, pas de note d’admission",
  "reach.none": "Choisissez des universités à comparer",
  "reach.one": "Seuil atteint : {n} sur {m}",
  "reach.many": "Seuil atteint : {n} sur {m}",
  "scen.one": "Scénario : {n} note obtenue modifiée",
  "scen.many": "Scénario : {n} notes obtenues modifiées",
  "scen.mini": " · scénario",
  "src.cuts": "seuils",
  "src.weights": "tableau des pondérations",
  "src.links": "Liens :",
  "cut.unknown": "seuil inconnu",
  "cut.none": "pas de seuil",
  "detail.group": "groupe {g}",
  "cfg.eyebrow": "Configuration",
  "cfg.title": "Données de l’élève",
  "cfg.close": "Fermer sans enregistrer",
  "cfg.nav": "Sections de la configuration",
  "nav.alumno": "Élève",
  "nav.unis": "Universités",
  "nav.datos": "Enregistrer et partager",
  "cfg.cancel": "Annuler",
  "cfg.save": "Enregistrer et voir",
  "f.alumno": "Élève",
  "f.name": "Prénom (facultatif)",
  "f.name.ph": "Ex. : Lucie",
  "f.unis.note.nodb": "Jusqu’à trois formations avec leur seuil sur 14 et la pondération de chaque matière.",
  "u.legend": "Université {n}",
  "u.how": "Comment choisir l’université {n}",
  "u.mode.list": "Choisir dans la liste",
  "u.mode.manual": "Saisir à la main",
  "u.search": "Formation et université",
  "u.search.ph": "Ex. : médecine valencia",
  "u.search.hint": "Saisissez la formation et, si vous voulez, la ville, l’université ou la communauté. Par exemple : « médecine valencia », « infirmier UAM », « biomédicale ».",
  "u.search.none": "Aucun résultat pour « {q} ». Essayez avec moins de mots ou utilisez « Saisir à la main ».",
  "u.search.count.one": "1 résultat",
  "u.search.count": "{n} résultats",
  "u.search.more": "{k} sur {n} affichés : ajoutez la ville ou l’université pour affiner.",
  "u.change": "Modifier",
  "u.cut": "Seuil d’admission (/14)",
  "u.cut.missing": "Je n’ai pas le seuil de cet établissement : saisissez-le vous-même. Vous le trouverez sur le site de l’université.",
  "u.cut.from": "Seuil de la liste ({lbl})",
  "u.cut.none5": "5,000, c’est-à-dire pas de seuil",
  "u.cut.update": ". Vous pouvez le modifier si un plus récent est publié.",
  "u.weights": "Pondération de chaque matière dans cette formation : consultez le tableau officiel de l’université.",
  "u.clear": "Vider",
  "u.name": "Université",
  "u.name.ph": "Ex. : Universitat de València",
  "u.degree": "Formation",
  "u.degree.ph": "Ex. : Medicina",
  "u.cut.ph": "Ex. : 12,720",
  "w.none": "Non pondérée",
  "w.x": "Pondération {x}",
  "f.datos": "Enregistrer et partager",
  "f.datos.note": "Les données sont enregistrées automatiquement dans ce navigateur. Pour les utiliser sur un autre appareil ou les transmettre à quelqu’un, copiez-les{dl} puis importez-les là-bas.",
  "f.datos.dl": " ou téléchargez-les",
  "f.copy": "Copier les données",
  "f.download": "Télécharger le fichier",
  "f.importfile": "Importer un fichier",
  "f.paste": "Ou collez ici des données copiées",
  "f.importtext": "Importer le texte collé",
  "f.example": "Charger l’exemple",
  "f.blank": "Repartir de zéro",
  "st.readerr": "Lecture impossible : le texte n’a pas le format des données du simulateur.",
  "st.imported": "Données importées. Vérifiez-les et cliquez sur « Enregistrer et voir ».",
  "st.fileerr": "Impossible d’ouvrir le fichier.",
  "st.copyfail": "La copie automatique a échoué. Le texte est sélectionné dans le cadre : copiez-le avec Ctrl+C ou Cmd+C.",
  "st.copied": "Données copiées. Collez-les dans « Importer le texte » sur l’autre appareil.",
  "st.downloaded": "Fichier téléchargé.",
  "st.example": "Exemple chargé. Cliquez sur « Enregistrer et voir » pour l’utiliser.",
  "v.nocut": "Il manque le seuil de l’université {n}.",
  "ck.default": "1re affectation 2026",
  "home.doc": "Simulateur de note d’admission · université espagnole",
  "home.desc": "Calculez la note d’admission à l’université espagnole (sur 14) avec le bachillerato et la PAU ou avec le Bac français, et comparez-la aux seuils d’admission.",
  "home.eyebrow": "Accès à l’université espagnole",
  "home.title": "Simulateurs de note d’admission",
  "home.lead": "Calculez votre note d’admission <strong>sur 14</strong> et comparez-la aux seuils d’admission des universités publiques espagnoles. Choisissez votre cas :",
  "home.pau.t": "Note d’admission avec le Bachillerato + PAU",
  "home.pau.s": "Bachillerato espagnol et épreuve d’accès à l’université (PAU)",
  "home.pau.d": "Moyenne du bachillerato, phase d’accès et phase d’admission de la PAU.",
  "home.bac.t": "Note d’admission avec le BAC",
  "home.bac.s": "Baccalauréat français (Bac général ou BFI)",
  "home.bac.d": "Moyenne du Bac convertie à l’échelle espagnole et matières reconnues par UNEDasiss.",
  "home.go": "Ouvrir le simulateur",
  "home.note": "Les deux simulateurs enregistrent vos données séparément, uniquement dans ce navigateur.",
  "nav.home": "Accueil",
  "nav.bac": "Simulateur Bac",
  "nav.pau": "Simulateur PAU",
  "nav.site": "Simulateurs",
  "foot.disclaimer": "Outil indicatif : il ne remplace pas les informations officielles des universités, d’UNEDasiss ni de la commission de la PAU de chaque communauté. Les données saisies sont enregistrées uniquement dans ce navigateur."
  });

/* Idioma, barra superior y pie de página */
var Site = (function(){
  'use strict';
  var t = I18N.t;
  var LANG_KEY = 'simulador-lang', OLD_KEY = 'simulador-bac-lang';
  var page = document.body.getAttribute('data-page') || 'home';
  var listeners = [];
  var FLAGS = {
    es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>',
    fr: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/></svg>'
  };
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function pickLang(){
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q === 'es' || q === 'fr') return q;
    try {
      var s = localStorage.getItem(LANG_KEY) || localStorage.getItem(OLD_KEY);
      if (s === 'es' || s === 'fr') return s;
    } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    return /^fr/i.test(nav) ? 'fr' : 'es';
  }
  function href(file){ return file + '?lang=' + I18N.getLang(); }
  function renderBar(){
    var box = document.getElementById('topbar');
    if (!box) return;
    var l = I18N.getLang();
    var home = page === 'home' ? '<span></span>' : '<a class="home-link" href="' + href('index.html') + '"><span aria-hidden="true">←</span> ' + esc(t('nav.home')) + '</a>';
    box.innerHTML = home + '<div class="lang" role="group" aria-label="' + esc(t('lang.group')) + '">' + ['es', 'fr'].map(function(k){
      return '<button type="button" class="flag" data-lang="' + k + '" lang="' + k + '" aria-pressed="' + (k === l) + '" title="' + esc(t('lang.' + k)) + '">' + FLAGS[k] + '<span>' + k.toUpperCase() + '</span></button>';
    }).join('') + '</div>';
  }
  function renderFoot(){
    var f = document.getElementById('site-foot');
    if (!f) return;
    var links = [['index.html', 'nav.home', 'home'], ['pau.html', 'nav.pau', 'pau'], ['bac.html', 'nav.bac', 'bac'], ['cortes.html', 'nav.cortes', 'cortes']].map(function(x){
      return x[2] === page ? '<span aria-current="page">' + esc(t(x[1])) + '</span>' : '<a href="' + href(x[0]) + '">' + esc(t(x[1])) + '</a>';
    }).join(' · ');
    f.innerHTML = '<nav class="foot-nav" aria-label="' + esc(t('nav.site')) + '">' + links + '</nav>' +
      '<p>' + esc(t('foot.disclaimer')) + '</p>' +
      '<p class="credit">2026 - &copy; - by <a href="mailto:nomada@gavama.es">Jesús Benavent</a></p>';
  }
  function applyStatic(){
    document.documentElement.lang = I18N.getLang();
    var dt = document.body.getAttribute('data-title'), dd = document.body.getAttribute('data-desc');
    if (dt) document.title = t(dt);
    var md = document.querySelector('meta[name="description"]');
    if (md && dd) md.setAttribute('content', t(dd));
    document.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){ el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('a[data-href]').forEach(function(a){ a.setAttribute('href', href(a.getAttribute('data-href'))); });
    var m = document.getElementById('method');
    if (m) m.innerHTML = I18N.method();
    renderBar();
    renderFoot();
  }
  function setLang(l){
    I18N.setLang(l);
    try { localStorage.setItem(LANG_KEY, I18N.getLang()); } catch (e) {}
    try {
      var url = new URL(location.href);
      url.searchParams.set('lang', I18N.getLang());
      history.replaceState(null, '', url);
    } catch (e) {}
    applyStatic();
    listeners.forEach(function(fn){ fn(I18N.getLang()); });
  }
  function onLang(fn){ listeners.push(fn); }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('#topbar [data-lang]');
    if (b && b.getAttribute('data-lang') !== I18N.getLang()) setLang(b.getAttribute('data-lang'));
  });
  /* Fecha de los datos y aviso cuando se quedan viejos (a partir de agosto del año siguiente) */
  var DATA = {cuts:2026, weights:'PAU 2027', reviewed:'2026-11'};
  function renderDataInfo(){
    var box = document.getElementById('data-info');
    if (!box) return;
    var rev = new Date(DATA.reviewed + '-01T12:00:00');
    var revTxt = rev.toLocaleDateString(I18N.locale(), {month:'long', year:'numeric'});
    var stale = new Date() >= new Date((DATA.cuts + 1) + '-08-01T00:00:00');
    box.className = 'data-info' + (stale ? ' stale' : '');
    box.innerHTML = '<span>' + esc([t('data.cuts', {y:DATA.cuts}), page === 'cortes' ? '' : t('data.weights', {w:DATA.weights}), t('data.reviewed', {d:revTxt})].filter(Boolean).join(' · ')) + '</span>' +
      (stale ? '<strong>' + esc(t('data.stale', {y:DATA.cuts})) + '</strong>' : '');
  }

  /* Avisos breves */
  var toastTimer = null;
  function toast(msg){
    var el = document.getElementById('toast');
    if (!el){ el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  /* Compartir por enlace: los datos van en el fragmento (#d=…), que no llega a ningún servidor */
  function b64e(str){
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64d(s){
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function shareLink(app, data){
    var url = new URL(location.href);
    url.search = '?lang=' + I18N.getLang();
    url.hash = 'd=' + b64e(JSON.stringify({app:app, v:1, data:data}));
    return url.toString();
  }
  function share(app, data, title){
    var link = shareLink(app, data);
    var copy = function(){
      var done = function(){ toast(t('share.copied')); };
      try { navigator.clipboard.writeText(link).then(done, function(){ window.prompt(t('share.manual'), link); }); }
      catch (e) { window.prompt(t('share.manual'), link); }
    };
    if (navigator.share && /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)){
      navigator.share({title:title || document.title, text:t('share.text'), url:link}).catch(function(){});
    } else copy();
  }
  /* Si la página se abre con datos compartidos, pregunta antes de reemplazar los del navegador */
  function readShared(app, hasOwn, onLoad){
    var m = /(?:^|[#&])d=([A-Za-z0-9_-]+)/.exec(location.hash);
    if (!m) return;
    var clear = function(){ try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; } };
    var payload = null;
    try { payload = JSON.parse(b64d(m[1])); } catch (e) {}
    if (!payload || payload.app !== app || !payload.data){ clear(); toast(t('share.bad')); return; }
    if (!hasOwn){ clear(); onLoad(payload.data); toast(t('share.loaded')); return; }
    var bar = document.createElement('div');
    bar.className = 'share-bar';
    bar.setAttribute('role', 'alert');
    var who = payload.data && payload.data.config && payload.data.config.student;
    bar.innerHTML = '<div class="wrap share-in"><p>' + esc(who ? t('share.ask.name', {name:who}) : t('share.ask')) + '</p>' +
      '<div class="brow"><button type="button" class="btn small primary" data-sh="load">' + esc(t('share.load')) + '</button>' +
      '<button type="button" class="btn small" data-sh="skip">' + esc(t('share.skip')) + '</button></div></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    bar.addEventListener('click', function(e){
      var b = e.target.closest('[data-sh]');
      if (!b) return;
      clear(); bar.remove();
      if (b.getAttribute('data-sh') === 'load'){ onLoad(payload.data); toast(t('share.loaded')); }
    });
  }

  /* Hoja para imprimir o guardar en PDF: resumen de notas (reales y estimadas) */
  function renderPrint(o){
    var box = document.getElementById('print-sheet');
    if (!box) return;
    var now = new Date().toLocaleDateString(I18N.locale(), {day:'numeric', month:'long', year:'numeric'});
    var h = '<h2>' + esc(o.title) + '</h2><p class="ps-sub">' + esc(t('print.date', {d:now})) + (o.subtitle ? ' · ' + esc(o.subtitle) : '') + '</p>';
    h += '<table class="ps-table"><tbody>';
    o.groups.forEach(function(g){
      if (!g.rows.length) return;
      h += '<tr class="ps-grp"><th colspan="3">' + esc(g.t) + '</th></tr>';
      g.rows.forEach(function(r){
        h += '<tr><td>' + esc(r.label) + '</td><td class="r">' + esc(r.val) + '</td><td class="ps-tag">' + (r.est ? esc(t('print.est')) : '') + '</td></tr>';
      });
    });
    h += '</tbody></table><p class="ps-foot">' + esc(t('print.foot')) + '</p>';
    box.innerHTML = h;
  }

  /* Instalable como app (funciona sin conexión una vez visitada) */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
    window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
  }

  var baseApply = applyStatic;
  applyStatic = function(){ baseApply(); renderDataInfo(); };

  I18N.setLang(pickLang());
  return {applyStatic:function(){ applyStatic(); }, setLang:setLang, onLang:onLang, esc:esc, toast:toast, share:share, readShared:readShared, renderPrint:renderPrint};
})();

/* Asistente por pasos para rellenar la configuración la primera vez.
   steps: [{t:'clave del título', d:'clave del texto', secs:['fs-…']}]. La app llama a Wizard.apply() tras dibujar el formulario. */
var Wizard = (function(){
  'use strict';
  var t = I18N.t, esc = Site.esc;
  var dlg = null, body = null, steps = [], cur = -1, onFinish = null;
  function active(){ return cur >= 0; }
  function setup(d, b, s){ dlg = d; body = b; steps = s; }
  function apply(){
    if (!dlg) return;
    dlg.classList.toggle('wiz', active());
    var prev = dlg.querySelector('[data-act="wiz-prev"]'), next = dlg.querySelector('[data-act="wiz-next"]'), save = dlg.querySelector('[data-act="save"]');
    var title = dlg.querySelector('#cfg-title'), eye = dlg.querySelector('.sheet-head .eyebrow');
    var old = body.querySelector('.wiz-intro');
    if (old) old.remove();
    if (!active()){
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      if (save) save.hidden = false;
      body.querySelectorAll('.fsec').forEach(function(s){ s.hidden = false; });
      if (title) title.textContent = t('cfg.title');
      if (eye) eye.textContent = t('cfg.eyebrow');
      return;
    }
    var st = steps[cur], last = cur === steps.length - 1;
    body.querySelectorAll('.fsec').forEach(function(s){ s.hidden = st.secs.indexOf(s.id) < 0; });
    if (title) title.textContent = t(st.t);
    if (eye) eye.textContent = t('wiz.step', {n:cur + 1, m:steps.length});
    var intro = document.createElement('div');
    intro.className = 'wiz-intro';
    intro.innerHTML = '<ol class="wiz-dots" aria-hidden="true">' + steps.map(function(x, i){ return '<li class="' + (i < cur ? 'done' : i === cur ? 'cur' : '') + '"></li>'; }).join('') + '</ol><p>' + esc(t(st.d)) + '</p>';
    body.insertBefore(intro, body.firstChild);
    if (prev) prev.hidden = cur === 0;
    if (next) next.hidden = last;
    if (save) save.hidden = !last;
  }
  function start(finish){ cur = 0; onFinish = finish || null; apply(); if (body) body.scrollTop = 0; }
  function stop(){ cur = -1; apply(); }
  function go(d){
    if (!active()) return;
    if (d > 0){
      var bad = Array.prototype.filter.call(body.querySelectorAll('.in.bad'), function(el){ return !el.closest('.fsec').hidden; })[0];
      if (bad){ var m = dlg.querySelector('#cfg-msg'); if (m) m.textContent = t('wiz.bad'); bad.focus(); return; }
    }
    cur = Math.max(0, Math.min(steps.length - 1, cur + d));
    var m2 = dlg.querySelector('#cfg-msg'); if (m2) m2.textContent = '';
    apply();
    body.scrollTop = 0;
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-act="wiz-prev"],[data-act="wiz-next"]');
    if (b) go(b.getAttribute('data-act') === 'wiz-next' ? 1 : -1);
  });
  return {setup:setup, apply:apply, start:start, stop:stop, active:active};
})();

/* Textos de las funciones comunes añadidas: datos, compartir, imprimir, asistente, orden de carreras */
I18N.add('es', {
  'data.cuts': 'Notas de corte de {y}',
  'data.weights': 'Ponderaciones precargadas: {w}',
  'data.reviewed': 'Datos revisados en {d}',
  'data.stale': 'Estos datos son de {y}: puede que ya haya notas de corte y ponderaciones más recientes. Compruébalas en la web de cada universidad.',
  'share.copied': 'Enlace copiado. Quien lo abra verá estas notas y universidades.',
  'share.manual': 'Copia este enlace:',
  'share.text': 'Mi simulación de nota de admisión',
  'share.bad': 'El enlace no contiene datos válidos de esta calculadora.',
  'share.ask': 'Has abierto un enlace con datos compartidos. ¿Quieres cargarlos? Sustituirán los que tienes guardados en este navegador.',
  'share.ask.name': 'Has abierto un enlace con los datos de {name}. ¿Quieres cargarlos? Sustituirán los que tienes guardados en este navegador.',
  'share.load': 'Cargar los datos',
  'share.skip': 'Mantener los míos',
  'share.loaded': 'Datos compartidos cargados.',
  'head.share': 'Compartir',
  'head.print': 'Imprimir / PDF',
  'f.sharelink': 'Copiar enlace para compartir',
  'print.date': 'Simulación del {d}',
  'print.est': 'estimada',
  'print.foot': 'Las notas marcadas como «estimada» aún no se conocen: son los valores del simulador. Herramienta orientativa; comprueba los datos oficiales de cada universidad.',
  'print.title': 'Notas usadas en la simulación',
  'uni.cat.hol': 'Entra con margen',
  'uni.cat.jus': 'Entra justo',
  'uni.cat.cer': 'Se queda cerca',
  'uni.cat.lej': 'Lejos',
  'uni.order': 'Ordenadas de más a menos margen sobre la nota de corte.',
  'u.weights.auto': 'Ponderaciones precargadas para este grado ({y}), según {src}. Compruébalas en {off}: cambian cada año y puedes corregirlas aquí.',
  'u.weights.off': 'la tabla oficial de la universidad',
  'u.weights.src': 'quecarreraestudio.com',
  'example.start': 'Empezar con mis datos',
  'wiz.step': 'Paso {n} de {m}',
  'wiz.prev': 'Atrás',
  'wiz.next': 'Siguiente',
  'wiz.bad': 'Hay valores no válidos, marcados en rojo: corrígelos para seguir.'
});
I18N.add('fr', {
  'data.cuts': 'Seuils d’admission de {y}',
  'data.weights': 'Pondérations préremplies : {w}',
  'data.reviewed': 'Données vérifiées en {d}',
  'data.stale': 'Ces données datent de {y} : des seuils et des pondérations plus récents sont peut-être publiés. Vérifiez-les sur le site de chaque université.',
  'share.copied': 'Lien copié. La personne qui l’ouvrira verra ces notes et ces universités.',
  'share.manual': 'Copiez ce lien :',
  'share.text': 'Ma simulation de note d’admission',
  'share.bad': 'Le lien ne contient pas de données valides pour ce simulateur.',
  'share.ask': 'Vous avez ouvert un lien avec des données partagées. Voulez-vous les charger ? Elles remplaceront celles enregistrées dans ce navigateur.',
  'share.ask.name': 'Vous avez ouvert un lien avec les données de {name}. Voulez-vous les charger ? Elles remplaceront celles enregistrées dans ce navigateur.',
  'share.load': 'Charger les données',
  'share.skip': 'Garder les miennes',
  'share.loaded': 'Données partagées chargées.',
  'head.share': 'Partager',
  'head.print': 'Imprimer / PDF',
  'f.sharelink': 'Copier un lien de partage',
  'print.date': 'Simulation du {d}',
  'print.est': 'estimée',
  'print.foot': 'Les notes marquées « estimée » ne sont pas encore connues : ce sont les valeurs du simulateur. Outil indicatif ; vérifiez les données officielles de chaque université.',
  'print.title': 'Notes utilisées dans la simulation',
  'uni.cat.hol': 'Atteint avec marge',
  'uni.cat.jus': 'Atteint de justesse',
  'uni.cat.cer': 'Tout proche',
  'uni.cat.lej': 'Loin',
  'uni.order': 'Classées de la plus grande à la plus petite marge sur le seuil.',
  'u.weights.auto': 'Pondérations préremplies pour cette formation ({y}), d’après {src}. Vérifiez-les dans {off} : elles changent chaque année et vous pouvez les corriger ici.',
  'u.weights.off': 'le tableau officiel de l’université',
  'u.weights.src': 'quecarreraestudio.com',
  'example.start': 'Commencer avec mes données',
  'wiz.step': 'Étape {n} sur {m}',
  'wiz.prev': 'Retour',
  'wiz.next': 'Suivant',
  'wiz.bad': 'Certaines valeurs, en rouge, ne sont pas valides : corrigez-les pour continuer.'
});

I18N.add('es', {'nav.cortes': 'Notas de corte', 'home.cuts': 'Ver sólo notas de corte', 'home.cuts.d': 'Todos los grados y universidades públicas, de mayor a menor nota de corte, con filtros.'});
I18N.add('fr', {'nav.cortes': 'Seuils d’admission', 'home.cuts': 'Voir uniquement les seuils d’admission', 'home.cuts.d': 'Toutes les formations et universités publiques, du seuil le plus élevé au plus bas, avec des filtres.'});
