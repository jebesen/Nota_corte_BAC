/* Textos propios de la calculadora de bachillerato + PAU (los comunes están en common.js).
   Los nombres de las materias del bachillerato español se dejan en español: son los oficiales. */
I18N.add('es', {
  'doc.title': 'Simulador PAU · nota de admisión',
  'doc.desc': 'Calcula la nota de admisión a la universidad española (sobre 14) con el bachillerato español y la PAU, y compárala con las notas de corte.',
  'head.eyebrow': 'Bachillerato español · {mod} → universidad',
  'calc.nmb': 'Media de bachillerato',
  'calc.cfa': 'Fase de acceso de la PAU',
  'calc.acc': 'Nota de acceso',
  'mention.pass': 'PAU superada',
  'mention.fail': 'PAU no superada',
  'example.note': 'Estás viendo datos de ejemplo. Pon los tuyos en «Configurar datos».',

  'mod.cyt': 'Ciencias y Tecnología', 'mod.hcs': 'Humanidades y Ciencias Sociales',
  'mod.apl': 'Artes · Artes Plásticas, Imagen y Diseño', 'mod.mae': 'Artes · Música y Artes Escénicas', 'mod.gen': 'General',
  'acc.esp.ph': 'Materia específica de modalidad', 'acc.coo': 'Lengua cooficial y Literatura II',
  'ph.b1': '1.º de bachillerato', 'ph.b2': '2.º de bachillerato', 'ph.pa': 'PAU · fase de acceso', 'ph.pd': 'PAU · fase de admisión',
  'cnt.materia.one': '{n} materia', 'cnt.materia': '{n} materias', 'cnt.examen.one': '{n} examen', 'cnt.examen': '{n} exámenes',
  'mat.n': 'Materia {n}',
  'h.bach': 'Nota entera de 0 a 10', 'h.acc': 'Examen de la fase de acceso', 'h.adm': 'Cuenta si llega a 5',
  'tag.pond': 'pondera',
  'sl.down': 'Bajar {x} {s}', 'sl.up': 'Subir {x} {s}',
  'sens.none': 'Ahora no suma',

  'pending.sub': '{n} de {m} notas. Los valores de partida son estimaciones a partir de las notas que ya tienes, no notas reales.',
  'known.scen': '{n} de {m} notas. La marca {mark} señala la nota real; si mueves un slider, su valor se pone en rojo.',
  'known.sub': '{n} de {m} notas{extra}. Activa los escenarios para ver qué habría pasado con otras notas.',
  'known.extra': ', con una media de bachillerato hasta ahora de {x}',
  'unis.empty': 'Elige hasta tres grados y universidades para ver si llegas a su nota de corte.',
  'unis.choose': 'Añadir universidades',
  'reach.none': 'Añade universidades para comparar',

  'warn.nobach': 'Faltan las materias de bachillerato: añádelas en la configuración.',
  'warn.noacc': 'Faltan los exámenes de la fase de acceso.',
  'warn.failed.one': 'Hay una materia de bachillerato por debajo de 5: para la PAU hace falta el título de Bachiller.',
  'warn.failed': 'Hay {n} materias de bachillerato por debajo de 5: para la PAU hace falta el título de Bachiller.',
  'warn.cfa': 'La media de la fase de acceso no llega a 4: no se supera la PAU.',
  'warn.acc': 'La nota de acceso no llega a 5: no se supera la PAU.',
  'warn.nosubj': 'No hay materias que ponderen: añádelas en la configuración.',
  'warn.low': '{s} no pondera: está por debajo de 5.',

  'wh.bach1': 'en la materia de bachillerato pendiente', 'wh.bachN': 'en cada materia de bachillerato pendiente',
  'wh.pau1': 'en el examen de la PAU pendiente', 'wh.pauN': 'en cada examen de la PAU pendiente',
  'need.fixed': 'Todas las notas están fijadas', 'need.never': 'No llega ni con un 10 {w}',
  'need.always': 'Llega con cualquier nota {w}', 'need.x': 'Llega con un {x} {w}',
  'uni.parts.fail': 'Sin la PAU superada no hay nota de admisión',

  'src.summary': 'Datos de las universidades: {n} grados y centros de {u} universidades públicas',
  'src.intro': 'Cubre 17 comunidades autónomas; faltan Ceuta y Melilla. Las notas de corte son las de la primera adjudicación de julio de 2026 donde se indica; las de Andalucía, Cataluña, Galicia, Castilla y León, Murcia, Cantabria y La Rioja proceden de Educaweb (curso 2026-27, sin indicar la adjudicación). Un 5,000 significa que no hubo corte. En Andalucía y Cataluña el listado solo recoge los grados con mayor nota de corte: si no encuentras el tuyo, usa «Escribir a mano». Las notas de corte de cada año cambian, y suelen bajar en las listas posteriores a la primera. No se incluyen las ponderaciones: son distintas en cada universidad y debes consultarlas en su tabla oficial.',

  'nav.bach': 'Bachillerato', 'nav.acc': 'PAU · acceso', 'nav.adm': 'PAU · admisión',
  'f.mod': 'Modalidad de bachillerato',
  'f.coo': 'Mi comunidad tiene examen de lengua cooficial en la PAU',
  'f.cooname': 'Lengua cooficial', 'f.cooname.ph': 'Ej.: Valenciano, Catalán, Gallego, Euskera',
  'f.coo.note': 'Cataluña, Comunitat Valenciana, Illes Balears, Galicia, País Vasco y Navarra (zona vascófona) tienen un quinto examen de lengua cooficial, salvo exención.',
  'f.bach': 'Bachillerato',
  'f.bach.note': 'Escribe las notas finales de cada materia, enteras de 0 a 10 como en el boletín. <strong>Deja en blanco las que falten:</strong> aparecerán como sliders. No incluyas Religión, que no cuenta para la media, ni materias exentas o convalidadas. Las materias de partida son las habituales de la modalidad: cambia los nombres para que coincidan con las tuyas.',
  'f.col.mat': 'Materia', 'f.col.grade': 'Nota /10', 'f.col.del': 'Quitar', 'f.col.exam': 'Examen', 'f.col.pond': 'Pondera',
  'f.mat.ph': 'Nombre de la materia', 'f.mat.aria': 'Materia {i} de {title}', 'f.gradeof': 'Nota de {x}', 'f.thesub': 'la materia {i}',
  'f.del': 'Quitar {x}', 'f.del.generic': 'materia', 'f.pending': 'pendiente',
  'f.addb': 'Añadir materia a {title}', 'f.fillb': 'Rehacer la lista según la modalidad',
  'f.acc': 'PAU · fase de acceso',
  'f.acc.note': 'Notas de 0 a 10, con hasta dos decimales. La media de estos exámenes tiene que llegar a 4. Marca <strong>Pondera</strong> en los que también cuenten para la nota de admisión: la materia específica de modalidad siempre puede hacerlo y, en algunas comunidades, también la Historia.',
  'f.his.aria': 'Historia', 'f.lex.ph': 'Idioma: Inglés…', 'f.lex.aria': 'Idioma de la Lengua Extranjera II',
  'f.esp.ph': 'Ej.: Matemáticas II', 'f.pond.aria': '{x} pondera en la admisión',
  'f.adm': 'PAU · fase de admisión',
  'f.adm.note': 'Exámenes voluntarios de materias de modalidad de 2.º (u otra lengua extranjera) para subir nota. Cada uno pondera solo si llega a 5, y cada universidad suma las dos materias que más le aportan, contando también las de la fase de acceso marcadas arriba.',
  'f.adm.ph': 'Ej.: Biología', 'f.adm.aria': 'Materia {i} de la fase de admisión',
  'f.adm.none': 'Ningún examen de la fase de admisión.', 'f.adm.add': 'Añadir examen',
  'f.unis': 'Universidades',
  'f.unis.note': 'Hasta tres grados. Busca el grado (y, si quieres, la ciudad o la universidad) y elige el centro: la nota de corte se rellena sola y puedes cambiarla. Si no aparece, pasa a «Escribir a mano». Después indica la ponderación de cada materia según la tabla oficial de la universidad.',
  'u.weights': 'Ponderación de cada materia en este grado: consúltala en la tabla oficial de la universidad (no está incluida en el listado).',
  'w.accsuffix': ' (fase de acceso)',
  'st.nodata': 'No se han encontrado datos de este simulador en lo importado.',
  'v.bad': 'Hay valores no válidos, marcados en rojo. Las notas de bachillerato son enteras de 0 a 10, las de la PAU van de 0 a 10 y las notas de corte de 0 a 14.',
  'v.nobach': 'Añade las materias de bachillerato: sin ellas no hay media.'
});

