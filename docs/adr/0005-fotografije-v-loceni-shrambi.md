
# Fotografije hranimo ločeno od relacijske baze

## Kontekst in problem

Stranke lahko rezervaciji priložijo inspiracijske fotografije, saloni pa lahko objavijo fotografije svojih del. Slike so velike binarne datoteke in imajo drugačne zahteve glede dostave ter prostora kot strukturirani zapisi rezervacij. Potrebujemo način hrambe, ki ohranja povezavo med datoteko in njenim lastnikom.

## Obravnavane možnosti

* Objektna ali datotečna shramba; v PostgreSQL hranimo reference in metapodatke.
* Binarne datoteke hranimo neposredno v PostgreSQL.
* Datoteke hranimo samo na lokalnem disku aplikacijskega strežnika.

## Izid odločitve

Izbrana možnost: **ločena objektna oziroma datotečna shramba z referencami v PostgreSQL**, ker so slike ločene od transakcijskih podatkov, baza pa hrani lastništvo in metapodatke. To omogoča zamenjavo ponudnika shrambe brez spremembe relacijskega modela.

## Posledice

* Dobro: fotografije ne povečujejo velikosti in obremenitve relacijske baze.
* Dobro: datoteke je mogoče dostavljati in varnostno kopirati ločeno od podatkovnih zapisov.
* Slabo: treba je vzdrževati dodatno storitev in uskladiti dovoljenja dostopa do datotek.
* Slabo: baza in shramba nimata skupne transakcije; napake pri nalaganju ali brisanju zahtevajo čiščenje osirotelih datotek.
