#!/bin/bash

mongo gamerfriends --eval "db.gamers.remove()"
mongo gamerfriends --eval "db.games.remove()"
mongoimport --db gamerfriends --collection gamers --file gamers.json --jsonArray
mongoimport --db gamerfriends --collection games --file games.json --jsonArray
