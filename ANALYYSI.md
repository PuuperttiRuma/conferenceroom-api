# Analyysi
## 1. Mitä tekoäly teki hyvin?
## 2. Mitä tekoäly teki huonosti?
## 3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

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

