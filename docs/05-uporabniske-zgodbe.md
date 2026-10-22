# Uporabniške zgodbe – NailBabe

Zgodbe izhajajo iz funkcionalnosti in uporabniških vlog, opredeljenih v [funkcionalnostih in obsegu](../02-funkcionalnosti-in-obseg.md). Funkcionalnost registracije in prijave je dodana kot samostojna zgodba, ker je navedena v opisu vlog in poteku rešitve.

## US-01 – Registracija in prijava

**Povezana funkcionalnost:** Registracija in prijava (podpora uporabniškim vlogam)  
**Uporabniška vloga:** Stranka, vodja salona, nail artist

**Uporabniška zgodba:** Kot stranka, vodja salona ali nail artist se želim registrirati in prijaviti z ustrezno vlogo, da lahko uporabljam funkcije, namenjene svojemu računu.

**Acceptance criteria:**
- Ob registraciji stranka ali vodja salona vnese ime, e-poštni naslov in geslo ter izbere ustrezno vlogo; račun nail artista se ustvari prek povabila vodje salona in poveže z njegovim salonom.
- Sistem zavrne registracijo z že uporabljenim e-poštnim naslovom in prikaže razumljivo napako.
- Po uspešni registraciji oziroma sprejetju povabila se uporabnik lahko prijavi z registriranim e-poštnim naslovom in geslom.
- Prijavljen uporabnik lahko dostopa samo do funkcij, dovoljenih njegovi vlogi.

## US-02 – Iskanje salonov

**Povezana funkcionalnost:** 1 – Iskanje salonov po regiji in kategoriji  
**Uporabniška vloga:** Stranka

**Uporabniška zgodba:** Kot stranka želim iskati salone po regiji, kategoriji storitve ali nazivu, da hitro najdem salon in ekipo, ki ustrezata mojim željam.

**Acceptance criteria:**
- Rezultate je mogoče filtrirati po regiji in kategoriji; mogoče je iskati tudi po delu naziva salona.
- Pri uporabi več filtrov so prikazani samo saloni, ki ustrezajo vsem izbranim filtrom.
- Rezultat prikaže vsaj naziv salona, regijo in povezavo do profila.
- Če ni ujemanj, sistem prikaže sporočilo, da rezultatov ni.

## US-03 – Pregled profila salona

**Povezana funkcionalnost:** 2 – Profil salona z galerijo del  
**Uporabniška vloga:** Stranka

**Uporabniška zgodba:** Kot stranka želim pregledati profil salona z galerijo, storitvami, cenami, delovnim časom in lokacijo, da lahko presodim, ali salon ustreza mojim potrebam.

**Acceptance criteria:**
- Profil prikaže naziv, opis, lokacijo, regijo, kontaktne podatke in delovni čas salona.
- Profil prikaže objavljene storitve z nazivom, trajanjem in ceno.
- Profil prikaže nail artiste salona in njihove objavljene specializacije.
- Galerija prikaže objavljene fotografije del salona.
- Če salon podatka ali fotografije še ni objavil, je ta del označen kot nedostopen oziroma prazen in ne povzroči napake strani.

## US-04 – Objava storitev in terminov

**Povezana funkcionalnost:** 3 – Objava storitev in razpoložljivih terminov  
**Uporabniška vloga:** Vodja salona

**Uporabniška zgodba:** Kot vodja salona želim objaviti storitve in določiti, kateri nail artisti jih izvajajo, da stranke lahko izberejo ustrezno storitev in izvajalca.

**Acceptance criteria:**
- Vodja salona lahko ustvari storitev z nazivom, trajanjem, ceno in kategorijo.
- Sistem zavrne storitev brez naziva, trajanja ali veljavne nenegativne cene.
- Vodja lahko poveže storitev z enim ali več artisti iz svojega salona.
- Nail artist lahko objavi svoje proste termine znotraj nastavljenih delovnih ur; sistem zavrne prekrivanje z drugim njegovim terminom.

## US-05 – Rezervacija s fotografijo

**Povezana funkcionalnost:** 4 – Rezervacija termina z inspiracijsko fotografijo  
**Uporabniška vloga:** Stranka

**Uporabniška zgodba:** Kot stranka želim izbrati storitev, nail artista in njegov prost termin ter po želji priložiti inspiracijsko fotografijo, da izberem izvajalca, ki ustreza mojim željam.

