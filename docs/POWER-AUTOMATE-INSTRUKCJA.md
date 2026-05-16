# Power Automate — Kolejka Sales do Tabeli Projekty

## Co robi ten flow

Kiedy wpiszesz dane nowego klienta w kolejce Sales (kolumny R-T, wiersz 10) i wybierzesz "TAK" w kolumnie Zatwierdz (U10), Power Automate automatycznie:

1. Odczyta dane z kolejki (nazwa, ID, data)
2. Doda nowy wiersz do tabeli "Projekty" z:
   - Kolejnym numerem (#)
   - Nazwa firmy
   - ID panelu
   - Status: "Brief"
   - URL: https://client{ID}.idosell.com/
   - Data briefu
3. Wyczyści komórki kolejki (gotowe na następnego klienta)

## Krok po kroku — tworzenie flow

### Krok 1: Otwórz Power Automate

Wejdź na: https://make.powerautomate.com/
Zaloguj się kontem Microsoft (tym samym co SharePoint).

### Krok 2: Nowy flow

1. Kliknij **"+ Create"** (lewy panel)
2. Wybierz **"Automated cloud flow"**
3. Nazwa: `Kolejka Sales → Projekty`
4. Trigger: wyszukaj **"When an item is modified"** → wybierz **"Excel Online (Business)"**
5. Kliknij **Create**

### Krok 3: Skonfiguruj trigger

W triggerze "When a row is modified" ustaw:

- **Location**: (wybierz swój SharePoint lub OneDrive)
- **Document Library**: (gdzie jest plik)
- **File**: `/Nowi_Klienci_2.0_NOWY.xlsx`
- **Table**: `Kolejka`

### Krok 4: Dodaj warunek (Condition)

Kliknij **"+ New step"** → szukaj **"Condition"**

Ustaw:
- **Zatwierdz** (z dynamic content z triggera) **is equal to** `TAK`

### Krok 5: Gałąź "If yes" — dodaj wiersz do tabeli

W gałęzi **"If yes"** kliknij **"Add an action"**:

**Akcja 1: "Add a row into a table" (Excel Online Business)**

- **Location**: (ten sam SharePoint)
- **Document Library**: (ta sama biblioteka)  
- **File**: `/Nowi_Klienci_2.0_NOWY.xlsx`
- **Table**: `Projekty`
- Wypełnij kolumny:
  - **#**: (zostaw puste — Excel doda numer)
  - **Nazwa firmy**: `Nazwa firmy` (dynamic content z triggera)
  - **ID panelu**: `ID panelu` (dynamic content)
  - **Status**: `Brief`
  - **Strona WWW**: wpisz formułę:
    ```
    concat('https://client', triggerOutputs()?['body/ID panelu'], '.idosell.com/')
    ```
  - **Data briefu**: `Data wplywu` (dynamic content)
  - Resztę kolumn zostaw pustą

**Akcja 2: "Update a row" (Excel Online Business)** — wyczyść kolejkę

- **Location/Library/File**: te same
- **Table**: `Kolejka`  
- **Key Column**: `Nazwa firmy`
- **Key Value**: `Nazwa firmy` (dynamic content — ta wartość co przed chwilą)
- Ustaw wszystkie pola na puste:
  - **Nazwa firmy**: (puste)
  - **ID panelu**: (puste)
  - **Data wplywu**: (puste)
  - **Zatwierdz**: (puste)

### Krok 6: Zapisz i przetestuj

1. Kliknij **"Save"** (prawy górny róg)
2. Otwórz Excel Online z plikiem
3. W kolejce (R10:U10) wpisz:
   - R10: `TEST FIRMA SP. Z O.O.`
   - S10: `99999`
   - T10: `2026-04-15` (wybierz z kalendarza)
   - U10: `TAK` (wybierz z dropdown)
4. Poczekaj 1-3 minuty
5. Sprawdź czy w tabeli Projekty pojawił się nowy wiersz
6. Sprawdź czy kolejka się wyczyściła

## Troubleshooting

**Flow się nie odpala?**
- Sprawdź czy tabela "Kolejka" jest rozpoznawana — w Excel Online kliknij w komórkę kolejki i sprawdź czy na wstążce pojawia się "Table Design"
- Sprawdź czy trigger jest ustawiony na tabelę "Kolejka" a nie "Projekty"

**Dane się nie czyszczą?**
- W akcji "Update a row" upewnij się że wpisujesz PUSTE wartości (nie null, nie spację — po prostu nic)

**URL się nie generuje?**
- Sprawdź formułę concat — nie może mieć spacji przed/po

## Alternatywa: Manual (bez Power Automate)

Jeśli Power Automate nie działa lub nie masz licencji:
1. Wpisz dane w kolejce (R10:T10)
2. Ręcznie skopiuj do nowego wiersza w tabeli Projekty
3. Wyczyść kolejkę
4. Tabela Excel automatycznie rozszerzy się o nowy wiersz
