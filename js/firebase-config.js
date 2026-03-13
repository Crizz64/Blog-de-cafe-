/**
 * Configuración de Firebase para Blog de Café
 * 
 * INSTRUCCIONES DE SETUP:
 * 1. Ir a https://console.firebase.google.com/
 * 2. Crear nuevo proyecto: "blog-de-cafe"
 * 3. Agregar app web
 * 4. Copiar config y reemplazar HERE abajo
 * 5. Activar Firestore Database
 * 6. Reemplazar las credenciales en este archivo
 */

// Importar Firebase (desde CDN en HTML)
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>

// Reemplaza estos valores con TUS credenciales de Firebase
const firebaseConfig = {
  apiKey: "REEMPLAZAR_CON_TU_API_KEY",
  authDomain: "REEMPLAZAR_CON_TU_AUTH_DOMAIN",
  projectId: "REEMPLAZAR_CON_TU_PROJECT_ID",
  storageBucket: "REEMPLAZAR_CON_TU_STORAGE_BUCKET",
  messagingSenderId: "REEMPLAZAR_CON_TU_SENDER_ID",
  appId: "REEMPLAZAR_CON_TU_APP_ID"
};

// Inicializar Firebase
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
}

/**
 * Función para guardar datos del formulario en Firestore
 * @param {Object} formData - Objeto con los datos del formulario
 * @returns {Promise} - Promesa que se resuelve cuando se guarda
 */
async function saveFormToFirebase(formData) {
  try {
    if (!db) {
      throw new Error('Firebase no está inicializado');
    }

    // Agregar timestamp
    const dataToSave = {
      ...formData,
      timestamp: new Date().toISOString(),
      fechaRegistro: new Date()
    };

    // Agregar a Firestore
    const docRef = await db.collection('contactos').add(dataToSave);
    
    console.log('✅ Datos guardados con ID:', docRef.id);
    return {
      success: true,
      id: docRef.id,
      message: '¡Gracias! Tu mensaje ha sido registrado correctamente.'
    };
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Obtener todos los contactos (solo para admin)
 * Usar en consola o dashboard privado
 */
async function getAllContacts() {
  try {
    const snapshot = await db.collection('contactos').orderBy('fechaRegistro', 'desc').get();
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return contacts;
  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    return [];
  }
}

/**
 * Obtener contactos de hoy
 */
async function getTodayContacts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const snapshot = await db.collection('contactos')
      .where('fechaRegistro', '>=', today)
      .orderBy('fechaRegistro', 'desc')
      .get();
    
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return contacts;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Eliminar un contacto (solo admin)
 */
async function deleteContact(contactId) {
  try {
    await db.collection('contactos').doc(contactId).delete();
    console.log('✅ Contacto eliminado');
    return true;
  } catch (error) {
    console.error('Error eliminando:', error);
    return false;
  }
}

// Exportar funciones si usas módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveFormToFirebase,
    getAllContacts,
    getTodayContacts,
    deleteContact
  };
}
