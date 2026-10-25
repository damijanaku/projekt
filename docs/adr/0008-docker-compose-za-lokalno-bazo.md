

# Lokalni PostgreSQL zaženemo z Docker Compose

## Kontekst in problem

Razvijalci potrebujejo lokalno podatkovno bazo, ki je po različici in konfiguraciji čim bolj podobna skupnemu okolju. Ročne namestitve PostgreSQL se razlikujejo med operacijskimi sistemi in lahko otežijo ponovljiv zagon projekta. Celotne aplikacije za MVP ni treba zapakirati v vsebnike.

## Obravnavane možnosti

* PostgreSQL kot vsebnik, upravljan z Docker Compose.
* PostgreSQL, nameščen neposredno na vsakem računalniku razvijalca.
* Oddaljena razvojna podatkovna baza v skupni rabi.

## Izid odločitve

Izbrana možnost: **Docker Compose za lokalno podatkovno bazo**, ker ekipi omogoča ponovljivo različico in konfiguracijo PostgreSQL z enim postopkom zagona. Frontend in backend se med razvojem lahko še naprej zaženeta neposredno z Node.js.

## Posledice

* Dobro: razvijalci uporabljajo enako različico baze in lažje ponovijo lokalno okolje.
* Dobro: lokalno bazo je mogoče zagnati in ustaviti neodvisno od aplikacije.
* Slabo: razvijalci morajo namestiti Docker in razumeti upravljanje vsebnikov
* Slabo: konfiguracijo, različice slike in občutljive poverilnice je treba vzdrževati in varno upravljati.
