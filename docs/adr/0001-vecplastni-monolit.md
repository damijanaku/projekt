# Uporabimo večplastni backend monolit

## Kontekst in problem

NailBabe mora za MVP ponuditi API, poslovna pravila za rezervacije, avtentikacijo in dostop do podatkovne baze. Ekipa in obseg sta majhna, zato bi več samostojno nameščenih servisov povečalo število premikajočih se delov. Potrebujemo pa dovolj jasne meje, da se lahko sistem pozneje razvija.

## Obravnavane možnosti

* Večplastni monolit z ločenimi moduli za API, poslovno logiko, podatke in zunanje storitve.
* Nabor mikroservisov, razdeljenih po poslovnih področjih.
* serverless izvajanje posameznih funkcij.

## Izid odločitve

Izbrana možnost: **večplastni monolit**, ker omogoča enostaven razvoj in namestitev MVP-ja, hkrati pa ločene plasti ohranjajo odgovornosti pregledne. Za obseg projekta samostojno skaliranje posameznih storitev še ne odtehta stroškov njihovega upravljanja.

## Posledice

* Dobro: enostavnejši lokalni razvoj, razhroščevanje, transakcije in objava.
* Dobro: modularne meje omogočajo poznejšo razdelitev, če jo utemeljijo potrebe.
* Slabo: posamezne komponente ni mogoče neodvisno namestiti ali skalirati.