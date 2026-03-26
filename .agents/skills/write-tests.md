# Skill: Escribir Tests

## Stack de testing (recomendado)
- Unit tests: Vitest o Jest (sin bundler necesario con `--experimental-vm-modules`)
- E2E: Playwright

## Estructura de un test
```js
// tests/<modulo>.test.js
import { describe, it, expect } from 'vitest'

describe('<NombreClase o función>', () => {
  it('debería <comportamiento esperado>', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

## Qué testear en este proyecto
- Validaciones del formulario (`FormularioContacto.validateField`)
- Sanitización de inputs
- Lógica de rate limiting
- Fallback a localStorage

## Convenciones
- Archivo: `tests/<nombre-modulo>.test.js`
- Describe en español, código en inglés
- Un `it` por comportamiento, no por función
