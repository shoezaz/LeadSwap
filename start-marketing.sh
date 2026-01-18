#!/bin/bash

echo "🚀 Démarrage de l'application marketing LeadSwap..."
echo ""

cd marketing

if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
  echo ""
fi

echo "✨ Lancement du serveur de développement..."
echo "📍 L'application sera accessible sur http://localhost:3000"
echo ""
echo "Pages disponibles :"
echo "  - Landing page : http://localhost:3000/"
echo "  - Pricing page : http://localhost:3000/pricing"
echo ""

npm run dev
