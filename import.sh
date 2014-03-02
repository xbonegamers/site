#!/bin/bash

~/Downloads/mongodb-osx-x86_64-2.4.9/bin/mongo gamerfriends --eval "db.gamers.remove()";
~/Downloads/mongodb-osx-x86_64-2.4.9/bin/mongoimport --db gamerfriends --collection gamers --file gamers.json --jsonArray
