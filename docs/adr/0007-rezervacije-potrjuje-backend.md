
# Backend potrdi rezervacije znotraj transakcije

## Kontekst in problem

Več strank lahko skoraj istočasno izbere isti prost termin. Preverjanje samo v brskalniku ali pred zapisom v bazo dopušča tekmovalne pogoje: dve zahtevi bi lahko obe videli termin kot prosti. Sistem mora zagotoviti, da se isti termin ne dodeli več kot eni aktivni rezervaciji.

## Obravnavane možnosti

* Backend preveri razpoložljivost in rezervira termin z uporabo transakcije ter ustrezne omejitve ali zaklepanja v PostgreSQL.
* Frontend skrije zasedene termine in backend zaupa poslani izbiri.
* Backend preveri termin pred zapisom, vendar brez transakcijskega zaklepanja ali omejitve.

## Izid odločitve

Izbrana možnost: **transakcijska potrditev na backendu**, ker je backend edina skupna točka, ki lahko uveljavi poslovno pravilo ob sočasnih zahtevah. Rezervacija se shrani samo, če je termin še vedno veljaven; podatkovna baza uveljavi dodatne omejitve, kjer je mogoče.

## Posledice

* Dobro: prepreči dvojno rezervacijo tudi, ko zahtevi prispeta hkrati.
* Dobro: enaka pravila veljajo za spletni, mobilni in druge odjemalce.
* Slabo: transakcije in zaklepi povečajo kompleksnost podatkovne logike.
* Slabo: ob tekmovanju mora ena od strank izbrati drug termin in razumeti, zakaj rezervacija ni uspela.
