// ========== CONFIGURACIÓN DE FIREBASE ==========
const firebaseConfig = {
  apiKey: "AIzaSyCsM9iEZ6xKZN8asWvWkG66KQse9eReeKA",
  authDomain: "dentaljarquin-af2fa.firebaseapp.com",
  projectId: "dentaljarquin-af2fa",
  storageBucket: "dentaljarquin-af2fa.firebasestorage.app",
  messagingSenderId: "1008954388103",
  appId: "1:1008954388103:web:c1121eb3b95ba6ac705222",
  measurementId: "G-26K839TN4E"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log('✅ Firebase configurado correctamente (Auth + Firestore)');