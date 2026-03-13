# 🚀 CHECKLIST PRE-DEPLOYMENT (5 MINUTOS)

Antes de publicar a Netlify/Vercel, completar esta checklist:

---

## 1. ✅ CÓDIGO LISTO

### Reemplazar en `contacto.html`:
```html
<!-- Del formulario, actualizar estos scripts: -->
<script src="js/firebase-config-secure.js"></script>
<script src="js/form-handler-secure.js"></script>
```

**Verificar:**
- [ ] Scripts correctos en HTML
- [ ] Otros .js no referenciados en contacto.html
- [ ] Console limpia (F12 sin errores rojos)

---

## 2. 🔐 SUPABASE CONFIGURATION (NUEVO)

**Opción A: Supabase (RECOMENDADO)** ⭐

1. Ve a https://supabase.com/ → **Sign Up**
2. Crea proyecto "blog-de-cafe"
3. Database Password: cópia (la necesitarás)
4. Espera 2-3 minutos a que se cree
5. Settings → **API** → Copia:
   - `Project URL`
   - `anon key` (la variable que start con `eyJ`)
6. Abre `js/supabase-config-secure.js`:
   - Reemplaza `const SUPABASE_URL = "https://xxxxx.supabase.co"`
   - Reemplaza `const SUPABASE_ANON_KEY = "eyJ..."`
7. En Supabase Dashboard, ve a **SQL Editor**
8. Click **"New Query"**
9. Pega este SQL:
```sql
CREATE TABLE contactos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
10. Click **"Run"** (botón azul)

**Verificar:**
- [ ] Supabase proyecto creado
- [ ] Tabla "contactos" creada
- [ ] Credenciales en `js/supabase-config-secure.js`
- [ ] Sin errores en Console (F12)

---

## 3. 📤 GITHUB PUSH

```bash
git add .
git commit -m "chore: update security implementation and pre-deployment"
git push origin main
```

**Verificar:**
- [ ] Repositorio actualizado en GitHub
- [ ] Todos los archivos `.md` sincronizados
- [ ] `firebase-config-secure.js` en GitHub
- [ ] `form-handler-secure.js` en GitHub

---

## 4. 🌐 DEPLOYMENT (Elegir UNA opción)

### Opción A: Netlify (RECOMENDADO) ⭐

1. Ve a https://app.netlify.com
2. Click en **"New site from Git"**
3. Conecta tu repositorio GitHub
4. Deja settings por defecto
5. Click en **"Deploy site"** (espera 60 segundos)
6. En **Site settings → Redirects**, agregar:
```
/*  /index.html  200
```

**Luego agregar headers:**
1. Ve a **Site settings → Build & deploy → Post processing**
2. Click en **Edit headers**
3. Pega esto:
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self' https://www.gstatic.com https://firebase.googleapis.com https://*.firebaseapp.com; script-src 'self' https://www.gstatic.com https://firebase.googleapis.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'
```
4. Save

**Verificar:**
- [ ] Deploy verde (✅)
- [ ] URL generada funciona
- [ ] Formulario envía datos

---

### Opción B: Vercel (RÁPIDO) ⚡

1. Ve a https://vercel.com
2. Importa tu repositorio GitHub
3. Framework: "Other" (es HTML estático)
4. Click en **Deploy**
5. En configuración, agregar archivo `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Verificar:**
- [ ] Deploy completado
- [ ] URL funciona
- [ ] Formulario funciona

---

### Opción C: GitHub Pages (GRATIS) 📚

1. Repository → **Settings**
2. Scroll a **Pages**
3. En "Source", selecciona: **main** → **/ (root)**
4. Click en **Save**
5. Espera 2 minutos
6. Tu sitio estará en: `https://tu-usuario.github.io/Blog-de-cafe-`

**Verificar:**
- [ ] Despliegue completado
- [ ] Se ve en la URL pública
- [ ] Formulario disponible

---

## 5. 🧪 POST-DEPLOYMENT TEST

Luego de notar que el sitio está online, verificar:

```
✅ Test 1: Abrir https://[tu-sitio].com
   Resultado: ✅ Cargas index.html correctamente

✅ Test 2: Ir a /contacto.html
   Resultado: ✅ Formulario visible y funcional

✅ Test 3: Llenar formulario y enviar
   Campo: nombre = "Test", email = "test@gmail.com", mensaje = "Hola"
   Resultado: ✅ Mensaje "Gracias por tu contacto"

✅ Test 4: Abrir Console (F12)
   Resultado: ✅ Sin errores rojos

✅ Test 5: Ir a Firebase Console → Firestore
   Resultado: ✅ Aparece documento nuevo en colección "contactos"

✅ Test 6: Enviar formulario 6 veces rapidito
   Resultado: ✅ Bloqueado en intento 6 (rate limit)

✅ Test 7: Intentar inyección: 
   Teléfono: <script>alert('xss')</script>
   Resultado: ✅ Script se sanitiza, sin alert

✅ Test 8: Abrir DevTools → Network
   Resultado: ✅ Solo vemos requests a Firebase, no a otros servidores
```

---

## 6. 🔧 TROUBLESHOOTING

### Problema: "Firebase is not defined"
**Solución:**
```html
<!-- Verificar que están ANTES de firebase-config-secure.js -->
<script src="https://www.gstatic.com/firebaseapps/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebaseapps/9.0.0/firebase-firestore.js"></script>
<script src="js/firebase-config-secure.js"></script>
<script src="js/form-handler-secure.js"></script>
```

### Problema: "Permission denied" al enviar formulario
**Solución:**
1. Firebase Console → Firestore → Rules
2. Cambiar a esta regla temporal:
```javascript
allow write: if true; // ⚠️ Temporal para testing
```
3. Probar envío
4. Si funciona, hay problema en validación
5. Si no funciona, hay problema de credenciales

### Problema: Formulario no se ve
**Solución:**
1. Verificar que contacto.html existe
2. Ir manualmente a /contacto.html
3. Verificar HTML no tiene errores (validar en w3c)

---

## 📋 RESUMEN FINAL

| Paso | Tarea | Tiempo | Status |
|------|-------|--------|--------|
| 1 | Actualizar contacto.html | 2 min | [ ] |
| 2 | Configurar Firestore rules | 1 min | [ ] |
| 3 | Push a GitHub | 1 min | [ ] |
| 4 | Desplegar (Netlify/Vercel) | 30 seg | [ ] |
| 5 | Tests de validación | 3 min | [ ] |

**TIEMPO TOTAL: 7-10 MINUTOS**

---

## 🎯 URLs IMPORTANTES

| Link | Propósito |
|------|----------|
| https://console.firebase.google.com | Crear/gestionar Firestore |
| https://app.netlify.com | Deployar en Netlify |
| https://vercel.com | Deployar en Vercel |
| https://github.com/settings/pages | GitHub Pages configuración |

---

## ✅ COMPLETADO CUANDO...

- ✅ Tu sitio está online en una URL pública
- ✅ Formulario envía datos a Firestore
- ✅ F12 Console sin errores rojos
- ✅ Rate limiting bloquea 6to envío
- ✅ XSS scripts se sanitizan

**¡LISTO PARA PRODUCCIÓN!** 🚀
