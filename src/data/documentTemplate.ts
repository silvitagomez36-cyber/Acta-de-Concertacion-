import { ActaData, ReasoningPhase } from '../types';

export const REASONING_PHASES: ReasoningPhase[] = [
  {
    phaseNumber: 1,
    title: 'Fase 1: Análisis de Audiencia y Tono',
    subtitle: 'Adecuación lingüística para comunidad rural con escolaridad básica',
    keyInsights: [
      'El lenguaje debe ser dignificante, empático y horizontal, reconociendo el saber ancestral y práctico de la comunidad.',
      'Sustitución sistemática de tecnicismos jurídicos («sanción pecuniaria», «subsanación», «cláusula resolutoria») por conceptos comunitarios claros («compromiso de asistencia», «aviso previo», «acuerdo de convivencia»).',
      'Mantenimiento del rigor administrativo indispensable para que la entidad formativa pueda validar oficialmente el inicio y certificación del curso.',
      'Redacción en oraciones directas (sujeto + verbo + predicado), con tipografía legible y formato visualmente estructurado para facilitar la lectura en voz alta en la asamblea.'
    ],
    pedagogicalStrategies: [
      {
        challenge: 'Desconfianza inicial ante documentos que se perciben como "contratos legales trampa".',
        actionTaken: 'Enmarcar el acta como un "Pacto de la Palabra Escrita" y "Concertación Comunitaria", no como una imposición externa.',
        rationale: 'En el campo, el valor de la palabra empeñada es sagrado; el papel debe ratificar la palabra dada en la reunión, no sustituirla con frialdad burocrática.'
      },
      {
        challenge: 'Brecha de lectoescritura entre participantes adultos mayores.',
        actionTaken: 'Inclusión explícita de lectura pública en voz alta antes de firmar, y opción válida de firma o huella dactilar.',
        rationale: 'Evita la exclusión o la vergüenza de quienes no dominan la firma manuscrita, otorgando el mismo valor honorífico a la huella dactilar.'
      }
    ],
    ruralContextApplication: 'Se usa un léxico afable, respetuoso de los ciclos comunitarios (épocas de siembra, recolección y faenas matutinas), reconociendo al campesinado como protagonista activo del aprendizaje y no como mero receptor pasivo.'
  },
  {
    phaseNumber: 2,
    title: 'Fase 2: Identificación de Requerimientos y Riesgos',
    subtitle: 'Salvaguardas para menores de edad, sostenibilidad del cupo y accesibilidad rural',
    keyInsights: [
      'Inclusión de jóvenes de 14 a 17 años: Oportunidad de relevo generacional en habilidades tecnológicas, pero requiere respaldo de acudiente/madre/padre para amparo legal y protección.',
      'Cupo mínimo de 15 aprendices registrados: Umbral indispensable para viabilidad institucional y dinamismo pedagógico grupal.',
      'Riesgos de deserción por factores climáticos (invierno, caminos intransitables) o jornales extraordinarios de cosecha.',
      'Accesibilidad y seguridad de la sede comunal: Iluminación, tomas eléctricas funcionales para carga de equipos y cercanía para traslados peatonales o a caballo.'
    ],
    pedagogicalStrategies: [
      {
        challenge: 'Menores de edad (14 a 17 años) desprotegidos jurídicamente.',
        actionTaken: 'Cláusula específica donde el padre, madre o acudiente avala su inscripción y se compromete a apoyarle en sus traslados y tareas.',
        rationale: 'Cumple con el Código de Infancia y Adolescencia y compromete a la familia entera en el proceso educativo.'
      },
      {
        challenge: 'Deserción que ponga en peligro el umbral de los 15 participantes.',
        actionTaken: 'Establecimiento del sistema de "Monitores Campesinos" o padrinos de asistencia entre vecinos cercanos.',
        rationale: 'Si un vecino no asiste un día por motivos de fuerza mayor (enfermedad, cosecha), otro compañero le recoge el material y avisa al facilitador.'
      },
      {
        challenge: 'Cortes imprevistos de fluido eléctrico en zonas veredales.',
        actionTaken: 'Protocolo de materiales impresos de respaldo y guías descargables previamente en teléfonos.',
        rationale: 'Garantiza que la sesión de capacitación no se cancele aunque falle la red eléctrica o el proyector.'
      }
    ],
    ruralContextApplication: 'Se pacta una sede neutral y equidistante (Salón Comunal o Escuela Veredal) que cuente con llave bajo custodia de la Junta de Acción Comunal y garantice un retorno seguro antes del anochecer.'
  },
  {
    phaseNumber: 3,
    title: 'Fase 3: Estructuración Metodológica',
    subtitle: 'Frecuencia semanal (cada 8 días) e introducción gradual de herramientas digitales',
    keyInsights: [
      'Frecuencia cada 8 días: Respeta los ritmos de trabajo rural (semana laboral de lunes a viernes o sábados de mercado). Se recomienda un día fijo (ej. sábados por la tarde o domingos matutinos).',
      'Metodología "De lo Conocido a lo Novedoso": Iniciar con lo que la comunidad ya tiene en el bolsillo (teléfono celular básico o smartphone sencillo y WhatsApp) antes de introducir aplicaciones complejas.',
      'Uso del grupo de WhatsApp comunitario no solo para avisos, sino como aula de repaso con audios cortos, infografías visuales y fotos de tareas prácticas.',
      'Curva de aprendizaje no intimidante: Prácticas en parejas intergeneracionales (un joven de 15 años hace dupla con un adulto o adulto mayor de 55 años).'
    ],
    pedagogicalStrategies: [
      {
        challenge: 'Frustración y miedo a "dañar el teléfono" en participantes adultos.',
        actionTaken: 'Diseño de la regla de oro: "Aquí nada se daña por tocar la pantalla. Aprendemos perdiendo el miedo juntos".',
        rationale: 'Desbloquea la barrera emocional que paraliza a los adultos en el primer contacto con tecnología táctil.'
      },
      {
        challenge: 'Poco o nulo paquete de datos de internet en el campo.',
        actionTaken: 'Enfoque offline-first: descargas en el punto de encuentro cuando haya señal/Wi-Fi comunitario y uso de archivos multimedia ligeros.',
        rationale: 'No exigir a las familias gastos adicionales en recargas de internet celular para cumplir con el curso.'
      }
    ],
    ruralContextApplication: 'Sesiones de 3 horas máximo con pausa pedagógica ("compartir de saberes o refrigerio campesino"), intercalando 30% explicación práctica demostrativa y 70% ejercicio vivencial guiado paso a paso.'
  },
  {
    phaseNumber: 4,
    title: 'Fase 4: Redacción y Consolidación',
    subtitle: 'Formulación del instrumento jurídico-comunitario con campos editables entre corchetes [ ]',
    keyInsights: [
      'Estructura modular y numerada: Encabezado institucional, antecedentes territoriales, tabla logística, cláusulas de acuerdos y compromisos, declaratoria de aceptación y firmas.',
      'Uso de campos de personalización universales entre corchetes `[ ... ]` para que cualquier facilitador pueda replicar el formato en cualquier departamento, municipio o vereda.',
      'Inclusión de tabla logística de tres columnas (Parámetro | Detalle Concertado | Observaciones Comunitarias) para visibilizar la voz colectiva en el papel.',
      'Doble sistema de validación: Firma y registro de huella dactilar para analfabetismo funcional o preferencia personal, brindando seguridad y solemnidad.'
    ],
    pedagogicalStrategies: [
      {
        challenge: 'Garantizar que todos los acuerdos tomados en asamblea queden registrados sin ambigüedades.',
        actionTaken: 'Columna obligatoria de "Observaciones Comunitarias" donde quedan consignadas las advertencias de la comunidad (ej. "el día de lluvia el camino es difícil", "el salón se abre con 15 minutos de anticipación").',
        rationale: 'Convierte el acta en un reflejo fidedigno de la realidad territorial, fomentando corresponsabilidad.'
      },
      {
        challenge: 'Disponibilidad inmediata para copia física y archivo institucional.',
        actionTaken: 'Generación simultánea en vista oficial maquetada, versión Markdown estándar editable y exportación directa a impresión/PDF.',
        rationale: 'Permite al facilitador llevar copias impresas a la asamblea en la vereda o archivar la copia digital en la plataforma institucional.'
      }
    ],
    ruralContextApplication: 'Se concluye con una Declaratoria de Aceptación inspirada en la convivencia y el progreso comunitario, firmada tanto por el Facilitador como por el Presidente(a) de la Junta de Acción Comunal y los aprendices inscritos.'
  }
];

