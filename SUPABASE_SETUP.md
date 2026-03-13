# 🚀 SUPABASE: Guía de Configuración (Blog de Café)

**Estado:** ✅ Alternativa recomendada a Firebase  
**Tiempo setup:** 5 minutos  
**Plan:** Gratuito (ilimitado para blog pequeño)

---

## ¿POR QUÉ SUPABASE EN VEZ DE FIREBASE?

| Aspecto | Firebase | Supabase | Ganador |
|--------|----------|-----------|---------|
| Crear proyecto | ❌ Bloqueado por admin | ✅ Sin restricciones | **Supabase** |
| Base de datos | NoSQL (JSON) | PostgreSQL (SQL) | Ambos bien |
| Gratis | ✅ Generoso | ✅ Muy generoso | **Supabase** |
| Complejidad | Media | Baja | **Supabase** |
| Documentación | Buena | Excelente | **Supabase** |
| API | GraphQL/REST | REST nativa | **Ambos** |

**Conclusión:** Supabase es mejor para ti ahora mismo. 🎉

---

## ⚡ PASO 1: Crear Cuenta en Supabase

1. Ve a https://supabase.com/
2. Click en **"Start your project"** o **"Sign Up"**
3. Puedes usar:
   - ✅ Email personal (cualquiera)
   - ✅ GitHub (recomendado)
   - ✅ Google (tu cuenta personal)
4. Completa el signup

**Ventaja:** Sin restricciones de admin. 🎉

---

## 🏗️ PASO 2: Crear Proyecto

1. En el dashboard de Supabase, click **"New Project"**
2. Nombre: `blog-de-cafe`
3. Database Password: Crea una contraseña fuerte (cópiala, la necesitarás)
4. Region: Elige la más cercana (ej: us-east-1 o eu-west-1)
5. Click **"Create new project"**

**Espera 2-3 minutos a que se cree...**

---

## 📋 PASO 3: Crear Tabla "contactos"

Una vez que el proyecto esté listo:

1. En el dashboard, ve a **"SQL Editor"** (menú izquierdo)
2. Click en **"New Query"**
3. Pega este código:

```sql
CREATE TABLE contactos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sincronizado BOOLEAN DEFAULT FALSE
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_created_at ON contactos(created_at DESC);

-- Comentario (opcional)
COMMENT ON TABLE contactos IS 'Formulario de contacto del Blog de Café';
```

4. Click en **"Run"** (botón azul)
5. Deberías ver: `✅ Query executed successfully`

---

## 🔑 PASO 4: Obtener Credenciales

1. Ve a **"Settings"** (menú izquierdo, abajo)
2. Click en **"API"**
3. Copia estos valores:
   - **Project URL:** (ej: `https://abcd1234.supabase.co`)
   - **anon key:** (la larga, para cliente)

**Estructura:**
```javascript
const SUPABASE_URL = "https://abcd1234.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

---

## 🔒 PASO 5: Configurar RLS (Row Level Security)

Para proteger la tabla:

1. Ve a **"Authentication"** → **"Policies"**
2. Tabla: Selecciona `public.contactos`
3. Click **"New Policy"**
4. Nombre: `Allow inserts for anyone`
5. Operation: `INSERT`
6. Expresión: `true` (por ahora, desarrollo)
7. Click **"Review"** → **"Save Policy"**

**Para PRODUCCIÓN:**
```sql
-- Solo lectura para admin
CREATE POLICY "Allow read for authenticated"
  ON contactos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Inserción con validación
CREATE POLICY "Allow inserts with validation"
  ON contactos FOR INSERT
  WITH CHECK (
    char_length(nombre) >= 3 AND
    char_length(email) >= 5 AND
    char_length(mensaje) >= 10
  );
```

---

## 💻 PASO 6: Código de Configuración

Crea archivo: `js/supabase-config-secure.js`

```javascript
// Supabase Configuration (Secure)
const SUPABASE_URL = "https://xxxxx.supabase.co"; // REEMPLAZA
const SUPABASE_ANON_KEY = "eyJhbGc..."; // REEMPLAZA

// Validación de configuración
function validateSupabaseConfig() {
  if (!SUPABASE_URL || SUPABASE_URL.includes("xxxx")) {
    console.error("❌ SUPABASE_URL no está configurada");
    return false;
  }
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("eyJ")) {
    console.error("❌ SUPABASE_ANON_KEY no está configurada");
    return false;
  }
  console.log("✅ Supabase configurado correctamente");
  return true;
}

