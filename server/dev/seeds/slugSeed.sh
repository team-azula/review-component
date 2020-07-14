#!/bin/bash

echo "Starting Seed!"

for ((c=0; c<1000000; c += 1))
do
  node seedDatabase.js -slug -$c
done

echo "Seeding complete!"
