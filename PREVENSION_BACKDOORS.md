# 🔒 SEGURIDAD: Prevención de Backdoors

**Objetivo:** Proteger el Blog de Café contra puertas traseras maliciosas  
**Nivel:** Security Hardening Completo  
**Actualización:** 13 Marzo 2026

---

## 🎯 TIPOS DE BACKDOORS A PREVENIR

```
🔴 CRÍTICOS (Máxima prioridad):
   1. Código malicioso en repositorio
   2. Credenciales (API keys, passwords) expuestas
   3. Dependencias comprometidas (npm packages)
   4. Acceso no autorizado a hosting

🟡 ALTOS (Importante):
   5. SQL injection en formularios
   6. XSS (JavaScript inyectado)
   7. CSRF (Cross-Site Request Forgery)
   8. Cambios no autorizados en archivos

🟠 MEDIANOS (Monitorear):
   9. Logs sin encriptación
   10. Backups sin protección
```

---

## 1. 🔐 PROTECCIÓN DE CREDENCIALES

### ❌ NUNCA hagas esto:

```javascript
// ❌ MAL - Credenciales en código
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIs..."; // PUBLICA EN GITHUB

// ❌ MAL - En comentarios
// ANON_KEY = "eyJhbGc..." 

// ❌ MAL - En archivos .env sin .gitignore
// .env (archivo con credenciales)
```

### ✅ CORRECTO - Usa variables de entorno:

**Archivo: `.env` (NO commits a GitHub)**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Archivo: `.gitignore` (SIEMPRE debe existir)**
```
.env
.env.local
.env.*.local
node_modules/
dist/
*.log
.DS_Store
```

**Código: `js/supabase-config-secure.js`**
```javascript
// ✅ CORRECTO - Lee de variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL || "https://demo.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "DEMO_KEY";

// ✅ O si es HTML estático, usa configuración en HOSTING
// (Netlify/Vercel permiten environment variables en dashboard)
```

---

## 2. 🚨 CONTROL DE ACCESO REPOSITORIO

### GitHub Security Checklist:

```
[ ] 1. HABILITADO: Two-Factor Authentication (2FA) en GitHub
      → Settings → Security & analysis → Enable 2FA
      
[ ] 2. BLOQUEADO: Main branch protegido
      → Repository → Settings → Branches → Protect main
      → Require pull request reviews before merging
      
[ ] 3. REVISADO: Solo tú puedes push directo
      → Add branch protection rule
      → Restrict who can push
      
[ ] 4. MONITOREADO: GitHub Advanced Security
      → Security tab → Secret scanning → Enable
      → Dependabot alerts → Enable
      
[ ] 5. AUDITADO: Ver activity log
      → Settings → Audit log
      → Buscar cambios sospechosos
```

### Mejores prácticas Git:

```bash
# ✅ CORRECTO: Usar ramas para cambios
git checkout -b feature/nueva-funcionalidad
# ... hacer cambios ...
git push origin feature/nueva-funcionalidad
# → Crear Pull Request en GitHub
# → Review antes de mergear

# ❌ MAL: Push directo a main
git push origin main  # NO HAGAS ESTO
```

---

## 3. 📦 DEPENDENCIAS SEGURAS

### Node.js/NPM (Si usas):

```bash
# ✅ Verificar vulnerabilidades existentes
npm audit

# ✅ Actualizar paquetes seguros
npm update

# ✅ Usar package-lock.json (SIEMPRE)
# Esto asegura que todos usan mismas versiones
git add package-lock.json
git commit -m "lock: update dependencies"
```

### Para HTML Estático (Tu caso):

**✅ (BUENO) No usas npm → No hay riesgo de packages comprometidos**

Solo asegúrate de:
1. CDNs confiables (Firebase, Supabase, Google Fonts)
2. Scripts de fuentes verificadas
3. Subresource Integrity (SRI)

```html
<!-- ✅ CORRECTO: Con SRI hash -->
<script src="https://cdn.example.com/script.js" 
        integrity="sha384-ABC123..."
        crossorigin="anonymous"></script>

<!-- ❌ MAL: Sin verificación -->
<script src="https://cdn.example.com/script.js"></script>
```

---

