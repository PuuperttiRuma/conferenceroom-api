#!/bin/bash

# Configuration
URL="http://localhost:3000/api/reservations"
ROOM_ID="Conference-Room-1"

# Generate future timestamps (1 hour and 2 hours from now)
# Note: Using 'date' in a way that is compatible with most Linux systems
START_TIME=$(date -u -d "+1 hour" +"%Y-%m-%dT%H:%M:%SZ")
END_TIME=$(date -u -d "+2 hours" +"%Y-%m-%dT%H:%M:%SZ")

echo "Creating reservation for room: $ROOM_ID"
echo "Start: $START_TIME"
echo "End:   $END_TIME"

curl -X POST "$URL" \
     -H "Content-Type: application/json" \
     -d "{
           \"roomId\": \"$ROOM_ID\",
           \"startTime\": \"$START_TIME\",
           \"endTime\": \"$END_TIME\"
         }"

echo -e "\n"
