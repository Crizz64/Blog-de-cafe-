/**
 * FORM HANDLER - VERSIÓN SEGURA
 * Con validación completa, manejo robusto de errores y seguridad
 */

class FormularioContactoSeguro {
  constructor(formularioSelector = '.formulario') {
    this.form = document.querySelector(formularioSelector);
    this.isSubmitting = false;
    this.submitAttempts = 0;
    this.lastSubmitTime = 0;
    this.minDelayBetweenSubmits = 1000; // 1 segundo mínimo
    
    if (!this.form) {
      this.logError('Formulario no encontrado', 'init');
      return;
    }
    
    this.inicializar();
    this.logEvent('form_initialized');
  }

  /**
   * LOGGING SEGURO - No expone datos sensibles
   */
  logEvent(eventName, data = {}) {
    if (location.hostname === 'localhost') {
      console.log(`✅ [EVENT] ${eventName}`, data);
    }
    // En producción, enviar a analytics
  }

  logError(message, context = '') {
    const isDev = location.hostname === 'localhost';
    
    if (isDev) {
      console.error(`❌ [ERROR] ${message}`, context);
    } else {
      // En producción, loguear internamente sin exponer
      console.error('Error procesando solicitud');
      // Enviar a servicio de monitoring
    }
  }

  /**
   * INICIALIZACIÓN
   */
  inicializar() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.configureValidationListeners();
    this.logEvent('listeners_configured');
  }

  /**
   * CONFIGURAR VALIDACIÓN EN TIEMPO REAL
   */
  configureValidationListeners() {
    const campos = ['nombre', 'email', 'telefono', 'mensaje'];
    
    campos.forEach(id => {
      const campo = document.getElementById(id);
      if (!campo) {
        this.logError(`Campo no encontrado: ${id}`, 'listener_config');
        return;
      }
      
      // Validar mientras escribe (con debounce)
      campo.addEventListener('input', this.debounce((e) => {
        this.validateField(e.target);
      }, 300));
      
      // Validar al perder foco
      campo.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });
    });
  }

  /**
   * DEBOUNCE - Evitar validación excesiva
   */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * VALIDAR UN CAMPO
   */
  validateField(field) {
    if (!field) return false;
    
    const valor = field.value.trim();
    let isValid = false;
    let minLength = 3;

    try {
      if (field.id === 'email') {
        // Validación email robusta
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        isValid = emailRegex.test(valor) && valor.length <= 254;
        
      } else if (field.id === 'telefono') {
        // Teléfono es opcional pero si se proporciona debe ser válido
        if (valor.length === 0) {
          isValid = true;
        } else {
          const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
          isValid = phoneRegex.test(valor);
        }
        
      } else if (field.id === 'nombre') {
        isValid = valor.length >= minLength && valor.length <= 100;
        
      } else if (field.id === 'mensaje') {
        isValid = valor.length >= 10 && valor.length <= 5000;
      }

      // Actualizar visual
      this.updateFieldStyle(field, isValid, valor.length > 0);
      
    } catch (error) {
      this.logError(`Error validando campo ${field.id}`, error);
      this.updateFieldStyle(field, false, true);
    }

    return isValid;
  }

  /**
   * ACTUALIZAR ESTILO DE CAMPO
   */
  updateFieldStyle(field, isValid, hasValue) {
    if (isValid) {
      field.style.borderColor = '#27ae60';
      field.style.backgroundColor = 'rgba(39, 174, 96, 0.02)';
      field.setAttribute('aria-invalid', 'false');
    } else if (hasValue) {
      field.style.borderColor = '#e74c3c';
      field.style.backgroundColor = 'rgba(231, 76, 60, 0.05)';
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.style.borderColor = '';
      field.style.backgroundColor = '';
      field.removeAttribute('aria-invalid');
    }
  }

  /**
   * VALIDAR FORMULARIO COMPLETO
   */
  validarFormulario() {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const mensaje = document.getElementById('mensaje');

    // Validar que existan los campos
    if (!nombre || !email || !mensaje) {
      this.mostrarError('Campos requeridos no encontrados');
      return false;
    }

    const campos = [
      { elem: nombre, minLen: 3, maxLen: 100, nombre: 'Nombre' },
      { elem: email, minLen: 5, maxLen: 254, nombre: 'Email' },
      { elem: mensaje, minLen: 10, maxLen: 5000, nombre: 'Mensaje' }
    ];

    for (const campo of campos) {
      const valor = campo.elem.value.trim();
      
      if (!valor || valor.length < campo.minLen) {
        this.mostrarError(`${campo.nombre} es requerido (mín ${campo.minLen} caracteres)`);
        campo.elem.focus();
        return false;
      }
      
      if (valor.length > campo.maxLen) {
        this.mostrarError(`${campo.nombre} es muy largo (máx ${campo.maxLen} caracteres)`);
        return false;
      }
    }

    // Validar email especial
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.value.trim())) {
      this.mostrarError('Por favor ingresa un email válido');
      email.focus();
      return false;
    }

    // Validar teléfono si se proporciona
    if (telefono && telefono.value.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
      if (!phoneRegex.test(telefono.value.trim())) {
        this.mostrarError('Teléfono no válido');
        telefono.focus();
        return false;
      }
    }

    return true;
  }

  /**
   * PREVENIR SPAM/ABUSE
   */
  checkRateLimit() {
    const ahora = Date.now();
    const tiempoTranscurrido = ahora - this.lastSubmitTime;

    if (tiempoTranscurrido < this.minDelayBetweenSubmits) {
      this.mostrarError('Por favor espera un momento antes de enviar de nuevo');
      return false;
    }

    // Limitar intentos por hora
    const horaActual = new Date().getHours();
    const sessionKey = `form_submit_${horaActual}`;
    const intentos = parseInt(sessionStorage.getItem(sessionKey) || '0');

    if (intentos >= 5) {
      this.mostrarError('Demasiados intentos. Intenta en 1 hora.');
      this.logEvent('rate_limit_exceeded', { intentos });
      return false;
    }

    sessionStorage.setItem(sessionKey, String(intentos + 1));
    this.lastSubmitTime = ahora;
    return true;
  }

  /**
   * MANEJAR ENVÍO
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Validaciones preliminares
    if (this.isSubmitting) {
      this.mostrarError('El formulario ya está siendo procesado');
      return;
    }

    if (!this.validarFormulario()) {
      return;
    }

    if (!this.checkRateLimit()) {
      return;
    }

    this.isSubmitting = true;
    this.cambiarBotonEstado(true);
    this.logEvent('form_submit_started');

    try {
      // Obtener datos con sanitización básica
      const nombre = this.sanitizeString(document.getElementById('nombre').value);
      const email = this.sanitizeString(document.getElementById('email').value);
      const telefono = this.sanitizeString(document.getElementById('telefono').value);
      const mensaje = this.sanitizeString(document.getElementById('mensaje').value);

      const datos = {
        nombre,
        email,
        telefono: telefono || '',
        mensaje,
        pagina: document.title.substring(0, 200),
        urlReferencia: window.location.href.substring(0, 500)
      };

      // Intentar Firebase
      if (typeof saveFormToFirebase !== 'undefined') {
        const resultado = await saveFormToFirebase(datos);
        
        if (resultado.success) {
          this.mostrarExito(resultado.message);
          this.form.reset();
          this.limpiarEstilos();
          this.logEvent('form_submitted_success', { docId: resultado.id });
        } else if (resultado.fallback) {
          // Firebase no disponible, usar localStorage
          this.guardarEnLocal(datos);
          this.mostrarExito('Mensaje guardado localmente. Se sincronizará cuando Internet esté disponible.');
        } else {
          throw new Error(resultado.message);
        }
      } else {
        throw new Error('Sistema de formulario no disponible');
      }

    } catch (error) {
      this.logError('Error en handleSubmit', error.message);
      this.mostrarError(error.message || 'Error procesando formulario. Intenta de nuevo.');
      this.logEvent('form_submit_failed', { error: error.message });
      
    } finally {
      this.isSubmitting = false;
      this.cambiarBotonEstado(false);
    }
  }

  /**
   * SANITIZAR STRING (Prevenir XSS)
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .trim()
      .substring(0, 5000) // Limitar longitud
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Eliminar scripts
      .replace(/javascript:/gi, '') // Eliminar javascript:
      .replace(/on\w+\s*=/gi, ''); // Eliminar event handlers (onclick=, etc)
  }

  /**
   * GUARDAR EN LOCALSTORAGE (FALLBACK)
   */
  guardarEnLocal(datos) {
    try {
      const formulariosLocal = JSON.parse(localStorage.getItem('formularios') || '[]');
      
      // Limitar a 50 registros para no llenar storage
      if (formulariosLocal.length >= 50) {
        formulariosLocal.shift(); // Eliminar el más antiguo
      }
      
      formulariosLocal.push({
        ...datos,
        id: `offline_${Date.now()}`,
        timestamp: new Date().toISOString(),
        sincronizado: false
      });
      
      localStorage.setItem('formularios', JSON.stringify(formulariosLocal));
      this.logEvent('saved_to_local_storage');
      
    } catch (error) {
      this.logError('Error guardando en localStorage', error.message);
    }
  }

  /**
   * CAMBIAR ESTADO DEL BOTÓN
   */
  cambiarBotonEstado(enviando) {
    const boton = this.form.querySelector('[type="submit"]');
    if (!boton) return;

    if (enviando) {
      boton.disabled = true;
      boton.textContent = '⏳ Enviando...';
      boton.style.opacity = '0.6';
      boton.setAttribute('aria-busy', 'true');
    } else {
      boton.disabled = false;
      boton.textContent = 'Enviar Mensaje';
      boton.style.opacity = '1';
      boton.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * MOSTRAR ALERTA (Error, Success, Info)
   */
  mostrarAlerta(mensaje, tipo = 'info') {
    // Sanitizar mensaje
    const mensajeLimpio = this.sanitizeString(mensaje);
    
    const alerta = document.createElement('div');
    alerta.role = 'alert';
    alerta.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1.5rem 2rem;
      border-radius: 8px;
      font-size: 1.6rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    const colores = {
      success: { bg: '#27ae60', color: 'white', icon: '✅' },
      error: { bg: '#e74c3c', color: 'white', icon: '❌' },
      info: { bg: '#3498db', color: 'white', icon: 'ℹ️' }
    };

    const config = colores[tipo] || colores.info;
    alerta.style.backgroundColor = config.bg;
    alerta.style.color = config.color;
    alerta.innerHTML = `${config.icon} ${mensajeLimpio}`;

    document.body.appendChild(alerta);

    // Remover después de 5 segundos
    setTimeout(() => {
      alerta.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        try {
          alerta.remove();
        } catch (e) {
          // Ya fue removida
        }
      }, 300);
    }, 5000);
  }

  mostrarError(mensaje) {
    this.mostrarAlerta(mensaje, 'error');
  }

  mostrarExito(mensaje) {
    this.mostrarAlerta(mensaje, 'success');
  }

  /**
   * LIMPIAR ESTILOS
   */
  limpiarEstilos() {
    ['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        campo.style.borderColor = '';
        campo.style.backgroundColor = '';
        campo.removeAttribute('aria-invalid');
      }
    });
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    new FormularioContactoSeguro();
  } catch (error) {
    console.error('Error inicializando formulario:', error.message);
  }
});
