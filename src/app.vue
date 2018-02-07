// Beefy Lollipop client - uncopyright (u)2018 by Don Barthel don.barthel@gmail.com

<template>
  <div id="app">
    <div class="box">
      <span class="serif-text">Summoner name:</span> <input v-model="summonerName" v-on:keyup.enter="lookup" placeholder="e.g. BFY Meowington">
      <button @click="lookup">Go</button>
    </div>
    <div v-for="game in games">
      <div class="box" v-bind:class="{ 'win-team': game['playerStats'][game['ourPlayerIndex']]['win'], 'loss-team': !game['playerStats'][game['ourPlayerIndex']]['win'] }">
        <div>
          <span class="serif-text">{{ game['playerStats'][game['ourPlayerIndex']]['summonerName'] }}</span>
          controls
          <span class="serif-text">{{ game['playerStats'][game['ourPlayerIndex']]['championName'] }}</span>
          to a
          {{ game['playerStats'][game['ourPlayerIndex']]['win'] ? 'Glorious Victory!' : 'loss.' }}
        </div>
        <div style="overflow: hidden">
          <div class="half-box">
            <div class="quarter-box">
              Duration: {{ game['gameDurationString'] }}
              <br /><br />{{ game['playerStats'][game['ourPlayerIndex']]['kills'] }} / {{ game['playerStats'][game['ourPlayerIndex']]['deaths'] }} / {{ game['playerStats'][game['ourPlayerIndex']]['assists'] }}
              <br />{{ Math.round(game['playerStats'][game['ourPlayerIndex']]['killDeathRatio'] * 100) / 100 }}:1 KDA
            </div>
            <div class="quarter-box">
              Level  {{ game['playerStats'][game['ourPlayerIndex']]['kills'] }}
              <br /><br />CS: {{ game['playerStats'][game['ourPlayerIndex']]['csScore'] }}
              <br />{{ Math.round(game['playerStats'][game['ourPlayerIndex']]['csScorePerMin'] * 100) / 100 }}/min
            </div>
          </div>
          <div class="half-box">
            <div class="quarter-box">
              <span>Items purchased:</span>
              <br /><span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item0Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item0Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['name'] : '(n/a)' }}</span> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item4Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item4Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['name'] : '(n/a)' }}</span>
              <br /><span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item1Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item1Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['name'] : '(n/a)' }}</span> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item5Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item5Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['name'] : '(n/a)' }}</span>
              <br /><span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item2Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item2Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['name'] : '(n/a)' }}</span> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item6Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item6Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['name'] : '(n/a)' }}</span>
              <br /><span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item3Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['plaintext'] : '(n/a)'"><img src="icon.png" width="16" height="16"> {{ items[game['playerStats'][game['ourPlayerIndex']]['item3Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['name'] : '(n/a)' }}</span>
              <br /><span>Spells:</span>
              <br /><span class="tiny-text" v-bind:title="spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['name']+' - '+spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['description']"><img src="icon.png" width="16" height="16"> {{ spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['name'] }}</span> <span class="tiny-text" v-bind:title="spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['name']+' - '+spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['description']"><img src="icon.png" width="16" height="16"> {{ spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['name'] }}</span>
            </div>
            <div class="quarter-box">
              <span>Teams:</span>
              <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][0]['color'] === 'red', 'blue-team': game['playerStats'][0]['color'] === 'blue' }" v-bind:title="(game['playerStats'][0]['summonerName']+': '+game['playerStats'][0]['kills']).toString()+' / '+(game['playerStats'][0]['deaths']).toString()+' / '+(game['playerStats'][0]['assists']).toString()+'  '+(Math.round(game['playerStats'][0]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][0]['summonerName']">{{ game['playerStats'][0]['summonerName'] }}</a></span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][5]['color'] === 'red', 'blue-team': game['playerStats'][5]['color'] === 'blue' }" v-bind:title="(game['playerStats'][5]['summonerName']+': '+game['playerStats'][5]['kills']).toString()+' / '+(game['playerStats'][5]['deaths']).toString()+' / '+(game['playerStats'][5]['assists']).toString()+'  '+(Math.round(game['playerStats'][5]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][5]['summonerName']">{{ game['playerStats'][5]['summonerName']  }}</a></span>
              <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][1]['color'] === 'red', 'blue-team': game['playerStats'][1]['color'] === 'blue' }" v-bind:title="(game['playerStats'][1]['summonerName']+': '+game['playerStats'][1]['kills']).toString()+' / '+(game['playerStats'][1]['deaths']).toString()+' / '+(game['playerStats'][1]['assists']).toString()+'  '+(Math.round(game['playerStats'][1]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][1]['summonerName']">{{ game['playerStats'][1]['summonerName'] }}</a></span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][6]['color'] === 'red', 'blue-team': game['playerStats'][6]['color'] === 'blue' }" v-bind:title="(game['playerStats'][6]['summonerName']+': '+game['playerStats'][6]['kills']).toString()+' / '+(game['playerStats'][6]['deaths']).toString()+' / '+(game['playerStats'][6]['assists']).toString()+'  '+(Math.round(game['playerStats'][6]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][6]['summonerName']">{{ game['playerStats'][6]['summonerName']  }}</a></span>
              <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][2]['color'] === 'red', 'blue-team': game['playerStats'][2]['color'] === 'blue' }" v-bind:title="(game['playerStats'][2]['summonerName']+': '+game['playerStats'][2]['kills']).toString()+' / '+(game['playerStats'][2]['deaths']).toString()+' / '+(game['playerStats'][2]['assists']).toString()+'  '+(Math.round(game['playerStats'][2]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][2]['summonerName']">{{ game['playerStats'][2]['summonerName'] }}</a></span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][7]['color'] === 'red', 'blue-team': game['playerStats'][7]['color'] === 'blue' }" v-bind:title="(game['playerStats'][7]['summonerName']+': '+game['playerStats'][7]['kills']).toString()+' / '+(game['playerStats'][7]['deaths']).toString()+' / '+(game['playerStats'][7]['assists']).toString()+'  '+(Math.round(game['playerStats'][7]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][7]['summonerName']">{{ game['playerStats'][7]['summonerName']  }}</a></span>
              <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][3]['color'] === 'red', 'blue-team': game['playerStats'][3]['color'] === 'blue' }" v-bind:title="(game['playerStats'][3]['summonerName']+': '+game['playerStats'][3]['kills']).toString()+' / '+(game['playerStats'][3]['deaths']).toString()+' / '+(game['playerStats'][3]['assists']).toString()+'  '+(Math.round(game['playerStats'][3]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][3]['summonerName']">{{ game['playerStats'][3]['summonerName'] }}</a></span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][8]['color'] === 'red', 'blue-team': game['playerStats'][8]['color'] === 'blue' }" v-bind:title="(game['playerStats'][8]['summonerName']+': '+game['playerStats'][8]['kills']).toString()+' / '+(game['playerStats'][8]['deaths']).toString()+' / '+(game['playerStats'][8]['assists']).toString()+'  '+(Math.round(game['playerStats'][8]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][8]['summonerName']">{{ game['playerStats'][8]['summonerName']  }}</a></span>
              <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][4]['color'] === 'red', 'blue-team': game['playerStats'][4]['color'] === 'blue' }" v-bind:title="(game['playerStats'][4]['summonerName']+': '+game['playerStats'][4]['kills']).toString()+' / '+(game['playerStats'][4]['deaths']).toString()+' / '+(game['playerStats'][4]['assists']).toString()+'  '+(Math.round(game['playerStats'][4]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][4]['summonerName']">{{ game['playerStats'][4]['summonerName'] }}</a></span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][9]['color'] === 'red', 'blue-team': game['playerStats'][9]['color'] === 'blue' }" v-bind:title="(game['playerStats'][9]['summonerName']+': '+game['playerStats'][9]['kills']).toString()+' / '+(game['playerStats'][9]['deaths']).toString()+' / '+(game['playerStats'][9]['assists']).toString()+'  '+(Math.round(game['playerStats'][9]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> <a v-bind:href="'/?summoner='+game['playerStats'][9]['summonerName']">{{ game['playerStats'][9]['summonerName']  }}</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <divmodal name="progress-window">
      <p v-for="msg in progressMessages"> {{ msg }} </p>
    </divmodal>
    <divmodal name="error-window" class="plain">
      <div>
      <button @click="$modal.hide('error-window')" style="position: absolute; top: 10px; right: 10px;">
        ❌
      </button>
      Error: {{ errorMessage }}
    </div>
    </divmodal>
  </div>
</template>

<script>
  import Axios from 'axios';
  import Vue from 'vue';
  import VModal from 'vue-js-modal';
  Vue.use(VModal, { componentName: 'divmodal' })
  let AxiosCouldBeNotFound = Axios.create({
    // Override what is considered a success - changes what results get thrown
    // We expect that a summoner-by-name and the summoner-games-played could be 404 Not Found
    validateStatus: function (status) {
      return status >= 200 && status < 500; // In addition to 200 level status codes, allow 300 and 400 level status codes to be considered successes (so we can handle them in context with a good error message)
    },
  });

  export default {
    name: 'app',
    data() {
      return {
        MAX_PARTICIPANTS: 10,
        summonerName: '',
        champions: {},
        items: {},
        spells: {},
        games: [],
        progressMessages: [],
        errorMessage: ''
      }
    },
    mounted() {
      let urlSummonerName = location.search.split('summoner=')[1];
      if (urlSummonerName) {
        this.summonerName = decodeURI(urlSummonerName); // Translate %20's in URL

        let self = this;  // Preserve 'this' after asynchronous call - if later we use an arrow function for .then we won't need 'self' anymore because arrow functions have lexical scope for 'this'

        Vue.nextTick()
        .then(function () {
          // DOM updated
          self.lookup();
        });
      }
    },
    methods: {
      lookup() {
        // Future upgrade: detect when a new request is made before the old request is finished (i.e. by clicking twice or when the old request is slow)
        // See cancellable Axios requests at: https://github.com/axios/axios#cancellation

        // Don't bother looking up blank names
        if (this.summonerName.trim() === '')
          return

        this.errorMessage = '';
        this.progressMessages = [];
        this.games = [];
        this.progressMessages.splice(0, 0, 'Looking up LOL static data...');
        this.$modal.show('progress-window');

        history.replaceState(null, null, location.origin+'?summoner='+this.summonerName);
        document.title = 'LOL Stats for '+this.summonerName;

        let self = this;  // Preserve 'this' after asynchronous call - if later we use an arrow function for .then we won't need 'self' anymore because arrow functions have lexical scope for 'this'

        // Lookup champions, items, spells
        Promise.all([Axios.get(location.origin+'/lookupChampions'),
                     Axios.get(location.origin+'/lookupItems'),
                     Axios.get(location.origin+'/lookupSpells')
        ])
        .then(function(response) {
          for (let i=0; i<3; i++) {
            if (typeof response[i].data !== 'object') {
              let responseObj = JSON.parse(response[0].data);
              let errorMsg = 'Server returned ' + (('status' in responseObj) ? responseObj['status']['status_code']+' '+responseObj['status']['message'] : 'unknown');
              return Promise.reject(errorMsg);
            }
          }
          let champions = response[0].data['data'];

          // Create champions lookup by champion ID
          for (let championName in champions){
            let championId = champions[championName]['id'];
            let championTitle = champions[championName]['title'];
            self.champions[championId] = {'name': championName, 'title': championTitle};
          }

          self.items = response[1].data['data'];
          self.items['0'] = {'name': '-', 'plaintext': '(n/a)'}; // Add in the name of the null item
          self.spells = response[2].data['data'];
          self.spells['0'] = {'name': '-', 'description': '(n/a)'}; // Add in the name of the null spell

          // Lookup summoner
          self.progressMessages.splice(0, 1, 'Looking up summoner...');
          return AxiosCouldBeNotFound.get(location.origin+'/lookupSummoner?summonerName='+self.summonerName)
        })

        // Found summoner
        .then(function(response) {
          if ((typeof response === 'object') && ('status' in response) && (response.status !== 200)) {
            if (response.status === 404)
              return Promise.reject('Summoner '+self.summonerName+' doesn\'t exist');
            else
              return Promise.reject('Server returned '+response.status+' '+response.statusText);
          }

          self.progressMessages.splice(0, 1, self.progressMessages[0]+'found.', 'Looking up games list...');

          let accountId = response.data['accountId'];
          if (accountId === undefined)
            return Promise.reject('summoner "'+self.summonerName+'" does not exist.');
          self.summonerName = response.data['name']; // The name in the data might be slightly different than the name input by the user (upper vs lower case and spaces vs no spaces)
          // Lookup games list
          return AxiosCouldBeNotFound.get(location.origin+'/lookupGames?accountId='+accountId);
        })

        // Found games list
        .then(function(response) {
          if ((typeof response === 'object') && ('status' in response) && (response.status !== 200)) {
            if (response.status === 404)
              return Promise.reject('Summoner '+self.summonerName+' hasn\'t played any games');
            else
              return Promise.reject('Server returned '+response.status+' '+response.statusText);
          }

          let games = response.data['matches'];
          console.assert(games instanceof Array, 'Expected an array of games but got a '+typeof games);
          let gamesLen = games.length;
          self.progressMessages.splice(1, 1, self.progressMessages[1]+'found.', 'Looking up '+gamesLen+' games...');

          let promises = [];
          let gamesFound = 0;
          for (let i=0; i<gamesLen; i++) {
            let gameId = games[i]['gameId'];

            // Lookup one individual game
            promises.push( Axios.get(location.origin+'/lookupGame?gameId='+gameId)
                           .then(function(response) {
                             gamesFound++;
                             self.progressMessages.splice(2, 1, 'Looking up '+gamesLen+' games - '+gamesFound+' found.');
                             return response;
                           })
            );
          }

          return Promise.all(promises);
        })

        // Found individual games
        .then(function(response) {
          self.progressMessages.splice(3, 0, 'Calculating stats...');

          let responseLen = response.length;
          let stats = [];
          for (let i=0; i<responseLen; i++) {
            if (typeof response[i].data !== 'object') {
              let responseObj = JSON.parse(response[i].data);
              let errorMsg = 'Server returned ' + (('status' in responseObj) ? responseObj['status']['status_code']+' '+responseObj['status']['message'] : 'unknown');
              return Promise.reject(errorMsg);
            }

            stats.push(response[i].data);
          }
          self.extractStats(self.summonerName, stats);

          self.$modal.hide('progress-window');
        })
        .catch(function (error) {
          self.$modal.hide('progress-window');
          if (error.response)
            self.errorMessage = error.response.data;
          else if (error.message)
            self.errorMessage = error.message;
          else
            self.errorMessage = error;
          self.$modal.show('error-window');
        });   
      },

      extractStats(summonerName, stats) {
        let gameCount = stats.length;
        for (let gameNo=0; gameNo<gameCount; gameNo++) {
          let teamCount = stats[gameNo]['teams'].length;

          // Determine the team Ids
          let teamIds = [];
          for (let teamNo=0; teamNo<teamCount; teamNo++) {
            teamIds.push(stats[gameNo]['teams'][teamNo]['teamId']);            
          }

          // Determine which player is ours
          let ourParticipantId = -1;
          let ourParticipantNo = -1;
          let participantCount = stats[gameNo]['participantIdentities'].length;
// Not an issue anymore, see call to blankStats() below
//          console.assert(participantCount === 10, 'Number of game participants is '+participantCount+' not 10');
          for (let participantNo=0; participantNo<participantCount; participantNo++) {
            if (stats[gameNo]['participantIdentities'][participantNo]['player']['summonerName'] === summonerName) {
              ourParticipantId = stats[gameNo]['participantIdentities'][participantNo]['participantId'];
              ourParticipantNo = participantNo;
              break;
            }
          }
          console.assert(ourParticipantId !== -1, 'Cant find '+summonerName+' in participants list of game #'+gameNo);

          // Determine which team is ours
          let ourTeamId = -1; // 100, 200, etc
          console.assert(participantCount === stats[gameNo]['participants'].length, 'Two participants lists differ in length of game #'+gameNo);
          for (let participantNo=0; participantNo<participantCount; participantNo++) {
            if (stats[gameNo]['participants'][participantNo]['participantId'] === ourParticipantId) {
              ourTeamId = stats[gameNo]['participants'][participantNo]['teamId'];
              break;
            }
          }
          console.assert(ourTeamId !== -1, 'Cant find our team in participants list of game #'+gameNo);

          let ourTeamNo = teamIds.findIndex(teamId => teamId === ourTeamId);
          console.assert(ourTeamNo !== undefined, 'Cant find our team number in teams list of game #'+gameNo);

          let minutes = stats[gameNo]['gameDuration'] / 60;
          let consolidatedGameStats = { playerStats: [] };
          for (let participantNo=0; participantNo<participantCount; participantNo++) {
            consolidatedGameStats.playerStats.push(this.playerStats(participantNo, stats[gameNo], gameNo, minutes));
          }
          // Fill remaining slots for missing players
          for (let participantNo=participantCount; participantNo<this.MAX_PARTICIPANTS; participantNo++) {
            consolidatedGameStats.playerStats.push(this.blankStats());
          }

          consolidatedGameStats['ourPlayerIndex'] = ourParticipantNo;
          consolidatedGameStats['ourColor'] = (ourTeamId ===  teamIds[0]) ? 'red' : 'blue';
          consolidatedGameStats['ourWin'] = stats[gameNo]['teams'][ourTeamNo]['win'].toUpperCase() === 'WIN';
          consolidatedGameStats['gameDurationSeconds'] = stats[gameNo]['gameDuration'];
          consolidatedGameStats['gameDurationString'] = this.durationString(stats[gameNo]['gameDuration']);

          // Seems that the players are already sorted
          // consolidatedGameStats.playerStats.sort

          this.games.push(consolidatedGameStats);
        }

      },

      playerStats(participantNo, gameStats, gameNo, minutes) {
        // local var participantNo indexes gameStats['participantIdentities']
        // local var participantIndex indexes gameStats['participants']

        // Determine the team Ids
        let teamCount = gameStats['teams'].length;
        let teamIds = [];
        for (let teamNo=0; teamNo<teamCount; teamNo++) {
          teamIds.push(gameStats['teams'][teamNo]['teamId']);            
        }

        // Determine which player is this
        let participantCount = gameStats['participantIdentities'].length;
        let thisParticipantId = gameStats['participantIdentities'][participantNo]['participantId'];
        console.assert(thisParticipantId <= participantCount, 'Participant '+thisParticipantId+' is out of range in game #'+gameNo);

        // Determine which team is this player on
        let thisTeamId = -1; // 100, 200, etc
        let thisParticipantIndex = -1; // 100, 200, etc
        console.assert(participantCount === gameStats['participants'].length, 'Two participants lists differ in length of game #'+gameNo);
        for (let participantIndex=0; participantIndex<participantCount; participantIndex++) {
          if (gameStats['participants'][participantIndex]['participantId'] == thisParticipantId) {
            thisTeamId = gameStats['participants'][participantIndex]['teamId'];
            thisParticipantIndex = participantIndex;
            break;
          }
        }
        console.assert(thisTeamId !== -1, 'Cant find players team in participants list of game #'+gameNo);

        let thisTeamNo = teamIds.findIndex(teamId => teamId === thisTeamId);
        console.assert(thisTeamNo !== undefined, 'Cant find players team number in teams list of game #'+gameNo);

        let participant = gameStats['participants'][thisParticipantIndex];

        return {
          'color': thisTeamId==teamIds[0] ? 'red' : 'blue',
          'win': gameStats['teams'][thisTeamNo]['win'] === 'Win',
          'summonerName': gameStats['participantIdentities'][participantNo]['player']['summonerName'],
          'spell1Id': participant['spell1Id'],
          'spell2Id': participant['spell2Id'],
          'championId': participant['championId'],
          'championName': this.champions[participant['championId']]['name'],
          'kills': participant['stats']['kills'],
          'assists': participant['stats']['assists'],
          'deaths': participant['stats']['deaths'],
          'killDeathRatio': (participant['stats']['kills']+participant['stats']['assists']) / participant['stats']['deaths'],
          'item0Id': participant['stats']['item0'],
          'item1Id': participant['stats']['item1'],
          'item2Id': participant['stats']['item2'],
          'item3Id': participant['stats']['item3'],
          'item4Id': participant['stats']['item4'],
          'item5Id': participant['stats']['item5'],
          'item6Id': participant['stats']['item6'],
          'level': participant['stats']['champLevel'],
          'csScore': participant['stats']['totalMinionsKilled'] + participant['stats']['neutralMinionsKilled'],
          'csScorePerMin': (participant['stats']['totalMinionsKilled'] + participant['stats']['neutralMinionsKilled']) / minutes
        };

      },

      blankStats() {
        return {
          'color': 'none',
          'win': 'none',
          'summonerName': '',
          'spell1Id': '0',
          'spell2Id': '0',
          'championId': 'none',
          'championName': '',
          'kills': 0,
          'assists': 0,
          'deaths': 0,
          'killDeathRatio': 0,
          'item0Id': '0',
          'item1Id': '0',
          'item2Id': '0',
          'item3Id': '0',
          'item4Id': '0',
          'item5Id': '0',
          'item6Id': '0',
          'level': 0,
          'csScore': 0,
          'csScorePerMin': 0
        };
      },

      durationString(seconds) {
        let hours = Math.floor(seconds / (60 * 60));
        let mins = Math.floor(seconds / 60) - (hours * 60 * 60);
        let secs = seconds - (mins * 60) - (hours * 60 * 60);

        return ((hours > 0) ? hours.toString()+':' : '') + ('0'+mins.toString()).slice(-2) + ':' + ('0'+secs.toString()).slice(-2);
      }

    }
  }
</script>

<style lang="css">

  a:link, a:visited {
    color: #000000;
  }

  a:hover, a:active {
    color: #555555;
  }

  #app {
    background-color: #808080;
    font-size: 160%;
  }

  #app input, #app button {
    background-color: #D0D0D0;
  }

  .serif-text {
    color: #56b983;
    font-family: 'Almendra SC', serif;
  }

  .plain-text {
    color: #000000;
    font-family: sans-serif;
  }

  .tiny-text {
    font-size: 66%;
    display: inline-block;
    width: 10vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .box {
    margin-bottom: 0vmin;
    padding: 0.5vmin;
    border-style: solid; 
    border-width: 2px 0 0 0;
  }

  .half-box {
    float: left;
    width: 48vw;
  }

  .quarter-box {
    float: left;
    width: 24vw;
    border-style: solid;
    border-width: 0px;
    border-width: 1px 0 0 0;
  }

  .red-team {
    background-color: #A08080;
  }

  .blue-team {
    background-color: #8080A0;
  }

  .win-team {
    background-color: #D0D0D0;
  }

  .loss-team {
    background-color: #808080;
  }

  @media only screen and (max-width: 1024px) {
    #app {
      background-color: #808080;
      font-size: 240%;
    }

    input, button {
      font-size: 80%;
    }

    .half-box {
      width: 96vw;
    }

    .quarter-box {
      width: 48vw; 
    }

    .tiny-text {
      width: 20vw;
    }
  }

</style>
