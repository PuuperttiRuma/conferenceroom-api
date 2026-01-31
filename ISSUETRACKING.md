- [x] Käy tiedostot läpi.
    - [x] index
    - [x] api
    - [x] reservationRoutes
    - [x] middleware/validation
    - [x] reservationControllers.ts
    - [x] ReservationService.ts 
    - [x] ReservationRepository.ts
    - [x] models/Reservation.ts
    - [x] testit 

## Yleistä
- [x] Tyyppi importit explisiittisiksi
- [ ] 

## reservationRoutes.ts
- [ ] Vaihda controlloreiden nimet postReservation muotoon
- [ ] Luo hae huoneet end point
- [ ] Tee dummy huonelistaus (vain id?)
- [ ] 

## middleware/validation.ts
- [x] Fix typescript errors
- [x] Rename validation function

## reservationControllers.ts
- [ ] Pitkä try catch createssa
- [ ] line 20: error any 
- [ ] Cancel: ei validoi onko ID:tä
- [ ] listRoom: ei validoi onko ID:tä 
- [ ] 

## service ja Repo
- [ ] Delete ei tarkista ID:Tä
- [ ] 

# Testit
## ReservationService
- [x] should create a reservation
- [x] should cancel a reservation
## ReservationRoutes
- [x] should return 400 for invalid data
- [ ] 
