var Express = require('express');
var Index = require('serve-index')
var Axios = require('axios')
var RateLimiter = require('request-rate-limiter');
var app = Express();

const API_KEY = 'NOT DISCLOSED';

// Routes
app.get('/about', aboutHandler);
app.get('/lookupSummoner', lookupSummonerHandler);
app.get('/lookupGames', lookupGamesHandler);
app.get('/lookupGame', lookupGameHandler);
app.get('/lookupChampions', lookupChampionsHandler);
app.get('/lookupItems', lookupItemsHandler);
app.get('/lookupSpells', lookupSpellsHandler);

// Routes for static files
app.use(Express.static('./dist'));

// Start listening
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

function lookupSummonerHandler(req, res) {
  let summonerName = req.query['summonerName'];
  let url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+summonerName+'?api_key='+API_KEY;
  lookup(url, res);
}

function lookupGamesHandler(req, res) {
  let accountId = req.query['accountId'];
  let url = 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/'+accountId+'/recent?api_key='+API_KEY;
  lookup(url, res);
}

function lookupGameHandler(req, res) {
  let gameId = req.query['gameId'];
  let url = 'https://na1.api.riotgames.com/lol/match/v3/matches/'+gameId+'?api_key='+API_KEY;
  lookup(url, res);
}

// Cache champions
var champions = null;

function lookupChampionsHandler(req, res) {
  if (champions === null) {
    limiterGet('https://na1.api.riotgames.com/lol/static-data/v3/champions?api_key='+API_KEY)
    .then(function(response) {
      champions = JSON.stringify(response.body);

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(champions);
    })
    .catch(function (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Error processing request');
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(champions);
  }   
}

// Cache items 
var items = null;

function lookupItemsHandler(req, res) {
  if (items === null) {
    limiterGet('https://na1.api.riotgames.com/lol/static-data/v3/items?api_key='+API_KEY)
    .then(function(response) {
      items = JSON.stringify(response.body);

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(items);
    })
    .catch(function (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Error processing request');
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(items);
  }   
}

// Cache spells
var spells = null;

function lookupSpellsHandler(req, res) {
  if (spells === null) {
    limiterGet('https://na1.api.riotgames.com/lol/static-data/v3/summoner-spells?dataById=true&api_key='+API_KEY)
    .then(function(response) {
      spells = JSON.stringify(response.body);

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(spells);
    })
    .catch(function (error) {
      conole.log('Error: '+error);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Error processing request');
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(spells);
  }   
}

//
// Utility functions
//

// Request a rate limited URL
// (Returns a promise)

var limiter = new RateLimiter({
      rate: 20              // requests per interval,
    , interval: 10          // interval for the rate, x requests per interval,
    , backoffTime: 10       // back off for n seconds,
    , maxWaitingTime: 60    // return errors for requests
});

function limiterGet(url) {
  return limiter.request( { url: url, method: 'get'});
};

// Keep track of request count for status messages
count = 0;

// Generic 'lookup' function
function lookup(url, res) {
  let thisCount = ++count;
  console.log('Making request '+thisCount+'...');

  limiterGet(url)
  .then(function(response) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(response.body));

    console.log('...done '+thisCount);
  })
  .catch(function (error) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Error processing request');

    console.log('...done '+thisCount+' with error: '+error);
  });   
}