I18N.add('fr', {
  'doc.title': 'Simulateur PAU · note d’admission',
  'doc.desc': 'Calculez la note d’admission à l’université espagnole (sur 14) avec le bachillerato espagnol et la PAU, et comparez-la aux seuils d’admission.',
  'head.eyebrow': 'Bachillerato espagnol · {mod} → université',
  'calc.nmb': 'Moyenne du bachillerato',
  'calc.cfa': 'Phase d’accès de la PAU',
  'calc.acc': 'Note d’accès',
  'mention.pass': 'PAU réussie',
  'mention.fail': 'PAU non réussie',
  'example.note': 'Vous voyez des données d’exemple. Saisissez les vôtres dans « Configurer ».',

  'mod.cyt': 'Sciences et technologie', 'mod.hcs': 'Humanités et sciences sociales',
  'mod.apl': 'Arts · arts plastiques, image et design', 'mod.mae': 'Arts · musique et arts du spectacle', 'mod.gen': 'Générale',
  'acc.esp.ph': 'Matière spécifique de la modalité', 'acc.coo': 'Langue co-officielle et littérature II',
  'ph.b1': '1re année de bachillerato', 'ph.b2': '2e année de bachillerato', 'ph.pa': 'PAU · phase d’accès', 'ph.pd': 'PAU · phase d’admission',
  'cnt.materia.one': '{n} matière', 'cnt.materia': '{n} matières', 'cnt.examen.one': '{n} épreuve', 'cnt.examen': '{n} épreuves',
  'mat.n': 'Matière {n}',
  'h.bach': 'Note entière de 0 à 10', 'h.acc': 'Épreuve de la phase d’accès', 'h.adm': 'Compte à partir de 5',
  'tag.pond': 'pondérée',
  'sl.down': 'Baisser {x} de {s}', 'sl.up': 'Augmenter {x} de {s}',
  'sens.none': 'Ne compte pas pour l’instant',

  'pending.sub': '{n} notes sur {m}. Les valeurs de départ sont des estimations à partir des notes déjà obtenues, pas des notes réelles.',
  'known.scen': '{n} notes sur {m}. Le repère {mark} indique la note réelle ; si vous déplacez un curseur, sa valeur passe en rouge.',
  'known.sub': '{n} notes sur {m}{extra}. Activez les scénarios pour voir ce qui se serait passé avec d’autres notes.',
  'known.extra': ', avec une moyenne de bachillerato de {x} pour l’instant',
  'unis.empty': 'Choisissez jusqu’à trois formations et universités pour voir si vous atteignez leur seuil d’admission.',
  'unis.choose': 'Ajouter des universités',
  'reach.none': 'Ajoutez des universités à comparer',

  'warn.nobach': 'Il manque les matières du bachillerato : ajoutez-les dans la configuration.',
  'warn.noacc': 'Il manque les épreuves de la phase d’accès.',
  'warn.failed.one': 'Une matière du bachillerato est en dessous de 5 : il faut le titre de Bachiller pour la PAU.',
  'warn.failed': '{n} matières du bachillerato sont en dessous de 5 : il faut le titre de Bachiller pour la PAU.',
  'warn.cfa': 'La moyenne de la phase d’accès n’atteint pas 4 : la PAU n’est pas réussie.',
  'warn.acc': 'La note d’accès n’atteint pas 5 : la PAU n’est pas réussie.',
  'warn.nosubj': 'Aucune matière pondérée : ajoutez-en dans la configuration.',
  'warn.low': '{s} n’est pas pondérée : elle est en dessous de 5.',

  'wh.bach1': 'dans la matière du bachillerato restante', 'wh.bachN': 'dans chaque matière du bachillerato restante',
  'wh.pau1': 'à l’épreuve de la PAU restante', 'wh.pauN': 'à chaque épreuve de la PAU restante',
  'need.fixed': 'Toutes les notes sont saisies', 'need.never': 'Pas atteint, même avec 10 {w}',
  'need.always': 'Atteint avec n’importe quelle note {w}', 'need.x': 'Atteint avec {x} {w}',
  'uni.parts.fail': 'Sans PAU réussie, pas de note d’admission',

  'src.summary': 'Données des universités : {n} formations et établissements dans {u} universités publiques',
  'src.intro': 'Couvre 17 communautés autonomes ; Ceuta et Melilla n’y figurent pas. Les seuils sont ceux de la première liste d’affectation de juillet 2026 lorsque c’est indiqué ; ceux d’Andalousie, de Catalogne, de Galice, de Castille-et-León, de Murcie, de Cantabrie et de La Rioja proviennent d’Educaweb (année 2026-27, sans préciser la liste d’affectation). Un 5,000 signifie qu’il n’y a pas eu de seuil. En Andalousie et en Catalogne, la liste ne reprend que les formations aux seuils les plus élevés : si vous ne trouvez pas la vôtre, utilisez « Saisir à la main ». Les seuils changent chaque année et baissent souvent dans les listes qui suivent la première. Les pondérations ne sont pas incluses : elles varient selon l’université et figurent dans son tableau officiel.',

  'nav.bach': 'Bachillerato', 'nav.acc': 'PAU · accès', 'nav.adm': 'PAU · admission',
  'f.mod': 'Modalité du bachillerato',
  'f.coo': 'Ma communauté a une épreuve de langue co-officielle à la PAU',
  'f.cooname': 'Langue co-officielle', 'f.cooname.ph': 'Ex. : valencien, catalan, galicien, basque',
  'f.coo.note': 'La Catalogne, la Communauté valencienne, les Baléares, la Galice, le Pays basque et la Navarre (zone bascophone) ont une cinquième épreuve de langue co-officielle, sauf dispense.',
  'f.bach': 'Bachillerato',
  'f.bach.note': 'Saisissez la note finale de chaque matière, entière de 0 à 10 comme sur le bulletin. <strong>Laissez vides celles qui manquent :</strong> elles apparaîtront sous forme de curseurs. N’incluez pas Religión, qui ne compte pas dans la moyenne, ni les matières dispensées ou validées. Les matières proposées sont les plus courantes de la modalité : modifiez les noms pour qu’ils correspondent aux vôtres.',
  'f.col.mat': 'Matière', 'f.col.grade': 'Note /10', 'f.col.del': 'Retirer', 'f.col.exam': 'Épreuve', 'f.col.pond': 'Pondérée',
  'f.mat.ph': 'Nom de la matière', 'f.mat.aria': 'Matière {i} – {title}', 'f.gradeof': 'Note de {x}', 'f.thesub': 'la matière {i}',
  'f.del': 'Retirer {x}', 'f.del.generic': 'la matière', 'f.pending': 'à venir',
  'f.addb': 'Ajouter une matière en {title}', 'f.fillb': 'Refaire la liste selon la modalité',
  'f.acc': 'PAU · phase d’accès',
  'f.acc.note': 'Notes de 0 à 10, avec deux décimales au plus. La moyenne de ces épreuves doit atteindre 4. Cochez <strong>Pondérée</strong> pour celles qui comptent aussi pour la note d’admission : la matière spécifique de la modalité le peut toujours et, dans certaines communautés, l’Histoire aussi.',
  'f.his.aria': 'Histoire', 'f.lex.ph': 'Langue : Inglés…', 'f.lex.aria': 'Langue de la Lengua Extranjera II',
  'f.esp.ph': 'Ex. : Matemáticas II', 'f.pond.aria': '{x} compte pour l’admission',
  'f.adm': 'PAU · phase d’admission',
  'f.adm.note': 'Épreuves facultatives de matières de modalité de 2e année (ou d’une autre langue étrangère) pour augmenter la note. Chacune n’est pondérée que si elle atteint 5, et chaque université retient les deux matières qui rapportent le plus, y compris celles de la phase d’accès cochées plus haut.',
  'f.adm.ph': 'Ex. : Biología', 'f.adm.aria': 'Matière {i} de la phase d’admission',
  'f.adm.none': 'Aucune épreuve de la phase d’admission.', 'f.adm.add': 'Ajouter une épreuve',
  'f.unis': 'Universités',
  'f.unis.note': 'Jusqu’à trois formations. Cherchez la formation (et, si vous voulez, la ville ou l’université) et choisissez l’établissement : le seuil se remplit tout seul et vous pouvez le modifier. On peut chercher en français (« médecine ») ou en espagnol (« medicina »). Si elle n’apparaît pas, passez à « Saisir à la main ». Indiquez ensuite la pondération de chaque matière d’après le tableau officiel de l’université.',
  'u.weights': 'Pondération de chaque matière dans cette formation : consultez le tableau officiel de l’université (elle n’est pas dans la liste).',
  'w.accsuffix': ' (phase d’accès)',
  'st.nodata': 'Aucune donnée de ce simulateur trouvée dans ce qui a été importé.',
  'v.bad': 'Certaines valeurs, en rouge, ne sont pas valides. Les notes du bachillerato sont entières de 0 à 10, celles de la PAU vont de 0 à 10 et les seuils de 0 à 14.',
  'v.nobach': 'Ajoutez les matières du bachillerato : sans elles, pas de moyenne.'
});

