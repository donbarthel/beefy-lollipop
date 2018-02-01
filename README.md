# beefy-lollipop

Deployed here: http://beefylollipop.com

Notes:

- Node app accepts AJAX requests but also serves client to communicate with it
- after loading a summoner, URL is modified to make it bookmarkable
- poor error handling if the summoner doesn't exist
- be sure to hover over items, spells, other summoners to see details
- the server component rate limits itself to keep LOL's servers happy
- the client component tries hard to give the user status updates during requests
- the client works hard to run things in parallel to the chagrin of the server component
(but when the server is ready to raise the request limits, the client is ready to hammer it)

All dependencies are listed in package.json except node, npm and npx. Tested with node v8.9.4.

To test:

- npm update (just once)
- node server.js (or: nodemon server.js, to run the server)
- npx parcel watch ./src/index.html --public-url . (to build automatically as files change; server.js assumes Parcel's default output of ./dist)
- npx parcel build ./src/index.html --public-url . (with minification for deployment)
