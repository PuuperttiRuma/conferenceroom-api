#!/bin/bash

# Configuration
ROOM_ID="${1:-Conference-Room-1}"
URL="http://localhost:3000/api/rooms/$ROOM_ID/reservations"

echo "Listing reservations for room: $ROOM_ID"

curl -X GET "$URL"

echo -e "\n"
