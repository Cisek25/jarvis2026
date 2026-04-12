#!/bin/bash
# ============================================================
# CrewAI IdoBooking — INSTALACJA
# Uruchom: chmod +x install.sh && ./install.sh
# ============================================================

set -e

echo "=== CrewAI IdoBooking Website Builder ==="
echo ""

# Sprawdz Python
PYTHON=""
for py in python3.13 python3.12 python3.11 python3.10; do
    if command -v $py &>/dev/null; then
        PYTHON=$py
        break
    fi
done

if [ -z "$PYTHON" ]; then
    echo "BLAD: Potrzebny Python 3.10-3.13. Zainstaluj: brew install python@3.13"
    exit 1
fi

echo "Python: $($PYTHON --version)"

# Stworz venv
echo "Tworzenie srodowiska wirtualnego..."
$PYTHON -m venv .venv
source .venv/bin/activate

# Zainstaluj
echo "Instalowanie CrewAI..."
pip install --upgrade pip
pip install 'crewai[tools]'

echo ""
echo "=== GOTOWE ==="
echo ""
echo "Aktywacja:  source .venv/bin/activate"
echo "Uruchomienie: python main.py --project madera"
echo ""
echo "Dostepne komendy:"
echo "  python main.py --project madera        # budowa strony Madera"
echo "  python main.py --project [nazwa]        # nowy projekt"
echo "  python main.py --task css-palette       # tylko paleta kolorow"
echo "  python main.py --task ux-audit          # tylko audit UX"
echo "  python main.py --task content-pl        # tylko tresc PL"
echo "  python main.py --task html-build        # tylko budowa HTML"
echo "  python main.py --task deploy-prep       # tylko przygotowanie do wklejenia"
