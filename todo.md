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
-                         luokittelee kuvan
-                         heatmap kuvasta

try to use function, top level atleast

import style

viewsit erikseen ja komponentit erikseen

services vähän niinkun se olis backednissä

utils normi settiä

teachable machine tulee knicosin gitistä

etsi modelsseja (verkkoselaimella toimivia)

opeta mallia lisää

redis jos tarvetta jakaa global state

-   optimoi myöhemmin käyttämällä lazy() latausta

-   [x] Dmitry, Semenov, kysy tipun lätkästä, UEFIN sähköpostilla (sähköpostilähetetty 20.5.2025)

# Questions to Nicolas

Webcam, single picture from component?

Store.gen-ai-fi kuville?

Mallin korkkaus, jotta voi käyttää heatMappia? Tai ennemmin siis toki valmiin komponentin käyttö, että miten tuosta saisi irti tuosta Teachable Modelista.

# Questions to someone/ Matti

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
