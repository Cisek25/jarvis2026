# Instinct 004 — Always Verify URLs on Live Site

**Trigger**: Tworzenie linków wewnętrznych (href) w kodzie HTML klienta

**Zachowanie**:
1. NIGDY nie zgaduj URL-a podstrony z jej nazwy
2. ZAWSZE sprawdź faktyczny URL w nawigacji strony (menu) na żywej stronie
3. IdoBooking URL pattern: `/txt/{ID}/{Slug}` — ID jest wymagane
4. Slug jest case-sensitive

**Przykład błędu**: Wpisano `/txt/miasta` zamiast `/txt/202/Nasze-miasta` → 404
