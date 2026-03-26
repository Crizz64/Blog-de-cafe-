# Design: Formulario de Contacto

## Arquitectura

```
contacto.html
    └── FormularioContacto (class)
            ├── validarFormulario()     → validación completa
            ├── validateField()         → validación por campo (real-time)
            ├── handleSubmit()          → orquesta el envío
            ├── guardarEnLocal()        → fallback localStorage
            └── mostrarAlerta()         → feedback visual (toast)
```

## Flujo de datos

```
Usuario llena form
    → validateField() en tiempo real (input/blur)
    → handleSubmit() al enviar
        → validarFormulario() (validación completa)
        → saveFormToFirebase() o supabase insert
            → éxito: mostrarExito() + form.reset()
            → fallo: guardarEnLocal() + mostrarError()
```

## Decisiones de diseño
- Clase ES6 para encapsular lógica del formulario
- Fallback localStorage para resiliencia offline
- Rate limiting en cliente (complementar con server-side)
- Sanitización de inputs antes de persistir

## Dependencias externas
- Firebase SDK (CDN) o Supabase JS client
- Google Fonts (PT Sans, Open Sans)
