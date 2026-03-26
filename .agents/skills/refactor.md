# Skill: Refactor

## Cuándo refactorizar
- Función con más de 30 líneas → dividir
- Lógica duplicada en 2+ lugares → extraer utilidad
- Nombre de variable/función no descriptivo → renombrar

## Proceso
1. Identificar el código a refactorizar
2. Escribir el comportamiento esperado en un comentario antes de tocar nada
3. Hacer el cambio mínimo necesario
4. Verificar que el comportamiento no cambió

## Reglas
- No cambiar comportamiento y estructura al mismo tiempo
- Un refactor = un commit: `refactor(<scope>): descripción`
- Si el refactor afecta una spec existente, actualizar la spec
