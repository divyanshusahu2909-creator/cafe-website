#!/bin/bash
# ==============================================================================
# Aesthetic Aroma — Development Server Launcher
# "Where Every Sip Feels Special."
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "☕ =================================================="
echo "   Starting Aesthetic Aroma Full-Stack Platform"
echo "   Indore, Madhya Pradesh | 100% Vegetarian Cafe"
echo "=================================================="

# Function to kill child processes on exit
cleanup() {
    echo ""
    echo "Shutting down Aesthetic Aroma services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Django Backend
echo "Starting Django REST Framework backend on http://127.0.0.1:8000..."
cd "$DIR/backend"
python3 manage.py migrate --noinput
python3 manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!

# 2. Start Vite Frontend
echo "Starting Vite Frontend on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ Both servers are running!"
echo "   - Storefront Website:  http://localhost:5173"
echo "   - Staff Admin Portal:  http://localhost:5173/admin-login"
echo "   - REST API Base:       http://127.0.0.1:8000/api/v1/"
echo "   - Django Admin:        http://127.0.0.1:8000/django-admin/"
echo ""
echo "Credentials: admin / adminpassword123"
echo "Press Ctrl+C to stop all servers."

# Wait for background processes
wait