export const INITIAL_ACTA_DATA: ActaData = {
  entityName: 'SERVICIO NACIONAL DE APRENDIZAJE / MINISTERIO DE LAS TIC & DESARROLLO RURAL',
  programName: 'PROGRAMA DE FORMACIÓN RURAL INTEGRAL PARA LA TRANSFORMACIÓN DIGITAL Y SOCIAL',
  trainingCourseName: 'Herramientas Digitales Básicas para la Productividad y la Convivencia Rural',
  actCode: 'ACT-CONF-RUR-2026-004',
  generalObjective: 'Establecer de manera consensuada, participativa y transparente los acuerdos organizativos, pedagógicos, logísticos y de convivencia que regirán el desarrollo del curso de capacitación, garantizando el acceso equitativo al conocimiento digital, el acompañamiento continuo del facilitador y la permanencia activa de los aprendices de la comunidad.',
  
  department: 'Boyacá / Cundinamarca',
  municipality: 'San Pablo del Monte',
  locality: 'Vereda Buena Vista - Sector La Esperanza',
  meetingPlace: 'Salón Comunal de la Junta de Acción Comunal (JAC) - Al lado de la Escuela Rural',
  sessionDay: 'Sábados',
  sessionTime: '02:00 PM a 05:00 PM (14:00 a 17:00 horas)',
  frequencyText: 'Una (1) sesión semanal de 3 horas presenciales cada ocho (8) días',
  startDate: '2026-10-24',
  endDate: '2026-12-19',
  totalHours: 36,

  facilitatorName: 'Lic. Claudia Marcela Suárez Peñuela',
  facilitatorRole: 'Facilitadora Comunitaria y Pedagoga Rural',
  facilitatorDocument: 'C.C. 52.489.210 de Tunja',
  facilitatorPhone: '+57 312 458 9211',
  communityLeaderName: 'Don Gonzalo Morales Rincón',
  communityLeaderRole: 'Presidente de la Junta de Acción Comunal (JAC)',

  logistics: [
    {
      id: 'log-1',
      parameter: 'Sede Física / Sitio de Encuentro',
      agreedDetail: 'Salón Comunal de la Vereda Buena Vista (Sector El Mirador)',
      communityObservations: 'La Junta de Acción Comunal aportará las llaves, mesas y 25 sillas plásticas. Cuenta con servicio de energía eléctrica estable y baño funcional.'
    },
    {
      id: 'log-2',
      parameter: 'Día de la Semana Concertado',
      agreedDetail: 'Sábados (cada 8 días)',
      communityObservations: 'Se eligió el sábado porque no cruza con los días de mercado municipal (domingos) ni con los jornales intensivos de labranza de lunes a viernes.'
    },
    {
      id: 'log-3',
      parameter: 'Franja Horaria y Puntualidad',
      agreedDetail: 'De 2:00 PM a 5:00 PM (3 horas de sesión)',
      communityObservations: 'Permite terminar antes del anochecer para que quienes viven en las fincas más alejadas puedan regresar con luz de día a pie o a caballo.'
    },
    {
      id: 'log-4',
      parameter: 'Frecuencia y Duración Total',
      agreedDetail: '1 sesión semanal (cada 8 días), durante 9 semanas (total 27 horas presenciales y 9 horas de práctica comunitaria)',
      communityObservations: 'Se acuerda un receso intermedio de 15 minutos para compartir saberes tradicionales y refrigerio comunitario aportado voluntariamente.'
    },
    {
      id: 'log-5',
      parameter: 'Condiciones de Energía y Conectividad',
      agreedDetail: 'Uso de proyector portátil y multicontacto provisto por la entidad formativa. Descarga de materiales offline.',
      communityObservations: 'En caso de suspensión fortuita del servicio de energía, la clase continuará con dinámicas vivenciales y guías de trabajo impresas.'
    }
  ],

  minLearners: 15,
  digitalToolsAgreed: [
    'Smartphones personales de los aprendices (de cualquier gama o sistema operativo)',
    'Aplicación de mensajería WhatsApp para consultas, guías y refuerzo semanal',
    'Cámara fotográfica del celular para registro de cosechas, trámites y eventos locales',
    'Aplicaciones de calculadora, notas de voz y correo electrónico básico',
    'Proyector de video portátil y parlante amplificador facilitado por la entidad formadora'
  ],
  connectivityNotes: 'Los contenidos pedagógicos serán preparados en formato liviano y descargable sin costo para el aprendiz. No se exigirá plan de datos comerciales continuo; se aprovecharán los puntos de conexión y descargas previas.',
  youthPolicyText: 'Los jóvenes entre 14 y 17 años cumplidos serán admitidos con la debida autorización y acompañamiento solidario de su padre, madre o acudiente legal, promoviendo el relevo generacional y duplas de apoyo intergeneracional con adultos mayores.',

  facilitatorCommitments: [
    'Llegar puntualmente a la sede acordada con al menos 20 minutos de anticipación para instalar los equipos y preparar el espacio de aprendizaje.',
    'Tratar a cada participante con máxima calidez, paciencia, dignidad y respeto, recordando que ningún saber campesino es inferior a la tecnología moderna.',
    'Utilizar un lenguaje pedagógico claro, accesible y exento de tecnicismos incomprensibles, explicando paso a paso cuantas veces sea necesario.',
    'Proveer guías impresas en letra grande y materiales visuales para aquellos aprendices que no cuenten con teléfono inteligente o conectividad en su hogar.',
    'Custodiar de manera estricta y ética los datos personales y números de contacto de los aprendices registrados, garantizando su uso exclusivo para fines formativos.',
    'Promover dinámicas de integración donde los jóvenes de 14+ años apoyen solidariamente a los adultos y adultos mayores en el manejo táctil de los dispositivos.'
  ],
  communityCommitments: [
    'Asistir puntualmente a cada una de las sesiones pactadas cada ocho días, procurando no faltar salvo motivos graves de salud, clima adverso o fuerza mayor.',
    'Garantizar la permanencia del cupo mínimo de 15 aprendices registrados hasta la finalización y certificación del programa.',
    'Avisar con anticipación al facilitador o al líder comunal en caso de ausencia imprevista, poniéndose al día con la ayuda del compañero de dupla.',
    'Cuidar con esmero las instalaciones del Salón Comunal, los pupitres, las tomas de corriente y los equipos tecnológicos dispuestos para la capacitación.',
    'Traer los teléfonos móviles con la batería completamente cargada desde casa para optimizar el tiempo de práctica en el aula.',
    'Mantener un ambiente de compañerismo, escucha atenta, tolerancia y ayuda mutua durante las jornadas de clase.'
  ],

  finalVerdictText: 'Habiendo leído en voz alta, debatido abiertamente y aprobado de forma unánime cada uno de los puntos expuestos en la presente asamblea, las partes manifiestan su entera conformidad y se comprometen bajo palabra de honor a cumplir y hacer cumplir lo aquí pactado en beneficio del desarrollo de nuestra comunidad.',

  learners: [
    {
      id: 'l-1',
      number: 1,
      fullName: 'María Rosalba Vargas Gómez',
      documentType: 'CC',
      documentNumber: '39.812.450',
      age: 54,
      isMinor: false,
      communityRole: 'Productora de hortalizas y lideresa de mujeres',
      phone: '311 234 5678',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-2',
      number: 2,
      fullName: 'José Custodio Benítez Riaño',
      documentType: 'CC',
      documentNumber: '19.452.109',
      age: 62,
      isMinor: false,
      communityRole: 'Agricultor y miembro de la JAC',
      phone: '313 890 1234',
      signatureType: 'huella',
      signatureDataUrl: ''
    },
    {
      id: 'l-3',
      number: 3,
      fullName: 'Brayan Estiven Morales Castro',
      documentType: 'TI',
      documentNumber: '1.054.321.890',
      age: 15,
      isMinor: true,
      guardianName: 'Gonzalo Morales Rincón (Padre)',
      guardianDoc: 'CC 79.345.120',
      communityRole: 'Estudiante de secundaria y apoyo técnico familiar',
      phone: '310 567 8901',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-4',
      number: 4,
      fullName: 'Luz Marina Cárdenas Silva',
      documentType: 'CC',
      documentNumber: '41.765.230',
      age: 48,
      isMinor: false,
      communityRole: 'Ganadera y tesorera del comité de acueducto',
      phone: '314 678 9012',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-5',
      number: 5,
      fullName: 'Hernando de Jesús Pineda Ortiz',
      documentType: 'CC',
      documentNumber: '79.112.443',
      age: 58,
      isMinor: false,
      communityRole: 'Cultivador de café y plátano',
      phone: '320 456 7890',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-6',
      number: 6,
      fullName: 'Yuly Tatiana Torres Rincón',
      documentType: 'TI',
      documentNumber: '1.098.765.432',
      age: 16,
      isMinor: true,
      guardianName: 'Carmen Rincón Gómez (Madre)',
      guardianDoc: 'CC 52.890.341',
      communityRole: 'Joven emprendedora en panadería rural',
      phone: '312 987 6543',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-7',
      number: 7,
      fullName: 'Ana Silvia Jiménez de Parra',
      documentType: 'CC',
      documentNumber: '24.110.876',
      age: 67,
      isMinor: false,
      communityRole: 'Artesana en tejido de lana y cuidadora comunitaria',
      phone: '315 321 0987',
      signatureType: 'huella',
      signatureDataUrl: ''
    },
    {
      id: 'l-8',
      number: 8,
      fullName: 'Carlos Julio Parra Jiménez',
      documentType: 'CC',
      documentNumber: '80.234.567',
      age: 41,
      isMinor: false,
      communityRole: 'Conductor y transportador veredal de alimentos',
      phone: '318 654 3210',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-9',
      number: 9,
      fullName: 'Diana Marcela Guío Beltrán',
      documentType: 'CC',
      documentNumber: '1.052.430.987',
      age: 26,
      isMinor: false,
      communityRole: 'Madre comunitaria y avicultora',
      phone: '321 789 0123',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-10',
      number: 10,
      fullName: 'Kevin Santiago Gómez Vargas',
      documentType: 'TI',
      documentNumber: '1.065.432.110',
      age: 14,
      isMinor: true,
      guardianName: 'María Rosalba Vargas (Madre)',
      guardianDoc: 'CC 39.812.450',
      communityRole: 'Estudiante de grado 9° y entusiasta tecnológico',
      phone: '311 234 5678',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-11',
      number: 11,
      fullName: 'Pedro Antonio Fonseca Moreno',
      documentType: 'CC',
      documentNumber: '17.890.432',
      age: 65,
      isMinor: false,
      communityRole: 'Productor de leche y sabedor tradicional',
      phone: '310 112 2334',
      signatureType: 'huella',
      signatureDataUrl: ''
    },
    {
      id: 'l-12',
      number: 12,
      fullName: 'Gloria Inés Salamanca Cruz',
      documentType: 'CC',
      documentNumber: '51.987.654',
      age: 51,
      isMinor: false,
      communityRole: 'Comerciante de tienda veredal',
      phone: '316 445 5667',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-13',
      number: 13,
      fullName: 'Jhon Alexander Roa Salamanca',
      documentType: 'TI',
      documentNumber: '1.045.678.901',
      age: 17,
      isMinor: true,
      guardianName: 'Gloria Inés Salamanca (Madre)',
      guardianDoc: 'CC 51.987.654',
      communityRole: 'Bachiller agropecuario y trabajador del campo',
      phone: '319 778 8990',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-14',
      number: 14,
      fullName: 'Flor Alba Bautista de Rodríguez',
      documentType: 'CC',
      documentNumber: '38.456.789',
      age: 59,
      isMinor: false,
      communityRole: 'Apicultora y procesadora de derivados lácteos',
      phone: '313 223 3445',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-15',
      number: 15,
      fullName: 'Luis Alfonso Rodríguez Silva',
      documentType: 'CC',
      documentNumber: '74.321.654',
      age: 63,
      isMinor: false,
      communityRole: 'Carpintero rural y agricultor',
      phone: '314 556 6778',
      signatureType: 'firma',
      signatureDataUrl: ''
    },
    {
      id: 'l-16',
      number: 16,
      fullName: 'Angie Paola Buitrago Mendoza',
      documentType: 'CC',
      documentNumber: '1.056.789.012',
      age: 22,
      isMinor: false,
      communityRole: 'Líder del grupo juvenil ambiental veredal',
      phone: '320 889 9001',
      signatureType: 'firma',
      signatureDataUrl: ''
    }
  ]
};