## 4. 🛡️ CÓDIGO SEGURO (XSS/Injection)

### XSS Prevention (Ya implementado):

```javascript
// ✅ CORRECTO: Sanitización
function sanitizeData(data) {
  return data
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

// ❌ MAL: Sin sanitización
element.innerHTML = userInput;  // VULNERABLE

// ✅ CORRECTO: textContent si es texto puro
element.textContent = userInput;  // SEGURO
```

### SQL Injection Prevention:

```javascript
// ❌ MAL: Concatenar strings (SQL Injection)
const query = `SELECT * FROM users WHERE email='${email}'`;

// ✅ CORRECTO: Usar parámetros (Supabase ya lo hace)
const { data } = await supabase
  .from('contactos')
  .insert([{ nombre, email, mensaje }]);  // SEGURO

// Supabase usa parámetros internamente = protegido
```

### CSRF Prevention (Ya implementado):

```javascript
// ✅ CORRECTO: verificar origen en headers
// Supabase y HTTPS automáticamente previenen CSRF

// ✅ CORRECTO: Rate limiting
// (Ya implementado en tu form-handler-supabase.js)
```

---

## 5. 🌐 DEPLOYMENT SEGURO

### Netlify/Vercel Security:

```
[ ] 1. HTTPS OBLIGATORIO
      ✅ Habilitado automáticamente
      
[ ] 2. HEADERS DE SEGURIDAD
      ✅ Content-Security-Policy (CSP)
      ✅ X-Frame-Options: DENY
      ✅ X-Content-Type-Options: nosniff
      
[ ] 3. VARIABLES DE ENTORNO SEGURAS
      Netlify/Vercel → Settings → Environment variables
      → Las credenciales NO aparecen en el código público
      
[ ] 4. BUILD PROCESS AUDITADO
      → Cada deploy es un nuevo build
      → Código verificado antes de publicar
      
[ ] 5. LOGS MONITOREADOS
      → Ver errores y accesos sospechosos
      → Alertas de fallos
```

### Configure Security Headers:

**Para Netlify: crear `_headers`**
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self' https:; script-src 'self' https://supabase.co https://cdn.jsdelivr.net
  Referrer-Policy: strict-origin-when-cross-origin
```

**Para Vercel: crear `vercel.json`**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 6. 🔍 MONITOREO Y AUDITORÍA

### GitHub Actions para CI/CD seguro:

**Archivo: `.github/workflows/security.yml`**
```yaml
name: Security Check

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          
      - name: Verify no hardcoded credentials
        run: |
          # Buscar patrones peligrosos
          ! grep -r "SUPABASE_ANON_KEY\|password\|secret" src/ js/
```

### Monitorear cambios:

```bash
# Ver quién cambió qué y cuándo
git log --oneline -n 20

# Ver cambios específicos
git log -p -- js/supabase-config-secure.js

# Ver ramas
git branch -a

# Buscar commits sospechosos
git log --grep="remove" --grep="delete" --oneline
```

### GitHub Activity Log:

```
Revisar regularmente:
1. GitHub → Account Settings → Security log
2. Ver logins recientes
3. Ver authorized apps
4. Revisar Personal access tokens
```

---

## 7. 🔄 BACKUP Y RECUPERACIÓN

### Supabase Backups:

```
✅ Automático: Supabase hace backups diarios
✅ Manual: Supabase → Database → Backups
✅ Verificar: Ir a Settings → Backups
```

### GitHub as Backup:

```bash
# Tu código está en GitHub (backup automático)
# Pero verifica:
git remote -v  # Ver dónde está guardado

# Clone local = backup adicional
git clone https://github.com/tu-usuario/Blog-de-cafe-.git
```

### Verificar integridad:

```bash
# Ver si archivos cambiaron
git status

# Ver cambios exactos
git diff

# Comparar con remote
git fetch origin
git log main..origin/main  # Cambios en remote
```

---

## 8. 🚨 RESPUESTA A INCIDENTES

### Si sospechas que hay un backdoor:

```
PASO 1: INMEDIATO
  [ ] Cambiar todas las credenciales (SUPABASE_ANON_KEY)
  [ ] Revocar tokens en GitHub
  [ ] Revisar últimos commits
  
