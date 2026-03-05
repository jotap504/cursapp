-- ════════════════════════════════════════════════════════
--  SEED DE CURSOS — cursApp
--  Ejecutá esto en Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════════

insert into cursos (nombre, descripcion, precio, imagen_url, categoria, activo, archivos)
values
(
  'Pack Master Reiki: Usui, Kármico y Amadeusr',
  'Este pack integral incluye las tres maestrías más potentes del trabajo energético: Reiki Usui a Distancia, Reiki Kármico a Distancia y Master Amadeusr con Sanación Chamánica. Aprenderás a canalizar energía universal, trabajar patrones kármicos de múltiples vidas, y activar frecuencias chamánicas de alta vibración. Incluye materiales, mentorías grupales y certificación.',
  11500,
  '/courses/1000616982_crop.jpg',
  'Terapias Energéticas',
  true,
  '[]'
),
(
  'Tameana, Salush Nahi y Sanación con Cristales',
  'Un recorrido profundo por el universo de la sanación cuántica con cristales. Aprenderás la técnica Tameana (sanación con cristales y geometría sagrada), Salush Nahi (activación del campo áurico), Tameana en Niños de 0 a 2 años, Hama para armonización de ambientes y la ley cósmica Maat. Incluye PDFs, videos explicativos y práctica supervisada online.',
  8500,
  '/courses/1000616987_crop.jpg',
  'Sanación con Cristales',
  true,
  '[]'
),
(
  'Armonización 7 Velas · 7 Chakras',
  'Este ritual sagrado utiliza el poder del fuego, los colores y los mantras para limpiar y equilibrar los 7 centros de energía del cuerpo. Aprenderás a trabajar con velas de colores específicos para cada chakra, los mantras de activación correspondientes y la forma correcta de cerrar el ritual para sellar los resultados.',
  5000,
  '/courses/1000616989_crop.jpg',
  'Rituales y Chakras',
  true,
  '[]'
),
(
  'Limpieza con Vela de Ruda',
  'La ruda es una de las plantas protectoras más poderosas de la tradición popular latinoamericana. En este curso aprenderás el ritual completo de limpieza energética con vela de ruda: cómo preparar el espacio sagrado, las oraciones de apertura, la lectura de la cera para diagnosticar bloqueos y las técnicas de sellado para protegerse de nuevas influencias negativas.',
  4000,
  '/courses/1000616997_crop.jpg',
  'Limpiezas Energéticas',
  true,
  '[]'
),
(
  'Curso Semillas Estelares',
  'Este programa está diseñado para almas que sienten que pertenecen a otro lugar. Aprenderás a identificar tu linaje estelar (Pleyadiano, Arcturiano, Urmah, Lemuriano u otros), conectar con tus guías de luz, activar memorias de vidas interplanetarias y recibir meditaciones y técnicas de sanación cósmica únicas.',
  9500,
  '/courses/1000616998_crop.jpg',
  'Espiritualidad Cosmica',
  true,
  '[]'
);
