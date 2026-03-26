# Skill: Crear Feature

## Pasos

1. **Crear spec** en `specs/<nombre-feature>.md`
   - Descripción clara
   - Requerimientos funcionales (RF-XX)
   - Requerimientos no funcionales (RNF-XX)
   - Archivos relacionados

2. **Crear diseño** en `specs/<nombre-feature>.design.md`
   - Arquitectura de componentes/módulos
   - Flujo de datos
   - Decisiones de diseño

3. **Implementar** siguiendo la spec
   - Un commit por requerimiento funcional si es posible
   - Mensaje de commit: `feat(<scope>): descripción`

4. **Actualizar estado** en la spec
   - Cambiar `Estado: 🔄 En progreso` → `Estado: ✅ Implementado`

## Convenciones de nombres
- Spec: `specs/<entidad>-<acción>.md` (ej: `blog-post-create.md`)
- JS: camelCase para funciones, PascalCase para clases
- CSS: BEM — `.bloque__elemento--modificador`
- HTML: IDs en kebab-case
