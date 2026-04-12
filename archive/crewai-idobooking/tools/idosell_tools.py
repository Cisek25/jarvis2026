"""
Narzedzia specyficzne dla IdoSell CMS.
Generowanie instrukcji wklejania, sprawdzanie kompatybilnosci.
"""

from crewai.tools import tool


@tool("generate_deploy_instructions")
def generate_deploy_instructions(
    project_name: str,
    page_name: str,
    client_id: str,
    subpage_id: str = "",
    language: str = "pl",
) -> str:
    """
    Generuj instrukcje wklejania plikow do panelu IdoSell.
    Zawiera dokladne kroki i adresy URL panelu.
    """
    panel_url = f"https://client{client_id}.idosell.com/panel"
    css_url = f"{panel_url}/frontpage/editorstyle"

    instructions = f"""# INSTRUKCJA WKLEJANIA — {project_name} / {page_name}
# Wygenerowano przez CrewAI IdoBooking
# ============================================================

## KROK 1: CSS (jednorazowo, pierwszy raz)

1. Otworz: {css_url}
2. W edytorze ACE znajdz koniec istniejacego CSS
3. Wklej CALA zawartosc pliku tokens.css NA KONCU
4. Kliknij ZAPISZ
5. UWAGA: Nie usuwaj istniejacego CSS — dodaj na koncu!

## KROK 2: Tresc strony {page_name.upper()} ({language.upper()})

"""

    if subpage_id:
        edit_url = f"{panel_url}/frontpage/editsubpage/id/{subpage_id}"
        instructions += f"""1. Otworz: {edit_url}
2. Pole "Poczatek sekcji Body" (body_top):
   → Wklej zawartosc pliku: {page_name}__body_top.html
3. Pole "Koniec sekcji Body" (body_bottom):
   → Wklej zawartosc pliku: {page_name}__body_bottom.html
4. Kliknij ZAPISZ
"""
    else:
        instructions += f"""1. Otworz panel: {panel_url}/frontpage
2. Znajdz lub stworz podstrone dla: {page_name}
3. Pole "Poczatek sekcji Body" (body_top):
   → Wklej zawartosc pliku: {page_name}__body_top.html
4. Pole "Koniec sekcji Body" (body_bottom):
   → Wklej zawartosc pliku: {page_name}__body_bottom.html
5. Kliknij ZAPISZ
"""

    instructions += f"""
## KROK 3: Weryfikacja

1. Otworz strone w nowej karcie przegladarki
2. Ctrl+Shift+R (twarde odswiezenie — wymusza pobranie nowego CSS)
3. Sprawdz:
   - Czy wszystkie sekcje sie laduja
   - Czy obrazki sie wyswietlaja
   - Czy przyciski dzialaja (linki do rezerwacji)
   - Czy lightbox otwiera sie na galerii (jesli jest)
   - Czy na mobile (telefon) layout sie poprawnie sklada
4. Jesli cos nie dziala — sprawdz konsole przegladarki (F12 → Console)

## UWAGI
- Pliki body_top nie moga zawierac tagow <script>
- Pliki body_bottom zawieraja TYLKO tagi <script>
- Limit pola CMS: ~64KB na pole
- Po wklejeniu CSS odczekaj ~30 sekund na odswiezenie cache
"""

    return instructions


@tool("check_cms_compatibility")
def check_cms_compatibility(html_content: str) -> str:
    """
    Sprawdz HTML pod katem kompatybilnosci z IdoSell CMS.
    Flaguje: zewnetrzne skrypty, style inline, potencjalne konflikty.
    """
    issues = []
    warnings = []
    info = []

    # Sprawdz zewnetrzne skrypty
    import re
    ext_scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)', html_content)
    for src in ext_scripts:
        if "cdnjs" in src or "jsdelivr" in src or "unpkg" in src:
            warnings.append(f"Zewnetrzny skrypt: {src} — moze byc blokowany przez CSP")

    # Sprawdz tagi style
    style_tags = re.findall(r"<style[^>]*>", html_content)
    if style_tags:
        warnings.append(f"Znaleziono {len(style_tags)} tagow <style> — przenies do CSS editora")

    # Sprawdz rozmiar
    size_bytes = len(html_content.encode("utf-8"))
    size_kb = size_bytes / 1024
    if size_kb > 64:
        issues.append(f"Rozmiar {size_kb:.1f}KB przekracza limit 64KB pola CMS!")
    elif size_kb > 50:
        warnings.append(f"Rozmiar {size_kb:.1f}KB — blisko limitu 64KB")
    else:
        info.append(f"Rozmiar: {size_kb:.1f}KB (OK, limit 64KB)")

    # Sprawdz <script> w srodku HTML (powinno byc na koncu)
    script_positions = [m.start() for m in re.finditer(r"<script", html_content)]
    non_script = html_content.split("<script")[0] if "<script" in html_content else html_content
    if script_positions:
        # Sprawdz czy cos jest PO ostatnim </script>
        last_close = html_content.rfind("</script>")
        after_scripts = html_content[last_close + 9:].strip() if last_close >= 0 else ""
        if after_scripts and not after_scripts.startswith("<!--"):
            warnings.append("HTML po zamknieciu </script> — moze nie dzialac w CMS")

    # Sprawdz klasy .container (konflikt z szablonem)
    if 'class="container"' in html_content or "class='container'" in html_content:
        warnings.append("Klasa 'container' moze konfliktowac z szablonem IdoSell")

    # Podsumowanie
    result = "Kompatybilnosc z IdoSell CMS:\n"
    if issues:
        result += f"\nCRITICAL ({len(issues)}):\n" + "\n".join(f"  {i}" for i in issues)
    if warnings:
        result += f"\nWARNING ({len(warnings)}):\n" + "\n".join(f"  {w}" for w in warnings)
    if info:
        result += f"\nINFO:\n" + "\n".join(f"  {i}" for i in info)
    if not issues and not warnings:
        result += "  Wszystko OK — kompatybilne z CMS."

    return result
