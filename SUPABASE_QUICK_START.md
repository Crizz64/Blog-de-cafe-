# ⚡ SUPABASE - QUICK START (5 MINUTOS)

**No tienes tiempo?** Aquí va directo al grano.

---

## 🏃 PASO 1: CREAR SUPABASE (2 min)

```
1. https://supabase.com/ → "Sign Up"
2. Email + contraseña (o GitHub)
3. New Project → nombre: blog-de-cafe
4. Database Password: aaaaa (cópia)
5. Region: cercana
6. "Create new project"
7. ESPERA 2-3 minutos ⏳
```

---

## 🏃 PASO 2: CREAR TABLA (1 min)

```
1. Supabase Dashboard abierto
2. Izquierda: "SQL Editor"
3. "New Query"
4. PEGA ESTO:
```

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

```
5. CLICK "RUN" (botón azul)
6. Ver: "Query executed successfully" ✅
```

---

## 🏃 PASO 3: COPIAR CREDENCIALES (1 min)

```
1. Settings (abajo izquierda)
2. API
3. COPIA:
   - Project URL (ej: https://xxxxx.supabase.co)
   - anon key (largo, empieza con eyJ...)
```

---

## 🏃 PASO 4: PEGAR EN CÓDIGO (1 min)

Abre: `js/supabase-config-secure.js`

Reemplaza:
```javascript
const SUPABASE_URL = "TU_PROJECT_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_ANON_KEY_AQUI";
```

Con los valores que copiaste:
```javascript
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiI...";
```

**GUARDA EL ARCHIVO**

---

## 📝 LISTO

Abre `contacto.html` en navegador:
- F12 → Console
- Ver: `✅ Supabase config script cargado`
- Completa formulario
- Envía
- Datos aparecen en Supabase Dashboard → Table Editor → contactos ✅

---

## 🎯 Tiempo total: 5-10 minutos

Si algo falla:
1. F12 Console
2. Ver error exacto
3. Ir a [SUPABASE_SETUP.md](SUPABASE_SETUP.md) Troubleshooting
4. Copiar solución

---

**¡LISTO!** 🚀
