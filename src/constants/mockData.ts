import { Lesson, ModuleItem, QuizQuestion, UserStats } from '@/types';

export const USER_STATS: UserStats = {
  streakDays: 4,
  streakText: '¡En racha!',
  points: 340,
  pointsDeltaText: '+45 hoy',
  routeProgressPercent: 45,
  routeLessonsText: '9/20 lecc.',
  overallHarvestProgressPercent: 45,
  currentFarmName: 'FUNDO LOS VALLES',
};

export const MODULES_LIST: ModuleItem[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Conoce la uva de mesa de exportación',
    description: 'Morfología, calibración requerida y parámetros de sanidad para Red Globe y Thompson.',
    durationText: '12 min',
    lessonsText: '4 lecciones',
    status: 'completed',
    statusText: 'Completado',
    scoreText: 'Calificación: 100%',
    progressText: '4/4 lecciones aprobadas',
    category: 'fundamentals',
    imageUri: require('../../assets/images/uvapro/quiz_grape.jpg'),
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Identifica el punto correcto de cosecha',
    description: 'Determinación de coloración adecuada, medición de grados Brix y apariencia del raquis.',
    durationText: '10 min',
    lessonsText: '3 lecciones',
    status: 'in_progress',
    statusText: 'En progreso',
    progressPercent: 66,
    progressText: '2 de 3 lecciones completadas',
    category: 'fundamentals',
    imageUri: require('../../assets/images/uvapro/module2_caliper.jpg'),
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Técnica de corte y uso de tijeras curvas',
    description: 'Uso ergonómico de tijeras de punta roma, ángulo a 45 grados y protección de bayas periféricas.',
    durationText: '15 min',
    lessonsText: '3 lecciones prácticas',
    status: 'available',
    statusText: 'Disponible',
    pointsText: '+60 pts',
    highlightTag: 'Técnica Clave',
    category: 'cutting',
    imageUri: require('../../assets/images/uvapro/module3_shears.jpg'),
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Manipulación cuidadosa del racimo y empaque primario',
    description: 'Sujeción por el pedúnculo sin tocar la pruina y disposición en bandeja de campo.',
    durationText: '8 min',
    lessonsText: '3 lecciones',
    status: 'available',
    statusText: 'Disponible',
    progressText: 'Se desbloquea con Módulo 3',
    category: 'packaging',
    imageUri: require('../../assets/images/uvapro/hero.jpg'),
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Selecciona y cuida la calidad de la fruta',
    description: 'Detección temprana de microdaños, descarte sanitario de bayas agrietadas y resguardo ante sombra térmica.',
    durationText: '12 min',
    lessonsText: '4 lecciones',
    status: 'available',
    statusText: 'Disponible',
    category: 'packaging',
    imageUri: require('../../assets/images/uvapro/lesson_video.jpg'),
  },
];

export const CURRENT_LESSON: Lesson = {
  id: 'lesson-2-2',
  moduleId: 'mod-2',
  moduleTitle: 'Módulo 2',
  lessonNumber: 2,
  totalLessons: 3,
  title: 'Cómo sujetar el racimo sin tocar las bayas',
  subtitle: 'Aprende la manipulación correcta para preservar la pruina y cumplir con el estándar de exportación en campo.',
  durationMinutes: 3,
  pointsReward: 20,
  tag: 'Técnica de Cosecha',
  videoDurationText: '03:00',
  videoProgressText: '02:15',
  youtubeId: 'Ke6tR-Ef2uo',
  youtubeUrl: 'https://youtu.be/Ke6tR-Ef2uo',
  keyPoints: [
    {
      id: 'kp-1',
      type: 'check',
      title: 'Pedúnculo leñoso',
      description: 'Sujeta siempre desde el pedúnculo leñoso, nunca aprietes las bayas con los dedos.',
    },
    {
      id: 'kp-2',
      type: 'check',
      title: 'Protección de Pruina',
      description: 'Conserva la pruina (el polvo blanquecino natural que protege la uva y certifica frescura).',
    },
    {
      id: 'kp-3',
      type: 'critical',
      title: 'Cuidado Crítico',
      description: 'Usa tijeras desinfectadas y afiladas para evitar desgarros en el sarmiento o el racimo.',
    },
  ],
  quizId: 'quiz-mod-2',
  quizQuestionCount: 3,
};

