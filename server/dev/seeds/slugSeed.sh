#!/bin/bash

echo "Starting Seed!"

for ((c=0; c<1000000; c += 100000))
do
  node seedDatabase.js -slug -$c
  echo "Sleeping for 30 seconds : Last Insert Modifier: $c "
  sleep 30
done

echo "Seeding complete!"
