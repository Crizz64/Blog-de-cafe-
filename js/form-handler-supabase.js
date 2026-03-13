// ============================================
// FORM HANDLER - SUPABASE
// ============================================
// Blog de Café - Manejo Avanzado del Formulario
// Validación, XSS prevention, Debounce

/**
 * FormularioContactoSupabase
 * Clase que maneja toda la lógica del formulario
 */
class FormularioContactoSupabase {
  constructor() {
    // Elementos del formulario
    this.form = document.querySelector('.formulario');
    this.nombre = document.getElementById('nombre');
    this.email = document.getElementById('email');
    this.telefono = document.getElementById('telefono');
    this.mensaje = document.getElementById('mensaje');
    this.submitBtn = document.querySelector('.boton--primario');

    // Estado
    this.debounceTimers = {};
    this.isSubmitting = false;

    // Inicializar solo si el formulario existe
    if (this.form) {
      this.init();
    }
  }

  /**
   * Inicializar event listeners
   */
  init() {
    console.log('Inicializando FormularioContactoSupabase...');

    // Validación en tiempo real con debounce
    if (this.nombre) {
      this.nombre.addEventListener('blur', () => this.validarNombre());
      this.nombre.addEventListener('input', () => this.debounce('nombre', () => this.validarNombre(), 300));
    }

    if (this.email) {
      this.email.addEventListener('blur', () => this.validarEmail());
      this.email.addEventListener('input', () => this.debounce('email', () => this.validarEmail(), 300));
    }

    if (this.telefono) {
      this.telefono.addEventListener('blur', () => this.validarTelefono());
      this.telefono.addEventListener('input', () => this.debounce('telefono', () => this.validarTelefono(), 300));
    }

    if (this.mensaje) {
      this.mensaje.addEventListener('blur', () => this.validarMensaje());
      this.mensaje.addEventListener('input', () => this.debounce('mensaje', () => this.validarMensaje(), 300));
    }

    // Submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    console.log('✅ Formulario Supabase inicializado');
  }

  /**
   * Debounce helper - evita validaciones exesivas
   * @param {string} key - Identificador único
   * @param {function} fn - Función a ejecutar
   * @param {number} delay - Delay en ms
   */
  debounce(key, fn, delay = 300) {
    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }
    this.debounceTimers[key] = setTimeout(fn, delay);
  }

  /**
   * Validar nombre
   * @returns {boolean} - True si es válido
   */
  validarNombre() {
    const valor = this.nombre.value.trim();
    const esValido = valor.length >= 3 && valor.length <= 255;

    if (!esValido) {
      this.nombre.classList.add('is-invalid');
      this.nombre.setAttribute('aria-invalid', 'true');
      return false;
    }

    this.nombre.classList.remove('is-invalid');
    this.nombre.setAttribute('aria-invalid', 'false');
    return true;
  }

  /**
   * Validar email
   * @returns {boolean} - True si es válido
   */
  validarEmail() {
    const valor = this.email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esValido = re.test(valor) && valor.length <= 254;

    if (!esValido) {
      this.email.classList.add('is-invalid');
      this.email.setAttribute('aria-invalid', 'true');
      return false;
    }

    this.email.classList.remove('is-invalid');
    this.email.setAttribute('aria-invalid', 'false');
    return true;
  }

  /**
   * Validar teléfono (opcional)
   * @returns {boolean} - True si es válido
   */
  validarTelefono() {
    const valor = this.telefono.value.trim();

    // Si está vacío, es válido (opcional)
    if (!valor) {
      this.telefono.classList.remove('is-invalid');
      this.telefono.setAttribute('aria-invalid', 'false');
      return true;
    }

    // Si tiene valor, validar formato
    const esValido = /^[\d\s+\-()]{7,20}$/.test(valor);

    if (!esValido) {
      this.telefono.classList.add('is-invalid');
      this.telefono.setAttribute('aria-invalid', 'true');
      return false;
    }

    this.telefono.classList.remove('is-invalid');
    this.telefono.setAttribute('aria-invalid', 'false');
    return true;
  }

  /**
   * Validar mensaje
   * @returns {boolean} - True si es válido
   */
  validarMensaje() {
    const valor = this.mensaje.value.trim();
    const esValido = valor.length >= 10 && valor.length <= 5000;

    if (!esValido) {
      this.mensaje.classList.add('is-invalid');
      this.mensaje.setAttribute('aria-invalid', 'true');
      return false;
    }

    this.mensaje.classList.remove('is-invalid');
    this.mensaje.setAttribute('aria-invalid', 'false');
    return true;
  }

  /**
   * Validar todo el formulario
   * @returns {boolean} - True si todos los campos son válidos
   */
  validarFormulario() {
    return this.validarNombre() &&
           this.validarEmail() &&
           this.validarTelefono() &&
           this.validarMensaje();
  }

  /**
   * Manejar submit del formulario
   * @param {Event} e - Event object
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Evitar envíos múltiples simultáneos
    if (this.isSubmitting) {
      return;
    }

    // Validar todos los campos
    if (!this.validarFormulario()) {
      // Mostrar primer campo inválido
      const campos = [this.nombre, this.email, this.telefono, this.mensaje];
      for (let campo of campos) {
        if (campo.classList.contains('is-invalid')) {
          campo.focus();
          break;
        }
      }
      return;
    }

    // Preparar envío
    this.isSubmitting = true;
    this.submitBtn.disabled = true;
    const textOriginal = this.submitBtn.textContent;
    this.submitBtn.textContent = 'Enviando...';

    try {
      // Preparar datos
      const formData = {
        nombre: this.nombre.value,
        email: this.email.value,
        telefono: this.telefono.value,
        mensaje: this.mensaje.value
      };

      // Enviar a Supabase
      const resultado = await saveFormToSupabase(formData);

      if (resultado.success) {
        // ✅ Éxito
        this.form.reset();
        
        // Limpiar validación visual
        document.querySelectorAll('input, textarea').forEach(el => {
          el.classList.remove('is-invalid');
          el.setAttribute('aria-invalid', 'false');
        });

        // Mostrar mensaje
        this.showSuccessMessage(resultado.message);
      } else {
        // ❌ Error
        this.showErrorMessage(resultado.message);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      this.showErrorMessage('Error inesperado. Por favor intenta más tarde.');
    } finally {
      // Restaurar estado
      this.isSubmitting = false;
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = textOriginal;
    }
  }

  /**
   * Mostrar mensaje de éxito
   * @param {string} mensaje - Mensaje a mostrar
   */
  showSuccessMessage(mensaje) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = 'alerta alerta--exito';
    alerta.setAttribute('role', 'status');
    alerta.setAttribute('aria-live', 'polite');
    alerta.textContent = mensaje;

    // Insertar antes del formulario
    this.form.parentNode.insertBefore(alerta, this.form);

    // Remover después de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }

  /**
   * Mostrar mensaje de error
   * @param {string} mensaje - Mensaje a mostrar
   */
  showErrorMessage(mensaje) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = 'alerta alerta--error';
    alerta.setAttribute('role', 'alert');
    alerta.setAttribute('aria-live', 'assertive');
    alerta.textContent = mensaje;

    // Insertar antes del formulario
    this.form.parentNode.insertBefore(alerta, this.form);

    // Remover después de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

/**
 * Inicializar cuando el DOM esté completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {
  new FormularioContactoSupabase();
});

console.log('✅ Form handler Supabase cargado');
