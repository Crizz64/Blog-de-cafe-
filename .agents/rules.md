# Reglas Globales de Agentes

## Contexto del proyecto
Blog de Café — sitio estático con HTML/CSS/JS vanilla.
Sin frameworks. Sin bundler. Sin TypeScript (por ahora).

## Stack
- Frontend: HTML5, CSS3 (BEM), JavaScript ES6+
- Base de datos: Firebase Firestore / Supabase
- Hosting: Netlify / Vercel / GitHub Pages

## Reglas generales
1. No introducir dependencias npm sin aprobación explícita
2. Mantener compatibilidad con navegadores modernos (últimas 2 versiones)
3. Todo código nuevo debe tener comentarios JSDoc mínimos
4. Seguir convenciones BEM para clases CSS
5. Validar inputs siempre en cliente; asumir que hay validación server-side
6. No exponer credenciales en código fuente — usar variables de entorno o config segura

## Flujo de trabajo SDD
1. Crear/actualizar spec en `specs/`
2. Revisar diseño en `specs/*.design.md`
3. Implementar según spec
4. Actualizar estado en spec al completar

## Idioma
- Código: inglés (variables, funciones, comentarios técnicos)
- Documentación/specs: español
