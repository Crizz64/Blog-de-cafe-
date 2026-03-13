# 🚀 GUÍA DE DEPLOYMENT - Plataformas Gratuitas

## 📊 COMPARATIVA PLATAFORMAS GRATUITAS

| Plataforma | Precio | Almacenamiento | Bandwidth | Uptime | Facilidad | Recomendación |
|------------|--------|---|---|---|---|---|
| **Netlify** | 🟢 Gratis | 100GB | Ilimitado | 99.9% | ⭐⭐⭐⭐⭐ | 🏆 MEJOR |
| **Vercel** | 🟢 Gratis | Ilimitado | 100GB | 99.9% | ⭐⭐⭐⭐⭐ | 🏆 MEJOR |
| **GitHub Pages** | 🟢 Gratis | 1GB | Ilimitado | 99.9% | ⭐⭐⭐⭐ | ✅ BUENO |
| **Firebase Hosting** | 🟢 Gratis | 1GB | 10GB | 99.95% | ⭐⭐⭐⭐ | ✅ BUENO |
| **Render** | 🟢 Gratis | 100GB | 100GB | 99.9% | ⭐⭐⭐ | ⚠️ BÁSICO |
| **AWS S3** | 🟡 Muy barato | Variable | Variable | 99.99% | ⭐⭐⭐ | 💰 Caro |

---

## 🏆 TOP 3 RECOMENDADAS

### 1️⃣ NETLIFY (Altamente Recomendado)

**Ventajas:**
- ✅ Deploy en 60 segundos
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ Funciones serverless gratuitas (limitadas)
- ✅ Prevista visual en Pull Requests
- ✅ Analytics incluido

**Desventajas:**
- ⚠️ Límite 100GB almacenamiento
- ⚠️ Funciones limitadas en plan free

**Costo:** Gratis → $19/mes premium

---

### 2️⃣ VERCEL (Alternativa Excelente)

**Ventajas:**
- ✅ Algoritmo de compresión automática
- ✅ CDN global súper rápido
- ✅ Deploy en rama automático
- ✅ Almacenamiento ilimitado
- ✅ Serverless functions gratuitas
- ✅ Performance analytics

**Desventajas:**
- ⚠️ Límite 100GB bandwidth/mes
- ⚠️ Mejor para Next.js

**Costo:** Gratis → $20/mes premium

---

### 3️⃣ GITHUB PAGES (Si usas GitHub)

**Ventajas:**
- ✅ Integrado con GitHub
- ✅ Gratis permanente (1GB)
- ✅ Sin límite de bandwidth
- ✅ HTTPS automático
- ✅ Dominio tusuario.github.io

**Desventajas:**
- ⚠️ Solo archivos estáticos
- ⚠️ Sin serverless functions
- ⚠️ URL poco personalizada

**Costo:** Gratis para siempre

---

## 📋 GUÍA PASO A PASO: NETLIFY

### PASO 1: Preparar Repositorio GitHub

```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Initial commit - Blog de Café"

# Crear repo en GitHub
# https://github.com/new
# Nombre: Blog-de-cafe

# Subir a GitHub
git remote add origin https://github.com/TU_USUARIO/Blog-de-cafe.git
git branch -M main
git push -u origin main
```

### PASO 2: Conectar Netlify

1. Ve a https://netlify.com
2. Haz clic en **"Conectar con GitHub"**
3. Autoriza Netlify en tu cuenta GitHub
4. Selecciona el repositorio **"Blog-de-cafe"**
5. Configuración:
   - **Build command:** (déjalo vacío - es estático)
   - **Publish directory:** `.` (carpeta raíz)
6. Haz clic en **"Deploy"**

**¡Listo en 2 minutos!** 🎉

### PASO 3: Configurar Dominio

**Opción 1: Subdominio Netlify (Gratis)**
- Tu URL: `blog-de-cafe.netlify.app`
- No requiere pago

