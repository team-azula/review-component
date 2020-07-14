#!/bin/bash
for ((c=0; c<10000000; c += 1000000))
do
  node seedDatabase.js -slug -$c
  echo "Sleeping 1 Hour : Last Insert Modifier: $c "
  sleep 60
done