**Acceptance criteria:**
- Rezervacija zahteva izbiro storitve, artista, ki jo izvaja, in njegovega trenutno prostega termina.
- Fotografija je neobvezna; če jo stranka priloži, sistem sprejme samo slikovno datoteko do 10 MB.
- Po oddaji sistem prikaže povzetek salona, storitve in izbranega termina ter stanje »čaka na potrditev«.
- Če termin med izbiro in oddajo ni več prost, sistem rezervacije ne ustvari in stranki omogoči izbiro drugega termina.

## US-06 – Odločitev o rezervaciji

**Povezana funkcionalnost:** 5 – Potrjevanje in zavračanje rezervacij  
**Uporabniška vloga:** Nail artist, vodja salona

**Uporabniška zgodba:** Kot nail artist želim pregledati sebi dodeljeno čakajočo rezervacijo in jo potrditi ali zavrniti, da lahko upravljam svoj urnik.

**Acceptance criteria:**
- Nail artist vidi rezervacije, dodeljene njemu; vodja salona vidi rezervacije vseh artistov svojega salona.
- Dodeljeni nail artist lahko potrdi ali zavrne samo sebi dodeljene čakajoče rezervacije; vodja salona lahko potrdi ali zavrne čakajoče rezervacije vseh artistov svojega salona.
- Potrjen termin se označi kot zaseden in ga ni več mogoče rezervirati.
- Sistem prepreči potrditev, če bi se termin prekrival z drugo potrjeno rezervacijo.
- Stranka prejme e-poštno obvestilo o potrditvi ali zavrnitvi.

## US-07 – Prestavitev ali odpoved

**Povezana funkcionalnost:** 6 – Prestavitev in odpoved rezervacije  
**Uporabniška vloga:** Stranka, nail artist, vodja salona

**Uporabniška zgodba:** Kot stranka, nail artist ali vodja salona želim prestaviti ali odpovedati rezervacijo v skladu s pravili odpovedi, da se urnik lahko posodobi, kadar se načrti spremenijo.

**Acceptance criteria:**
- Stranka lahko spreminja samo svoje rezervacije; nail artist lahko spreminja sebi dodeljene rezervacije, vodja salona pa rezervacije artistov svojega salona.
- Sistem pred izvedbo odpovedi ali prestavitve preveri veljavno časovno omejitev za odpoved.
- Za prestavitev je treba izbrati drug prost termin; prvotni termin se sprosti šele, ko je sprememba uspešna.
- Po spremembi sta status in termin rezervacije posodobljena; stranka, dodeljeni artist in vodja salona prejmejo e-poštno obvestilo.

## US-08 – E-poštna obvestila

**Povezana funkcionalnost:** 7 – E-poštna obvestila  
**Uporabniška vloga:** Stranka, nail artist, vodja salona

**Uporabniška zgodba:** Kot stranka, nail artist ali vodja salona želim prejemati e-poštna obvestila o rezervaciji in spremembah, da pravočasno vem, kaj se dogaja s terminom.

**Acceptance criteria:**
- Ob oddaji rezervacije sistem pošlje stranki potrdilo o prejemu zahteve.
- Ob potrditvi, zavrnitvi, prestavitvi ali odpovedi sistem pošlje obvestilo stranki, dodeljenemu artistu in vodji salona.
- Obvestilo vsebuje salon, datum in uro termina ter trenutno stanje rezervacije.
- Sistem pošlje opomnik 24 ur pred potrjeno rezervacijo.

## US-09 – Kontaktni obrazec

**Povezana funkcionalnost:** 8 – Kontaktni obrazec med stranko in salonom  
**Uporabniška vloga:** Stranka

**Uporabniška zgodba:** Kot stranka želim salonu poslati vprašanje prek kontaktnega obrazca, da lahko dobim informacije pred rezervacijo.

**Acceptance criteria:**
- Obrazec zahteva ime, veljaven e-poštni naslov, sporočilo in izbrani salon.
- Sistem zavrne prazno sporočilo ali neveljaven e-poštni naslov ter označi polje z napako.
- Po uspešni oddaji sistem prikaže potrditev pošiljanja.
- Sporočilo je poslano na kontaktni e-poštni naslov izbranega salona in ni prikazano drugim salonom.

## US-10 – Urnik salona

