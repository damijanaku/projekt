
# NailBabe 💅🏽 – Funkcionalnosti in obseg

## 1. Uporabniške vloge

### 1.1 Stranka (Customer)

**Kaj lahko počne:**
- Registrira se in prijavi kot stranka.
- Išče salone po regiji, kategoriji storitve ali nazivu.
- Pregleduje profil salona: galerijo del, storitve, cenik, delovne ure in lokacijo.
- Rezervira prost termin pri izbranem salonu.
- Ob rezervaciji priloži **inspiracijsko fotografijo** želenega dizajna nohtov.
- Prestavi ali odpove svojo rezervacijo (do določenega roka).
- Kontaktira salon prek kontaktnega obrazca.
- Pregleduje zgodovino svojih rezervacij.

**Česa ne more:**
- Ne more urejati ali brisati profilov salonov.
- Ne more videti rezervacij drugih strank.
- Ne more upravljati kategorij ali uporabnikov platforme.
- Ne more potrjevati ali zavračati rezervacij (to stori dodeljeni nail artist ali vodja salona).

---

### 1.2 Vodja salona (Salon Manager)

**Kaj lahko počne:**
- Registrira salon in upravlja njegov profil: naziv, opis, lokacijo, kontakt ter galerijo.
- Povabi oziroma poveže nail artiste s svojim salonom ter upravlja članstvo ekipe.
- Ustvari in ureja storitve salona ter določi, kateri nail artisti jih izvajajo.
- Pregleduje urnik in rezervacije vseh artistov svojega salona ter potrjuje, zavrača, prestavlja ali odpoveduje rezervacije.
- Pregleduje statistiko zasedenosti salona.

**Česa ne more:**
- Ne more upravljati profilov ali rezervacij drugih salonov.
- Ne more upravljati računov strank ali administratorjev.
- Ne more urejati globalnih kategorij storitev.
- Ne more videti osebnih podatkov strank, ki niso povezani z rezervacijami njegovega salona.

### 1.3 Nail artist (Nail Artist)

**Kaj lahko počne:**
- Povabi nail artiste, da ustvarijo račune in se povežejo z njegovim salonom; artist lahko pripada enemu salonu.
- Upravlja svoje razpoložljive termine in delovni čas.
- Pregleduje rezervacije, inspiracijske fotografije in urnik, ki so dodeljeni njemu.
- Potrdi ali zavrne dodeljeno rezervacijo ter po terminu označi storitev kot opravljeno ali stranko kot »no-show«.

**Česa ne more:**
- Ne more urejati profila salona ali upravljati drugih članov ekipe; to lahko vodja salona.
- Ne more pregledovati rezervacij drugih artistov, razen če je za salon hkrati določen kot vodja.
- Ne more upravljati globalnih kategorij, uporabnikov ali drugih salonov.

---

### 1.4 Administrator (Admin)

**Kaj lahko počne:**
- Upravlja vse uporabnike (stranke, vodje salonov, nail artiste in druge administratorje).
- Aktivira, deaktivira ali izbriše uporabniške račune.
- Upravlja kategorije storitev (dodajanje, urejanje, brisanje).
- Pregleduje vse salone in rezervacije v sistemu.
- Odstrani neprimerne ali lažne profile salonov.
- Upravlja globalne nastavitve platforme (npr. pravila odpovedi).

**Česa ne more:**
- Ne more rezervirati termina v imenu stranke.
- Ne more urejati vsebine galerije salonov brez njihovega soglasja.
- Ne more dostopati do gesel uporabnikov (hashirana).

---

## 2. Predvidene funkcionalnosti

| # | Funkcionalnost | Opis | MVP |
|---|---|---|---|
| 1 | **Iskanje salonov po regiji in kategoriji** | Stranka filtrira salone glede na regijo, kategorijo storitve in naziv. | MVP |
| 2 | **Profil salona z galerijo del** | Salon objavi opis, lokacijo, regijo, kontakt in galerijo fotografij svojih del. | MVP |
| 3 | **Objava storitev in razpoložljivih terminov** | Vodja salona uredi storitve in izvajalce, nail artist objavi svoje proste termine. | MVP |
| 4 | **Rezervacija termina z inspiracijsko fotografijo** | Stranka rezervira termin pri izbranem nail artistu in po želji priloži fotografijo želenega dizajna. | MVP |
| 5 | **Potrjevanje in zavračanje rezervacij** | Dodeljeni nail artist ali vodja salona potrdi oziroma zavrne rezervacijo; sistem prepreči konflikte za istega artista. | MVP |
| 6 | **Prestavitev in odpoved rezervacije** | Stranka, dodeljeni nail artist ali vodja salona prestavi/odpove termin; sprosti se termin artista. | MVP |
| 7 | **E-poštna obvestila** | Sistem pošilja potrditve, opomnike in obvestila o spremembah. | MVP |
| 8 | **Kontaktni obrazec med stranko in salonom** | Stranka pošlje vprašanje neposredno salonu prek platforme. | NE |
| 9 | **Pregled urnika salona (dnevni/tedenski)** | Nail artist vidi svoj urnik, vodja salona pa urnik ekipe v koledarskem pogledu. | NE |
| 10 | **Zgodovina rezervacij stranke** | Stranka vidi pretekle in prihodnje rezervacije. | NE |
| 11 | **Osnovna statistika za salon** | Prikaz zasedenosti, števila rezervacij. | NE |
| 12 | **Oznaka "no-show" in opravljenih storitev** | Salon označi rezervacijo kot opravljeno ali kot neprihod stranke. | NE |
| 13 | **Upravljanje kategorij storitev (admin)** | Administrator dodaja, ureja in briše kategorije storitev. | NE |
| 14 | **Upravljanje uporabnikov (admin)** | Administrator aktivira, deaktivira ali izbriše uporabnike in salone. | NE |

**Opomba:** Funkcionalnosti 1–7 so označene kot **MVP**. Med njimi so **domensko specifične** predvsem:
- iskanje salonov po regiji in kategoriji,
- profil salona z galerijo del,
- rezervacija termina z inspiracijsko fotografijo.


---

## 3. Kasnejše nadgradnje

1. **Mobilna aplikacija** (React Native) za stranke in salone.
2. **Sistem ocen in komentarjev** z možnostjo odgovora salona.
3. **Večjezičnost** (slovenščina, angleščina, hrvaščina) in večvalutni prikaz cen.
4. **Integracija z Google Calendar / Apple Calendar** za sinhronizacijo terminov.
5. **Program zvestobe** – točke za ponovne rezervacije in popuste.

---

## 4. Out of scope

V okviru tega projekta **ne bomo implementirali**:

- dejanskega plačevanja ali finančnih transakcij,
- AI-analize inspiracijskih fotografij,
- video klicev ali klepet v živo,
- upravljanja zalog materiala v salonu,
- sms opomnikov
