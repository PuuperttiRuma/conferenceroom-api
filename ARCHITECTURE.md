# Conference Room Reservation API - Architecture & Requirements

## Requirements
1. User can reserve a conference room for a certain time period.
2. User can cancel the reservation.
3. User can list all the reservations to a specified room.
4. The reservations to a specific room cannot overlap.
5. A room cannot be reserved in the past, ie. a room can only be reserved in the future.
6. Reservation has to start before it ends.

## Tech Stack
- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Validation:** Zod
- **Date Handling:** date-fns
- **ID Generation:** uuid
- **Testing:** Vitest & Supertest
- **Database:** In-memory (singleton repository)

## Proposed Architecture

### Layered Structure
- **Routes:** Define API endpoints and connect them to controllers.
- **Controllers:** Handle request parsing, validation (via Zod), and response formatting.
- **Services:** Implement business logic, including overlap checks and date validation.
- **Repository:** Manages in-memory data storage (Map or Array).
- **Models/Types:** TypeScript interfaces for reservations.

### API Endpoints
- `POST /reservations`: Create a new reservation.
- `DELETE /reservations/:id`: Cancel an existing reservation.
- `GET /rooms/:roomId/reservations`: Retrieve all reservations for a specific room.
