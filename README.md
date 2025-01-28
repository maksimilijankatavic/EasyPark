# EasyPark

**EasyPark** je web aplikacija osmišljena za jednostavno upravljanje parkiranjem. Aplikacija omogućava korisnicima kupnju, produljenje i upravljanje parkirnim kartama, pregled slobodnih parkirnih mjesta i zona, te administraciju parkirališta.

## Osnovne funkcionalnosti

### Neprijavljeni korisnici
- Kupnja i produljenje satne karte.
- Kupnja dnevne karte.
- Pregled parkirališta i zona.
- Registracija.

### Prijavljeni korisnici
- Sve mogućnosti neprijavljenih korisnika.
- Kupnja mjesečne karte (rezervacija parkirnog mjesta).

### Administratori
- Pregled statistike.
- Dodavanje novih parkirališta.
- Uređivanje postojećih parkirališta.

## Tehnologije
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, JavaScript
- **Baza podataka:** PostgreSQL

## Preduvjeti
- [Node.js](https://nodejs.org/)
- Live Server ekstenzija za editor (npr. [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)) ili neki drugi lokalni poslužitelj.

## Kako pokrenuti projekt


1. Klonirajte repozitorij:

   ```bash
   git clone https://github.com/maksimilijankatavic/EasyPark.git/
2. Instalirajte potrebne pakete:

   ```bash
   npm install 

3. Stvorite .env datoteku:

   - U direktoriju server ručno kreirajte .env datoteku.
   - Unesite potrebne podatke.
   - pošto su u njoj povjerljivi podaci nije ovdje objavljen sadržaj
4. (Ako ne koristite Firefox) Pokrenite aplikaciju:

   ```bash
   npm run pokreni

6. (Ako koristite Firefox) Pokrenite aplikaciju:
   ```bash
   npm run pokreni_server
   ```

   - Navigirajte do mape stranice/pocetna u projektu.
   - Pokrenite pocetna.html datoteku koristeći Live Server u svom editoru (npr. VS Code) ili putem drugog lokalnog poslužitelja.

## Napomena

Ovaj projekt razvijen je kao dio kolegija Uvod u programsko inženjerstvo na Prirodoslovno-matematičkom fakultetu Sveučilišta u Splitu.
