# NailBabe 💅🏽

NailBabe je načrt spletne platforme za iskanje lepotnih salonov in rezervacijo terminov pri nail artistih. Stranke lahko primerjajo salone po regiji in storitvah, pregledajo njihove profile ter rezervirajo termin z možnostjo priložitve inspiracijske fotografije. Saloni upravljajo storitve, ekipo, razpoložljivost in rezervacije.

## Tehnologije

Predvideni tehnološki sklad vključuje React, TypeScript, Tailwind CSS in Vite za uporabniški vmesnik; Node.js, Express.js in JavaScript za backend ter REST API; PostgreSQL za podatkovno bazo; JWT in bcrypt za avtentikacijo. Za lokalni razvoj so predvideni npm ter Docker in Docker Compose. Fotografije in e-poštna obvestila uporabljajo predvideni shrambi oziroma storitvi, kot so Multer in Nodemailer/SMTP. Sklad je podrobneje opisan v [arhitekturi in tehnološkem skladu](docs/04-arhitektura-in-tehnoloski-sklad.md).

## Lokalna namestitev

### Zahteve

- Git
- Node.js in npm
- PostgreSQL

### Fork in prenos projekta

1. Na GitHubu izberite **Fork**.
2. Klonirajte svoj fork in vstopite v projekt:

   ```bash
   git clone https://github.com/VAŠ-UPORABNIK/NailBabe.git
   cd NailBabe
   ```

   URL zamenjajte z URL-jem svojega forka.

### Podatkovna baza

Ustvarite prazno PostgreSQL podatkovno bazo, na primer `nailbabe`. Primer, če imate nameščena orodja PostgreSQL:

Uporabnik v `DATABASE_URL` mora imeti pravice za ustvarjanje tabel in PostgreSQL razširitev, ki jih zahtevajo migracije.

### Okoljske spremenljivke

Ustvarite lokalni datoteki `.env` iz priloženih primerov:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

V `backend/.env` nastavite `DATABASE_URL` za svojo podatkovno bazo. Ustvarite različni skrivnosti za JWT:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Prvo vrednost vnesite kot `JWT_SECRET`, drugo pa kot `JWT_REFRESH_SECRET`. `SMTP_USER` in `SMTP_PASS` sta potrebna samo za pošiljanje e-poštnih vabil nail artistom. Skrivnosti in lokalni `.env` datoteki ne dodajajte v Git.

`frontend/.env` privzeto uporablja backend na `http://localhost:3000`. Če spremenite naslov ali vrata backend strežnika, posodobite `VITE_API_BASE_URL` in `VITE_IMAGE_UPLOAD_URL`.

### Namestitev in zagon

V prvem terminalu namestite backend odvisnosti, zaženite migracije in zaženite API:

```bash
cd backend
npm install
node scripts/migrate.js
node index.js
```

Backend privzeto posluša na `http://localhost:3000`. Preverite povezavo z bazo na `http://localhost:3000/health`.

V drugem terminalu namestite frontend odvisnosti in zaženite Vite:

```bash
cd frontend
npm install
npm run dev
```

Frontend privzeto teče na `http://localhost:5173`.

Naložene salonske fotografije se lokalno shranijo v `backend/uploads/`. Ta mapa je namenjena lokalnemu razvoju in je izključena iz Gita.

### Koristni ukazi

Migracije so razvrščene po datotekah in se izvajajo samo enkrat; ob naslednjem zagonu `node scripts/migrate.js` preskoči že izvedene migracije.

## Dokumentacija

- [Zasnova rešitve](docs/01-zasnova-resitve.md)
- [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [Podatkovni model](docs/03-podatkovni-model.md)
- [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [Wireframes](docs/06-wireframes.md)
