/**
 * Gestor del Formulario de Contacto con Firebase
 * Integra validación, almacenamiento y feedback visual
 */

class FormularioContacto {
  constructor(formularioSelector = '.formulario') {
    this.form = document.querySelector(formularioSelector);
    this.isSubmitting = false;
    
    if (!this.form) {
      console.error('Formulario no encontrado');
      return;
    }
    
    this.inicializar();
  }

  /**
   * Inicializar event listeners
   */
  inicializar() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.configureValidationListeners();
  }

  /**
   * Validación en tiempo real mientras escribe
   */
  configureValidationListeners() {
    const campos = ['nombre', 'email', 'mensaje'];
    campos.forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        campo.addEventListener('input', () => this.validateField(campo));
        campo.addEventListener('blur', () => this.validateField(campo));
      }
    });
  }

  /**
   * Validar un campo individual
   */
  validateField(field) {
    const valor = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(valor);
      message = isValid ? '✅ Email válido' : '❌ Email inválido';
    } else if (['nombre', 'mensaje'].includes(field.id)) {
      isValid = valor.length >= 3;
      message = isValid ? '✅ OK' : '❌ Mínimo 3 caracteres';
    }

    // Actualizar visual
    if (isValid) {
      field.style.borderColor = '#27ae60';
      field.style.backgroundColor = 'rgba(39, 174, 96, 0.02)';
    } else if (valor.length > 0) {
      field.style.borderColor = '#e74c3c';
      field.style.backgroundColor = 'rgba(231, 76, 60, 0.05)';
    } else {
      field.style.borderColor = '';
      field.style.backgroundColor = '';
    }

    return isValid;
  }

  /**
   * Validar todo el formulario
   */
  validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validaciones
    if (!nombre || nombre.length < 3) {
      this.mostrarError('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.mostrarError('Por favor ingresa un email válido');
      return false;
    }

    if (!mensaje || mensaje.length < 10) {
      this.mostrarError('El mensaje debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  }

  /**
   * Manejar envío del formulario
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Validación básica
    if (!this.validarFormulario()) {
      return;
    }

    // Evitar múltiples envíos
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.cambiarBotonEstado(true);

    try {
      // Obtener datos
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      const datos = {
        nombre,
        email,
        telefono: telefono || 'No proporcionado',
        mensaje,
        pagina: document.title,
        urlReferencia: window.location.href
      };

      // Intentar guardar en Firebase
      if (typeof saveFormToFirebase !== 'undefined') {
        const resultado = await saveFormToFirebase(datos);
        
        if (resultado.success) {
          this.mostrarExito('¡Gracias! Tu mensaje ha sido registrado. Nos contactaremos pronto.');
          this.form.reset();
          this.limpiarEstilos();
        } else {
          throw new Error(resultado.message);
        }
      } else {
        // Fallback si Firebase no está disponible
        console.log('📧 Formulario (localStorage):', datos);
        this.guardarEnLocal(datos);
        this.mostrarExito('✅ Mensaje registrado localmente. Por favor actualiza la página.');
      }
    } catch (error) {
      console.error('Error procesando formulario:', error);
      this.mostrarError(`Error: ${error.message}. Intenta nuevamente.`);
    } finally {
      this.isSubmitting = false;
      this.cambiarBotonEstado(false);
    }
  }

  /**
   * Guardar en localStorage si Firebase falla (backup)
   */
  guardarEnLocal(datos) {
    const formulariosLocal = JSON.parse(localStorage.getItem('formularios') || '[]');
    formulariosLocal.push({
      ...datos,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('formularios', JSON.stringify(formulariosLocal));
  }

  /**
   * Cambiar estado del botón
   */
  cambiarBotonEstado(enviando) {
    const boton = this.form.querySelector('[type="submit"]');
    if (!boton) return;

    if (enviando) {
      boton.disabled = true;
      boton.textContent = '⏳ Enviando...';
      boton.style.opacity = '0.6';
    } else {
      boton.disabled = false;
      boton.textContent = 'Enviar Mensaje';
      boton.style.opacity = '1';
    }
  }

  /**
   * Mostrar mensaje de error
   */
  mostrarError(mensaje) {
    this.mostrarAlerta(mensaje, 'error');
  }

  /**
   * Mostrar mensaje de éxito
   */
  mostrarExito(mensaje) {
    this.mostrarAlerta(mensaje, 'success');
  }

  /**
   * Mostrar alerta personalizada
   */
  mostrarAlerta(mensaje, tipo = 'info') {
    // Crear elemento alerta
    const alerta = document.createElement('div');
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

    // Colores según tipo
    const colores = {
      success: { bg: '#27ae60', color: 'white', icon: '✅' },
      error: { bg: '#e74c3c', color: 'white', icon: '❌' },
      info: { bg: '#3498db', color: 'white', icon: 'ℹ️' }
    };

    const config = colores[tipo] || colores.info;
    alerta.style.backgroundColor = config.bg;
    alerta.style.color = config.color;
    alerta.innerHTML = `${config.icon} ${mensaje}`;

    document.body.appendChild(alerta);

    // Remover después de 5 segundos
    setTimeout(() => {
      alerta.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => alerta.remove(), 300);
    }, 5000);
  }

  /**
   * Limpiar estilos de validación
   */
  limpiarEstilos() {
    ['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        campo.style.borderColor = '';
        campo.style.backgroundColor = '';
      }
    });
  }
}

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new FormularioContacto();
  console.log('✅ Formulario de contacto inicializado');
});
