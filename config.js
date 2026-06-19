// ========== CONFIGURACIÓN DESDE VARIABLES DE ENTORNO ==========
// Este archivo usa variables de entorno de Netlify

const CONFIG = {
    // Firebase - Tomado de variables de entorno
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "dentaljarquin-af2fa.firebaseapp.com",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "dentaljarquin-af2fa",
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "dentaljarquin-af2fa.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "1008954388103",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "1:1008954388103:web:c1121eb3b95ba6ac705222",
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || "G-26K839TN4E",
    
    // EmailJS
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || "S_lKrkyrMZPblJxkm",
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID || "service_s8261oe",
    EMAILJS_TEMPLATE_CONTACTO: process.env.EMAILJS_TEMPLATE_CONTACTO || "template_ke12e27",
    EMAILJS_TEMPLATE_CODIGO: process.env.EMAILJS_TEMPLATE_CODIGO || "template_7xgn3qa",
};

// No permitir modificar
Object.freeze(CONFIG);

// Exportar para módulos (si usas imports)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}