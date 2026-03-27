#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DASHBOARD DE CONTACTOS - Blog de Café
Dashboard interactivo con gráficos de registros en Supabase
Usar: python3 dashboard.py
Acceder: http://localhost:5000
"""

from flask import Flask, render_template_string
import requests
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import json
from collections import Counter

# ============================================
# CONFIGURACIÓN SUPABASE (API REST)
# ============================================
SUPABASE_URL = "https://wyuqnxjwgizpqwybilmu.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_asx3rChDRxfjA93M8cLuGw_aQHB3IMC"
SUPABASE_API_URL = f"{SUPABASE_URL}/rest/v1"

# Crear aplicación Flask
app = Flask(__name__)

# ============================================
# FUNCIONES AUXILIARES
# ============================================

def get_contactos():
    """Obtener todos los contactos de Supabase usando API REST"""
    try:
        headers = {
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Query a la tabla contactos
        url = f"{SUPABASE_API_URL}/contactos?select=*&order=timestamp.desc&limit=1000"
        
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {len(data)} contactos cargados desde Supabase")
            return data
        else:
            print(f"⚠️  Error Supabase ({response.status_code}): {response.text}")
            return []
            
    except requests.exceptions.Timeout:
        print("⚠️  Timeout conectando a Supabase")
        return []
    except Exception as e:
        print(f"❌ Error al conectar con Supabase: {e}")
        return []


def parse_fecha(timestamp_str):
    """Parsear timestamp de diferentes formatos"""
    if not timestamp_str:
        return None
    try:
        # ISO format con Z
        if isinstance(timestamp_str, str):
            timestamp_str = timestamp_str.replace('Z', '+00:00').split('+')[0]
            return datetime.fromisoformat(timestamp_str)
        return None
    except:
        return None


def get_estadisticas(contactos):
    """Calcular estadísticas generales"""
    stats = {
        'total': len(contactos),
        'hoy': 0,
        'ultima_semana': 0,
        'ultimo_mes': 0,
        'ciudades': Counter(),
        'horas': Counter(),
    }
    
    ahora = datetime.now()
    hace_7_dias = ahora - timedelta(days=7)
    hace_30_dias = ahora - timedelta(days=30)
    
    for contacto in contactos:
        # Contar por fecha
        timestamp = parse_fecha(contacto.get('timestamp', ''))
        if timestamp:
            if timestamp.date() == ahora.date():
                stats['hoy'] += 1
            if timestamp >= hace_7_dias:
                stats['ultima_semana'] += 1
            if timestamp >= hace_30_dias:
                stats['ultimo_mes'] += 1
            
            # Contar por hora
            stats['horas'][timestamp.hour] += 1
        
        # Contar ciudades (si existen)
        if 'ciudad' in contacto and contacto['ciudad']:
            stats['ciudades'][contacto['ciudad']] += 1
    
    return stats


# ============================================
# GRÁFICOS CON PLOTLY
# ============================================

def grafico_temporal(contactos):
    """Gráfico: contactos por día (últimos 30 días)"""
    if not contactos:
        return ""
    
    # Contar por fecha
    fechas = Counter()
    ahora = datetime.now()
    
    for contacto in contactos:
        timestamp = parse_fecha(contacto.get('timestamp', ''))
        if timestamp and (ahora - timestamp).days <= 30:
            fecha_str = timestamp.strftime('%Y-%m-%d')
            fechas[fecha_str] += 1
    
    if not fechas:
        return go.Figure().add_annotation(text="Sin datos").to_html(
            include_plotlyjs='cdn', div_id="grafico_temporal"
        )
    
    # Ordenar por fecha
    fechas_sorted = sorted(fechas.items())
    
    fig = go.Figure(data=[
        go.Scatter(
            x=[f[0] for f in fechas_sorted],
            y=[f[1] for f in fechas_sorted],
            mode='lines+markers',
            name='Contactos',
            line=dict(color='#784D3c', width=3),
            marker=dict(size=8, color='#fae41b')
        )
    ])
    
    fig.update_layout(
        title='Contactos por Día (últimos 30 días)',
        xaxis_title='Fecha',
        yaxis_title='Cantidad',
        hovermode='x unified',
        template='plotly_white',
        height=400,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    
    return fig.to_html(include_plotlyjs='cdn', div_id="grafico_temporal")


def grafico_horas(contactos):
    """Gráfico: por hora del día"""
    if not contactos:
        return ""
    
    horas = Counter()
    for contacto in contactos:
        timestamp = parse_fecha(contacto.get('timestamp', ''))
        if timestamp:
            horas[timestamp.hour] += 1
    
    if not horas:
        return go.Figure().add_annotation(text="Sin datos").to_html(
            include_plotlyjs='cdn', div_id="grafico_horas"
        )
    
    horas_sorted = sorted(horas.items())
    
    fig = go.Figure(data=[
        go.Bar(
            x=[f"{h:02d}:00" for h, _ in horas_sorted],
            y=[count for _, count in horas_sorted],
            marker=dict(color='#784D3c'),
            name='Contactos'
        )
    ])
    
    fig.update_layout(
        title='Contactos por Hora del Día',
        xaxis_title='Hora',
        yaxis_title='Cantidad',
        template='plotly_white',
        height=400,
        margin=dict(l=50, r=50, t=50, b=50),
        showlegend=False
    )
    
    return fig.to_html(include_plotlyjs='cdn', div_id="grafico_horas")


def grafico_estadisticas(stats):
    """Gráfico: estadísticas generales (gauge)"""
    fig = go.Figure(data=[
        go.Indicator(
            mode="number+gauge",
            value=stats['total'],
            title={'text': "Total de Contactos"},
            domain={'x': [0, 1], 'y': [0, 1]},
            gauge={
                'axis': {'range': [0, max(100, stats['total'] * 1.5)]},
                'bar': {'color': '#784D3c'},
                'steps': [
                    {'range': [0, stats['total'] * 0.5], 'color': '#e1e1e1'},
                    {'range': [stats['total'] * 0.5, stats['total']], 'color': '#fae41b'}
                ],
                'threshold': {
                    'line': {'color': 'red', 'width': 4},
                    'thickness': 0.75,
                    'value': stats['total']
                }
            }
        )
    ])
    
    fig.update_layout(height=300)
    return fig.to_html(include_plotlyjs='cdn', div_id="grafico_estadisticas")


# ============================================
# PÁGINA PRINCIPAL
# ============================================

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Blog de Café</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 5px solid #784D3c;
        }
        
        h1 {
            color: #784D3c;
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 0.95em;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 4px solid #fae41b;
        }
        
        .stat-card h3 {
            color: #666;
            font-size: 0.9em;
            font-weight: 400;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .stat-card .number {
            color: #784D3c;
            font-size: 2.5em;
            font-weight: 700;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .chart-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .chart-container h3 {
            color: #784D3c;
            margin-bottom: 15px;
            font-size: 1.1em;
        }
        
        footer {
            text-align: center;
            color: #999;
            margin-top: 30px;
            font-size: 0.9em;
        }
        
        .refresh-btn {
            background: #784D3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.95em;
            transition: all 0.3s;
            margin-top: 20px;
        }
        
        .refresh-btn:hover {
            background: #5c3929;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(120, 77, 60, 0.3);
        }
        
        @media (max-width: 768px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
            
            h1 {
                font-size: 1.5em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Dashboard de Contactos</h1>
            <p class="subtitle">Blog de Café - Análisis de Registros en Supabase</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Actualizar</button>
        </header>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total</h3>
                <div class="number">{{ stats.total }}</div>
            </div>
            <div class="stat-card">
                <h3>Hoy</h3>
                <div class="number">{{ stats.hoy }}</div>
            </div>
            <div class="stat-card">
                <h3>Esta Semana</h3>
                <div class="number">{{ stats.ultima_semana }}</div>
            </div>
            <div class="stat-card">
                <h3>Este Mes</h3>
                <div class="number">{{ stats.ultimo_mes }}</div>
            </div>
        </div>
        
        <div class="charts-grid">
            <div class="chart-container">
                <h3>📈 Tendencia Temporal</h3>
                {{ grafico_temporal | safe }}
            </div>
            <div class="chart-container">
                <h3>⏰ Contactos por Hora</h3>
                {{ grafico_horas | safe }}
            </div>
        </div>
        
        <footer>
            <p>✅ Dashboard en vivo | Última actualización: {{ fecha_actualizacion }}</p>
        </footer>
    </div>
</body>
</html>
"""