export const LESSONS_BY_MODULE_ID: Record<string, Lesson> = {
  'mod-1': {
    id: 'lesson-1-1',
    moduleId: 'mod-1',
    moduleTitle: 'Módulo 1',
    lessonNumber: 1,
    totalLessons: 4,
    title: 'Reconoce una uva de mesa de exportación',
    subtitle: 'Identifica las características de un racimo sano y los criterios básicos de selección.',
    durationMinutes: 4,
    pointsReward: 20,
    tag: 'Fundamentos de calidad',
    videoDurationText: '04:00',
    videoProgressText: '00:00',
    keyPoints: [
      { id: 'kp-1', type: 'check', title: 'Bayas uniformes', description: 'Revisa que las bayas mantengan un tamaño y color parejos.' },
      { id: 'kp-2', type: 'check', title: 'Racimo sano', description: 'El racimo debe estar firme, limpio y sin signos de pudrición.' },
      { id: 'kp-3', type: 'critical', title: 'Descarta daños', description: 'Separa la fruta con grietas, golpes o señales de enfermedad.' },
    ],
    quizId: 'quiz-mod-1',
    quizQuestionCount: 3,
  },
  'mod-2': CURRENT_LESSON,
  'mod-3': {
    id: 'lesson-3-1',
    moduleId: 'mod-3',
    moduleTitle: 'Módulo 3',
    lessonNumber: 1,
    totalLessons: 3,
    title: 'Realiza un corte limpio con tijeras curvas',
    subtitle: 'Practica el ángulo de corte y el uso seguro de tijeras para proteger el racimo.',
    durationMinutes: 5,
    pointsReward: 20,
    tag: 'Técnica de corte',
    videoDurationText: '05:00',
    videoProgressText: '00:00',
    keyPoints: [
      { id: 'kp-1', type: 'check', title: 'Herramienta limpia', description: 'Desinfecta las tijeras antes de comenzar el trabajo.' },
      { id: 'kp-2', type: 'check', title: 'Corte preciso', description: 'Corta el pedúnculo con un movimiento firme y controlado.' },
      { id: 'kp-3', type: 'critical', title: 'Manos seguras', description: 'Mantén los dedos fuera del recorrido de las hojas.' },
    ],
    quizId: 'quiz-mod-3',
    quizQuestionCount: 3,
  },
  'mod-4': {
    id: 'lesson-4-1',
    moduleId: 'mod-4',
    moduleTitle: 'Módulo 4',
    lessonNumber: 1,
    totalLessons: 3,
    title: 'Manipula y acomoda el racimo con cuidado',
    subtitle: 'Sujeta la fruta por el pedúnculo y colócala en la bandeja sin presionarla.',
    durationMinutes: 4,
    pointsReward: 20,
    tag: 'Manipulación y empaque',
    videoDurationText: '04:00',
    videoProgressText: '00:00',
    keyPoints: [
      { id: 'kp-1', type: 'check', title: 'Sujeción correcta', description: 'Levanta el racimo por el pedúnculo, nunca por las bayas.' },
      { id: 'kp-2', type: 'check', title: 'Acomodo cuidadoso', description: 'Apoya el racimo suavemente dentro de la bandeja.' },
      { id: 'kp-3', type: 'critical', title: 'Evita presión', description: 'No apiles fruta de forma que aplaste los racimos.' },
    ],
    quizId: 'quiz-mod-4',
    quizQuestionCount: 3,
  },
  'mod-5': {
    id: 'lesson-5-1',
    moduleId: 'mod-5',
    moduleTitle: 'Módulo 5',
    lessonNumber: 1,
    totalLessons: 4,
    title: 'Selecciona fruta y protege su calidad',
    subtitle: 'Detecta daños visibles y resguarda los racimos del calor durante la cosecha.',
    durationMinutes: 4,
    pointsReward: 20,
    tag: 'Selección de calidad',
    videoDurationText: '04:00',
    videoProgressText: '00:00',
    keyPoints: [
      { id: 'kp-1', type: 'check', title: 'Inspección visual', description: 'Busca bayas agrietadas, golpeadas o con señales de deterioro.' },
      { id: 'kp-2', type: 'check', title: 'Separación oportuna', description: 'Retira la fruta dañada para proteger el resto del racimo.' },
      { id: 'kp-3', type: 'critical', title: 'Protección térmica', description: 'Deja la fruta cosechada bajo sombra mientras se traslada.' },
    ],
    quizId: 'quiz-mod-5',
    quizQuestionCount: 3,
  },
};

