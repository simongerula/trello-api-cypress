# Despegar Flightsearch Automation
***
### Automated test interacting with the Trello API.
### This framework was made with Cypress 10.

###  The automation has 4 tests.
1. It should connect Trello API and get "board-one".
2. It should have two lists "column-one" and "column-two" in "board-one".
3. It should have "card-one" and "card-two" in "column-one".
4. It should delete and not find "card-one" in "column-one".

At the end of the last test, the letter "card-one" is generated again in "column-one"
