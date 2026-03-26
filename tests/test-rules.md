# Reglas de Testing

## Stack
- Vitest (recomendado) o Jest
- Sin dependencias de DOM para unit tests (usar mocks)

## Qué testear
- Lógica de validación de formularios
- Sanitización de inputs
- Rate limiting
- Fallback localStorage

## Qué NO testear
- Integración real con Firebase/Supabase (usar mocks)
- Estilos CSS
- Comportamiento del DOM (dejar para E2E)

## Comandos
```bash
# Instalar Vitest (si se agrega package.json)
npm install -D vitest

# Correr tests una vez
npx vitest run

# Correr tests en watch mode (desarrollo)
npx vitest
```

## Estructura de carpeta
```
tests/
├── test-rules.md          ← este archivo
├── form-handler.test.js   ← tests del formulario
└── utils.test.js          ← tests de utilidades
```
