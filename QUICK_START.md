# 🚀 QUICK START - Blog de Café

## ⚡ EN 5 MINUTOS ESTÁ TODO LISTO

### Paso 1: Clonar/Descargar Proyecto
```bash
git clone <repository-url>
cd Blog-de-cafe
```

### Paso 2: Abrir con Live Server
1. Instala extensión: **Live Server** (ritwickdey)
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"
4. Se abre automáticamente en `http://localhost:5501`

### Paso 3: Configurar Firebase (IMPORTANTE)

1. Ve a https://console.firebase.google.com/
2. Crea proyecto nuevo: "blog-de-cafe"
3. Copia la configuración Firebase
4. Abre `js/firebase-config.js`
5. Reemplaza los valores `REEMPLAZAR_CON_TU_*`
6. Activa Firestore Database en modo "test"

**[Ver guía completa: FIREBASE_SETUP.md]**

### Paso 4: Prueba el Formulario
1. Ve a la página Contacto
2. Completa el formulario
3. Abre Consola (F12) - debes ver: ✅ "Datos guardados"
4. Verifica en Firebase Console

### Paso 5: Publica (Opcional)
```bash
# Opción 1: Vercel (Recomendado)
npm install -g vercel
vercel

# Opción 2: GitHub Pages
git push origin main

# Opción 3: Netlify
Conectar repo en https://app.netlify.com
```

---

## 📋 CHECKLIST PRE-PRODUCCIÓN

- [ ] Firebase configurado con credenciales reales
- [ ] Formulario probado (envía y guarda datos)
- [ ] Móvil: abre página en iPhone/Android
- [ ] SEO: revisa meta tags (consola)
- [ ] Imágenes: todas cargan correctamente
- [ ] Links: todos funcionan
- [ ] Widget WhatsApp: aparece y funciona
- [ ] PageSpeed Insights: 90+

---

## 🎯 PRÓXIMOS PASOS OPCIONALES

1. **Crear artículos individuales**
   - Dupl icar entrada.html
   - Actualizar contenido y meta tags
   - Crear: article1.html, article2.html, etc.

2. **Agregar analytics**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   ```

3. **Servicio email para notificaciones**
   - FormSubmit.co (gratis)
   - EmailJS (con límites)
   - SendGrid (cuando crece)

4. **Testing**
   ```
   https://pagespeed.web.dev
   https://www.seobility.net
   https://webaim.org/resources/contrastchecker
   ```

---

## 🆘 SOPORTE RÁPIDO

**¿Qué ver primero cuando algo no funciona?**

1. Abrir Consola (F12)
2. Buscar errores en rojo
3. Verificar que Firebase está inicializado
4. Buscar solución en `agent.md` → Sección "PROBLEMAS CONOCIDOS"

**Comandos útiles en consola:**
```javascript
// Ver si Firebase está listo
firebase

// Obtener todos los contactos
getAllContacts().then(c => console.table(c))

// Obtener contactos de hoy
getTodayContacts().then(c => console.table(c))

// Ver localStorage (datos si Firebase falla)
JSON.parse(localStorage.getItem('formularios'))
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO

```
Total de Archivos:    15
Líneas HTML:         ~800
Líneas CSS:          ~1200
Líneas JS:           ~600
Imágenes:            13
Meta Tags:           35+
Transiciones CSS:    15+
```

---

## 🎓 PARA APRENDER MÁS

- Firebase Docs: https://firebase.google.com/docs
- MDN Web Docs: https://developer.mozilla.org
- CSS Tricks: https://css-tricks.com
- Web.dev: https://web.dev

---

**Estado: 🟢 LISTO PARA USAR**  
*Última actualización: 13 Marzo 2026*
