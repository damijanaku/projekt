

# E-poštna obvestila pošiljamo prek SMTP

## Kontekst in problem

Stranke, nail artisti in vodje salonov morajo prejemati potrditve, spremembe in opomnike za rezervacije. MVP potrebuje zanesljiv kanal za obvestila, vendar ne zahteva sinhrone komunikacije v živo ali SMS-sporočil. Ponudnik naj bo zamenljiv brez posega v osrednja pravila rezervacij.

## Obravnavane možnosti

* Pošiljanje e-pošte prek SMTP z uporabo poštnega ponudnika.
* Neposredna integracija z API-jem enega ponudnika e-pošte.
* SMS ali obvestila znotraj aplikacije.

## Izid odločitve

Izbrana možnost: **e-pošta prek SMTP**, ker pokriva potrditve in opomnike v MVP-ju ter loči poslovno logiko od konkretnega ponudnika. Predloge sporočil so ločene od kode pošiljanja.

## Posledice

* Dobro: SMTP je široko podprt in ponudnika je mogoče zamenjati prek konfiguracije.
* Dobro: e-pošta omogoča dostavo potrdil tudi uporabnikom, ki niso prijavljeni v aplikacijo.
* Slabo: dostava ni takojšnja ali zagotovljena; obravnavati je treba napake in ponovne poskuse.
* Slabo: aplikacija mora varno hraniti poverilnice ponudnika in preprečevati neželeno pošto.
