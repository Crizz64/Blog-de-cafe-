# 🔥 GUÍA: Configurar Firebase para Blog de Café

## ⚡ 5 MINUTOS DE SETUP

### PASO 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Crear proyecto"**
3. Nombre: `blog-de-cafe`
4. Desactiva "Google Analytics" (opcional)
5. Haz clic en **"Crear proyecto"**

### PASO 2: Crear App Web

1. En la página del proyecto, busca el ícono de `</>`
2. Haz clic en **"Ampliar"** o **"Web"**
3. Nombre de la app: `blog-de-cafe-web`
4. Marca la casilla "También configurar Hosting..."
5. Haz clic en **"Registrar app"**

### PASO 3: Copiar Configuración

Firebase te mostrará algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "blog-de-cafe.firebaseapp.com",
  projectId: "blog-de-cafe",
  storageBucket: "blog-de-cafe.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};
```

**Copia TODA esta configuración**

### PASO 4: Pegar en tu Proyecto

Abre `js/firebase-config.js` en tu editor y **reemplaza los valores REEMPLAZAR_CON_TU_*** con tus valores de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "PEGAAQUITUAPIKEY",
  authDomain: "PEGAAQUITUAUTHDOMAIN",
  projectId: "blog-de-cafe",
  // ... etc
};
```

**Guarda el archivo**

### PASO 5: Configurar Firestore Database

1. En la consola de Firebase, ve a **"Firestore Database"** (en el menú izquierdo)
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Empezar en modo de prueba"**
4. Región: elige la más cercana a ti
5. Haz clic en **"Crear"**

**Espera 1-2 minutos a que se cree**

### PASO 6: Configurar Reglas de Seguridad (Importante)

1. En Firestore, ve a la pestaña **"Reglas"**
2. **Reemplaza el contenido actual** con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de la colección contactos
    match /contactos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      // Para desarrollo, permitir write a todos (comentar después)
      allow write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

---

## ✅ VERIFICACIÓN

Para verificar que funciona:

1. Abre tu página de contacto en el navegador
2. Abre la consola (F12 → Console)
3. Busca el mensaje: `✅ Firebase inicializado correctamente`
4. Completa y envía el formulario
5. Deberías ver: `✅ Datos guardados con ID: ...`

---

## 📊 VER TUS DATOS

### Opción 1: Firebase Console
1. Ve a https://console.firebase.google.com/
2. Abre tu proyecto "blog-de-cafe"
3. Abre Firestore Database
4. Verás colección "contactos" con todos los registros

### Opción 2: JavaScript (Consola)
Abre la consola del navegador y ejecuta:
```javascript
getAllContacts().then(contacts => console.table(contacts));
```

---

## 🔐 SEGURIDAD EN PRODUCCIÓN

**IMPORTANTE:** Las reglas de arriba permiten escritura pública. Para producción, cambia a:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactos/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Esto requiere autenticación, pero es más seguro.

---

## 💰 PRESUPUESTO

**Firebase FREE TIER (Generoso):**
- 50,000 lecturas/día
- 20,000 escrituras/día
- 20,000 eliminaciones/día
- 1 GB de almacenamiento

**Para tu blog:** ✅ Ilimitado

---

## 🆘 TROUBLESHOOTING

### "Firebase no está inicializado"
- ✅ Verificar que `firebase-config.js` esté correctamente cargado
- ✅ Verificar que los valores del config sean correctos
- ✅ Verificar en consola (F12) que no haya errores de red

### "Permiso denegado"
- ✅ Revisar las Reglas de Firestore
- ✅ Asegurarse que `allow write: if true` está mientras desarrollas

### "Formulario no envía"
- ✅ Abrir consola (F12)
- ✅ Ver mensajes de error
- ✅ Verificar que formulario es válido

### "Datos no aparecen en Firestore"
- ✅ Esperar 1-2 segundos después de enviar
- ✅ Refrescar la página de Firestore
- ✅ Verificar que Firestore esté en modo de prueba

---

## 📚 REFERENCIAS

- Firebase Docs: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore
- JavaScript SDK: https://firebase.google.com/docs/web/setup

---

*Actualizado: 13 de Marzo, 2026*
