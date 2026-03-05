import { db } from './config.js';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const INITIAL_COURSES = [
    {
        nombre: 'Pack Master Reiki: Usui, Kármico y Amadeуsr',
        descripcion_corta: 'Tres niveles de maestría energética en un solo programa. Aprende a canalizar, sanar y liberar a distancia.',
        descripcion_larga: 'Este pack integral incluye las tres maestrías más potentes del trabajo energético: Reiki Usui a Distancia, Reiki Kármico a Distancia y Master Amadeуsr con Sanación Chamánica. Aprenderás a canalizar energía universal, trabajar patrones kármicos de múltiples vidas, y activar frecuencias chamánicas de alta vibración. Incluye materiales, mentorías grupales y certificación. Ideal para quienes desean convertirse en terapeutas o profundizar su camino espiritual.',
        precio: 11500,
        imagen_url: '/courses/1000616982_crop.jpg',
        categoria: 'Terapias Energéticas',
        duracion: '20 Horas',
        rating: 4.9,
        reviews: 312,
        activo: true,
    },
    {
        nombre: 'Tameana, Salush Nahi y Sanación con Cristales',
        descripcion_corta: 'Aprende las técnicas de sanación con cristales más poderosas del mundo, incluyendo la técnica Tameana y la armonización Maat.',
        descripcion_larga: 'Un recorrido profundo por el universo de la sanación cuántica con cristales. Aprenderás la técnica Tameana (sanación con cristales y geometría sagrada), Salush Nahi (activación del campo áurico), Tameana en Niños de 0 a 2 años, Hama para armonización de ambientes y la ley cósmica Maat. Incluye PDFs, videos explicativos y práctica supervisada online.',
        precio: 8500,
        imagen_url: '/courses/1000616987_crop.jpg',
        categoria: 'Sanación con Cristales',
        duracion: '16 Horas',
        rating: 4.8,
        reviews: 187,
        activo: true,
    },
    {
        nombre: 'Armonización 7 Velas · 7 Chakras',
        descripcion_corta: 'Ritual de sanación energética para armonizar tus 7 chakras principales a través del poder purificador del fuego.',
        descripcion_larga: 'Este ritual sagrado utiliza el poder del fuego, los colores y los mantras para limpiar y equilibrar los 7 centros de energía del cuerpo. Aprenderás a trabajar con velas de colores específicos para cada chakra, los mantras de activación correspondientes y la forma correcta de cerrar el ritual para sellar los resultados. Una herramienta poderosa para liberar bloqueos emocionales, energizar tu campo áurico y recuperar la vitalidad.',
        precio: 5000,
        imagen_url: '/courses/1000616989_crop.jpg',
        categoria: 'Rituales y Chakras',
        duracion: '6 Horas',
        rating: 4.9,
        reviews: 224,
        activo: true,
    },
    {
        nombre: 'Limpieza con Vela de Ruda',
        descripcion_corta: 'Elimina envidias, malas energías, encantamientos y bloqueos con esta poderosa limpieza energética ancestral.',
        descripcion_larga: 'La ruda es una de las plantas protectoras más poderosas de la tradición popular latinoamericana. En este curso aprenderás el ritual completo de limpieza energética con vela de ruda: cómo preparar el espacio sagrado, las oraciones de apertura, la lectura de la cera para diagnosticar bloqueos y las técnicas de sellado para protegerse de nuevas influencias negativas. Si sentís que todo está bloqueado en tu vida, esta limpieza es el primer paso hacia la liberación.',
        precio: 4000,
        imagen_url: '/courses/1000616997_crop.jpg',
        categoria: 'Limpiezas Energéticas',
        duracion: '4 Horas',
        rating: 4.7,
        reviews: 156,
        activo: true,
    },
    {
        nombre: 'Curso Semillas Estelares',
        descripcion_corta: 'Descubrí tu origen cósmico y activá tu energía estelar. Para Pleyadianos, Arcturianos, Urmah, Lemurianos y más.',
        descripcion_larga: 'Este programa está diseñado para almas que sienten que pertenecen a otro lugar, que han llegado a la Tierra con una misión específica. Aprenderás a identificar tu linaje estelar (Pleyadiano, Arcturiano, Urmah, Lemuriano u otros), conectar con tus guías de luz, activar memorias de vidas interplanetarias y recibir meditaciones y técnicas de sanación cósmica únicas. Incluye PDFs, videos, meditaciones guiadas y ejercicios de activación. Activa tu energía cósmica y recuerda tu origen estelar.',
        precio: 9500,
        imagen_url: '/courses/1000616998_crop.jpg',
        categoria: 'Espiritualidad Cosmica',
        duracion: '14 Horas',
        rating: 5.0,
        reviews: 289,
        activo: true,
    }
];

export async function seedCourses() {
    const coursesCol = collection(db, 'cursos');

    // Remove existing courses
    console.log("Clearing existing courses...");
    const snapshot = await getDocs(coursesCol);
    for (const document of snapshot.docs) {
        try {
            await deleteDoc(document.ref);
        } catch (e) {
            console.error("Error deleting course: ", e);
        }
    }

    console.log("Seeding new courses...");
    for (const course of INITIAL_COURSES) {
        try {
            await addDoc(coursesCol, course);
            console.log(`Added: ${course.nombre}`);
        } catch (e) {
            console.error("Error adding course: ", e);
        }
    }
    console.log("Seeding complete!");
}
