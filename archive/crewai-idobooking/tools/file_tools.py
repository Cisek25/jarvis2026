"""
Narzedzia plikowe dla CrewAI IdoBooking.
Odczyt/zapis plikow, ladowanie szablonow, podział HTML na body_top/body_bottom.
"""

from pathlib import Path
from crewai.tools import tool


BASE_DIR = Path(__file__).parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUT_DIR = BASE_DIR / "output"


@tool("read_file")
def read_file(file_path: str) -> str:
    """Odczytaj plik tekstowy. Podaj sciezke wzgledem katalogu projektu."""
    path = BASE_DIR / file_path
    if not path.exists():
        return f"BLAD: Plik nie istnieje: {path}"
    return path.read_text(encoding="utf-8")


@tool("write_file")
def write_file(file_path: str, content: str) -> str:
    """Zapisz tresc do pliku. Tworzy foldery jesli potrzeba."""
    path = BASE_DIR / file_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return f"Zapisano: {path} ({len(content)} znakow)"


@tool("load_template")
def load_template(template_name: str) -> str:
    """Zaladuj szablon HTML z folderu templates/. Podaj nazwe bez rozszerzenia."""
    path = TEMPLATES_DIR / f"{template_name}.html"
    if not path.exists():
        available = [f.stem for f in TEMPLATES_DIR.glob("*.html")]
        return f"BLAD: Szablon '{template_name}' nie istnieje. Dostepne: {', '.join(available)}"
    return path.read_text(encoding="utf-8")


@tool("list_templates")
def list_templates() -> str:
    """Lista dostepnych szablonow HTML."""
    templates = sorted(TEMPLATES_DIR.glob("*.html"))
    if not templates:
        return "Brak szablonow w templates/"
    lines = []
    for t in templates:
        content = t.read_text(encoding="utf-8")
        first_line = content.split("\n")[0].strip()
        lines.append(f"  {t.stem:20s} — {first_line}")
    return "Dostepne szablony:\n" + "\n".join(lines)


@tool("split_html_for_deploy")
def split_html_for_deploy(project_name: str, page_name: str) -> str:
    """
    Podziel plik HTML na body_top (czysty HTML) i body_bottom (script).
    Uzyj do przygotowania plikow do wklejenia w panel IdoSell.
    """
    html_path = OUTPUT_DIR / project_name / f"{page_name}.html"
    if not html_path.exists():
        return f"BLAD: Plik nie istnieje: {html_path}"

    content = html_path.read_text(encoding="utf-8")

    # Podziel na czesc HTML i czesc JS
    script_marker = "<script>"
    if script_marker in content:
        idx = content.index(script_marker)
        body_top = content[:idx].rstrip()
        body_bottom = content[idx:]
    else:
        body_top = content
        body_bottom = "<!-- Brak sekcji script -->"

    # Zapisz pliki
    deploy_dir = OUTPUT_DIR / project_name / "DO_WKLEJENIA"
    deploy_dir.mkdir(parents=True, exist_ok=True)

    top_path = deploy_dir / f"{page_name}__body_top.html"
    bottom_path = deploy_dir / f"{page_name}__body_bottom.html"

    top_path.write_text(body_top, encoding="utf-8")
    bottom_path.write_text(body_bottom, encoding="utf-8")

    top_size = len(body_top.encode("utf-8"))
    bottom_size = len(body_bottom.encode("utf-8"))
    limit = 64 * 1024  # 64KB limit pola CMS

    warnings = []
    if top_size > limit:
        warnings.append(f"UWAGA: body_top ({top_size // 1024}KB) przekracza limit 64KB!")
    if bottom_size > limit:
        warnings.append(f"UWAGA: body_bottom ({bottom_size // 1024}KB) przekracza limit 64KB!")

    result = f"Podzielono {page_name}:\n"
    result += f"  body_top:    {top_path.name} ({top_size // 1024}KB)\n"
    result += f"  body_bottom: {bottom_path.name} ({bottom_size // 1024}KB)\n"
    if warnings:
        result += "\n".join(warnings)

    return result