**Opción 2: Dominio propio + Netlify (Recomendado)**
1. Compra dominio: Namecheap, GoDaddy, Google Domains (~$10/año)
2. En Netlify: **Site settings** → **Domain management**
3. Agrega tu dominio +personaliza DNS
4. HTTPS automático (Let's Encrypt)

---

## 📋 GUÍA PASO A PASO: VERCEL

### PASO 1: Preparar Repositorio GitHub (igual que Netlify)

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### PASO 2: Conectar Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Continue with GitHub"**
3. Autoriza Vercel
4. Selecciona repositorio "Blog-de-cafe"
5. **Import project directamente** (detecta automáticamente que es estático)
6. Haz clic en **"Deploy"**

### PASO 3: Enlazar Dominio

1. En Vercel → **Settings** → **Domains**
2. Agrega tu dominio (ej: midominio.com)
3. Actualiza DNS en registrador
4. HTTPS automático

---

## 📋 GUÍA PASO A PASO: GITHUB PAGES

### PASO 1: Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### PASO 2: Activar GitHub Pages

1. En tu repo → **Settings**
2. Busca **"Pages"** en el menú izquierdo
3. En **Source** selecciona **"main"**
4. Rama: **"/ (root)"**
5. Haz clic en **Save**

**¡Tu sitio está en:** `https://tusuario.github.io/Blog-de-cafe`

### PASO 3: Usar Dominio Propio (Opcional)

1. En **Pages** → **Custom domain**
2. Ingresa tu dominio (ej: blog.midominio.com)
3. Actualiza registros DNS en tu registrador

```
# Registros DNS a agregar:
Type: CNAME
Name: blog
Value: tusuario.github.io
```

---

## 🔒 SEGURIDAD EN DEPLOYMENT

### Headers de Seguridad Recomendados

Para **Netlify**, agrega archivo `_headers`:

```
/* 
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.gstatic.com/firebasejs/ https://www.googletagmanager.com/; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

Para **Vercel**, crea `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📊 FLUJO DE TRABAJO RECOMENDADO

```
Local Development
        ↓
git push a GitHub
        ↓
Netlify/Vercel detecta cambios
        ↓
Build automático
        ↓
Deploy a producción
        ↓
https://tudominio.com actualizado
```

### Ventajas:
- ✅ Cero downtime
- ✅ Un solo comando (git push)
- ✅ Cambios en vivo en < 2 minutos
- ✅ Rollback automático si hay errores

---

## 🔄 MIGRACIÓN ENTRE PLATAFORMAS

**Si cambia de Netlify a Vercel (o viceversa):**

1. Todo está en GitHub, no en la plataforma
2. Solo cambiar la configuración de deploy
3. Toma 5 minutos
4. Tu código siempre está en GitHub

### Ejemplo:
```bash
# Tu código nunca se pierde
git clone https://github.com/tusuario/Blog-de-cafe.git
# Conectar a Netlify / Vercel / GitHub Pages
# Listo
```

---

## 💡 CHECKS ANTES DE PUBLICAR

- [ ] Código en GitHub
- [ ] Firebase config tiene credenciales reales
- [ ] Formulario funciona en local
- [ ] Mobile se ve bien (testing en Chrome DevTools)
- [ ] Imágenes cargan correctamente
- [ ] Links funcionan (test con CTR+Click)
- [ ] PageSpeed Insights: 90+

---

## 🆘 TROUBLESHOOTING

### Sitio muestra 404
**Causa:** Publish directory incorrecto
**Solución:** En Netlify/Vercel → Verificar que sea `.` o `./`

### Firebase no carga
**Causa:** Credenciales no configuradas
**Solución:** Verificar `js/firebase-config-secure.js`

### Dominio personalizado no funciona
**Causa:** DNS no actualizado
**Solución:** Esperar 24-48 horas + limpiar DNS cache

### Build fallido
**Causa:** Sintaxis error en HTML/CSS/JS
**Solución:** Revisar console en local

---

## 📈 MONITOREO POST-DEPLOY

### Google Analytics
```html
<!-- Agregar en <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_XXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('config', 'GA_XXXX');
</script>
```

### Uptime Monitoring
- UptimeRobot (gratis): https://uptimerobot.com/
- Verificar que sitio siempre esté online

### Performance Monitoring
- Netlify/Vercel: Analytics incluido
- Google PageSpeed: https://pagespeed.web.dev

---

## 🎯 RECOMENDACIÓN FINAL

**Para tu caso (Blog estático con Firebase):**

## 🥇 Usar NETLIFY o VERCEL

- ✅ Más fácil que GitHub Pages
- ✅ Preview automático de cambios
- ✅ Analytics incluido
- ✅ Serverless ready (futuro)
- ✅ Mejor UX de deploy

**Alternativa:** GitHub Pages si solo usas GitHub

---

*Última actualización: 13 Marzo 2026*
