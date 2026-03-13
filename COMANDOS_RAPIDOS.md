# 💻 COMANDOS RÁPIDOS - Referencia

Copia y pega estos comandos en tu terminal para acelerar el proceso.

---

## 📤 SINCRONIZAR CON GITHUB

### Opción 1: Comando Completo (Recomendado)
```bash
git add . && git commit -m "chore: security update with secure-config files" && git push origin main
```

### Opción 2: Paso a Paso
```bash
# 1. Agregar todos los cambios
git add .

# 2. Confirmar cambios
git commit -m "update: implement security improvements and pre-deployment checklist"

# 3. Subir a GitHub
git push origin main
```

---

## 🔍 VERIFICAR ESTADO

```bash
# Ver estado actual
git status

# Ver últimos commits
git log --oneline -5

# Ver cambios pendientes
git diff --name-only
```

---

## 🌐 DEPLOYMENT

### Para Netlify
```bash
# a) Por primera vez: ve a https://app.netlify.com → New site from Git
# b) Conecta repositorio
# c) Deploy automático

# Para triggear deploy manual:
git push origin main  # (automático con Netlify)
```

### Para Vercel
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy inicial
vercel

# 3. Deployments posteriores
git push origin main  # (automático)
```

### Para GitHub Pages
```bash
# No requiere comandos especiales
# Solo: git push origin main
# Verifica en: https://github.com/tu-usuario/Blog-de-cafe-/settings/pages
```

---

## 📊 VERIFICAR CAMBIOS LOCALMENTE

```bash
# Abrir en navegador local (si tienes Python 3)
python -m http.server 8000

# Luego ve a: http://localhost:8000/contacto.html
```

---

## 🧪 TESTING RÁPIDO

```bash
# Windows: abrir index.html en navegador
start index.html

# Mac/Linux:
open index.html  # Mac
xdg-open index.html  # Linux
```

---

## 🗑️ DESCARTAR CAMBIOS (CUIDADO)

```bash
# Descartar cambios en un archivo
git checkout -- archivo.html

# Descartar TODOS los cambios sin commit
git reset --hard HEAD

# Descartar último commit (sin publicado)
git reset --soft HEAD~1
```

---

## 🔐 FIRESTORE RULES (UNA LINEA)

```javascript
// Para copiar rápido: Copiar → Firebase Console → Rules → Publish
rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /contactos/{document=**} { allow read: if request.auth != null; allow write: if request.resource.data.nombre is string && request.resource.data.nombre.size() >= 3 && request.resource.data.email is string && request.resource.data.mensaje is string && request.resource.data.mensaje.size() >= 10; } } }
```

---

## 🐛 DEBUG RÁPIDO

```javascript
// En consola del navegador (F12)

// Ver si Firebase está conectado
console.log(db);  // > Firestore object

// Limpiar localStorage
localStorage.clear();

// Ver errores
console.error('Tu mensaje');

// Ver formulario capturado
console.log(document.querySelector('form'));
```

---

## 📱 ABRIR HERRAMIENTAS IMPORTANTES

### En VS Code
```bash
# Abrir carpeta del proyecto
code .

# Abrir terminal integrada
Ctrl + ` (backtick)

# Buscar archivo
Ctrl + P + nombre del archivo
```

### En navegador
```
F12 = Abrir DevTools
Ctrl+Shift+Delete = Limpiar cache
Ctrl+Shift+N = Página de incógnito (testing)
```

---

## 🚀 CHECKLIST UNA LINEA

```bash
git add . && git commit -m "security: update to secure implementations" && git push && echo "✅ Listo para desplegar"
```

Luego:
1. Abre https://app.netlify.com (o https://vercel.com)
2. Espera deploy automático (30-60 segundos)
3. ¡Listo! 🎉

---

## 📞 SI ALGO FALLA

### Error: "fatal: not a git repository"
```bash
# Estás fuera de la carpeta del proyecto
cd ruta/al/Blog-de-cafe-
git status
```

### Error: "origin does not appear to be a 'git' repository"
```bash
# El repositorio no está inicializado
git remote -v  # Ver repositorios conectados
git remote add origin https://github.com/tu-usuario/Blog-de-cafe-.git
```

### Error: "Your branch is ahead of 'origin/main'"
```bash
# Cambios sin publicar
git push origin main
```

### Error: Firebase config not loaded
```javascript
// En consola:
console.log(firebase);  // Si está undefined, scripts no cargaron
console.log(db);        // Si es undefined, Firebase config no funcionó
```

---

## 📚 ARCHIVOS CRÍTICOS GENERADOS

| Archivo | Propósito | Líneas |
|---------|-----------|--------|
| `js/firebase-config-secure.js` | Configuración Firebase segura | 450+ |
| `js/form-handler-secure.js` | Manejo de formulario robusto | 400+ |
| `SEGURIDAD.md` | Auditoría de seguridad completa | 300+ |
| `DEPLOYMENT.md` | Guía de deployment 6 plataformas | 600+ |
| `PRE_DEPLOYMENT.md` | Checklist 5 minutos antes de deploy | 200+ |

---

## ⚡ ATAJOS ÚTILES

```
Netlify → Deploy automático = git push
Vercel → Deploy automático = git push
GitHub Pages → Deploy automático = git push
Firebase → Datos en tiempo real = F12 Console
```

**Todo sube automático con `git push origin main`** ✨

---

*Última actualización: 13 Marzo 2026*