// Sanitizar datos (prevenir XSS)
function sanitizeData(data) {
  const sanitized = {};
  for (let [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remover scripts
      sanitized[key] = value
        .trim()
        .substring(0, 5000)
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Validar email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

// Validar teléfono
function isValidPhone(phone) {
  if (!phone) return true; // Opcional
  return /^[\d\s+\-()]{7,20}$/.test(phone);
}

// Guardar formulario en Supabase
async function saveFormToSupabase(formData) {
  try {
    // 1. Validar configuración
    if (!validateSupabaseConfig()) {
      return { success: false, message: "Supabase no configurado", error: "config" };
    }

    // 2. Validar campos requeridos
    const { nombre, email, mensaje } = formData;
    
    if (!nombre || nombre.trim().length < 3) {
      return { success: false, message: "Nombre debe tener mínimo 3 caracteres" };
    }
    if (!email || !isValidEmail(email)) {
      return { success: false, message: "Email inválido" };
    }
    if (!mensaje || mensaje.trim().length < 10) {
      return { success: false, message: "Mensaje debe tener mínimo 10 caracteres" };
    }

    // 3. Validar teléfono si existe
    if (formData.telefono && !isValidPhone(formData.telefono)) {
      return { success: false, message: "Teléfono inválido" };
    }

    // 4. Rate limiting
    const lastSubmit = sessionStorage.getItem('lastFormSubmit');
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 1000) {
      return { success: false, message: "Espera un segundo antes de enviar otra vez", rateLimited: true };
    }

    // 5. Sanitizar datos
    const sanitized = sanitizeData({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: (formData.telefono || "").trim(),
      mensaje: mensaje.trim()
    });

    // 6. Enviar a Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(sanitized)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error Supabase:', error);
      
      // Error handling seguro
      if (response.status === 401) {
        return { success: false, message: "Error de autenticación", error: "auth" };
      } else if (response.status === 403) {
        return { success: false, message: "Acceso denegado", error: "permission" };
      } else {
        return { success: false, message: "Error al guardar", error: "unknown" };
      }
    }

    console.log('✅ Formulario guardado en Supabase');
    
    // 7. Actualizar rate limit
    sessionStorage.setItem('lastFormSubmit', Date.now().toString());
    
    // 8. Guardar en localStorage como fallback
    const contacts = JSON.parse(localStorage.getItem('contactos_offline') || '[]');
    contacts.push({ ...sanitized, sincronizado: true, timestamp: new Date().toISOString() });
    // Limitar a 50 registros
    if (contacts.length > 50) {
      contacts.shift();
    }
    localStorage.setItem('contactos_offline', JSON.stringify(contacts));

    return { success: true, message: "✅ Gracias por tu contacto" };

  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, message: "Error de conexión", error: error.message };
  }
}

// Obtener contactos (admin solo)
async function getContacts() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    return [];
  }
}

console.log('✅ Supabase config cargado');
```

---

## 🎯 PASO 7: Actualizar contacto.html

Reemplaza los scripts de Firebase con Supabase:

```html
<!-- Antes (REMOVE THESE) -->
<!-- <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script> -->
<!-- <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script> -->
<!-- <script src="js/firebase-config-secure.js"></script> -->

<!-- Después (ADD THESE) -->
<script defer src="js/supabase-config-secure.js"></script>
<script defer src="js/form-handler-supabase.js"></script>
```

---

## 📝 PASO 8: Form Handler para Supabase

Crea archivo: `js/form-handler-supabase.js`

```javascript
class FormularioContactoSupabase {
  constructor() {
    this.form = document.querySelector('.formulario');
    this.nombre = document.getElementById('nombre');
    this.email = document.getElementById('email');
    this.telefono = document.getElementById('telefono');
    this.mensaje = document.getElementById('mensaje');
    this.submitBtn = document.querySelector('.boton--primario');
    
    this.init();
  }

  init() {
    if (!this.form) return;

    // Eventos de validación
    this.nombre?.addEventListener('blur', () => this.validarNombre());
    this.email?.addEventListener('blur', () => this.validarEmail());
    this.telefono?.addEventListener('blur', () => this.validarTelefono());
    this.mensaje?.addEventListener('blur', () => this.validarMensaje());

    // Submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    console.log('✅ Formulario Supabase inicializado');
  }

  validarNombre() {
    const valor = this.nombre.value.trim();
    if (valor.length < 3) {
      this.nombre.classList.add('is-invalid');
      return false;
    }
    this.nombre.classList.remove('is-invalid');
    return true;
  }

