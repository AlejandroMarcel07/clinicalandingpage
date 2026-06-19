// ========== CONFIGURACIÓN DESDE VARIABLES DE ENTORNO ==========
// Este archivo usa variables de entorno de Netlify

const CONFIG = {
    // Firebase - Tomado de variables de entorno
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    
    // EmailJS
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_CONTACTO: process.env.EMAILJS_TEMPLATE_CONTACTO,
    EMAILJS_TEMPLATE_CODIGO: process.env.EMAILJS_TEMPLATE_CODIGO,
};

// No permitir modificar
Object.freeze(CONFIG);

// Exportar para módulos (si usas imports)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}