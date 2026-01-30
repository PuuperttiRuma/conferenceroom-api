#!/bin/bash

# Configuration
RES_ID="$1"

if [ -z "$RES_ID" ]; then
    echo "Usage: $0 <reservation_id>"
    exit 1
fi

URL="http://localhost:3000/api/reservations/$RES_ID"

echo "Canceling reservation: $RES_ID"

curl -v -X DELETE "$URL"

echo -e "\n"
