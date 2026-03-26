# Convenciones del Proyecto

## Naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Variables JS | camelCase | `formData`, `isSubmitting` |
| Clases JS | PascalCase | `FormularioContacto` |
| Funciones JS | camelCase, verbo primero | `handleSubmit`, `validateField` |
| IDs HTML | kebab-case | `contact-form`, `submit-btn` |
| Clases CSS | BEM | `.formulario__campo--error` |
| Archivos JS | kebab-case | `form-handler.js` |
| Archivos CSS | kebab-case | `style-responsive.css` |
| Specs | kebab-case | `blog-contacto-form.md` |

## Estructura de archivos JS
```js
/**
 * Descripción del módulo
 */

// 1. Imports / dependencias
// 2. Constantes
// 3. Clase o funciones principales
// 4. Inicialización (DOMContentLoaded)
```

## Variables CSS disponibles
```css
--primario: #784D3C;
--secundario: /* ver style.css */
--fuente-principal: 'PT Sans', sans-serif;
```

## Breakpoints CSS
```css
/* Mobile: base (sin media query) */
/* Tablet: @media (min-width: 768px) */
/* Desktop: @media (min-width: 1024px) */
```