type QuizQuestionSeed = {
  title: string;
  options: [string, string, string];
  correctOptionIndex: number;
  explanation: string;
};

const createQuizQuestions = (
  quizId: string,
  categoryTag: string,
  imageFocusText: string,
  imageUri: number,
  seeds: QuizQuestionSeed[]
): QuizQuestion[] =>
  seeds.map((seed, index) => ({
    id: `${quizId}-q${index + 1}`,
    quizId,
    questionNumber: index + 1,
    totalQuestions: seeds.length,
    streakText: 'RACHA X3',
    categoryTag,
    locationTag: 'Piura 2025',
    title: seed.title,
    imageFocusText,
    imageUri,
    options: seed.options.map((text, optionIndex) => ({
      id: `opt-${String.fromCharCode(97 + optionIndex)}`,
      letter: String.fromCharCode(65 + optionIndex),
      text,
    })),
    correctOptionId: `opt-${String.fromCharCode(97 + seed.correctOptionIndex)}`,
    feedback: {
      title: '¡Correcto! Excelente técnica',
      subtitle: 'Buena práctica agrícola verificada',
      explanation: seed.explanation,
      points: 15,
      standardTag: 'Criterio GlobalGAP cumplido',
    },
  }));

export const QUIZ_QUESTIONS_BY_ID: Record<string, QuizQuestion[]> = {
  'quiz-mod-1': createQuizQuestions(
    'quiz-mod-1',
    'Evaluación rápida • Calidad de uva',
    'Foco: Reconocer fruta sana para exportación',
    require('../../assets/images/uvapro/quiz_grape.jpg'),
    [
      {
        title: '¿Qué característica indica un racimo uniforme?',
        options: ['Bayas de tamaño y color parejos.', 'Bayas con tamaños muy distintos.', 'Racimo con varias bayas agrietadas.'],
        correctOptionIndex: 0,
        explanation: 'La uniformidad de tamaño y color facilita una selección de calidad consistente.',
      },
      {
        title: '¿Qué debes hacer si encuentras bayas con pudrición?',
        options: ['Mezclarlas con la fruta sana.', 'Separar el racimo para revisión.', 'Limpiarlas frotando las bayas.'],
        correctOptionIndex: 1,
        explanation: 'Separar la fruta afectada evita comprometer la calidad del resto.',
      },
      {
        title: '¿Qué aspecto ayuda a identificar un racimo sano?',
        options: ['Bayas firmes y sin daños visibles.', 'Bayas blandas y con grietas.', 'Raquis seco y fruta desprendida.'],
        correctOptionIndex: 0,
        explanation: 'La firmeza y la ausencia de daños son señales de buena condición.',
      },
    ]
  ),
  'quiz-mod-2': createQuizQuestions(
    'quiz-mod-2',
    'Evaluación rápida • Técnica de cosecha',
    'Foco: Preservar la pruina y calidad de exportación',
    require('../../assets/images/uvapro/quiz_grape.jpg'),
    [
      {
        title: '¿Qué debes hacer justo antes de cortar un racimo?',
        options: ['Tocar las uvas para sentir si están maduras.', 'Sujetar el racimo por el pedúnculo sin tocar las bayas.', 'Jalar el racimo hacia abajo con la mano.'],
        correctOptionIndex: 1,
        explanation: 'Sujetar el pedúnculo protege la pruina natural y evita marcas en la fruta.',
      },
      {
        title: '¿Qué protege la pruina de las bayas?',
        options: ['La frescura y apariencia natural de la fruta.', 'El filo de las tijeras.', 'El color del raquis después del corte.'],
        correctOptionIndex: 0,
        explanation: 'La pruina es la capa natural que ayuda a conservar la apariencia y frescura.',
      },
      {
        title: '¿Qué condición deben tener las tijeras de cosecha?',
        options: ['Estar limpias y afiladas.', 'Tener las hojas húmedas de savia.', 'Estar sin filo para no cortar rápido.'],
        correctOptionIndex: 0,
        explanation: 'Una herramienta limpia y afilada permite un corte preciso y reduce desgarros.',
      },
    ]
  ),
  'quiz-mod-3': createQuizQuestions(
    'quiz-mod-3',
    'Evaluación rápida • Técnica de corte',
    'Foco: Cortar con precisión y seguridad',
    require('../../assets/images/uvapro/module3_shears.jpg'),
    [
      {
        title: '¿Qué debes revisar antes de usar las tijeras?',
        options: ['Que estén limpias y desinfectadas.', 'Que tengan restos de savia.', 'Que las hojas estén flojas.'],
        correctOptionIndex: 0,
        explanation: 'Limpiar la herramienta antes de usarla ayuda a prevenir contaminación.',
      },
      {
        title: '¿Cómo se realiza un corte seguro?',
        options: ['Con un movimiento firme y controlado.', 'Torciendo el pedúnculo con la mano.', 'Tirando del racimo mientras cortas.'],
        correctOptionIndex: 0,
        explanation: 'Un corte firme evita movimientos bruscos y daños en la planta o el racimo.',
      },
      {
        title: '¿Dónde deben mantenerse los dedos al cortar?',
        options: ['Fuera del recorrido de las hojas.', 'Entre las hojas de las tijeras.', 'Debajo del pedúnculo que se corta.'],
        correctOptionIndex: 0,
        explanation: 'Mantener las manos fuera de las hojas reduce el riesgo de lesiones.',
      },
    ]
  ),
  'quiz-mod-4': createQuizQuestions(
    'quiz-mod-4',
    'Evaluación rápida • Manipulación y empaque',
    'Foco: Evitar golpes y presión sobre la fruta',
    require('../../assets/images/uvapro/hero.jpg'),
    [
      {
        title: '¿Por dónde debes levantar el racimo?',
        options: ['Por el pedúnculo.', 'Apretando el centro de las bayas.', 'Sosteniéndolo por la punta inferior.'],
        correctOptionIndex: 0,
        explanation: 'La sujeción por el pedúnculo evita presionar y marcar las bayas.',
      },
      {
        title: '¿Cómo se coloca el racimo en la bandeja?',
        options: ['Apoyándolo suavemente.', 'Dejándolo caer desde altura.', 'Presionándolo contra otros racimos.'],
        correctOptionIndex: 0,
        explanation: 'El acomodo suave reduce golpes y mantiene la presentación del racimo.',
      },
      {
        title: '¿Cómo deben acomodarse los racimos?',
        options: ['Sin apilarlos de forma que se aplasten.', 'Con peso encima para fijarlos.', 'Apretados hasta llenar la bandeja.'],
        correctOptionIndex: 0,
        explanation: 'Evitar presión protege las bayas durante el traslado y el empaque.',
      },
    ]
  ),
  'quiz-mod-5': createQuizQuestions(
    'quiz-mod-5',
    'Evaluación rápida • Calidad de fruta',
    'Foco: Detectar daños y proteger la cosecha',
    require('../../assets/images/uvapro/lesson_video.jpg'),
    [
      {
        title: '¿Qué daño debes identificar durante la inspección?',
        options: ['Grietas o golpes en las bayas.', 'El tamaño normal del pedúnculo.', 'El color natural de la pruina.'],
        correctOptionIndex: 0,
        explanation: 'Las grietas y golpes afectan la calidad y deben detectarse a tiempo.',
      },
      {
        title: '¿Qué haces con la fruta dañada?',
        options: ['La separas de la fruta sana.', 'La ocultas debajo del racimo.', 'La frotas para quitar la marca.'],
        correctOptionIndex: 0,
        explanation: 'Separar fruta dañada evita que afecte la presentación del lote.',
      },
      {
        title: '¿Dónde resguardas los racimos cosechados?',
        options: ['Bajo sombra mientras se trasladan.', 'Al sol para que se sequen.', 'Junto a una fuente de calor.'],
        correctOptionIndex: 0,
        explanation: 'La sombra ayuda a proteger la fruta del calor durante el traslado.',
      },
    ]
  ),
};

export const QUIZ_QUESTION_DEMO = QUIZ_QUESTIONS_BY_ID['quiz-mod-2'][0];

export const SUPERVISOR_TIP = {
  name: 'Ing. Carlos Mendoza',
  role: 'Supervisor de Calidad',
  quote: '"Recuerda: nunca tomes el racimo por el centro. Mantener la pruina intacta garantiza que nuestra uva llegue con grado de exportación a destino."',
  avatarUri: require('../../assets/images/uvapro/supervisor.jpg'),
};