I18N.setMethod(
  '<h3>Cómo se calcula</h3>' +
  '<p><strong>Media de bachillerato.</strong> Es la media aritmética de las notas de todas las materias de 1.º y 2.º, que son enteras de 0 a 10, redondeada a la centésima. Religión no cuenta, ni las materias exentas o convalidadas.</p>' +
  '<p><strong>Fase de acceso de la PAU.</strong> Cuatro exámenes, o cinco en las comunidades con lengua cooficial: Lengua Castellana y Literatura II, Historia de España o Historia de la Filosofía, Lengua Extranjera II, la materia específica obligatoria de la modalidad y, en su caso, la lengua cooficial. Su nota es la media aritmética de los exámenes y tiene que llegar a 4.</p>' +
  '<p class="formula">Nota de acceso = 0,6 × media de bachillerato + 0,4 × fase de acceso (mínimo 5, máximo 10)</p>' +
  '<p><strong>Nota de admisión.</strong> Cada universidad suma como mucho dos materias aprobadas con 5 o más, multiplicadas por la ponderación del grado (0,1 o 0,2). Pueden ser exámenes de la fase de admisión y también la materia específica de la fase de acceso. Cuentan las dos que más suman.</p>' +
  '<p class="formula">Nota /14 = nota de acceso + a × M1 + b × M2</p>' +
  '<ul>' +
  '<li>Las ponderaciones las fija cada universidad para cada grado: búscalas en su tabla oficial y escríbelas en la configuración.</li>' +
  '<li>En algunas comunidades también ponderan Historia de España o Historia de la Filosofía de la fase de acceso: márcalo en la configuración si es tu caso.</li>' +
  '<li>Las notas de corte cambian cada año y suelen bajar en las listas que siguen a la primera adjudicación.</li>' +
  '<li>No contempla otras vías de acceso (FP, mayores de 25, sistemas extranjeros) ni el caso del título de Bachiller con una materia suspendida.</li>' +
  '</ul>' +
  '<p>Fuentes: <a href="https://www.boe.es/eli/es/rd/2024/06/11/534" target="_blank" rel="noopener">Real Decreto 534/2024 (BOE)</a> · <a href="https://www.boe.es/eli/es/rd/2022/04/05/243" target="_blank" rel="noopener">Real Decreto 243/2022, del Bachillerato (BOE)</a> · <a href="https://www.educacionfpydeportes.gob.es/en/prensa/actualidad/2025/06/20250602-pau.html" target="_blank" rel="noopener">Ministerio de Educación: la PAU</a></p>',

  '<h3>Comment c’est calculé</h3>' +
  '<p><strong>Moyenne du bachillerato.</strong> C’est la moyenne arithmétique des notes de toutes les matières de 1re et de 2e année, entières de 0 à 10, arrondie au centième. Religión ne compte pas, ni les matières dispensées ou validées.</p>' +
  '<p><strong>Phase d’accès de la PAU.</strong> Quatre épreuves, ou cinq dans les communautés ayant une langue co-officielle : Lengua Castellana y Literatura II, Historia de España ou Historia de la Filosofía, Lengua Extranjera II, la matière spécifique obligatoire de la modalité et, le cas échéant, la langue co-officielle. Sa note est la moyenne arithmétique des épreuves et doit atteindre 4.</p>' +
  '<p class="formula">Note d’accès = 0,6 × moyenne du bachillerato + 0,4 × phase d’accès (minimum 5, maximum 10)</p>' +
  '<p><strong>Note d’admission.</strong> Chaque université ajoute au plus deux matières réussies avec 5 ou plus, multipliées par la pondération de la formation (0,1 ou 0,2). Il peut s’agir d’épreuves de la phase d’admission et aussi de la matière spécifique de la phase d’accès. Ce sont les deux qui rapportent le plus qui comptent.</p>' +
  '<p class="formula">Note /14 = note d’accès + a × M1 + b × M2</p>' +
  '<ul>' +
  '<li>Chaque université fixe les pondérations de chaque formation : cherchez-les dans son tableau officiel et saisissez-les dans la configuration.</li>' +
  '<li>Dans certaines communautés, Historia de España ou Historia de la Filosofía de la phase d’accès sont aussi pondérées : cochez-le dans la configuration si c’est votre cas.</li>' +
  '<li>Les seuils changent chaque année et baissent souvent dans les listes qui suivent la première affectation.</li>' +
  '<li>Les autres voies d’accès (formation professionnelle, plus de 25 ans, systèmes étrangers) ne sont pas prises en compte, ni le cas du titre de Bachiller avec une matière non validée.</li>' +
  '</ul>' +
  '<p>Sources : <a href="https://www.boe.es/eli/es/rd/2024/06/11/534" target="_blank" rel="noopener">Real Decreto 534/2024 (BOE)</a> · <a href="https://www.boe.es/eli/es/rd/2022/04/05/243" target="_blank" rel="noopener">Real Decreto 243/2022, du Bachillerato (BOE)</a> · <a href="https://www.educacionfpydeportes.gob.es/en/prensa/actualidad/2025/06/20250602-pau.html" target="_blank" rel="noopener">Ministère de l’Éducation : la PAU</a></p>'
);

