# NailBabe 💅🏽 – Podatkovni model

## 1. Namen 

Ta dokument opisuje podatkovni model aplikacije NailBabe: entitete, njihove atribute, tipe, omejitve in relacije. Model je zasnovan tako, da podpira MVP funkcionalnosti (iskanje salonov, profil salona, storitve, termini, rezervacije z inspiracijsko fotografijo, potrjevanje/zavračanje, prestavitve/odpovedi, e-poštna obvestila).

---

## 2. Konceptualni model (ER opis)

Glavne entitete in relacije:

- **User** (uporabnik) – osnovni račun za prijavo. Vsak uporabnik ima natanko eno vlogo (Customer, SalonManager, NailArtist, Admin).
- **Customer** – stranka, povezana z uporabnikom (1:1).
- **SalonManager** – profil vodje, povezan z uporabniškim računom (1:1).
- **NailArtist** – nail artist, povezan z uporabniškim računom in salonom; salon ima več artistov.
- **Salon** – profil salona, ki ga upravlja en vodja in v katerem deluje več nail artistov.
- **ServiceCategory** – globalna kategorija storitev (npr. manikura, gel, podaljševanje).
- **Service** – storitev, ki jo ponuja salon (naziv, trajanje, cena, kategorija); povezava ServiceArtist določa, kateri artisti jo izvajajo.
- **WorkingHours** – delovne ure posameznega artista po dnevih v tednu.
- **AvailabilitySlot** – konkreten razpoložljiv termin posameznega artista.
- **Reservation** – rezervacija stranke za določen termin in storitev.
- **InspirationPhoto** – inspiracijska fotografija, priložena rezervaciji (0..N).
- **Notification** – e-poštno obvestilo (potrditev, opomnik, sprememba).
---

## 3. Entitete in atributi

### 3.1 User

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID | PK | Enolični identifikator |
| email | VARCHAR(255) | UNIQUE, NOT NULL | E-poštni naslov (za prijavo) |
| password_hash | VARCHAR(255) | NOT NULL | Hashirano geslo (bcrypt) |
| role | ENUM('customer','salon_manager','nail_artist','admin') | NOT NULL | Vloga uporabnika |
| first_name | VARCHAR(100) | | Ime |
| last_name | VARCHAR(100) | | Priimek |
| phone | VARCHAR(30) | | Telefon |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Ali je račun aktiven |
| created_at | TIMESTAMP | NOT NULL | Čas ustvarjanja |
| updated_at | TIMESTAMP | | Čas zadnje spremembe |

---

### 3.2 Customer

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| user_id | UUID / BIGINT | FK -> User.id, UNIQUE, NOT NULL | Povezava na uporabnika |
| default_region | VARCHAR(100) | | Privzeta regija za iskanje |
| notes | TEXT | | Opombe |

---

### 3.3 SalonManager

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| user_id | UUID / BIGINT | FK -> User.id, UNIQUE, NOT NULL | Povezava na uporabnika |
| display_name | VARCHAR(150) | NOT NULL | Ime vodje |
| bio | TEXT | | Kratka predstavitev vodje |

---

### 3.4 Salon

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| manager_id | UUID / BIGINT | FK -> SalonManager.id, UNIQUE, NOT NULL | Vodja salona |
| name | VARCHAR(150) | NOT NULL | Naziv salona |
| description | TEXT | | Opis salona |
| region | VARCHAR(100) | NOT NULL, INDEX | Regija (npr. Osrednja Slovenija) |
| address | VARCHAR(255) | | Naslov |
| city | VARCHAR(100) | | Mesto |
| postal_code | VARCHAR(20) | | Poštna številka |
| latitude | DECIMAL(9,6) | | Zemljepisna širina |
| longitude | DECIMAL(9,6) | | Zemljepisna dolžina |
| phone | VARCHAR(30) | | Kontakt |
| email | VARCHAR(255) | | Kontakt |
| instagram | VARCHAR(255) | | Instagram profil |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Ali je salon viden |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | | |

**Indeksi:** `region`, `name` (za iskanje po regiji in nazivu).

### 3.5 NailArtist

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator artista |
| user_id | UUID / BIGINT | FK -> User.id, UNIQUE, NOT NULL | Uporabniški račun artista |
| salon_id | UUID / BIGINT | FK -> Salon.id, NOT NULL | Salon, katerega ekipe je član |
| display_name | VARCHAR(150) | NOT NULL | Javno ime artista |
| bio | TEXT | | Predstavitev in specializacija |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Ali artist trenutno sprejema rezervacije |

**Omejitev:** artist pripada enemu salonu; salon lahko ima več artistov. Samostojni nail artist nastopa kot vodja svojega profila salona in kot njegov edini artist.

### 3.6 ServiceArtist

Povezovalna entiteta, ki določa, kateri artisti lahko izvajajo posamezno storitev.

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| service_id | UUID / BIGINT | FK -> Service.id, PK | Storitev |
| nail_artist_id | UUID / BIGINT | FK -> NailArtist.id, PK | Artist, ki izvaja storitev |

---

### 3.7 ServiceCategory

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Naziv kategorije |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly oznaka |
| description | TEXT | | Opis |
| is_active | BOOLEAN | DEFAULT true | Ali je kategorija aktivna |

**Primeri:** manikura, gel nohti, podaljševanje, nail art, pedikura.

---

