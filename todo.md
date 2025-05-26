# Muistiinpanot ja TODO

## Todo next:

-   [x] optimoi käyttämällä lazy() latausta
-   [x] pisteet pois näkyvistä, siirrä console.logiin (muutkin ylimääräiset piiloon tai jotenkin vielä silleen, että näkee paremmin miltä pitää näyttää)
-   [x] basetason ottamisessa tee kameraikkunasta näyttävämpi ja joku teksti että asetetaan nollatasoa
-   [x] toptason ottamisessa jokin pistepalkki, jossa näkyy sen hetkinen taso ja myös taso jolla kuva on sillähetkellä
-   [ ] pistetaulukko tyylikkäämmäksi ja sinne overallscore oliskohan palkki, jossa näkyy mistä osista koostuu kokonaispisteet
-   [ ] tallennetaan kuva joka sai parhaat pisteet!

## Todo myöhemmin

-   [ ] Heatmap-selite, miksi luokittelee (ja tämä pitää olla verrattuna siihen vuorossa olevaan luokittelutermiin!??)
-   [ ] vitest, (lisätty, ei käytetä vielä mihinkään)
-   [ ] pelkkä frontti, vaatii sen routejutun buildiin
-   [ ] pisteiden näkymään muiden pelaajien pisteet?! eli vähän niinkuin opettajanäkymä?
-   [ ] Etukameraksi vaihtaminen tökkii, kysy Nick

-   [x] heatmapcomponent -> TeachableModel CAM

## Muistiinpanoja:

aloitetaan seuraavasta:

-   [x] ottaa kuvan
-   [x] luokittelee kuvan
-   [ ] heatmap kuvasta

redis jos tarvetta jakaa global state

Nicolas kertoo myöhemmin tästä lisää: Store.gen-ai-fi kuville ja mallille

Mallin korkkaus, jotta voi käyttää heatMappia? Tai ennemmin siis toki valmiin komponentin käyttö, että miten tuosta saisi irti tuosta Teachable Modelista.
</br>Nicolas tekee tiistaiksi (27.5.2025)

# Questions

### Questions to Nicolas

-   [ ] Heatmap-selite, miksi luokittelee (ja tämä pitää olla verrattuna siihen vuorossa olevaan luokittelutermiin!??) kysy onko mahdolista

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

# Bias Game

key idea:
First students are taught the basic consepts of classification bias with game 1
After students have learned the consepts of classification biases, the try to exploit them in game 2

# Game 1 (Exploring Biases)

asdasdasd

# Game 2 (Bias Exploitation Game)

key idea:

1. There is a given occupation or feature = term
2. 1st we take baselane of how well the video is classified as that term
3. Student tries to get as good as classification result as she or he can (there is limited oppoturnities so biases should be exploited to get maximal score)
4. Students see scoreboard of how they succeeded

5. ?? teacher selects occupation from list and free-for-all with only "topScore". Scoreboard visible??

Saman kaverin luokittelu ammattiin taustalla?
Saman kaverin luokittelu (joku tunnettu fiksu kuten Einstein)

Edellinen voi myös jatkua tähän, että laitetaan niihin edellisiin kuviin joku julkkis ja kone ennustaa sille jotain?

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
