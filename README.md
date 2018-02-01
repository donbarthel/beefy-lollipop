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
