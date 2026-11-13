/* Ponderaciones precargadas para los grados más buscados (PAU 2027, admisión 2027-28).
   Fuente: quecarreraestudio.com (tablas «Ponderaciones de …», consultadas en noviembre de 2026),
   contrastada con tablas oficiales de UCLM, UM, URJC, UAH, UPNA, UPM y UC3M.
   Solo universidades públicas del listado. Si una universidad tiene dos filas distintas para el mismo
   grado (UB, UPF y UVA en Ingeniería Biomédica), no se precarga nada.
   Claves de materia: bio Biología · qui Química · fis Física · mat Matemáticas II ·
   mcs Matemáticas Aplicadas a las CCSS II · cg Ciencias Generales · dt Dibujo Técnico II ·
   dta Dibujo Técnico Aplicado a las Artes Plásticas y al Diseño II · dis Diseño ·
   tgp Técnicas de Expresión Gráfico-Plástica · emp Empresa y Diseño de Modelos de Negocio ·
   geo Geología y Ciencias Ambientales · tec Tecnología e Ingeniería II ·
   len1 Lengua Extranjera II (la de la fase de acceso) · len2 segunda lengua extranjera (fase de admisión).
   Una materia que no aparece no pondera (0). */
window.WEIGHTS_DB = (function(){
  var AND = {bio:.2, cg:.1, dt:.1, fis:.1, geo:.1, mcs:.2, mat:.2, qui:.2, tec:.1};   /* Andalucía, tabla común */
  var BFMQ = {bio:.2, fis:.2, mat:.2, qui:.2};
  var BQ = {bio:.2, qui:.2};
  var EHU = {bio:.2, fis:.1, qui:.2};
  var BFQ = {bio:.2, fis:.2, qui:.2};
  var MAD = {bio:.2, fis:.2, geo:.1, mat:.2, qui:.2};
  var UMU = {bio:.2, fis:.2, geo:.2, mat:.2, qui:.2, len2:.1};
  var GAL = {bio:.2, fis:.1, mcs:.2, mat:.2, qui:.2};
  var CAN = {bio:.2, fis:.1, mcs:.1, mat:.1, qui:.2};
  function all(codes, w){ var o = {}; codes.forEach(function(c){ o[c] = w; }); return o; }
  function merge(){ var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  var ANDU = ['UAL', 'UCA', 'UCO', 'UGR', 'UHU', 'UJA', 'UMA', 'US'];

  return {
    year: 'PAU 2027',
    checked: '2026-11',
    src: {
      'medicina': 'https://quecarreraestudio.com/acceso/ponderaciones-de-medicina/',
      'enfermeria': 'https://quecarreraestudio.com/acceso/ponderaciones-de-enfermeria/',
      'fisioterapia': 'https://quecarreraestudio.com/acceso/ponderaciones-de-fisioterapia/',
      'farmacia': 'https://quecarreraestudio.com/acceso/ponderaciones-de-farmacia/',
      'odontologia': 'https://quecarreraestudio.com/acceso/ponderaciones-de-odontologia/',
      'ingenieria biomedica': 'https://quecarreraestudio.com/acceso/ponderaciones-de-ingenieria-biomedica/'
    },
    /* Nombres de grado del listado (normalizados) que usan cada tabla */
    alias: {'biomedical engineering': 'ingenieria biomedica'},
    deg: {
      'medicina': merge(all(ANDU, AND), all(['UAB', 'UB', 'UPF', 'UdG', 'UdL', 'URV'], BFQ), {
        USC:GAL, UCLM:{bio:.2, fis:.1, mat:.2, qui:.2}, UMH:BFMQ, UA:BFMQ, UJI:BFMQ, UV:BFMQ,
        UNIOVI:BQ, UEX:{bio:.2, fis:.2, mcs:.1, mat:.2, qui:.2}, UC:{bio:.2, fis:.1, mat:.1, qui:.2},
        UNIZAR:{bio:.2, fis:.1, mat:.1, qui:.2}, UIB:CAN, ULL:CAN, ULE:BFMQ, UVA:BFMQ,
        USAL:{bio:.2, fis:.1, mat:.2, qui:.2}, UCM:MAD, UAM:MAD, URJC:BFMQ, UAH:BFMQ,
        UMU:UMU, UPNA:{bio:.2, fis:.2, mcs:.2, mat:.2, qui:.2}, EHU:EHU
      }),
      'enfermeria': merge(all(ANDU, AND), all(['UAB', 'UB', 'UdL', 'URV', 'UdG'], {bio:.2, mcs:.2, mat:.2, qui:.2}), all(['USC', 'UDC', 'UVigo'], GAL), {
        UCLM:{bio:.2, fis:.1, mat:.2, qui:.2}, UA:{bio:.2, fis:.1, mat:.1, qui:.2}, UMH:{bio:.2, fis:.1, mat:.1, qui:.2},
        UJI:{bio:.2, fis:.1, mat:.1, qui:.2}, UV:{bio:.2, fis:.1, mat:.1, qui:.2},
        UCM:MAD, UAM:MAD, UAH:BFMQ, URJC:{bio:.2, fis:.1, mat:.1, qui:.2},
        USAL:BFMQ, UVA:BFMQ, ULL:CAN, UEX:CAN, UC:CAN, UNIZAR:CAN,
        EHU:EHU, UMU:UMU, UPNA:{bio:.2, fis:.2, mcs:.2, mat:.2, qui:.2},
        UIB:{bio:.2, mcs:.2, mat:.2, qui:.2}, UNIOVI:BQ
      }),
      'fisioterapia': merge(all(ANDU, AND), all(['UAB', 'UdL', 'URV'], {bio:.2, fis:.2, mcs:.2, mat:.2}), {
        UDC:BFMQ, UVigo:BFMQ, UMH:BFMQ, UV:BFMQ, UCLM:BFMQ, UAH:BFMQ, URJC:BFMQ, USAL:BFMQ, UVA:BFMQ, ULE:BFMQ, UPNA:BFMQ,
        UNIOVI:BQ, UEX:{bio:.2, fis:.2, mcs:.1, mat:.2, qui:.2}, UIB:{bio:.2, fis:.2, mcs:.2, mat:.2},
        ULL:CAN, UCM:MAD, UMU:UMU, EHU:EHU, UNIZAR:{bio:.2, fis:.2, mcs:.1, mat:.1, qui:.2}
      }),
      'farmacia': {
        USC:BFMQ, EHU:{bio:.2, cg:.1, fis:.1, mcs:.1, mat:.1, qui:.2}, UCLM:BFMQ, UMH:{bio:.2, fis:.1, mat:.2, qui:.2},
        UB:BFMQ, UGR:AND, US:AND, UIB:{bio:.2, fis:.1, mcs:.1, mat:.2, qui:.2}, UCM:MAD, UAH:BFMQ,
        URJC:{bio:.2, fis:.1, mat:.2, qui:.2}, UMU:UMU, USAL:{bio:.2, fis:.2, mat:.2, qui:.2, len1:.1, len2:.1},
        ULL:{bio:.2, fis:.1, mat:.2, qui:.2}, UV:{bio:.2, fis:.1, mat:.2, qui:.2}, UVA:{bio:.2, fis:.1, mat:.2, qui:.2}
      },
      'odontologia': {
        USC:GAL, UNIOVI:BQ, UB:BFQ, UGR:AND, US:AND, UNIZAR:{bio:.2, fis:.2, geo:.1, mcs:.1, mat:.1, qui:.2},
        UCM:MAD, URJC:BFMQ, UMU:UMU, USAL:{bio:.2, fis:.1, mat:.2, qui:.2}, UV:BFMQ, EHU:EHU
      },
      'ingenieria biomedica': {
        UA:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, mcs:.1, mat:.2, qui:.2, tec:.1},
        UPV:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, mcs:.1, mat:.2, qui:.2, tec:.1},
        UCLM:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, mcs:.1, mat:.2, qui:.2, tec:.1},
        UPC:{bio:.2, fis:.2, geo:.2, mat:.2, qui:.2, tec:.2}, UdG:{bio:.2, fis:.2, geo:.2, mat:.2, qui:.2, tec:.2},
        URV:{bio:.2, fis:.2, geo:.2, mat:.2, qui:.2, tec:.2}, UAB:BFMQ, UdL:BFMQ, EHU:BFMQ,
        UJA:{bio:.2, cg:.1, dt:.2, fis:.2, geo:.1, mcs:.1, mat:.2, qui:.2, tec:.2},
        US:{bio:.2, cg:.1, dt:.1, fis:.1, geo:.1, mcs:.2, mat:.2, qui:.2, tec:.1},
        UAM:{bio:.2, dt:.2, emp:.1, fis:.2, geo:.1, mat:.2, qui:.2, tec:.2},
        UC3M:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, geo:.1, mat:.2, qui:.2, tec:.2},
        UPM:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, geo:.1, mat:.2, qui:.2, tec:.2},
        URJC:{bio:.2, dt:.1, dis:.1, emp:.1, fis:.2, mat:.2, qui:.2, tec:.2},
        UPCT:{bio:.2, cg:.2, dt:.2, dta:.1, dis:.1, emp:.1, fis:.2, geo:.1, mat:.2, qui:.2, tgp:.1, tec:.2, len2:.1},
        UPNA:{bio:.2, dt:.2, dis:.1, emp:.1, fis:.2, mcs:.1, mat:.2, qui:.2, tec:.2},
        UVigo:{bio:.2, dt:.2, emp:.1, fis:.2, mat:.2, qui:.2, tec:.1},
        UNIZAR:{bio:.2, dt:.2, dis:.1, fis:.2, geo:.1, mat:.2, qui:.2, tec:.2}
      }
    }
  };
})();