  validarEmail() {
    const valor = this.email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(valor)) {
      this.email.classList.add('is-invalid');
      return false;
    }
    this.email.classList.remove('is-invalid');
    return true;
  }

  validarTelefono() {
    const valor = this.telefono.value.trim();
    if (valor && !/^[\d\s+\-()]{7,20}$/.test(valor)) {
      this.telefono.classList.add('is-invalid');
      return false;
    }
    this.telefono.classList.remove('is-invalid');
    return true;
  }

  validarMensaje() {
    const valor = this.mensaje.value.trim();
    if (valor.length < 10) {
      this.mensaje.classList.add('is-invalid');
      return false;
    }
    this.mensaje.classList.remove('is-invalid');
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validar todos
    const valido = this.validarNombre() &&
                   this.validarEmail() &&
                   this.validarTelefono() &&
                   this.validarMensaje();

    if (!valido) {
      alert('Por favor completa correctamente todos los campos');
      return;
    }

    // Deshabilitar botón
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Enviando...';

    const formData = {
      nombre: this.nombre.value,
      email: this.email.value,
      telefono: this.telefono.value,
      mensaje: this.mensaje.value
    };

    const resultado = await saveFormToSupabase(formData);

    if (resultado.success) {
      // Éxito
      this.form.reset();
      alert(resultado.message);
      
      // Limpiar validación
      document.querySelectorAll('input, textarea').forEach(el => {
        el.classList.remove('is-invalid');
      });
    } else {
      // Error
      alert(resultado.message || 'Error desconocido');
    }

    // Restaurar botón
    this.submitBtn.disabled = false;
    this.submitBtn.textContent = 'Enviar Mensaje';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new FormularioContactoSupabase();
});

console.log('✅ Form handler Supabase cargado');
```

---

## ✅ VERIFICACIÓN

1. **Abre contacto.html en navegador**
2. **F12 → Console**
3. Deberías ver:
   ```
   ✅ Supabase config cargado
   ✅ Form handler Supabase cargado
   ✅ Formulario Supabase inicializado
   ```

4. **Completa el formulario y envía**
5. **Deberías ver:** `✅ Gracias por tu contacto`

---

## 📊 VER TUS DATOS

### Opción 1: Supabase Dashboard
1. Ve a https://supabase.com/
2. Abre tu proyecto "blog-de-cafe"
3. Ve a **"Table Editor"**
4. Selecciona tabla `contactos`
5. Ver todos los registros enviados ✅

### Opción 2: SQL Query
En "SQL Editor", ejecuta:
```sql
SELECT * FROM contactos ORDER BY created_at DESC;
```

### Opción 3: JavaScript Console
```javascript
getContacts().then(data => console.table(data));
```

---

## 🔐 SEGURIDAD EN PRODUCCIÓN

### Deshabilitar INSERT abierto
En **Authentication → Policies**, edita la política `Allow inserts for anyone`:

Cambia de:
```sql
USING (true)
```

A validación real:
```sql
USING (
  char_length(nombre) >= 3 AND
  char_length(email) >= 5 AND
  char_length(mensaje) >= 10 AND
  telefono IS NOT NULL
)
```

### Habilitar RLS completo
Elimina `Allow inserts for anyone` si deseas autenticación.

---

## 💰 PRECIOS (GRATIS)

**Supabase Free Tier:**
- Proyectos: Ilimitado
- Base de datos: 500 MB
- Almacenamiento: 1 GB
- Peticiones API: Ilimitado
- Auth: Ilimitado

**Para tu blog:** ✅ **Completamente gratis** 🎉

---

## 🆘 TROUBLESHOOTING

### "Supabase no configurado"
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos
- No incluyas comillas al copiar

### "403 Forbidden"
- Ve a **Authentication → Policies**
- Asegúrate que `Allow inserts for anyone` existe
- O crea manualmente la policy

### "Tabla no existe"
- Ve a **SQL Editor**
- Ejecuta el SQL del PASO 3
- Espera a que complete

### "CORS Error"
- Esto NO pasa con Supabase (ya está configurado)
- Si ocurre, revisa la URL del proyecto

---

## 📚 REFERENCIAS

- Supabase Docs: https://supabase.com/docs
- API Reference: https://supabase.com/docs/guides/api
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

## 🚀 PRÓXIMO PASO

Una vez finances Supabase:

1. Actualiza `contacto.html` con los nuevos scripts
2. Abre el navegador → contacto.html
3. Prueba el formulario
4. Verifica datos en Supabase Dashboard
5. ¡LISTO!

---

*Guía Supabase creada: 13 Marzo 2026*  
*Estado: ✅ Listo para usar*
