// ============================================
// SUPABASE CONFIGURATION (SECURE)
// ============================================
// Blog de Café - Formulario de Contacto
// Integración segura con PostgreSQL/Supabase

// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES
const SUPABASE_URL = "https://wyuqnxjwgizpqwybilmu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_asx3rChDRxfjA93M8cLuGw_aQHB3IMC";

// ============================================
// VALIDACIÓN DE CONFIGURACIÓN
// ============================================
function validateSupabaseConfig() {
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  if (!SUPABASE_URL || SUPABASE_URL.includes("xxxxx")) {
    if (isDev) {
      console.error("❌ SUPABASE_URL no está configurada");
      console.error("   Ir a: supabase.com → Settings → API → Project URL");
    }
    return false;
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("eyJ")) {
    if (isDev) {
      console.error("❌ SUPABASE_ANON_KEY no está configurada");
      console.error("   Ir a: supabase.com → Settings → API → anon key");
    }
    return false;
  }
  
  console.log("✅ Supabase configurado correctamente");
  return true;
}

// ============================================
// SANITIZACIÓN (Prevención XSS)
// ============================================
function sanitizeData(data) {
  const sanitized = {};
  for (let [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remover scripts y handlers JavaScript
      sanitized[key] = value
        .trim()
        .substring(0, 5000)  // Limitar longitud
        .replace(/<script[^>]*>.*?<\/script>/gi, '')  // <script>
        .replace(/javascript:/gi, '')  // javascript: URLs
        .replace(/on\w+\s*=/gi, '')  // event handlers (onclick, onerror, etc)
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')  // iframes
        .replace(/<embed[^>]*>/gi, '')  // embeds
        .replace(/<object[^>]*>.*?<\/object>/gi, '');  // objects
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// ============================================
// VALIDADORES
// ============================================

/**
 * Validar email format (RFC compliant)
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254 && email.length >= 5;
}

/**
 * Validar teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido (permite formato flexible)
 */
function isValidPhone(phone) {
  if (!phone || phone.trim() === '') return true; // Opcional
  // Permite números, espacios, +, -, ()
  return /^[\d\s+\-()]{7,20}$/.test(phone.trim());
}

/**
 * Validar longitud de texto
 * @param {string} text - Texto a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} - True si es válido
 */
function isValidLength(text, min, max) {
  const trimmed = text.trim();
  return trimmed.length >= min && trimmed.length <= max;
}

// ============================================
// RATE LIMITING
// ============================================

/**
 * Verificar rate limiting
 * Máximo 5 envíos por hora por sesión
 * @returns {object} - {allowed: boolean, message: string}
 */
function checkRateLimit() {
  const now = new Date();
  const currentHour = now.getHours();
  const sessionKey = `form_submit_${currentHour}`;
  
  const submitCount = parseInt(sessionStorage.getItem(sessionKey) || '0');
  const maxSubmits = 5;
  
  if (submitCount >= maxSubmits) {
    return {
      allowed: false,
      message: `Límite de ${maxSubmits} envíos por hora alcanzado. Intenta más tarde.`
    };
  }
  
  // Incrementar contador
  sessionStorage.setItem(sessionKey, (submitCount + 1).toString());
  
  // Limpiar otros horas
  for (let i = 0; i < 24; i++) {
    if (i !== currentHour) {
      sessionStorage.removeItem(`form_submit_${i}`);
    }
  }
  
  return { allowed: true };
}

/**
 * Verificar delay mínimo entre envíos (1 segundo)
 * @returns {boolean} - True si pasó el tiempo
 */
function checkMinimumDelay() {
  const lastSubmit = sessionStorage.getItem('lastFormSubmit');
  if (!lastSubmit) return true;
  
  const elapsed = Date.now() - parseInt(lastSubmit);
  return elapsed >= 1000; // 1 segundo mínimo
}

// ============================================
// GUARDAR EN SUPABASE
// ============================================

/**
 * Guardar formulario contacto en Supabase
 * @param {object} formData - {nombre, email, telefono, mensaje}
 * @returns {object} - {success, message, error}
 */
async function saveFormToSupabase(formData) {
  try {
    // 1. Validar configuración
    if (!validateSupabaseConfig()) {
      return {
        success: false,
        message: "Base de datos no configurada",
        error: "config"
      };
    }

    // 2. Validar campos requeridos
    const { nombre, email, mensaje } = formData;
    
    if (!nombre || !isValidLength(nombre, 3, 255)) {
      return {
        success: false,
        message: "Nombre debe tener entre 3 y 255 caracteres"
      };
    }

    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: "Email inválido. Verifica formato: ejemplo@dominio.com"
      };
    }

    if (!mensaje || !isValidLength(mensaje, 10, 5000)) {
      return {
        success: false,
        message: "Mensaje debe tener entre 10 y 5000 caracteres"
      };
    }

    // 3. Validar teléfono si existe
    if (formData.telefono && !isValidPhone(formData.telefono)) {
      return {
        success: false,
        message: "Teléfono inválido"
      };
    }

    // 4. Rate limiting
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        message: rateLimitCheck.message,
        rateLimited: true
      };
    }

    // 5. Delay mínimo entre envíos
    if (!checkMinimumDelay()) {
      return {
        success: false,
        message: "Espera un segundo antes de enviar otra vez",
        rateLimited: true
      };
    }

    // 6. Sanitizar datos
    const sanitized = sanitizeData({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: (formData.telefono || "").trim(),
      mensaje: mensaje.trim()
    });

    // 7. Enviar a Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'  // No devolver el registro
      },
      body: JSON.stringify(sanitized)
    });

    // 8. Manejo de respuesta
    if (!response.ok) {
      const isDev = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
      
      if (isDev) {
        const error = await response.json();
        console.error('Error Supabase (DEV):', error);
      }
      
      // Errores seguros para producción
      if (response.status === 401) {
        return {
          success: false,
          message: "Error de autenticación",
          error: "auth"
        };
      } else if (response.status === 403) {
        return {
          success: false,
          message: "No tienes permiso para enviar",
          error: "permission"
        };
      } else if (response.status === 400) {
        return {
          success: false,
          message: "Datos inválidos. Verifica los campos.",
          error: "validation"
        };
      } else {
        return {
          success: false,
          message: "Error al procesar tu solicitud",
          error: "unknown"
        };
      }
    }

    // 9. Éxito
    console.log('✅ Formulario guardado en Supabase');
    sessionStorage.setItem('lastFormSubmit', Date.now().toString());
    
    // 10. Guardar en localStorage como fallback
    const contacts = JSON.parse(localStorage.getItem('contactos_offline') || '[]');
    contacts.push({
      ...sanitized,
      sincronizado: true,
      timestamp: new Date().toISOString()
    });
    
    // Limitar a 50 registros
    if (contacts.length > 50) {
      contacts.shift();
    }
    localStorage.setItem('contactos_offline', JSON.stringify(contacts));

    return {
      success: true,
      message: "✅ ¡Gracias por tu contacto! Pronto nos pondremos en contacto."
    };

  } catch (error) {
    // Error de red o otro
    console.error('Error:', error.message);
    
    // Fallback: guardar en localStorage
    try {
      const contacts = JSON.parse(localStorage.getItem('contactos_offline') || '[]');
      contacts.push({
        ...formData,
        sincronizado: false,
        timestamp: new Date().toISOString(),
        error: error.message
      });
      localStorage.setItem('contactos_offline', JSON.stringify(contacts));
      
      return {
        success: true,
        message: "Tu mensaje se guardó localmente. Se sincronizará cuando haya conexión.",
        offline: true
      };
    } catch (localError) {
      return {
        success: false,
        message: "Error de conexión. Por favor intenta más tarde.",
        error: error.message
      };
    }
  }
}

// ============================================
// LECTURA DE CONTACTOS (Admin)
// ============================================

/**
 * Obtener todos los contactos
 * @returns {array} - Array de contactos
 */
async function getContacts() {
  try {
    validateSupabaseConfig();
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contactos?order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      console.error('Error obteniendo contactos:', response.status);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

/**
 * Obtener contactos locales (offline)
 * @returns {array} - Array de contactos guardados localmente
 */
function getOfflineContacts() {
  try {
    return JSON.parse(localStorage.getItem('contactos_offline') || '[]');
  } catch {
    return [];
  }
}

// ============================================
// ELIMINACIÓN DE CONTACTOS (Admin)
// ============================================

/**
 * Eliminar un contacto por ID
 * @param {number} id - ID del contacto
 * @returns {boolean} - True si fue eliminado
 */
async function deleteContact(id) {
  try {
    validateSupabaseConfig();
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error eliminando contacto:', error);
    return false;
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Verificar configuración al cargar
validateSupabaseConfig();
console.log('✅ Supabase config script cargado');
