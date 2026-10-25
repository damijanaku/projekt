# Uporabimo spletno SPA aplikacijo z REST API-jem

## Kontekst in problem

NailBabe ima različne uporabniške vloge in interaktivne poglede za iskanje salonov, profile ter upravljanje terminov. Poslovna pravila in dostop do podatkov morajo biti uveljavljeni na strežniku, uporabniški vmesnik pa se lahko spreminja neodvisno od njih. Potrebujemo preprost vmesnik med brskalnikom in backendom, ki je primeren za MVP.

## Obravnavane možnosti

* Enostranska spletna aplikacija (React, TypeScript) in JSON REST API (Express.js).
* Strežniško izrisana aplikacija z obrazci in minimalnim JavaScriptom.
* GraphQL API, ki ga uporablja enostranska aplikacija.

## Izid odločitve

Izbrana možnost: **React SPA z JSON REST API-jem**, ker podpira interaktivne poglede in jasno loči predstavitev od poslovnih pravil. REST je za omejen nabor funkcij razumljiv in enostaven za dokumentiranje; backend ostaja avtoritativen za validacijo in avtorizacijo.

## Posledice

* Dobro: frontend in backend je mogoče razvijati ter nameščati ločeno.
* Dobro: API lahko pozneje uporabljajo tudi mobilne ali druge odjemalske aplikacije.
* Slabo: za API je treba posebej upravljati različice, napake, CORS in avtentikacijo.
* Slabo: SPA prenese več dela na brskalnik in zahteva ločeno obravnavo začetnega nalaganja ter dostopnosti.
