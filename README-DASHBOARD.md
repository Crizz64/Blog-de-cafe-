# 📊 DASHBOARD DE CONTACTOS - Blog de Café

Dashboard interactivo en Python que muestra gráficos en tiempo real de los contactos registrados en Supabase.

## 🚀 Inicio Rápido

### 1️⃣ Instalar Dependencias
```bash
pip install -r requirements-dashboard.txt
```

### 2️⃣ Ejecutar Dashboard
```bash
python3 dashboard.py
```

### 3️⃣ Acceder
Abre tu navegador en: **http://localhost:5000**

## 📊 Características

- ✅ **Estadísticas en Tiempo Real**: Total, hoy, esta semana, este mes
- ✅ **Gráfico Temporal**: Contactos por día (últimos 30 días)
- ✅ **Gráfico por Hora**: Horas con más registros
- ✅ **Interfaz Responsive**: Funciona en móvil y desktop
- ✅ **Conexión Directa a Supabase**: Sin intermediarios

## 🔧 Personalización

### Cambiar Puerto
En `dashboard.py`, línea final:
```python
app.run(debug=True, port=8080, host='0.0.0.0')  # Cambiar 5000 por 8080
```

### Agregar Más Gráficos
Crear una nueva función `grafico_nuevo()` en `dashboard.py` y añadirla al HTML.

Ejemplo:
```python
def grafico_nuevas_ciudades(contactos):
    """Gráfico por ciudad"""
    ciudades = Counter()
    for contacto in contactos:
        if 'ciudad' in contacto:
            ciudades[contacto['ciudad']] += 1
    
    fig = go.Figure(data=[
        go.Bar(x=list(ciudades.keys()), y=list(ciudades.values()))
    ])
    return fig.to_html()
```

## 🔄 Actualizar Datos

- **Manualmente**: Click en botón "🔄 Actualizar"
- **Auto**: Página se recarga cada 60 seg (si editas `dashboard.py`)

## 📁 Archivos

```
dashboard.py              # Servidor Flask + gráficos
requirements-dashboard.txt # Dependencias
README-DASHBOARD.md       # Este archivo
```

## ❌ Solucionar Problemas

### "ModuleNotFoundError: No module named 'flask'"
→ Ejecuta: `pip install -r requirements-dashboard.txt`

### "Connection refused"
→ El servidor no está corriendo. Ejecuta: `python3 dashboard.py`

### "No se conecta a Supabase"
→ Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctas en `dashboard.py`

### "Dice 0 contactos"
→ Verifica que la tabla se llame `contactos` en Supabase

## 🎨 Editar Estilos

Los estilos están en la sección `<style>` dentro de `dashboard.py`.

**Colores Blog de Café:**
- Primario: `#784D3c` (marrón)
- Secundario: `#fae41b` (amarillo)
- Gris: `#e1e1e1`

## 📝 Notas

- No modifica archivos HTML/CSS/JS del proyecto
- Conexión independiente a Supabase
- Usa Plotly para gráficos interactivos
- Responsive design automático

---
*Creado: 27/03/2026 | Independiente del proyecto principal*
