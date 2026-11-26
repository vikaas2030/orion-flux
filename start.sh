#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║        🚀 ORION FLUX — Super Agent           ║"
echo "  ║        Starting Production Server...         ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed! Download it from https://nodejs.org/"
    exit 1
fi

echo "[1/4] Checking server dependencies..."
cd "$SCRIPT_DIR/server"
if [ ! -d "node_modules" ]; then
    echo "      Installing server dependencies..."
    npm install --production
else
    echo "      ✅ Server dependencies ready"
fi

echo "[2/4] Checking client dependencies..."
cd "$SCRIPT_DIR/client"
if [ ! -d "node_modules" ]; then
    echo "      Installing client dependencies..."
    npm install
else
    echo "      ✅ Client dependencies ready"
fi

echo "[3/4] Building frontend..."
if [ ! -d "dist" ]; then
    echo "      Building production frontend..."
    npm run build
else
    echo "      ✅ Frontend build exists (run 'npm run build' to rebuild)"
fi

echo "[4/4] Starting ORION FLUX..."
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   Open your browser:                        ║"
echo "  ║   👉 http://localhost:5000                   ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# Open browser (works on macOS and Linux)
if command -v xdg-open &> /dev/null; then
    (sleep 2 && xdg-open "http://localhost:5000") &
elif command -v open &> /dev/null; then
    (sleep 2 && open "http://localhost:5000") &
fi

# Start server
cd "$SCRIPT_DIR/server"
exec node app.js
