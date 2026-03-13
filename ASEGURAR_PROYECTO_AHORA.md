# 🔒 ASEGURAR TU PROYECTO - ACCIONES INMEDIATAS

**Objetivo:** Proteger el Blog de Café ahora mismo  
**Tiempo:** 15 minutos  
**Dificultad:** Fácil

---

## ✅ PASO 1: CREAR `.gitignore` (2 min)

Crea archivo en la raíz del proyecto: `.gitignore`

**Contenido:**
```
# Variables de entorno (NUNCA a GitHub)
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/
*.log

# System
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Credentials (por si acaso)
*.pem
*.key
credentials.json
```

**Guarda el archivo y haz:**
```bash
git add .gitignore
git commit -m "security: add .gitignore to protect sensitive files"
git push origin main
```

---

## ✅ PASO 2: VERIFICAR CREDENCIALES (5 min)

### Buscar si credenciales ya están en GitHub:

```bash
# Ver si SUPABASE_ANON_KEY está en archivos
git log -p | grep -i "SUPABASE_ANON_KEY\|apikey"

# Ver último commit
git show HEAD
```

**Si encuentras credenciales expuestas:**

```bash
# ⚠️ Cambiar credenciales INMEDIATAMENTE en Supabase
# 1. Supabase Dashboard → Settings → API
# 2. Regenerar "anon key"
# 3. Copiar nueva key

# Luego actualizar en tu código:
# js/supabase-config-secure.js
```

---

## ✅ PASO 3: HABILITAR 2FA EN GITHUB (3 min)

1. Ve a **https://github.com/settings/security**
2. Click en **"Enable two-factor authentication"**
3. Elige método:
   - ✅ Authenticator app (recomendado)
   - ✅ SMS (alternativa)
4. Guarda los **backup codes** en lugar seguro
5. Click **"Enable"**

---

## ✅ PASO 4: PROTEGER RAMA PRINCIPAL (3 min)

1. Ve a tu repositorio en GitHub
2. **Settings** → **Branches**
3. Click **"Add rule"** bajo "Branch protection rules"
4. Branch name pattern: `main`
5. Marca estas opciones:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
6. Click **"Create"**

**Resultado:** Nadie (ni tú) puede pushear directamente a main. Debe ser via Pull Request.

---

## ✅ PASO 5: REVISAR COMMITS RECIENTES (2 min)

```bash
# Ver últimos 10 commits
git log --oneline -10

# Si ves algo sospechoso:
git log -p --follow -- [archivo]  # Ver cambios en archivo específico
```

**Busca:**
- ❌ Cambios no autorizados
- ❌ Nuevos archivos sospechosos
- ❌ Credenciales visibles

---

## 🔐 PASO 6: VERIFICAR CREDENCIALES EN CÓDIGO (1 min)

Busca en tus archivos:

```bash
# Windows PowerShell
Get-Content js/supabase-config-secure.js | Select-String "xxxxx"

# Si ves "xxxxx" = Bueno (placeholders)
# Si ves valores reales = MAL, cambiar credenciales
```

---

## 📋 DESPUÉS DE ESTOS PASOS

**Tu proyecto estará protegido contra:**
- ✅ Credenciales expuestas
- ✅ Cambios no autorizados
- ✅ Acceso no autorizado a GitHub
- ✅ Push directo sin revisión

---

## 🚨 SI DESCUBRES CREDENCIALES EXPUESTAS

**ACCIÓN INMEDIATA:**

```bash
# 1. Cambiar credenciales en Supabase
#    Supabase → Settings → API → Regenerar keys

# 2. Limpiar historio de Git
git filter-branch --tree-filter 'rm -f ARCHIVO_CON_CREDENCIAL' HEAD

# 3. Forzar push (cuidado, solo si es tu repo)
git push origin --force-with-lease

# 4. Notificar a usuarios si es necesario
```

---

## 📞 VERIFICACIÓN FINAL

```
[ ] .gitignore creado y committed
[ ] No hay credenciales en git log
[ ] 2FA habilitado en GitHub
[ ] Branch protection activo en main
[ ] Últimos commits revisados
[ ] Credenciales en código son placeholders (xxxxx)
[ ] ¡PROYECTO SEGURO! ✅
```

---

## 🎯 PRÓXIMA VEZ QUE HAGAS CAMBIOS

1. Crear rama nueva:
   ```bash
   git checkout -b feature/nombre-cambio
   ```

2. Hacer cambios

3. Commit:
   ```bash
   git commit -m "feat: descripción del cambio"
   ```

4. Push a rama:
   ```bash
   git push origin feature/nombre-cambio
   ```

5. Crear Pull Request en GitHub
6. Revisar cambios
7. Mergear a main

**Nunca seas tú quien apruebe tu propio PR.** (Si puedes, al menos espera 24h)

---

## 🛡️ MONITOREO PERMANENTE

Una vez a la semana:
```bash
# Revisar actividad
git log --oneline --since="1 week ago"

# Ver si hay cambios no esperados
git status
```

Una vez al mes:
```bash
# Revisar acceso a GitHub
# Ir a GitHub → Settings → Security log
# Buscar logins sospechosos
```

---

## ⚡ SUPER RÁPIDO (5 minutos mínimo)

Si no tienes tiempo:

```bash
# 1. Crear .gitignore
echo ".env" > .gitignore

# 2. Commit
git add .gitignore
git commit -m "security: add gitignore"
git push origin main

# 3. Ir a GitHub → Settings → Security
# 4. "Enable two-factor authentication"
```

**¡Eso es lo MÍNIMO!** 🔒

---

*Actualización: 13 Marzo 2026*  
*Estado: ✅ Listo implementar ahora*
