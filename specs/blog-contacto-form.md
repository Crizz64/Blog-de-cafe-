# Spec: Formulario de Contacto

## Estado: ✅ Implementado

## Descripción
Formulario de contacto con validación client-side, integración con Firebase/Supabase y fallback a localStorage.

## Requerimientos funcionales
- RF-01: Validar nombre (mínimo 3 caracteres)
- RF-02: Validar email (formato válido)
- RF-03: Validar mensaje (mínimo 10 caracteres)
- RF-04: Guardar datos en base de datos (Firebase o Supabase)
- RF-05: Fallback a localStorage si el servicio no está disponible
- RF-06: Rate limiting (máximo 5 envíos por hora)
- RF-07: Protección XSS en inputs

## Requerimientos no funcionales
- RNF-01: Feedback visual en tiempo real por campo
- RNF-02: Estado de carga en botón de envío
- RNF-03: Notificaciones toast (éxito/error)

## Archivos relacionados
- `contacto.html` — Vista del formulario
- `js/form-handler.js` — Lógica base
- `js/form-handler-secure.js` — Versión con seguridad
- `js/form-handler-supabase.js` — Versión con Supabase
- `js/firebase-config.js` — Configuración Firebase
- `js/supabase-config-secure.js` — Configuración Supabase