### 3.8 Service

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| salon_id | UUID / BIGINT | FK -> Salon.id, NOT NULL | Kateremu salonu pripada |
| category_id | UUID / BIGINT | FK -> ServiceCategory.id | Kategorija storitve |
| name | VARCHAR(150) | NOT NULL | Naziv storitve |
| description | TEXT | | Opis |
| duration_minutes | INT | NOT NULL, CHECK > 0 | Trajanje v minutah |
| price | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Cena |
| currency | VARCHAR(3) | DEFAULT 'EUR' | Valuta |
| is_active | BOOLEAN | DEFAULT true | Ali je storitev na voljo |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | | |

**Indeksi:** `salon_id`, `category_id`.

---

### 3.9 WorkingHours

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| nail_artist_id | UUID / BIGINT | FK -> NailArtist.id, NOT NULL | Artist |
| day_of_week | SMALLINT | NOT NULL, CHECK 1–7 | 1 = ponedeljek, 7 = nedelja |
| open_time | TIME | NOT NULL | Začetek dela |
| close_time | TIME | NOT NULL | Konec dela |
| is_closed | BOOLEAN | DEFAULT false | Ali je ta dan zaprto |

**Unikat:** (`nail_artist_id`, `day_of_week`).

---

### 3.10 AvailabilitySlot

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| nail_artist_id | UUID / BIGINT | FK -> NailArtist.id, NOT NULL | Artist, ki je prost |
| start_time | TIMESTAMP | NOT NULL | Začetek termina |
| end_time | TIMESTAMP | NOT NULL | Konec termina |
| status | ENUM('available','reserved','blocked') | NOT NULL, DEFAULT 'available' | Stanje termina |
| created_at | TIMESTAMP | NOT NULL | |

**Indeksi:** `nail_artist_id`, `start_time`, `status`.
**Omejitev:** `end_time > start_time`.

**Opomba:** sistem mora preprečiti prekrivanje terminov istega artista. Ob rezervaciji backend preveri, da storitev pripada salonu artista in da jo artist izvaja.

---

### 3.11 Reservations

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| customer_id | UUID / BIGINT | FK -> Customer.id, NOT NULL | Stranka |
| salon_id | UUID / BIGINT | FK -> Salon.id, NOT NULL | Salon |
| nail_artist_id | UUID / BIGINT | FK -> NailArtist.id, NOT NULL | Artist, pri katerem je rezervacija |
| service_id | UUID / BIGINT | FK -> Service.id, NOT NULL | Storitev |
| slot_id | UUID / BIGINT | FK -> AvailabilitySlot.id, UNIQUE | Termin |
| status | ENUM('pending','confirmed','rejected','cancelled','completed','no_show') | NOT NULL, DEFAULT 'pending' | Stanje rezervacije |
| note | TEXT | | Opomba stranke |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | | |
| cancelled_at | TIMESTAMP | | Čas odpovedi |
| cancelled_by | ENUM('customer','nail_artist','salon_manager','admin') | | Kdo je odpovedal |

**Indeksi:** `customer_id`, `salon_id`, `nail_artist_id`, `status`, `slot_id`.
**Omejitev:** en slot ima lahko največ eno aktivno rezervacijo (status != 'cancelled' / 'rejected').
**Celovitost:** `salon_id` in `nail_artist_id` v rezervaciji morata ustrezati salonu artista, izbrani storitvi pa mora biti artist dodeljen prek `ServiceArtist`.

---

### 3.12 InspirationPhoto

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| reservation_id | UUID / BIGINT | FK -> Reservation.id, NOT NULL | Rezervacija |
| file_path | VARCHAR(500) | NOT NULL | Pot do datoteke |
| mime_type | VARCHAR(100) | | Tip datoteke |
| size_bytes | INT | | Velikost |
| uploaded_at | TIMESTAMP | NOT NULL | |

**Opomba:** za MVP dovolimo 0..N fotografij na rezervacijo (npr. maks. 3).

---

### 3.13 Notifications

| Atribut | Tip | Omejitve | Opis |
|---|---|---|---|
| id | UUID / BIGINT | PK | Identifikator |
| user_id | UUID / BIGINT | FK -> User.id, NOT NULL | Prejemnik |
| reservation_id | UUID / BIGINT | FK -> Reservation.id | Povezana rezervacija |
| type | ENUM('reservation_created','reservation_confirmed','reservation_rejected','reservation_cancelled','reminder') | NOT NULL | Tip obvestila |
| channel | ENUM('email') | NOT NULL, DEFAULT 'email' | Kanal |
| subject | VARCHAR(255) | | Zadeva |
| body | TEXT | | Vsebina |
| status | ENUM('pending','sent','failed') | NOT NULL, DEFAULT 'pending' | Stanje |
| sent_at | TIMESTAMP | | Čas pošiljanja |
| created_at | TIMESTAMP | NOT NULL | |

---

## 4. Relacije (povzetek)

- User 1:1 Customer
- User 1:1 SalonManager
- SalonManager 1:1 Salon
- User 1:1 NailArtist
- Salon 1:N NailArtist
- Salon 1:N Service
- Service N:M NailArtist (prek ServiceArtist)
- ServiceCategory 1:N Service
- NailArtist 1:N WorkingHours
- NailArtist 1:N AvailabilitySlot
- Customer 1:N Reservation
- Salon 1:N Reservation
- NailArtist 1:N Reservation
- Service 1:N Reservation
- AvailabilitySlot 1:1 Reservation (aktivna)
- Reservation 1:N InspirationPhoto
- User 1:N Notification
- Reservation 1:N Notification
- Customer 1:N ContactMessage 
- Salon 1:N ContactMessage

---