I18N.add('es', {
  'wiz.p1.t': 'Tu bachillerato',
  'wiz.p1.d': 'Indica tu modalidad y si tu comunidad tiene examen de lengua cooficial. Con eso preparamos la lista de materias y exámenes.',
  'wiz.p2.t': 'Notas de bachillerato',
  'wiz.p2.d': 'Escribe las notas de 1.º y 2.º que ya tengas. Deja en blanco las que falten: luego podrás moverlas con los sliders.',
  'wiz.p3.t': 'La PAU',
  'wiz.p3.d': 'Si ya tienes las notas de la PAU, escríbelas; si no, déjalas en blanco y las estimaremos. Añade los exámenes de la fase de admisión que vayas a hacer.',
  'wiz.p4.t': 'Tus carreras',
  'wiz.p4.d': 'Busca hasta tres grados y universidades. La nota de corte y, en los grados más buscados, las ponderaciones se rellenan solas.'
});
I18N.add('fr', {
  'wiz.p1.t': 'Votre bachillerato',
  'wiz.p1.d': 'Indiquez votre modalité et si votre communauté a une épreuve de langue co-officielle. Cela permet de préparer la liste des matières et des épreuves.',
  'wiz.p2.t': 'Notes du bachillerato',
  'wiz.p2.d': 'Saisissez les notes de 1re et de 2e année déjà obtenues. Laissez vides celles qui manquent : vous pourrez ensuite les faire varier avec les curseurs.',
  'wiz.p3.t': 'La PAU',
  'wiz.p3.d': 'Si vous avez déjà les notes de la PAU, saisissez-les ; sinon, laissez-les vides et nous les estimerons. Ajoutez les épreuves de la phase d’admission que vous comptez passer.',
  'wiz.p4.t': 'Vos formations',
  'wiz.p4.d': 'Cherchez jusqu’à trois formations et universités. Le seuil et, pour les formations les plus demandées, les pondérations se remplissent tout seuls.'
});
