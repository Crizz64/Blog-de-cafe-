/**
 * FIREBASE CONFIG - VERSIÓN SEGURA
 * Con validaciones, manejo de errores robusto y protecciones
 */

// ============================================
// VARIABLES DE ENTORNO (Usar estas si es posible)
// ============================================
const firebaseConfig = {
  // IMPORTANTE: Estas credenciales tienen protección de Firestore Rules
  // No son tokens de admin - riesgo controlado
  apiKey: "REEMPLAZAR_CON_TU_API_KEY",
  authDomain: "REEMPLAZAR_CON_TU_AUTH_DOMAIN",
  projectId: "REEMPLAZAR_CON_TU_PROJECT_ID",
  storageBucket: "REEMPLAZAR_CON_TU_STORAGE_BUCKET",
  messagingSenderId: "REEMPLAZAR_CON_TU_SENDER_ID",
  appId: "REEMPLAZAR_CON_TU_APP_ID"
};

// ============================================
// VALIDACIÓN DE CONFIGURACIÓN
// ============================================
function validateFirebaseConfig(config) {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 
    'storageBucket', 'messagingSenderId', 'appId'
  ];
  
  for (const field of requiredFields) {
    if (!config[field] || config[field].startsWith('REEMPLAZAR')) {
      console.error(`❌ Firebase config incompleto: ${field} falta o no remplazado`);
      return false;
    }
  }
  
  return true;
}

// ============================================
// INICIALIZACIÓN CON MANEJO DE ERRORES
// ============================================
let db;
let firebaseReady = false;

try {
  if (!validateFirebaseConfig(firebaseConfig)) {
    throw new Error('Firebase config no validado - Ver FIREBASE_SETUP.md');
  }
  
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  
  // Habilitar logging solo en desarrollo
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // firebase.firestore.enableLogging(true);
  }
  
  firebaseReady = true;
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  firebaseReady = false;
  console.error('❌ Error inicializando Firebase:', error.message);
  // No exponer detalles del error al usuario
}

// ============================================
// FUNCIÓN: SANITIZAR DATOS (Prevenir XSS)
// ============================================
function sanitizeData(data) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Eliminar caracteres peligrosos pero mantener contenido
      sanitized[key] = value
        .trim()
        .substring(0, 1000) // Limitar longitud
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Eliminar scripts
        .replace(/javascript:/gi, ''); // Eliminar javascript:
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// ============================================
// FUNCIÓN: VALIDAR EMAILS (Básico)
// ============================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// ============================================
// FUNCIÓN: VALIDAR TELÉFONO
// ============================================
function isValidPhone(phone) {
  if (!phone) return true; // Opcional
  // Acepta: +57 123 456 7890, 573124567890, etc
  const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
  return phoneRegex.test(phone);
}