PASO 2: INVESTIGACIÓN
  [ ] git log --all --oneline
  [ ] git diff origin/main HEAD
  [ ] Revisar archivos modificados recientemente
  
PASO 3: RECUPERACIÓN
  [ ] git reset --hard HEAD~[N]  (revertir N commits)
  [ ] Generar nuevas credenciales en Supabase
  [ ] Re-deploy en Netlify/Vercel
  
PASO 4: PREVENCIÓN
  [ ] Enable 2FA en GitHub
  [ ] Cambiar passwords
  [ ] Revisar acceso a hosting
```

---

## 📋 CHECKLIST DE SEGURIDAD FINAL

```
CREDENCIALES:
  [ ] .env.local NO committed a GitHub
  [ ] .gitignore contiene .env
  [ ] Variables de entorno en Netlify/Vercel
  [ ] No hay credenciales en código visible

REPOSITORIO:
  [ ] 2FA habilitado en GitHub
  [ ] Branch protection en main
  [ ] Require pull request reviews
  [ ] Solo tú puedes mergear

CÓDIGO:
  [ ] XSS prevention (sanitizeData)
  [ ] Rate limiting
  [ ] Input validation
  [ ] Error handling seguro
  [ ] No hardcoded secrets

DEPLOYMENT:
  [ ] HTTPS habilitado (automático)
  [ ] Security headers configurados
  [ ] Logs monitoreados
  [ ] CDNs confiables

MONITOREO:
  [ ] GitHub activity log revisado
  [ ] Commits verificados
  [ ] Cambios unauthorized NO existen
  [ ] Backups accesibles

INCIDENTES:
  [ ] Plan de respuesta creado
  [ ] Sé cómo revertir cambios
  [ ] Credenciales pueden renovarse rápido
  [ ] Contactos de emergencia documentados
```

---

## 🎯 RESUMEN DE PROTECCIONES

```
NIVEL 1: OBVIO (pero CRÍTICO)
  ✅ No expongas credenciales
  ✅ Usa .gitignore
  ✅ 2FA en GitHub

NIVEL 2: STANDARD
  ✅ Branch protection
  ✅ Code review (PR)
  ✅ Security headers

NIVEL 3: ADVANCED
  ✅ CI/CD pipeline seguro
  ✅ Monitoreo continuo
  ✅ Auditoría de cambios

NIVEL 4: ENTERPRISE (Opcional)
  ✅ Signing commits GPG
  ✅ SBOM (Software Bill of Materials)
  ✅ Threat modeling
```

---

## 🚀 IMPLEMENTACIÓN INMEDIATA

### Hoy (5 minutos):
```bash
# 1. Crear .gitignore
echo ".env" > .gitignore
echo ".env.local" >> .gitignore

# 2. Verificar qué está committed (CUIDADO)
git status

# 3. Si credenciales están expuestas:
git rm --cached .env  # Remover del tracking
git add .gitignore
git commit -m "security: add .gitignore, remove credentials"
```

### Esta semana:
```
[ ] Enable 2FA en GitHub
[ ] Crear branch protection en main
[ ] Revisar GitHub security log
[ ] Configurar environment variables en Netlify
```

### Este mes:
```
[ ] Crear GitHub Actions workflow para security
[ ] Setup automated backups
[ ] Documentar incident response plan
```

---

## 📞 REFERENCIAS

- OWASP Top 10: https://owasp.org/Top10/
- GitHub Security: https://docs.github.com/en/code-security
- Supabase Security: https://supabase.com/docs/guides/auth
- Netlify Security: https://docs.netlify.com/security/overview/

---

## 🎓 KEY TAKEAWAYS

```
1. CREDENCIALES = SECRETO (nunca a GitHub)
2. 2FA = OBLIGATORIO (GitHub + Supabase)
3. CÓDIGO SEGURO = Sanitización + Validación
4. DEPLOYMENT SEGURO = HTTPS + Headers + Logs
5. MONITOREO = Revisar cambios regularmente
6. BACKUP = GitHub + Supabase automático
7. RESPUESTA = Plan creado antes de incidente
```

---

*"La seguridad no es un destino, es un proceso continuo"*

**Documento de seguridad: 13 Marzo 2026**  
**Status: ✅ Implementado**