**Povezana funkcionalnost:** 9 – Pregled urnika salona (dnevni/tedenski)  
**Uporabniška vloga:** Nail artist, vodja salona

**Uporabniška zgodba:** Kot nail artist ali vodja salona želim pregledati urnik, da lahko načrtujem delo; artist vidi svoje rezervacije, vodja pa urnik celotne ekipe.

**Acceptance criteria:**
- Uporabnik lahko preklopi med dnevnim in tedenskim pogledom.
- Urnik prikaže datum, čas, storitev in stanje vsake rezervacije.
- Artist vidi samo svoje rezervacije; vodja vidi rezervacije artistov svojega salona.
- Izbira drugega dne ali tedna posodobi prikazane rezervacije na izbrano obdobje.

## US-11 – Zgodovina rezervacij

**Povezana funkcionalnost:** 10 – Zgodovina rezervacij stranke  
**Uporabniška vloga:** Stranka

**Uporabniška zgodba:** Kot stranka želim pregledati svoje pretekle in prihodnje rezervacije, da imam evidenco obiskov in prihajajočih terminov.

**Acceptance criteria:**
- Stranka vidi samo rezervacije, ki so povezane z njenim računom.
- Rezervacije so razdeljene na prihodnje in pretekle.
- Vsak zapis prikaže salon, storitev, datum, uro in stanje rezervacije.
- Če stranka še nima rezervacij, sistem prikaže prazno stanje z razlago.

## US-12 – Statistika salona

**Povezana funkcionalnost:** 11 – Osnovna statistika za salon  
**Uporabniška vloga:** Vodja salona

**Uporabniška zgodba:** Kot vodja salona želim videti osnovno statistiko rezervacij, da lahko spremljam zasedenost salona in ekipe.

**Acceptance criteria:**
- Statistika prikazuje število rezervacij in zasedenost za izbrano obdobje.
- Vodja lahko izbere obdobje, za katero se izračunajo podatki.
- V izračun so vključene potrjene rezervacije, odpovedane pa niso štete kot zasedenost.
- Prikaz vključuje izbrano obdobje in jasno označene enote oziroma števila.

## US-13 – Evidenca opravljenih storitev in neprihodov

**Povezana funkcionalnost:** 12 – Oznaka »no-show« in opravljenih storitev  
**Uporabniška vloga:** Nail artist, vodja salona

**Uporabniška zgodba:** Kot nail artist želim po terminu označiti storitev kot opravljeno ali stranko kot neprihod, da je evidenca rezervacij ažurna.

**Acceptance criteria:**
- Artist lahko spremeni status sebi dodeljene rezervacije; vodja lahko spremeni status rezervacije v svojem salonu.
- Status »opravljeno« ali »neprihod« je mogoče nastaviti šele po času termina.
- Rezervaciji je mogoče nastaviti samo en končni status.
- Posodobljeni status je viden v urniku in zgodovini rezervacije.

## US-14 – Upravljanje kategorij

**Povezana funkcionalnost:** 13 – Upravljanje kategorij storitev  
**Uporabniška vloga:** Administrator

**Uporabniška zgodba:** Kot administrator želim dodajati, urejati in brisati kategorije storitev, da so storitve salonov razvrščene enotno.

**Acceptance criteria:**
- Administrator lahko ustvari kategorijo z obveznim nazivom.
- Sistem zavrne prazen ali že obstoječ naziv kategorije.
- Administrator lahko spremeni naziv obstoječe kategorije.
- Kategorije, ki je že uporabljena pri storitvah, sistem ne izbriše brez opozorila in potrditve.

## US-15 – Upravljanje uporabnikov

**Povezana funkcionalnost:** 14 – Upravljanje uporabnikov  
**Uporabniška vloga:** Administrator

**Uporabniška zgodba:** Kot administrator želim pregledati in aktivirati, deaktivirati ali izbrisati uporabniški račun, da lahko vzdržujem varno in urejeno platformo.

**Acceptance criteria:**
- Administrator lahko poišče račun po e-poštnem naslovu in vidi njegovo vlogo ter stanje.
- Administrator lahko račun aktivira ali deaktivira; deaktiviran uporabnik se ne more prijaviti.
- Pred izbrisom računa sistem prikaže povzetek izbranega računa in zahteva potrditev.
- Administrator ne more pregledati ali pridobiti uporabnikovega gesla.
