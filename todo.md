# Muistiinpanot ja TODO

## Todo

-   [x] kielet, käytä samaa
-   [ ] vitest, (lisätty, ei käytetä vielä mihinkään)
-   [ ] pelkkä frontti, vaatii sen routejutun buildiin
-   [x] lint ja prettier configit
-   [x] tsconfig.json

-   [x] heatmapcomponent -> TeachableModel CAM

## Muistiinpanoja:

aloitetaan seuraavasta:

-   [x] ottaa kuvan
-   [x] luokittelee kuvan
-   [ ] heatmap kuvasta

try to use function, top level atleast

import style

viewsit erikseen ja komponentit erikseen

services vähän niinkun se olis backednissä

utils normi settiä

teachable machine tulee knicosin gitistä

etsi modelsseja (verkkoselaimella toimivia)

opeta mallia lisää

redis jos tarvetta jakaa global state

Nicolas kertoo myöhemmin tästä lisää: Store.gen-ai-fi kuville ja mallille

Mallin korkkaus, jotta voi käyttää heatMappia? Tai ennemmin siis toki valmiin komponentin käyttö, että miten tuosta saisi irti tuosta Teachable Modelista.
</br>Nicolas tekee tiistaiksi (27.5.2025)

-   [ ] optimoi myöhemmin käyttämällä lazy() latausta

# Questions

### Questions to Nicolas

### Questions to someone/ Matti

SAP Cats

# Ideas

## Käyttäjä toteuttaa vääristymän ja luokittelija myös

Kolmiportainen tehtävä
Ihminen "antaa" sen vääristymän??

1. Käyttäjä maalaa, että mistä voidaan tunnistaa vaikkapa opettaja (tausta viittaa siihen)

-   ja saa pisteet siitä miten hyvin osui luokittelijan tunnistamiin piirteisiin

näitä useita

2. Käyttäjä maalaa, että mistä voidaan tunnistaa "piirre" -kuten sukupuoli samasta kuvasta (olisko nainen tai muun-sukupuolinen ja mies tai muun-sukupuolinen)

-   ja saa pisteet siitä miten hyvin osui luokittelijan tunnistamiin piirteisiin

näitä useita

3. Feikki loading-screen jonka aikana selitetään, että miksi vinouma syntyy, per kuva?

4. Luokittelija tunnistaa sukupuolen taustasta? (valmiiksi opetettu vinoon)

-   loppunäkymä jossa näytetään pisteet ja miten luokittelija oppi vinouman

## Ammattiluokittelu

Saman kaverin luokittelu ammattiin taustalla?
Saman kaverin luokittelu (joku tunnettu fiksu kuten Einstein)

Edellinen voi myös jatkua tähän, että laitetaan niihin edellisiin kuviin joku julkkis ja kone ennustaa sille jotain?

# Keskustelu 22.5.

vaikka 5 erilaista ammattiryhmää ja yhdistetään joihinkin piirteisiin

peli kahdessa osassa,

1. opetetaan mitä se on
   multiple features.

-   outside/ inside
-   muuta taustasta..
-   gender
-   age
-   style (vaatetus)
-   muuta frontista..

2. opetetaan miten sitä "käytetään hyödyksi"

tallennetaan se

-
-   kuka saa parannettua tulostaan eniten
-   näyttää enemmän joltain
-

# Bias Exploitation Game

## Esimerkkiluokkia

### Ammatit

// TODO: muuta nää sitten sukupuolineutraaleiksi

-   Opettaja
-   Vanki
-   Johtaja
-   Liikemies
-   Rakennustyömies (sähköasentaja tai joku toinen tarkempi sopii myös?)
-   Kokki
-   Metsästäjä
-   Taiteilija
-   Parturi
-   ...

### Frontground

-   sex
-   age
-   style (vaatetus)
-   ...

### Background

-   outside / inside
