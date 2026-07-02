# Pliki prawne (logowanie / rejestracja)

Umieść tutaj pliki PDF do pobrania z ekranu akceptacji warunków:

- `warunki-uzytkowania.pdf`
- `polityka-prywatnosci.pdf`

Po dodaniu będą dostępne pod adresami (dev: http://127.0.0.1:3000/documents/...):

- `/documents/warunki-uzytkowania.pdf`
- `/documents/polityka-prywatnosci.pdf`

## Ważne — plik binarny, nie tekst

PDF to plik binarny. Jeśli zostanie otwarty lub zapisany w edytorze (np. Cursor/VS Code), dane wewnętrzne ulegają uszkodzeniu i w przeglądarce widać **puste strony** — link i serwer działają poprawnie, ale treść znika.

**Jak wgrać poprawnie:**

1. Zamknij plik PDF w edytorze (nie otwieraj go w IDE).
2. W Google Docs / Word: **Plik → Pobierz → PDF** (albo skopiuj oryginał z dysku).
3. Przeciągnij plik do tego folderu w Eksploratorze Windows (zastąp istniejący).
4. Sprawdź: otwórz w Chrome/Edge `http://127.0.0.1:3000/documents/polityka-prywatnosci.pdf` — musi być widoczna treść, nie puste strony.

**Uwaga:** kopia w `Downloads/polityka-prywatnosci.pdf` jest obecnie taka sama uszkodzona jak ta w projekcie — trzeba pobrać **nowy** eksport ze źródła.

- Oba pliki muszą istnieć. Brak pliku powoduje zwrot strony HTML aplikacji zamiast PDF.