// ============================================
// FUNCIÓN: GUARDAR DATOS EN FIREBASE
// ============================================
async function saveFormToFirebase(formData) {
  // Validar que Firebase está listo
  if (!firebaseReady) {
    return {
      success: false,
      message: 'Base de datos no disponible. Reintenta más tarde.',
      fallback: true
    };
  }

  try {
    // === VALIDACIÓN 1: Campos requeridos ===
    if (!formData.nombre?.trim() || !formData.email?.trim() || !formData.mensaje?.trim()) {
      return {
        success: false,
        message: 'Por favor completa todos los campos requeridos'
      };
    }

    // === VALIDACIÓN 2: Longitudes ===
    if (formData.nombre.length < 3 || formData.nombre.length > 100) {
      return { success: false, message: 'Nombre debe tener 3-100 caracteres' };
    }
    
    if (formData.mensaje.length < 10 || formData.mensaje.length > 5000) {
      return { success: false, message: 'Mensaje debe tener 10-5000 caracteres' };
    }

    // === VALIDACIÓN 3: Email válido ===
    if (!isValidEmail(formData.email)) {
      return { success: false, message: 'Email no válido' };
    }

    // === VALIDACIÓN 4: Teléfono (si se proporciona) ===
    if (formData.telefono && !isValidPhone(formData.telefono)) {
      return { success: false, message: 'Teléfono no válido' };
    }

    // === VALIDACIÓN 5: Rate Limiting (Prevenir spam) ===
    const sessionKey = `form_submit_${new Date().getHours()}`;
    const submitCount = parseInt(sessionStorage.getItem(sessionKey) || '0');
    
    if (submitCount >= 5) {
      return {
        success: false,
        message: 'Demasiados envíos. Intenta en 1 hora.',
        rateLimited: true
      };
    }
    
    sessionStorage.setItem(sessionKey, String(submitCount + 1));

    // === SANITIZACIÓN ===
    const dataToSave = sanitizeData({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono || '',
      mensaje: formData.mensaje,
      pagina: document.title.substring(0, 200),
      urlReferencia: window.location.href.substring(0, 500),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 200) // Para análisis
    });

    // === GUARDAR EN FIRESTORE ===
    const docRef = await db.collection('contactos').add(dataToSave);
    
    // Log interno (no exponer a usuario)
    logEvent('form_submitted', { docId: docRef.id });
    
    return {
      success: true,
      id: docRef.id,
      message: '✅ Tu mensaje ha sido registrado. Nos contactaremos pronto.'
    };

  } catch (error) {
    // === MANEJO DE ERRORES SEGURO ===
    
    // Clasificar tipo de error
    let message = 'Error procesando formulario. Intenta de nuevo.';
    
    if (error.code === 'permission-denied') {
      message = 'No tienes permiso para enviar formularios. Contacta soporte.';
    } else if (error.code === 'unauthenticated') {
      message = 'Conexión perdida. Por favor recarga y intenta de nuevo.';
    } else if (error.message.includes('quota')) {
      message = 'Servidor congestionado. Intenta en unos minutos.';
    }
    
    // Log interno para debugging
    if (location.hostname === 'localhost') {
      console.error('Debug info:', error);
    } else {
      // En producción, enviar a servicio de monitoring
      logErrorToMonitoring(error, { form: 'contacto' });
    }
    
    return {
      success: false,
      message: message,
      error: error.code
    };
  }
}

// ============================================
// FUNCIÓN: OBTENER CONTACTOS (Admin only)
// ============================================
async function getAllContacts() {
  if (!firebaseReady) {
    console.warn('⚠️ Firebase no está listo');
    return [];
  }

  try {
    const snapshot = await db
      .collection('contactos')
      .orderBy('fechaRegistro', 'desc')
      .limit(100) // Limitar para no sobrecargar
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
    console.error('Error obteniendo contactos:', error.message);
    return [];
  }
}

// ============================================
// FUNCIÓN: ELIMINAR UN CONTACTO
// ============================================
async function deleteContact(contactId) {
  if (!firebaseReady) return false;

  try {
    // Validar que ID parece válido
    if (!contactId || typeof contactId !== 'string' || contactId.length < 5) {
      console.error('❌ ID de contacto inválido');
      return false;
    }

    await db.collection('contactos').doc(contactId).delete();
    console.log('✅ Contacto eliminado');
    return true;
  } catch (error) {
    console.error('Error eliminando contacto:', error.message);
    return false;
  }
}

// ============================================
// FUNCIONES AUXILIARES DE MONITORING
// ============================================

function logEvent(eventName, data = {}) {
  // Implementar con Google Analytics o servicio similar
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, data);
  }
}

function logErrorToMonitoring(error, context = {}) {
  // Implementar con Sentry, LogRocket, etc
  console.error('Monitoring event:', {
    message: error.message,
    code: error.code,
    timestamp: new Date().toISOString(),
    ...context
  });
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveFormToFirebase,
    getAllContacts,
    deleteContact,
    isValidEmail,
    isValidPhone,
    firebaseReady
  };
}
