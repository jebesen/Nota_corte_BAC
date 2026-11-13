/* Textos de la interfaz en español y francés.
   t('clave', {x:1}) sustituye {x}. En francés se añade un espacio fino antes de : ; ? ! */
var I18N = (function(){
  'use strict';

  var es = {
    'doc.title': 'Simulador Bac España',
    'doc.desc': 'Calcula la nota de admisión a la universidad española (sobre 14) con el Bac francés y compárala con las notas de corte.',
    'lang.es': 'Español',
    'lang.fr': 'Français',
    'lang.group': 'Idioma',

    'head.eyebrow.gen': 'Bac francés → universidad española',
    'head.eyebrow.bfi': 'Bac français international (BFI) → universidad española',
    'head.h1': 'Simulador de nota de admisión',
    'head.h1.student': 'Nota de admisión de {name}',
    'head.lead': 'Las notas que ya tienes quedan fijas. Mueve las que faltan para ver la nota <strong>sobre 14</strong> en cada universidad y si llegas a su nota de corte.',
    'head.cfg': 'Configurar datos',

    'score.label': 'Nota de admisión',
    'score.label.range': 'Nota de admisión, según la universidad',
    'score.label.acc': 'Nota de acceso',
    'score.restore': 'Restaurar notas reales',
    'calc.bac': 'Media del Bac',
    'calc.acc': 'Nota de acceso (Bac pasado a /10)',
    'results.foot': 'Las notas de corte cambian cada año y suelen bajar en las listas que siguen a la primera.',

    'pending.title': 'Notas por llegar',
    'pending.reset': 'Volver a la estimación inicial',
    'pending.done': 'Todas las notas están introducidas: la nota de admisión ya es definitiva.',
    'pending.sub': '{pc} de {tot} coeficientes. Los valores de partida son estimaciones a partir de las notas que ya tienes, no notas reales.',
    'known.title': 'Notas ya obtenidas',
    'known.switch': 'Probar otros escenarios',
    'known.reset': 'Restaurar las notas reales',
    'known.none': 'Aún no hay notas fijadas. Añádelas en la configuración.',
    'known.scen': '{kc} de {tot} coeficientes. La marca {mark} señala la nota real; si mueves un slider, su valor se pone en rojo.',
    'known.sub': '{kc} de {tot} coeficientes, con una media de {avg}. Activa los escenarios para ver qué habría pasado con otras notas.',

    'mention.tbf': 'Très Bien · félicitations',
    'mention.tb': 'Très Bien',
    'mention.b': 'Bien',
    'mention.ab': 'Assez Bien',
    'mention.none': 'Sin mención',
    'mention.fail': 'No aprobado',

    'sl.down': 'Bajar {x} 0,1',
    'sl.up': 'Subir {x} 0,1',
    'sl.sens': '1 punto = +{a}',
    'sl.sens.range': '1 punto = +{a} a +{b}',
    'sl.real': 'Nota real: {x}',
    'sl.changed': ' · cambiada',
    'coef': 'coef.',

    'unis.empty': 'Elige hasta tres carreras y facultades para ver si llegas a su nota de corte.',
    'unis.choose': 'Elegir universidades',
    'uni.nodeg': 'Grado sin indicar',
    'uni.fallback': 'Universidad {n}',
    'uni.ok': 'Entra',
    'uni.no': 'No llega',
    'uni.cut': 'Nota de corte {x}',
    'uni.cut.none': ' (sin corte)',
    'uni.cut.manual': ' · cambiada a mano ({lbl}: {x})',
    'uni.cut.list': 'listado',
    'uni.need.fixed': 'Las notas de especialidad ya están fijadas',
    'uni.need.never': 'No llega ni con un 20 en {s}',
    'uni.need.always': 'Llega con cualquier nota en {s}',
    'uni.need.x': 'Llega con un {x} en {s}',
    'uni.need.and': '{a} y en {b}',
    'uni.parts': 'Acceso {x}',
    'uni.parts.fail': 'Sin Bac aprobado no hay nota de admisión',

    'reach.none': 'Elige universidades para comparar',
    'reach.one': 'Llega a {n} de {m} opción',
    'reach.many': 'Llega a {n} de {m} opciones',
    'scen.one': 'Escenario: {n} nota obtenida cambiada',
    'scen.many': 'Escenario: {n} notas obtenidas cambiadas',
    'scen.mini': ' · escenario',

    'warn.fail': 'Con una media del Bac inferior a 10 no se aprueba el Bac.',
    'warn.nosubj': 'No hay asignaturas que sumen en la fase de admisión: añádelas en la configuración.',
    'warn.low': '{s} no cuenta: {src} está por debajo de 10.',
    'warn.svt': '{s} no cuenta: la media de enseignement scientifique queda por debajo de 10.',

    'src.summary': 'Datos de las universidades: {n} carreras y centros de {u} universidades',
    'src.intro': 'Solo se incluyen universidades públicas de comunidades que aceptan el reconocimiento de las especialidades del Bac, según UNEDasiss. Las notas de corte son, salvo que se indique otra cosa, las de la primera adjudicación de julio de 2026; un 5,000 significa que no hubo corte. Si un centro aparece «sin nota de corte», escríbela tú. Las ponderaciones no vienen en el listado: indícalas tú con la tabla oficial de cada universidad. Comprueba siempre los datos oficiales antes de decidir.',
    'src.cuts': 'notas de corte',
    'src.weights': 'tabla de ponderaciones',
    'src.links': 'Enlaces:',

    'cut.unknown': 'sin nota de corte',
    'cut.none': 'sin corte',
    'detail.group': 'grupo {g}',

    'foot.disclaimer': 'Herramienta orientativa: no sustituye a la información oficial de UNEDasiss ni de las universidades. Los datos que introduces se guardan solo en este navegador.',

    /* Pruebas del Bac */
    'b.fre': 'Francés escrito', 'b.fro': 'Francés oral', 'b.mta': 'Matemáticas',
    'b.hg': 'Historia-geografía', 'b.es': 'Enseignement scientifique', 'b.emc': 'EMC',
    'b.phi': 'Filosofía', 'b.gor': 'Gran oral', 'b.eps': 'Educación física',
    'b.cdm': 'Connaissance du monde', 'b.dnl2': 'DNL2 (opcional)',
    'b.lva': 'Lengua A', 'b.lvb': 'Lengua B', 'b.spd': 'Especialidad dejada · {s}',
    'b.acl': 'ACL {kind}', 'b.dnl': 'DNL {s} · {kind}', 'b.written': 'escrito', 'b.oral': 'oral',
    'b.spec': 'Especialidad',
    'h.spe': 'Examen de especialidad', 'h.phi': 'Disertación escrita de 4 h', 'h.gor': 'Oral de 20 minutos',
    'h.eps': 'Tres evaluaciones en Terminale', 'h.cdm': 'Oral en la lengua de la sección',
    'h.acl': 'Approfondissement culturel et linguistique', 'h.dnl': 'Disciplina no lingüística, en la lengua de la sección',
    'h.dnl2': 'Evaluación opcional',
    'ph.p1x': 'Première · exámenes anticipados', 'ph.p1c': 'Première · evaluación continua',
    'ph.t2x': 'Terminale · exámenes finales', 'ph.t2c': 'Terminale · evaluación continua',
    'ph.t2b': 'Terminale · evaluaciones específicas del BFI', 'ph.opt': 'Opciones',
    'opt.n': 'Opción {n}',

    /* Asignaturas españolas */
    'subj.bio': 'Biología', 'subj.qui': 'Química', 'subj.fis': 'Física', 'subj.mat': 'Matemáticas II',
    'subj.mcs': 'Matemáticas Aplicadas a las Ciencias Sociales II', 'subj.emp': 'Empresa y Diseño de Modelos de Negocio',
    'subj.len': 'Lengua Extranjera II (Inglés)', 'subj.tec': 'Tecnología e Ingeniería II',
    'subj.generic': 'Asignatura',

    /* Configuración */
    'cfg.eyebrow': 'Configuración', 'cfg.title': 'Datos del alumno', 'cfg.close': 'Cerrar sin guardar',
    'cfg.nav': 'Secciones de la configuración',
    'nav.alumno': 'Alumno', 'nav.esp': 'Especialidades', 'nav.notas': 'Notas', 'nav.opc': 'Opciones',
    'nav.asig': 'Asignaturas en España', 'nav.unis': 'Universidades', 'nav.datos': 'Guardar y compartir',
    'cfg.cancel': 'Cancelar', 'cfg.save': 'Guardar y ver',

    'f.alumno': 'Alumno', 'f.name': 'Nombre (opcional)', 'f.name.ph': 'Ej.: Lucía',
    'f.lva': 'Lengua A (LVA)', 'f.lva.ph': 'Ej.: Inglés', 'f.lvb': 'Lengua B (LVB)', 'f.lvb.ph': 'Ej.: Español',
    'f.bactype': 'Tipo de Bac', 'f.bac.gen': 'Bac general', 'f.bac.bfi': 'Bac français international (BFI)',
    'f.bfi.note': 'En el BFI, el ACL sustituye a una de las lenguas y la DNL a historia-geografía o a enseignement scientifique en la evaluación continua. Se suman Connaissance du monde y, si se hace, la DNL2. Lo indica el boletín de notas.',
    'f.bfi.acl': 'El ACL sustituye a', 'f.bfi.dnl': 'La DNL sustituye a', 'f.bfi.dnl2': 'Hace la DNL2 opcional (coef. 20)',

    'f.esp': 'Especialidades', 'f.esp.note': 'Las dos que se cursan en Terminale y la que se dejó al terminar Première.',
    'f.sp1': 'Especialidad 1 (Terminale)', 'f.sp2': 'Especialidad 2 (Terminale)', 'f.spd': 'Especialidad dejada en Première',

    'f.notas': 'Notas',
    'f.notas.note': 'Escribe las notas sobre 20 que ya tengas, con coma o punto decimal. <strong>Deja en blanco las que falten:</strong> aparecerán como sliders. ',
    'f.notas.gen': 'Los coeficientes son los del Bac general de 2027 en adelante: suman {x} sin contar las opciones.',
    'f.notas.bfi': 'Los coeficientes son los del BFI de 2027 en adelante: suman {x} sin contar las opciones.',
    'f.notas.end': ' Cámbialos solo si cambia la normativa.',
    'f.col.test': 'Prueba', 'f.col.coef': 'Coef.', 'f.col.grade': 'Nota /20',
    'f.pending': 'pendiente', 'f.coefof': 'Coeficiente de {x}', 'f.gradeof': 'Nota de {x}',

    'f.opc': 'Opciones',
    'f.opc.note': 'Cada opción suma sus coeficientes a la media, normalmente 2 por curso. Maths complémentaires, Maths expertes y DGEMC solo existen en Terminale: pon 0 en el coeficiente de Première.',
    'f.opc.none': 'Sin opciones.', 'f.opc.name': 'Nombre', 'f.opc.name.ph': 'Ej.: Latín',
    'f.opc.cp': 'Coef. Première', 'f.opc.gp': 'Nota Première', 'f.opc.ct': 'Coef. Terminale', 'f.opc.gt': 'Nota Terminale',
    'f.opc.del': 'Quitar opción', 'f.opc.add': 'Añadir opción', 'f.opc.example': 'Latín',

    'f.asig': 'Asignaturas que cuentan en España',
    'f.asig.note': 'Asignaturas del bachillerato español que UNEDasiss reconoce a partir de las notas del Bac. Cada universidad suma las dos que más le aportan. SVT cuenta como Biología; Physique-chimie, como Química y también puede contar como Física. Cuánto pondera cada una (0, 0,1 o 0,2) se indica en cada universidad, más abajo.',
    'f.asig.none': 'Ninguna asignatura: la nota de admisión se quedaría en la nota de acceso, como máximo 10.',
    'f.asig.es': 'Asignatura española', 'f.asig.other': 'Otra (escribir el nombre)',
    'f.asig.name': 'Nombre de la asignatura', 'f.asig.name.ph': 'Ej.: Latín II',
    'f.asig.src': 'Toma la nota de', 'f.asig.src.choose': 'Elige de dónde sale la nota',
    'f.asig.del': 'Quitar', 'f.asig.add': 'Añadir asignatura', 'f.asig.redo': 'Rehacer según las especialidades',
    'src.exam': 'Examen de {s}', 'src.spd': '{s} (dejada en Première)',

    'f.unis': 'Universidades',
    'f.unis.note': 'Elige hasta tres carreras: busca la carrera (y, si quieres, la ciudad o la universidad), elige el centro y la nota de corte del último curso se rellena sola. La ponderación de cada asignatura la indicas tú, según la tabla oficial de la universidad. El listado incluye universidades públicas de las comunidades que reconocen las especialidades del Bac. Si tu carrera o tu universidad no aparece, usa «Escribir a mano».',
    'f.unis.note.nodb': 'Hasta tres grados con su nota de corte sobre 14 y la ponderación de cada asignatura.',
    'u.legend': 'Universidad {n}', 'u.how': 'Cómo elegir la universidad {n}',
    'u.mode.list': 'Elegir del listado', 'u.mode.manual': 'Escribir a mano',
    'u.search': 'Carrera y universidad',
    'u.search.ph': 'Ej.: medicina valencia',
    'u.search.hint': 'Escribe la carrera y, si quieres, la ciudad, la universidad o la comunidad. Por ejemplo: «medicina valencia», «enfermería UAM», «biomédica».',
    'u.search.none': 'No hay resultados para «{q}». Prueba con menos palabras o usa «Escribir a mano».',
    'u.search.count.one': '1 resultado',
    'u.search.count': '{n} resultados',
    'u.search.more': 'Se muestran {k} de {n}: añade la ciudad o la universidad para afinar.',
    'u.change': 'Cambiar',
    'u.cut': 'Nota de corte (/14)',
    'u.cut.missing': 'No tengo la nota de corte de este centro: escríbela tú. La encontrarás en la web de la universidad.',
    'u.cut.from': 'Nota de corte del listado ({lbl})',
    'u.cut.none5': '5,000, es decir, sin corte',
    'u.cut.update': '. Puedes cambiarla si se publica una más reciente.',
    'u.weights': 'Ponderación de cada asignatura en este grado: consúltala en la tabla oficial de la universidad.',
    'u.clear': 'Vaciar',
    'u.name': 'Universidad', 'u.name.ph': 'Ej.: Universitat de València',
    'u.degree': 'Grado', 'u.degree.ph': 'Ej.: Medicina', 'u.cut.ph': 'Ej.: 12,720',
    'w.none': 'No pondera', 'w.x': 'Pondera {x}',

    'f.datos': 'Guardar y compartir',
    'f.datos.note': 'Los datos se guardan automáticamente en este navegador. Para usarlos en otro equipo o pasárselos a otra persona, cópialos{dl} y luego impórtalos allí.',
    'f.datos.dl': ' o descárgalos',
    'f.copy': 'Copiar datos', 'f.download': 'Descargar archivo', 'f.importfile': 'Importar archivo',
    'f.paste': 'O pega aquí unos datos copiados', 'f.importtext': 'Importar texto pegado',
    'f.example': 'Cargar el ejemplo', 'f.blank': 'Empezar en blanco',

    'st.readerr': 'No se ha podido leer: el texto no tiene el formato de datos del simulador.',
    'st.nodata': 'No se han encontrado datos del simulador en lo importado.',
    'st.imported': 'Datos importados. Revísalos y pulsa «Guardar y ver».',
    'st.fileerr': 'No se ha podido abrir el archivo.',
    'st.copyfail': 'No se ha podido copiar solo. El texto está seleccionado en el recuadro: cópialo con Ctrl+C o Cmd+C.',
    'st.copied': 'Datos copiados. Pégalos en «Importar texto» en el otro equipo.',
    'st.downloaded': 'Archivo descargado.',
    'st.example': 'Ejemplo cargado. Pulsa «Guardar y ver» para usarlo.',

    'v.bad': 'Hay valores no válidos, marcados en rojo. Las notas van de 0 a 20 y las notas de corte de 0 a 14.',
    'v.samespec': 'Elige dos especialidades de Terminale distintas.',
    'v.spd': 'La especialidad dejada en Première no puede ser una de las de Terminale.',
    'v.nocut': 'Falta la nota de corte de la universidad {n}.',

    'ex.lva': 'Inglés', 'ex.lvb': 'Español',

    /* Etiquetas de convocatoria de las notas de corte (campo ck del listado) */
    'ck.default': '1.ª adjudicación 2026'
  };

  var methodEs =
    '<h3>Cómo se calcula</h3>' +
    '<p>La nota del Bac es la media de todas las pruebas, cada una con su coeficiente: 100 en total en el Bac general y 148 en el Bac français international (168 con la DNL2), más los de las opciones. Esa media, la misma que aparece en el boletín de notas, se pasa a la escala española con la fórmula de su tramo y da la nota de acceso, hasta 10.</p>' +
    '<div class="tbl-wrap" style="margin-bottom:12px"><table><thead><tr><th>Media del Bac</th><th>Fórmula de conversión</th></tr></thead><tbody>' +
    '<tr><td class="num">10 – 11,99</td><td class="num">0,8372 × nota − 3,3714</td></tr>' +
    '<tr><td class="num">12 – 13,99</td><td class="num">0,502 × nota + 0,6579</td></tr>' +
    '<tr><td class="num">14 – 15,99</td><td class="num">0,3719 × nota + 2,479</td></tr>' +
    '<tr><td class="num">16 – 20</td><td class="num">0,394 × nota + 2,123 (máximo 10)</td></tr>' +
    '</tbody></table></div>' +
    '<p>Después, cada universidad suma como mucho dos asignaturas reconocidas: la nota sobre 20 se divide entre 2 y se multiplica por la ponderación del grado (0,1 o 0,2). Cuentan las dos que más suman.</p>' +
    '<p class="formula">Nota /14 = nota de acceso + las dos mejores (nota /20 ÷ 2 × ponderación)</p>' +
    '<ul>' +
    '<li>Una asignatura solo cuenta con 10/20 o más.</li>' +
    '<li>SVT cuenta como Biología si la media de enseignement scientifique de Première y Terminale llega a 10.</li>' +
    '<li>Physique-chimie puede reconocerse también como Física, y Mathématiques como Matemáticas II, que puede exigir haber cursado Maths expertes. Confirma con UNEDasiss qué te reconocen y añádelo en la configuración.</li>' +
    '<li>Las notas de corte del listado son las del último curso, en general de la primera adjudicación de julio de 2026, y suelen bajar en las listas siguientes. Las ponderaciones no vienen en el listado: búscalas en la tabla oficial de cada universidad y elígelas en la configuración. Cortes y ponderaciones cambian cada año.</li>' +
    '<li>Los coeficientes por defecto son los del Bac de 2027 en adelante. En el BFI, el ACL (20) sustituye a una lengua, la DNL (20) a historia-geografía o a enseignement scientifique, y se suman Connaissance du monde (20) y la DNL2 opcional (20).</li>' +
    '<li>No incluye las pruebas PCE de UNEDasiss.</li>' +
    '</ul>' +
    '<p>Fuentes: <a href="https://boe.es/buscar/pdf/2025/BOE-A-2025-10777-consolidado.pdf" target="_blank" rel="noopener">Orden EFD/550/2025 (BOE)</a> · <a href="https://www.letudiant.fr/bac/coefficients-bac-par-matiere-et-serie.html" target="_blank" rel="noopener">coeficientes del Bac 2027</a> · <a href="https://siec.education.fr/candidats/docutheque/download/fiches-de-synthese-reglementaire-session-2027/Fiches%20de%20synth%C3%A8se%20BCG-BTN-Session%202027%20(web)-pdf" target="_blank" rel="noopener">fichas de la sesión 2027, con el BFI (SIEC)</a> · <a href="https://unedasiss.uned.es/" target="_blank" rel="noopener">UNEDasiss</a></p>';

  var fr = {
    'doc.title': 'Simulateur Bac → Espagne',
    'doc.desc': 'Calculez la note d’admission à l’université espagnole (sur 14) avec le Bac français et comparez-la aux seuils d’admission.',
    'lang.es': 'Español',
    'lang.fr': 'Français',
    'lang.group': 'Langue',

    'head.eyebrow.gen': 'Bac français → université espagnole',
    'head.eyebrow.bfi': 'Bac français international (BFI) → université espagnole',
    'head.h1': 'Simulateur de note d’admission',
    'head.h1.student': 'Note d’admission de {name}',
    'head.lead': 'Les notes déjà obtenues restent fixes. Faites varier celles qui manquent pour voir la note <strong>sur 14</strong> dans chaque université et si vous atteignez son seuil d’admission.',
    'head.cfg': 'Configurer',

    'score.label': 'Note d’admission',
    'score.label.range': 'Note d’admission, selon l’université',
    'score.label.acc': 'Note d’accès',
    'score.restore': 'Rétablir les notes réelles',
    'calc.bac': 'Moyenne du Bac',
    'calc.acc': 'Note d’accès (Bac converti sur 10)',
    'results.foot': 'Les seuils d’admission changent chaque année et baissent souvent dans les listes qui suivent la première.',

    'pending.title': 'Notes à venir',
    'pending.reset': 'Revenir à l’estimation initiale',
    'pending.done': 'Toutes les notes sont saisies : la note d’admission est définitive.',
    'pending.sub': '{pc} coefficients sur {tot}. Les valeurs de départ sont des estimations à partir des notes déjà obtenues, pas des notes réelles.',
    'known.title': 'Notes déjà obtenues',
    'known.switch': 'Tester d’autres scénarios',
    'known.reset': 'Rétablir les notes réelles',
    'known.none': 'Aucune note saisie pour l’instant. Ajoutez-les dans la configuration.',
    'known.scen': '{kc} coefficients sur {tot}. Le repère {mark} indique la note réelle ; si vous déplacez un curseur, sa valeur passe en rouge.',
    'known.sub': '{kc} coefficients sur {tot}, avec une moyenne de {avg}. Activez les scénarios pour voir ce qui se serait passé avec d’autres notes.',

    'mention.tbf': 'Très bien · félicitations',
    'mention.tb': 'Très bien',
    'mention.b': 'Bien',
    'mention.ab': 'Assez bien',
    'mention.none': 'Sans mention',
    'mention.fail': 'Non obtenu',

    'sl.down': 'Baisser {x} de 0,1',
    'sl.up': 'Augmenter {x} de 0,1',
    'sl.sens': '1 point = +{a}',
    'sl.sens.range': '1 point = +{a} à +{b}',
    'sl.real': 'Note réelle : {x}',
    'sl.changed': ' · modifiée',
    'coef': 'coef.',

    'unis.empty': 'Choisissez jusqu’à trois formations pour voir si vous atteignez leur seuil d’admission.',
    'unis.choose': 'Choisir des universités',
    'uni.nodeg': 'Formation non indiquée',
    'uni.fallback': 'Université {n}',
    'uni.ok': 'Atteint',
    'uni.no': 'Pas atteint',
    'uni.cut': 'Seuil {x}',
    'uni.cut.none': ' (pas de seuil)',
    'uni.cut.manual': ' · modifié à la main ({lbl} : {x})',
    'uni.cut.list': 'liste',
    'uni.need.fixed': 'Les notes de spécialité sont déjà saisies',
    'uni.need.never': 'Pas atteint, même avec 20 en {s}',
    'uni.need.always': 'Atteint avec n’importe quelle note en {s}',
    'uni.need.x': 'Atteint avec {x} en {s}',
    'uni.need.and': '{a} et en {b}',
    'uni.parts': 'Accès {x}',
    'uni.parts.fail': 'Sans Bac obtenu, pas de note d’admission',

    'reach.none': 'Choisissez des universités à comparer',
    'reach.one': 'Seuil atteint : {n} sur {m}',
    'reach.many': 'Seuil atteint : {n} sur {m}',
    'scen.one': 'Scénario : {n} note obtenue modifiée',
    'scen.many': 'Scénario : {n} notes obtenues modifiées',
    'scen.mini': ' · scénario',

    'warn.fail': 'Avec une moyenne inférieure à 10, le Bac n’est pas obtenu.',
    'warn.nosubj': 'Aucune matière ne compte pour la phase d’admission : ajoutez-en dans la configuration.',
    'warn.low': '{s} ne compte pas : {src} est en dessous de 10.',
    'warn.svt': '{s} ne compte pas : la moyenne d’enseignement scientifique est en dessous de 10.',

    'src.summary': 'Données des universités : {n} formations et établissements dans {u} universités',
    'src.intro': 'Seules sont incluses les universités publiques des communautés autonomes qui acceptent la reconnaissance des spécialités du Bac, d’après UNEDasiss. Sauf mention contraire, les seuils sont ceux de la première liste d’affectation de juillet 2026 ; un 5,000 signifie qu’il n’y a pas eu de seuil. Si un établissement apparaît « seuil inconnu », saisissez-le vous-même. Les pondérations ne figurent pas dans la liste : indiquez-les d’après le tableau officiel de chaque université. Vérifiez toujours les données officielles avant de décider.',
    'src.cuts': 'seuils',
    'src.weights': 'tableau des pondérations',
    'src.links': 'Liens :',

    'cut.unknown': 'seuil inconnu',
    'cut.none': 'pas de seuil',
    'detail.group': 'groupe {g}',

    'foot.disclaimer': 'Outil indicatif : il ne remplace pas les informations officielles d’UNEDasiss ni des universités. Les données saisies sont enregistrées uniquement dans ce navigateur.',

    'b.fre': 'Français écrit', 'b.fro': 'Français oral', 'b.mta': 'Mathématiques',
    'b.hg': 'Histoire-géographie', 'b.es': 'Enseignement scientifique', 'b.emc': 'EMC',
    'b.phi': 'Philosophie', 'b.gor': 'Grand oral', 'b.eps': 'EPS',
    'b.cdm': 'Connaissance du monde', 'b.dnl2': 'DNL2 (facultative)',
    'b.lva': 'Langue A', 'b.lvb': 'Langue B', 'b.spd': 'Spécialité abandonnée · {s}',
    'b.acl': 'ACL {kind}', 'b.dnl': 'DNL {s} · {kind}', 'b.written': 'écrit', 'b.oral': 'oral',
    'b.spec': 'Spécialité',
    'h.spe': 'Épreuve de spécialité', 'h.phi': 'Dissertation écrite de 4 h', 'h.gor': 'Oral de 20 minutes',
    'h.eps': 'Trois évaluations en Terminale', 'h.cdm': 'Oral dans la langue de la section',
    'h.acl': 'Approfondissement culturel et linguistique', 'h.dnl': 'Discipline non linguistique, dans la langue de la section',
    'h.dnl2': 'Évaluation facultative',
    'ph.p1x': 'Première · épreuves anticipées', 'ph.p1c': 'Première · contrôle continu',
    'ph.t2x': 'Terminale · épreuves finales', 'ph.t2c': 'Terminale · contrôle continu',
    'ph.t2b': 'Terminale · épreuves spécifiques du BFI', 'ph.opt': 'Options',
    'opt.n': 'Option {n}',

    'subj.bio': 'Biologie', 'subj.qui': 'Chimie', 'subj.fis': 'Physique', 'subj.mat': 'Mathématiques II',
    'subj.mcs': 'Mathématiques appliquées aux sciences sociales II', 'subj.emp': 'Entreprise et conception de modèles d’affaires',
    'subj.len': 'Langue étrangère II (anglais)', 'subj.tec': 'Technologie et ingénierie II',
    'subj.generic': 'Matière',

    'cfg.eyebrow': 'Configuration', 'cfg.title': 'Données de l’élève', 'cfg.close': 'Fermer sans enregistrer',
    'cfg.nav': 'Sections de la configuration',
    'nav.alumno': 'Élève', 'nav.esp': 'Spécialités', 'nav.notas': 'Notes', 'nav.opc': 'Options',
    'nav.asig': 'Matières en Espagne', 'nav.unis': 'Universités', 'nav.datos': 'Enregistrer et partager',
    'cfg.cancel': 'Annuler', 'cfg.save': 'Enregistrer et voir',

    'f.alumno': 'Élève', 'f.name': 'Prénom (facultatif)', 'f.name.ph': 'Ex. : Lucie',
    'f.lva': 'Langue A (LVA)', 'f.lva.ph': 'Ex. : Anglais', 'f.lvb': 'Langue B (LVB)', 'f.lvb.ph': 'Ex. : Espagnol',
    'f.bactype': 'Type de Bac', 'f.bac.gen': 'Bac général', 'f.bac.bfi': 'Bac français international (BFI)',
    'f.bfi.note': 'Dans le BFI, l’ACL remplace l’une des langues et la DNL remplace l’histoire-géographie ou l’enseignement scientifique en contrôle continu. S’y ajoutent Connaissance du monde et, le cas échéant, la DNL2. C’est indiqué sur le bulletin.',
    'f.bfi.acl': 'L’ACL remplace', 'f.bfi.dnl': 'La DNL remplace', 'f.bfi.dnl2': 'Présente la DNL2 facultative (coef. 20)',

    'f.esp': 'Spécialités', 'f.esp.note': 'Les deux suivies en Terminale et celle abandonnée à la fin de la Première.',
    'f.sp1': 'Spécialité 1 (Terminale)', 'f.sp2': 'Spécialité 2 (Terminale)', 'f.spd': 'Spécialité abandonnée en Première',

    'f.notas': 'Notes',
    'f.notas.note': 'Saisissez les notes sur 20 déjà obtenues, avec une virgule ou un point. <strong>Laissez vides celles qui manquent :</strong> elles apparaîtront sous forme de curseurs. ',
    'f.notas.gen': 'Les coefficients sont ceux du Bac général à partir de 2027 : ils totalisent {x} sans compter les options.',
    'f.notas.bfi': 'Les coefficients sont ceux du BFI à partir de 2027 : ils totalisent {x} sans compter les options.',
    'f.notas.end': ' Ne les modifiez que si la réglementation change.',
    'f.col.test': 'Épreuve', 'f.col.coef': 'Coef.', 'f.col.grade': 'Note /20',
    'f.pending': 'à venir', 'f.coefof': 'Coefficient de {x}', 'f.gradeof': 'Note de {x}',

    'f.opc': 'Options',
    'f.opc.note': 'Chaque option ajoute ses coefficients à la moyenne, en général 2 par année. Maths complémentaires, Maths expertes et DGEMC n’existent qu’en Terminale : mettez 0 au coefficient de Première.',
    'f.opc.none': 'Aucune option.', 'f.opc.name': 'Nom', 'f.opc.name.ph': 'Ex. : Latin',
    'f.opc.cp': 'Coef. Première', 'f.opc.gp': 'Note Première', 'f.opc.ct': 'Coef. Terminale', 'f.opc.gt': 'Note Terminale',
    'f.opc.del': 'Retirer l’option', 'f.opc.add': 'Ajouter une option', 'f.opc.example': 'Latin',

    'f.asig': 'Matières qui comptent en Espagne',
    'f.asig.note': 'Matières du baccalauréat espagnol qu’UNEDasiss reconnaît à partir des notes du Bac. Chaque université retient les deux qui rapportent le plus. La SVT compte comme Biología ; la physique-chimie comme Química, et peut aussi compter comme Física. La pondération de chacune (0 ; 0,1 ou 0,2) s’indique pour chaque université, plus bas.',
    'f.asig.none': 'Aucune matière : la note d’admission resterait égale à la note d’accès, 10 au maximum.',
    'f.asig.es': 'Matière espagnole', 'f.asig.other': 'Autre (saisir le nom)',
    'f.asig.name': 'Nom de la matière', 'f.asig.name.ph': 'Ex. : Latín II',
    'f.asig.src': 'Prend la note de', 'f.asig.src.choose': 'Choisissez d’où vient la note',
    'f.asig.del': 'Retirer', 'f.asig.add': 'Ajouter une matière', 'f.asig.redo': 'Refaire d’après les spécialités',
    'src.exam': 'Épreuve de {s}', 'src.spd': '{s} (abandonnée en Première)',

    'f.unis': 'Universités',
    'f.unis.note': 'Choisissez jusqu’à trois formations : cherchez la formation (et, si vous voulez, la ville ou l’université), choisissez l’établissement et le seuil de l’année précédente se remplit tout seul. La pondération de chaque matière, c’est vous qui l’indiquez d’après le tableau officiel de l’université. La liste comprend les universités publiques des communautés qui reconnaissent les spécialités du Bac. On peut chercher en français (« médecine », « infirmier ») ou en espagnol (« medicina », « enfermería »). Si votre formation ou votre université n’y figure pas, utilisez « Saisir à la main ».',
    'f.unis.note.nodb': 'Jusqu’à trois formations avec leur seuil sur 14 et la pondération de chaque matière.',
    'u.legend': 'Université {n}', 'u.how': 'Comment choisir l’université {n}',
    'u.mode.list': 'Choisir dans la liste', 'u.mode.manual': 'Saisir à la main',
    'u.search': 'Formation et université',
    'u.search.ph': 'Ex. : médecine valencia',
    'u.search.hint': 'Saisissez la formation et, si vous voulez, la ville, l’université ou la communauté. Par exemple : « médecine valencia », « infirmier UAM », « biomédicale ».',
    'u.search.none': 'Aucun résultat pour « {q} ». Essayez avec moins de mots ou utilisez « Saisir à la main ».',
    'u.search.count.one': '1 résultat',
    'u.search.count': '{n} résultats',
    'u.search.more': '{k} sur {n} affichés : ajoutez la ville ou l’université pour affiner.',
    'u.change': 'Modifier',
    'u.cut': 'Seuil d’admission (/14)',
    'u.cut.missing': 'Je n’ai pas le seuil de cet établissement : saisissez-le vous-même. Vous le trouverez sur le site de l’université.',
    'u.cut.from': 'Seuil de la liste ({lbl})',
    'u.cut.none5': '5,000, c’est-à-dire pas de seuil',
    'u.cut.update': '. Vous pouvez le modifier si un plus récent est publié.',
    'u.weights': 'Pondération de chaque matière dans cette formation : consultez le tableau officiel de l’université.',
    'u.clear': 'Vider',
    'u.name': 'Université', 'u.name.ph': 'Ex. : Universitat de València',
    'u.degree': 'Formation', 'u.degree.ph': 'Ex. : Medicina', 'u.cut.ph': 'Ex. : 12,720',
    'w.none': 'Non pondérée', 'w.x': 'Pondération {x}',

    'f.datos': 'Enregistrer et partager',
    'f.datos.note': 'Les données sont enregistrées automatiquement dans ce navigateur. Pour les utiliser sur un autre appareil ou les transmettre à quelqu’un, copiez-les{dl} puis importez-les là-bas.',
    'f.datos.dl': ' ou téléchargez-les',
    'f.copy': 'Copier les données', 'f.download': 'Télécharger le fichier', 'f.importfile': 'Importer un fichier',
    'f.paste': 'Ou collez ici des données copiées', 'f.importtext': 'Importer le texte collé',
    'f.example': 'Charger l’exemple', 'f.blank': 'Repartir de zéro',

    'st.readerr': 'Lecture impossible : le texte n’a pas le format des données du simulateur.',
    'st.nodata': 'Aucune donnée du simulateur trouvée dans ce qui a été importé.',
    'st.imported': 'Données importées. Vérifiez-les et cliquez sur « Enregistrer et voir ».',
    'st.fileerr': 'Impossible d’ouvrir le fichier.',
    'st.copyfail': 'La copie automatique a échoué. Le texte est sélectionné dans le cadre : copiez-le avec Ctrl+C ou Cmd+C.',
    'st.copied': 'Données copiées. Collez-les dans « Importer le texte » sur l’autre appareil.',
    'st.downloaded': 'Fichier téléchargé.',
    'st.example': 'Exemple chargé. Cliquez sur « Enregistrer et voir » pour l’utiliser.',

    'v.bad': 'Certaines valeurs, en rouge, ne sont pas valides. Les notes vont de 0 à 20 et les seuils de 0 à 14.',
    'v.samespec': 'Choisissez deux spécialités de Terminale différentes.',
    'v.spd': 'La spécialité abandonnée en Première ne peut pas être l’une de celles de Terminale.',
    'v.nocut': 'Il manque le seuil de l’université {n}.',

    'ex.lva': 'Anglais', 'ex.lvb': 'Espagnol',

    'ck.default': '1re affectation 2026'
  };

  var methodFr =
    '<h3>Comment c’est calculé</h3>' +
    '<p>La note du Bac est la moyenne de toutes les épreuves, chacune avec son coefficient : 100 au total pour le Bac général et 148 pour le Bac français international (168 avec la DNL2), plus ceux des options. Cette moyenne, celle du relevé de notes, est convertie à l’échelle espagnole avec la formule de sa tranche et donne la note d’accès, jusqu’à 10.</p>' +
    '<div class="tbl-wrap" style="margin-bottom:12px"><table><thead><tr><th>Moyenne du Bac</th><th>Formule de conversion</th></tr></thead><tbody>' +
    '<tr><td class="num">10 – 11,99</td><td class="num">0,8372 × note − 3,3714</td></tr>' +
    '<tr><td class="num">12 – 13,99</td><td class="num">0,502 × note + 0,6579</td></tr>' +
    '<tr><td class="num">14 – 15,99</td><td class="num">0,3719 × note + 2,479</td></tr>' +
    '<tr><td class="num">16 – 20</td><td class="num">0,394 × note + 2,123 (10 au maximum)</td></tr>' +
    '</tbody></table></div>' +
    '<p>Ensuite, chaque université ajoute au plus deux matières reconnues : la note sur 20 est divisée par 2 et multipliée par la pondération de la formation (0,1 ou 0,2). Ce sont les deux qui rapportent le plus qui comptent.</p>' +
    '<p class="formula">Note /14 = note d’accès + les deux meilleures (note /20 ÷ 2 × pondération)</p>' +
    '<ul>' +
    '<li>Une matière ne compte qu’à partir de 10/20.</li>' +
    '<li>La SVT compte comme Biología si la moyenne d’enseignement scientifique de Première et de Terminale atteint 10.</li>' +
    '<li>La physique-chimie peut aussi être reconnue comme Física, et les mathématiques comme Matemáticas II, ce qui peut exiger d’avoir suivi Maths expertes. Vérifiez auprès d’UNEDasiss ce qui vous est reconnu et ajoutez-le dans la configuration.</li>' +
    '<li>Les seuils de la liste sont ceux de l’année précédente, en général de la première liste d’affectation de juillet 2026, et baissent souvent dans les listes suivantes. Les pondérations ne figurent pas dans la liste : cherchez-les dans le tableau officiel de chaque université et choisissez-les dans la configuration. Seuils et pondérations changent chaque année.</li>' +
    '<li>Les coefficients par défaut sont ceux du Bac à partir de 2027. Dans le BFI, l’ACL (20) remplace une langue, la DNL (20) remplace l’histoire-géographie ou l’enseignement scientifique, et s’ajoutent Connaissance du monde (20) et la DNL2 facultative (20).</li>' +
    '<li>Les épreuves PCE d’UNEDasiss ne sont pas prises en compte.</li>' +
    '</ul>' +
    '<p>Sources : <a href="https://boe.es/buscar/pdf/2025/BOE-A-2025-10777-consolidado.pdf" target="_blank" rel="noopener">Orden EFD/550/2025 (BOE)</a> · <a href="https://www.letudiant.fr/bac/coefficients-bac-par-matiere-et-serie.html" target="_blank" rel="noopener">coefficients du Bac 2027</a> · <a href="https://siec.education.fr/candidats/docutheque/download/fiches-de-synthese-reglementaire-session-2027/Fiches%20de%20synth%C3%A8se%20BCG-BTN-Session%202027%20(web)-pdf" target="_blank" rel="noopener">fiches de la session 2027, avec le BFI (SIEC)</a> · <a href="https://unedasiss.uned.es/" target="_blank" rel="noopener">UNEDasiss</a></p>';

  /* Traducción de los textos que vienen del listado de universidades */
  var ckFr = {
    '1.ª adjudicación 2026': '1re affectation 2026',
    '2.ª adjudicación 2026': '2e affectation 2026',
    'adjudicación de julio 2026': 'affectation de juillet 2026',
    'cierre 2026-27': 'clôture 2026-27',
    'cierre 2025-26': 'clôture 2025-26',
    'lista del 31 jul 2026': 'liste du 31 juil. 2026'
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

  var DICT = {es: es, fr: fr};
  /* Espacio fino antes de la puntuación doble en francés */
  Object.keys(fr).forEach(function(k){
    fr[k] = fr[k].replace(/ ([:;!?»])/g, ' $1').replace(/« /g, '« ');
  });
  methodFr = methodFr.replace(/ ([:;!?»])/g, ' $1');

  var lang = 'es';
  function t(k, p){
    var s = DICT[lang][k];
    if (s == null) s = es[k];
    if (s == null) return k;
    if (p) s = s.replace(/\{(\w+)\}/g, function(m, n){ return p[n] != null ? p[n] : m; });
    return s;
  }
  function setLang(l){ lang = l === 'fr' ? 'fr' : 'es'; }
  function getLang(){ return lang; }
  function locale(){ return lang === 'fr' ? 'fr-FR' : 'es-ES'; }
  function method(){ return lang === 'fr' ? methodFr : methodEs; }
  function ck(s){ return lang === 'fr' ? (ckFr[s] || s) : s; }
  function cl(code, s){ return lang === 'fr' ? (clFr[code] || s) : s; }
  function synonyms(tok){
    var out = [tok];
    if (tok.length < 3) return out;
    SYN.forEach(function(p){
      if (tok.indexOf(p[0]) === 0 || (tok.length >= 4 && p[0].indexOf(tok) === 0)) out.push(p[1]);
    });
    return out;
  }
  return {t:t, setLang:setLang, getLang:getLang, locale:locale, method:method, ck:ck, cl:cl, synonyms:synonyms};
})();
