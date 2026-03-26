#!/bin/bash
# deploy.sh — Deploy a Netlify / Vercel / GitHub Pages

echo "☕ Blog de Café — Deploy"
echo "========================"

# Verificar que hay cambios para commitear
if [[ -n $(git status --porcelain) ]]; then
  echo "📝 Hay cambios sin commitear:"
  git status --short
  echo ""
  read -p "¿Continuar con deploy? (s/n): " confirm
  if [[ "$confirm" != "s" ]]; then
    echo "Deploy cancelado."
    exit 0
  fi
fi

# Push a main (dispara deploy automático en Netlify/Vercel)
echo "🚀 Haciendo push a main..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "Nada nuevo para commitear"
git push origin main

echo ""
echo "✅ Push completado"
echo "   Netlify/Vercel detectará el cambio y desplegará automáticamente"
echo "   Revisa el estado en tu dashboard de Netlify o Vercel"
