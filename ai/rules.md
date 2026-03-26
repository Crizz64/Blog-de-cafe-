# Reglas de IA / Prompt Engineering

## Contexto del proyecto
Blog de Café — sitio estático HTML/CSS/JS vanilla con integración Firebase/Supabase.

## Al generar código
- Usar ES6+ (clases, async/await, destructuring)
- Sin dependencias externas salvo las ya existentes
- Comentarios JSDoc en funciones públicas
- Manejar siempre el caso de error

## Al modificar HTML
- Mantener semántica (usar `<article>`, `<section>`, `<nav>`, etc.)
- No romper clases BEM existentes
- Agregar `alt` descriptivo en imágenes nuevas

## Al modificar CSS
- Mobile-first: estilos base → media queries para pantallas grandes
- Usar variables CSS existentes (`--primario`, `--secundario`, etc.)
- Seguir convención BEM

## Formato de respuesta esperado
1. Explicación breve de qué se va a hacer
2. Código con comentarios
3. Instrucciones de integración si aplica
