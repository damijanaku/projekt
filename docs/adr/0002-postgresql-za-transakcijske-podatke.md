
# Uporabimo PostgreSQL za transakcijske podatke

## Kontekst in problem

Podatki o uporabnikih, salonih, storitvah, artistih, terminih in rezervacijah so med seboj povezani. Sistem mora uveljavljati tuje ključe in hkrati varno obdelati sočasne poskuse rezervacije istega termina. Izbrati moramo podatkovno shrambo, ki podpira relacije in zanesljive transakcije.

## Obravnavane možnosti

* PostgreSQL kot relacijska podatkovna baza.
* Dokumentna baza brez relacijskega modela.
* Podatkovna baza SQLite

## Izid odločitve

Izbrana možnost: **PostgreSQL**, ker relacije, omejitve, transakcije in zaklepanje omogočajo preverjanje celovitosti rezervacij tudi ob sočasnih zahtevah. Strukturirani podatkovni model NailBabe se dobro ujema z relacijsko bazo.

## Posledice

* Dobro: povezave in omejitve je mogoče uveljavljati v podatkovni plasti.
* Dobro: transakcije zmanjšajo tveganje dvojnih rezervacij in delno zapisanih sprememb.
* Slabo: treba je upravljati shemo, migracije, povezave in varnostne kopije baze.
* Slabo: spremembe sheme zahtevajo usklajene migracije in objavo aplikacije.
