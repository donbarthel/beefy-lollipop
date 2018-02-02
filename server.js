// Beefy Lollipop server - uncopyright (u)2018 by Don Barthel don.barthel@gmail.com

var Express = require('express');
var Index = require('serve-index')
var Axios = require('axios')
var RateLimiter = require('request-rate-limiter');
var app = Express();

//const API_KEY = 'NOT DISCLOSED';
const API_KEY = 'RGAPI-ad389637-7b68-46e6-95c0-99ffac5eed69';

// Routes
app.get('/about', aboutHandler);
app.get('/lookupChampions', lookupChampionsHandler);
app.get('/lookupItems', lookupItemsHandler);
app.get('/lookupSpells', lookupSpellsHandler);
app.get('/lookupSummoner', lookupSummonerHandler);
app.get('/lookupGames', lookupGamesHandler);
app.get('/lookupGame', lookupGameHandler);

// Routes for static files
app.use(Express.static('./dist'));

// Start listening (the port is assigned randomly by my webhost from their firewall, you will have to assign a different one maybe 80)
app.listen(20873, function() {
  console.log('Listening on port 20873');
});

//
// Handlers for routes
//

function aboutHandler(req, res) {
  console.log(req);
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('BattleFy League Of Legends Stats App Server by Don Barthel');
}

function lookupChampionsHandler(req, res) {
  let url = 'https://na1.api.riotgames.com/lol/static-data/v3/champions?api_key='+API_KEY;
  lookup(url, res, 'champions', true);
}

function lookupItemsHandler(req, res) {
  let url = 'https://na1.api.riotgames.com/lol/static-data/v3/items?api_key='+API_KEY;
  lookup(url, res, 'items', true);
}

function lookupSpellsHandler(req, res) {
  let url = 'https://na1.api.riotgames.com/lol/static-data/v3/summoner-spells?dataById=true&api_key='+API_KEY;
  lookup(url, res, 'spells', true);
}

function lookupSummonerHandler(req, res) {
  let summonerName = req.query['summonerName'];
  let url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+summonerName+'?api_key='+API_KEY;
  lookup(url, res, 'summoner '+summonerName);
}

function lookupGamesHandler(req, res) {
  let accountId = req.query['accountId'];
  let url = 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/'+accountId+'/recent?api_key='+API_KEY;
  lookup(url, res, 'summoner games for summoner account id '+accountId);
}

function lookupGameHandler(req, res) {
  let gameId = req.query['gameId'];
  let url = 'https://na1.api.riotgames.com/lol/match/v3/matches/'+gameId+'?api_key='+API_KEY;
  lookup(url, res, 'summoner game '+gameId);
}


//
// Utility functions
//

var limiter = new RateLimiter({
      rate: 20              // requests per interval,
    , interval: 10          // interval for the rate, x requests per interval,
    , backoffTime: 10       // back off for n seconds,
    , maxWaitingTime: 60    // return errors for requests
});

// Request a rate limited URL
// (Returns a promise)
function limiterGet(url) {
  return limiter.request( { url: url, method: 'get'});
};

let count = 0;            // Keep track of request count for status messages
let responseBodies = {};  // Cache responses

// Generic 'lookup' function
// Optionally cache the result
function lookup(url, res, cacheKey, cacheIt = false) {
  let thisCount = ++count;
  console.log('Making request '+thisCount+' ('+cacheKey+')...');

  if (!cacheIt || !(cacheKey in responseBodies)) {
    limiterGet(url)
    .then(function(response) {
      let responseObj = JSON.parse(response.body);
      if (responseObj['status'] && responseObj['status']['status_code'] && responseObj['status']['status_code'] !== 200) {
        let errorMsg = responseObj['status']['status_code']+' '+responseObj['status']['message']+'"';
        res.writeHead(responseObj['status']['status_code'], {
          'Content-Type': 'text/plain'
        });
        res.end('Origin returned "'+errorMsg);

        console.log('...done '+thisCount+' with error: '+errorMsg);
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(response.body);

        if (cacheIt)
          responseBodies[cacheKey] = response.body;

        console.log('...done '+thisCount);
      }
    })
    .catch(function (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(error);

      console.log('...done '+thisCount+' with error: '+error);
    });
  } else {
    // Use cached response
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(responseBodies[cacheKey]);

    console.log('...done '+thisCount);
  }
}
