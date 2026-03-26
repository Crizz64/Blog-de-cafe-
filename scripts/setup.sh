#!/bin/bash
# setup.sh — Configuración inicial del entorno de desarrollo

echo "☕ Blog de Café — Setup"
echo "======================"

# Verificar que Python esté disponible (para servidor local)
if command -v python3 &>/dev/null; then
  echo "✅ Python3 disponible"
else
  echo "⚠️  Python3 no encontrado — instálalo para usar el servidor local"
fi

# Verificar Node (opcional, para testing)
if command -v node &>/dev/null; then
  echo "✅ Node $(node -v) disponible"
  
  # Instalar dependencias si hay package.json
  if [ -f "package.json" ]; then
    echo "📦 Instalando dependencias..."
    npm install
  fi
else
  echo "ℹ️  Node no encontrado — solo necesario para tests"
fi

echo ""
echo "Para iniciar el servidor local:"
echo "  python3 -m http.server 8000"
echo "  → http://localhost:8000"
echo ""
echo "✅ Setup completo"