@app.route('/')
def dashboard():
    """Renderizar dashboard"""
    print("📊 Cargando datos de Supabase...")
    
    contactos = get_contactos()
    print(f"✅ {len(contactos)} contactos cargados")
    
    stats = get_estadisticas(contactos)
    
    return render_template_string(
        HTML_TEMPLATE,
        stats=stats,
        grafico_temporal=grafico_temporal(contactos),
        grafico_horas=grafico_horas(contactos),
        fecha_actualizacion=datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    )


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 DASHBOARD BLOG DE CAFÉ")
    print("="*50)
    print("📍 Acceder en: http://localhost:5000")
    print("🛑 Presiona Ctrl+C para salir")
    print("="*50 + "\n")
    
    try:
        # Probar conexión a Supabase
        headers = {
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        url = f"{SUPABASE_API_URL}/contactos?select=count&limit=1"
        response = requests.get(url, headers=headers, timeout=3)
        
        if response.status_code == 200:
            print("✅ Conexión a Supabase: OK")
        else:
            print(f"⚠️  Supabase respondió con: {response.status_code}")
            print("   Los datos se mostrarán vacíos hasta que se configure correctamente")
    except Exception as e:
        print(f"⚠️  No se pudo conectar a Supabase: {e}")
        print("   Los gráficos mostrarán datos vacíos")
    
    app.run(debug=True, port=5000, host='0.0.0.0', use_reloader=False)
