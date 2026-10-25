
# Avtenticirajmo z JWT in avtorizirajmo vsako zahtevo na backendu

## Kontekst in problem

Platformo uporabljajo stranke, vodje salonov, nail artisti in administratorji z različnimi dovoljenji. Zaščitene API zahteve morajo dokazati identiteto uporabnika, backend pa mora pri vsakem dejanju preveriti vlogo in pripadajoči salon oziroma rezervacijo. Uporabniški vmesnik sam ne more biti varnostna meja.

## Obravnavane možnosti

* JWT žeton, preverjan na backendu, in bcrypt za zgoščevanje gesel.
* Strežniške seje s piškotki in shrambo sej.
* Avtentikacija, prepuščena zunanjemu ponudniku, brez lastnega preverjanja dovoljenj.

## Izid odločitve

Izbrana možnost: **JWT z avtorizacijo na backendu**, ker omogoča preverjanje identitete pri API zahtevah, medtem ko lahko backend dosledno uveljavi vloge in lastništvo virov. Gesla se shranjujejo samo kot bcrypt zgoščene vrednosti; skrivnosti za podpis žetonov se hranijo zunaj repozitorija.

## Posledice

* Dobro: dovoljenja se uveljavljajo na enem mestu in niso odvisna od prikaza v uporabniškem vmesniku.
* Dobro: API je uporaben za različne odjemalce brez strežniške seje za vsakega od njih.
* Slabo: preklic že izdanega žetona je zahtevnejši; treba je izbrati kratko življenjsko dobo in strategijo osveževanja.
* Slabo: napačno preverjanje lastništva lahko razkrije podatke drugega salona, zato so preverjanja virov nujna pri vsaki operaciji.