/**
 * Generates the pure Markdown text representation of the document,
 * either with raw bracket placeholders [ ... ] or populated with the current data values.
 */
export function generateActaMarkdown(data: ActaData, usePlaceholders: boolean = false): string {
  const entity = usePlaceholders ? '[NOMBRE DE LA ENTIDAD FORMATIVA / INSTITUCIÓN]' : data.entityName;
  const program = usePlaceholders ? '[NOMBRE DEL PROGRAMA O CONVENIO]' : data.programName;
  const course = usePlaceholders ? '[NOMBRE DEL CURSO O ACCIÓN FORMATIVA]' : data.trainingCourseName;
  const actCode = usePlaceholders ? '[NÚMERO / CÓDIGO DE ACTA]' : data.actCode;
  const objective = usePlaceholders ? '[OBJETIVO GENERAL DE LA FORMACIÓN Y DE LA CONCERTACIÓN]' : data.generalObjective;
  
  const dep = usePlaceholders ? '[DEPARTAMENTO]' : data.department;
  const mun = usePlaceholders ? '[MUNICIPIO]' : data.municipality;
  const loc = usePlaceholders ? '[VEREDA / CORREGIMIENTO / CASERÍO]' : data.locality;
  const place = usePlaceholders ? '[SEDE FÍSICA / SALÓN COMUNAL / ESCUELA]' : data.meetingPlace;
  const day = usePlaceholders ? '[DÍA DE LA SEMANA PACTADO]' : data.sessionDay;
  const time = usePlaceholders ? '[FRANJA HORARIA PACTADA]' : data.sessionTime;
  const freq = usePlaceholders ? '[FRECUENCIA DE LAS SESIONES]' : data.frequencyText;
  const start = usePlaceholders ? '[FECHA DE INICIO]' : data.startDate;
  const end = usePlaceholders ? '[FECHA PREVISTA DE FINALIZACIÓN]' : data.endDate;

  const facilitator = usePlaceholders ? '[NOMBRE DEL FACILITADOR/A]' : data.facilitatorName;
  const facilitatorRole = usePlaceholders ? '[CARGO / ROL DEL FACILITADOR/A]' : data.facilitatorRole;
  const facilitatorDoc = usePlaceholders ? '[DOCUMENTO DE IDENTIDAD]' : data.facilitatorDocument;
  const communityLeader = usePlaceholders ? '[NOMBRE DEL REPRESENTANTE COMUNITARIO/A]' : data.communityLeaderName;
  const communityRole = usePlaceholders ? '[CARGO / ROL EN LA COMUNIDAD]' : data.communityLeaderRole;

  let logisticsRows = '';
  data.logistics.forEach((log) => {
    const p = usePlaceholders ? `[${log.parameter}]` : log.parameter;
    const d = usePlaceholders ? `[Detalle concertado para ${log.parameter}]` : log.agreedDetail;
    const o = usePlaceholders ? `[Observación acordada con la comunidad]` : log.communityObservations;
    logisticsRows += `| **${p}** | ${d} | ${o} |\n`;
  });

  let facilitatorCommitmentsList = '';
  data.facilitatorCommitments.forEach((c, idx) => {
    facilitatorCommitmentsList += `${idx + 1}. ${c}\n`;
  });

  let communityCommitmentsList = '';
  data.communityCommitments.forEach((c, idx) => {
    communityCommitmentsList += `${idx + 1}. ${c}\n`;
  });

  let digitalToolsList = '';
  data.digitalToolsAgreed.forEach((t) => {
    digitalToolsList += `- ${t}\n`;
  });

  let signaturesRows = '';
  data.learners.forEach((l) => {
    const doc = `${l.documentType} ${l.documentNumber}`;
    const signBadge = l.signatureType === 'huella' ? '[Huella Registrada]' : (l.signatureType === 'firma' ? '[Firma Registrada]' : '[Pendiente]');
    const minorNote = l.isMinor ? ` *(Menor de edad - Acudiente: ${l.guardianName || 'Ver registro'})*` : '';
    signaturesRows += `| ${l.number} | ${l.fullName}${minorNote} | ${doc} | ${signBadge} |\n`;
  });

  return `# ACTA FORMAL DE CONCERTACIÓN Y COMPROMISO COMUNITARIO
**Código:** ${actCode}

---

## 1. ENCABEZADO INSTITUCIONAL Y OBJETIVO GENERAL
- **Entidad Formativa / Convocante:** ${entity}
- **Programa:** ${program}
- **Curso de Capacitación:** ${course}
- **Objetivo General:**  
  ${objective}

---

## 2. DATOS GENERALES DE CONCERTACIÓN TERRITORIAL
- **Departamento:** ${dep}
- **Municipio:** ${mun}
- **Vereda / Caserío / Localidad:** ${loc}
- **Sede Física / Sitio de Encuentro:** ${place}
- **Día de la Semana Concertado:** ${day}
- **Franja Horaria:** ${time}
- **Frecuencia de Encuentros:** ${freq}
- **Período de Ejecución:** Desde ${start} hasta ${end} (${data.totalHours} horas totales)
- **Facilitador(a) a Cargo:** ${facilitator} (${facilitatorRole} - ${facilitatorDoc})
- **Representante Comunitario / Testigo:** ${communityLeader} (${communityRole})

---

## 3. TABLA DE LOGÍSTICA Y CRONOGRAMA CONCERTADO

| Parámetro | Detalle Concertado | Observaciones Comunitarias |
| :--- | :--- | :--- |
${logisticsRows}

---

## 4. CONDICIONES Y ACUERDOS METODOLÓGICOS

### 4.1. Cupo Mínimo de Aprendices y Sostenibilidad
Para garantizar la viabilidad pedagógica y la continuidad del acompañamiento institucional, se establece un **cupo mínimo obligatorio de ${data.minLearners} aprendices registrados**. La comunidad asume la corresponsabilidad de velar por la permanencia activa del grupo, implementando un sistema solidario de apoyo vecinal en caso de ausencias justificadas.

### 4.2. Participación Inclusiva e Intergeneracional (Mayores y Jóvenes desde 14 años)
${data.youthPolicyText}
Se impulsará el trabajo en duplas intergeneracionales ("Padrinazgo Tecnológico"), donde los jóvenes aportan dinamismo digital y los adultos aportan sabiduría territorial y visión productiva.

### 4.3. Metodología de Herramientas Digitales Adaptadas a la Brecha Rural
La formación se fundamentará en el principio de *"Aprender Haciendo sin Miedo"*, empleando herramientas tecnológicas sencillas y accesibles:
${digitalToolsList}
${data.connectivityNotes}

---

## 5. COMPROMISOS MUTUOS DE LAS PARTES

### 5.1. Compromisos del Facilitador / Entidad Formativa
${facilitatorCommitmentsList}

### 5.2. Compromisos de los Aprendices y la Comunidad
${communityCommitmentsList}

---

## 6. VEREDICTO FINAL Y DECLARATORIA DE ACEPTACIÓN
${data.finalVerdictText}

En constancia de lo anterior, se firma la presente acta en la Vereda **${loc}**, Municipio de **${mun}**, a los **[DÍA]** días del mes de **[MES]** de **[AÑO]**.

---

## 7. SECCIÓN DE REGISTRO, FIRMAS Y HUELLAS DACTILARES
*(Mínimo ${data.minLearners} aprendices comunitarios registrados)*

| N° | Nombre Completo | Tipo y N° de Documento | Firma o Huella |
| :---: | :--- | :--- | :---: |
${signaturesRows}

---

### FIRMAS DE CONCERTACIÓN INSTITUCIONAL Y COMUNITARIA

_____________________________________________  
**${facilitator}**  
${facilitatorRole}  
${facilitatorDoc}  

_____________________________________________  
**${communityLeader}**  
${communityRole}  
Vereda ${loc}
`;
}
