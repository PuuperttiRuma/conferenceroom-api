# Analyysi
## 1. Mitä tekoäly teki hyvin?
Kaikin puolin AI teki yllättävän hyvää jälkeä. Koodi toimi käytännössä ensimmäisen iteroinnin jälkeen, pois lukien testit. Tehtävänannossa ei testejä pyydetty tekemään, ja ehkä olisi pitänyt lisätä ne jälkikäteen, mutta kyllähän sellaiset on kunnollisessa tuotantovalmiissa koodissa oltava. Erityisesti hyvää oli, että tekoäly osasi ehdottaa zodia ja date-fns:ää. Datan validointi on luonnollisesti tärkeää API:ssa. Olin erityisen positiivisesti yllättynyt, miten kelvollinen tekoälyn ehdottama arkkitehtuuri oli. Toki on muistettava, että netti on pullollaan tämänkaltaisia API-projekteja, joten tekoälyllä on mistä kopioida.

Ensimmäisen iteraation jälkeisessä vaiheessa AI oli erittäin hyödyllinen, sillä en väitä olevani seniorkoodari ja, että muistaisin täysin ulkoa miten esim. zodin schemat toimivat tai vitestin mockaaminen. Toisaalta tämä on riski tekoälyavusteisessa ohjelmoinnissa: jos en täysin ymmärrä mitä olen tekemässä, saatan luoda ihan höpöhöpöä.

Toisekseen, pystyin myös AI:n kanssa keskustelemaan ihan parhaista käytänteistä, esimerkiksi siitä, missä virheenkäsittely pitäisi tapahtua. Se on asia, jota Googlesta tutkin aiempaa harjoitusprojektia tehdessä, enkä silloin löytänyt kelvollista vastausta.

## 2. Mitä tekoäly teki huonosti?
Ensimmäinen riippakivi oli ainakin käyttämäni Gemini Code Assistantin hirveä hinku tehdä kaikki heti. Alkuperäinen tarkoitus oli rakentaa API pikkuhiljaa yksi asia kerrallaan käyttäen TDD:tä, mutta Gemini lähtikin lapasesta ja teki koko sivuston kerralla ja poltti kaikki päivän ilmaiset tokenit siinä. Useampaan otteeseen sitä piti toppuutella tekemään yksi asia kerrallaan. Ilmaisten mallien tokenien loppuminen aiheutti sen verran päänvaivaa, että päädyin aktivoimaan maksullisen version.

Suurimmat ongelmat AI:n koodissa oli se, että se ei saanut testejä toimimaan, ja että se ei automaattisesti lähtenyt kehittämään inkrementaalisesti TDD:tä käyttäen. Se pitää erikseen siis osata promptata. Toisekseen AI:n virheenkäsittely ei ollut erityisen hyvää jatkokehitystä silmällä pitäen. Se oli toimivaa tismalleen tähän tehtävään, mutta esimerkiksi poistossa tulevat ongelmat ovat tällä hetkellä aina sitä, että yritettiin poistaa olematonta dataa.

## 3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?
Kuten yllä mainitsin, tärkeimmät parannukset oli korjata testit toimimaan ja parantaa virheenkäsittelyä. Sitä voisi parantaa vielä enemmänkin, tietenkin, mutta tässä tehtävässä annettuihin parametreihin se on mielestäni riittävä.

Lähtökohtaisesti AI teki omasta mielestäni yllättävänkin hyvää jälkeä, enkä nähnyt erityisen paljon tarvetta parantaa tai lisätä. Mahdollisesti tähän auttoi se, että kävimme alussa läpi vaatimusmäärittelyä ja arkkitehtuuria tarpeeksi, että se osasi tehdä mitä tarvittiin.

Ohjelmasta puuttuu toiminnallisuus konferenssihuoneiden listaamiseen, lisäämiseen yms. Oletettavasti niiden hallintaan pitäisi luoda toiminnallisuus, mutta tämän tehtävän vaatimusmäärittelyssä niitä ei ollut, joten keskityin tehtävään, enkä lähtenyt tätä toiminnallisuutta luomaan.

# Työpäiväkirja
Päätin kirjoittaa muistiinpanoja itselleni, avuksi analyysin tekemistä varten ja muutenkin pohtimaan AI Coding agenttien käyttöä. 

## 20.1.
Katsoin Youtubesta Gemini Code Assistant tutoriaaleja.

## 29.1.
Pääsin aloittamaan oikean implementoinnin tänään.

Muutamia aloittelijavirheitä:
- Geminin 3.0-flash mallia voi käyttää, mutta sen käyttö on hyvin rajoitettua ilmaisversiossa. Mallista loppuikin tokenit kesken projektin luomisen.
- Pitää jatkossa muistaa käskeä agentti tekemään muutokset pienissä osissa: oli tarkoitus laittaa Gemini rakentamaan API käyttäen TTD:tä, mutta sepä meni luomaan koko höskän kerralla.
- Mallien free-tierit on melkoisen rajattuja, piti lopettaa sessio melko nopeasti. Koska quota loppui :(
- Näköjään .geminiignore pitää tehdä itse. Ihmekös quota loppui kun heitti node_modulesin contextiin x_x

## 30.1.
Otin Geminin maksulliseksi niin ei tarvitse hermoilla quotan kanssa. Kävin koodin läpi ja tein muutamia korjauksia käsin.

## 31.1.
Tein lisäykset enimmäkseen AI:n avustuksella.
