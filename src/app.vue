<template>
  <div id="app">
    <div class="box">
      <span class="serif-text">Summoner name:</span> <input v-model="summonerName" v-on:keyup.enter="lookup" placeholder="e.g. BFY Meowington">
      <button @click="lookup">Go</button>
    </div>
    <div v-for="game in games">
      <div class="box small-text" v-bind:class="{ 'win-team': game['playerStats'][game['ourPlayerIndex']]['win'], 'loss-team': !game['playerStats'][game['ourPlayerIndex']]['win'] }">
        <div>
          <span class="serif-text">{{ game['playerStats'][game['ourPlayerIndex']]['summonerName'] }}</span>
          controls
          <span class="serif-text">{{ game['playerStats'][game['ourPlayerIndex']]['championName'] }}</span>
          to a
          {{ game['playerStats'][game['ourPlayerIndex']]['win'] ? 'Glorious Victory!' : 'loss.' }}
        </div>
        <div class="small-text" style="overflow: hidden">
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
          <div class="quarter-box">
            <span class="small-text">Items purchased:</span>
            <br /><img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item0Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item0Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item0Id']]['name'] : '(n/a)' }}</span> <img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item4Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item4Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item4Id']]['name'] : '(n/a)' }}</span>
            <br /><img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item1Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item1Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item1Id']]['name'] : '(n/a)' }}</span> <img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item5Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item5Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item5Id']]['name'] : '(n/a)' }}</span>
            <br /><img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item2Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item2Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item2Id']]['name'] : '(n/a)' }}</span> <img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item6Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item6Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item6Id']]['name'] : '(n/a)' }}</span>
            <br /><img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="items[game['playerStats'][game['ourPlayerIndex']]['item3Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['name']+' - '+items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['plaintext'] : '(n/a)'">{{ items[game['playerStats'][game['ourPlayerIndex']]['item3Id']] ? items[game['playerStats'][game['ourPlayerIndex']]['item3Id']]['name'] : '(n/a)' }}</span>
            <br /><span class="small-text">Spells:</span>
            <br /><img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['name']+' - '+spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['description']">{{ spells[game['playerStats'][game['ourPlayerIndex']]['spell1Id']]['name'] }}</span> <img src="icon.png" width="16" height="16"> <span class="tiny-text" v-bind:title="spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['name']+' - '+spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['description']">{{ spells[game['playerStats'][game['ourPlayerIndex']]['spell2Id']]['name'] }}</span>
          </div>
          <div class="quarter-box">
            <span class="small-text">Teams:</span>
            <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][0]['color'] === 'red', 'blue-team': game['playerStats'][0]['color'] === 'blue' }" v-bind:title="(game['playerStats'][0]['summonerName']+': '+game['playerStats'][0]['kills']).toString()+' / '+(game['playerStats'][0]['deaths']).toString()+' / '+(game['playerStats'][0]['assists']).toString()+'  '+(Math.round(game['playerStats'][0]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> {{ game['playerStats'][0]['summonerName'] }}</span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][5]['color'] === 'red', 'blue-team': game['playerStats'][5]['color'] === 'blue' }" v-bind:title="(game['playerStats'][5]['summonerName']+': '+game['playerStats'][5]['kills']).toString()+' / '+(game['playerStats'][5]['deaths']).toString()+' / '+(game['playerStats'][5]['assists']).toString()+'  '+(Math.round(game['playerStats'][5]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16">{{  game['playerStats'][5]['summonerName']  }}</span>
            <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][1]['color'] === 'red', 'blue-team': game['playerStats'][1]['color'] === 'blue' }" v-bind:title="(game['playerStats'][1]['summonerName']+': '+game['playerStats'][1]['kills']).toString()+' / '+(game['playerStats'][1]['deaths']).toString()+' / '+(game['playerStats'][1]['assists']).toString()+'  '+(Math.round(game['playerStats'][1]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> {{ game['playerStats'][1]['summonerName'] }}</span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][6]['color'] === 'red', 'blue-team': game['playerStats'][6]['color'] === 'blue' }" v-bind:title="(game['playerStats'][6]['summonerName']+': '+game['playerStats'][6]['kills']).toString()+' / '+(game['playerStats'][6]['deaths']).toString()+' / '+(game['playerStats'][6]['assists']).toString()+'  '+(Math.round(game['playerStats'][6]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16">{{  game['playerStats'][6]['summonerName']  }}</span>
            <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][2]['color'] === 'red', 'blue-team': game['playerStats'][2]['color'] === 'blue' }" v-bind:title="(game['playerStats'][2]['summonerName']+': '+game['playerStats'][2]['kills']).toString()+' / '+(game['playerStats'][2]['deaths']).toString()+' / '+(game['playerStats'][2]['assists']).toString()+'  '+(Math.round(game['playerStats'][2]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> {{ game['playerStats'][2]['summonerName'] }}</span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][7]['color'] === 'red', 'blue-team': game['playerStats'][7]['color'] === 'blue' }" v-bind:title="(game['playerStats'][7]['summonerName']+': '+game['playerStats'][7]['kills']).toString()+' / '+(game['playerStats'][7]['deaths']).toString()+' / '+(game['playerStats'][7]['assists']).toString()+'  '+(Math.round(game['playerStats'][7]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16">{{  game['playerStats'][7]['summonerName']  }}</span>
            <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][3]['color'] === 'red', 'blue-team': game['playerStats'][3]['color'] === 'blue' }" v-bind:title="(game['playerStats'][3]['summonerName']+': '+game['playerStats'][3]['kills']).toString()+' / '+(game['playerStats'][3]['deaths']).toString()+' / '+(game['playerStats'][3]['assists']).toString()+'  '+(Math.round(game['playerStats'][3]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> {{ game['playerStats'][3]['summonerName'] }}</span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][8]['color'] === 'red', 'blue-team': game['playerStats'][8]['color'] === 'blue' }" v-bind:title="(game['playerStats'][8]['summonerName']+': '+game['playerStats'][8]['kills']).toString()+' / '+(game['playerStats'][8]['deaths']).toString()+' / '+(game['playerStats'][8]['assists']).toString()+'  '+(Math.round(game['playerStats'][8]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16">{{  game['playerStats'][8]['summonerName']  }}</span>
            <br /><span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][4]['color'] === 'red', 'blue-team': game['playerStats'][4]['color'] === 'blue' }" v-bind:title="(game['playerStats'][4]['summonerName']+': '+game['playerStats'][4]['kills']).toString()+' / '+(game['playerStats'][4]['deaths']).toString()+' / '+(game['playerStats'][4]['assists']).toString()+'  '+(Math.round(game['playerStats'][4]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16"> {{ game['playerStats'][4]['summonerName'] }}</span> <span class="tiny-text" v-bind:class="{ 'red-team': game['playerStats'][9]['color'] === 'red', 'blue-team': game['playerStats'][9]['color'] === 'blue' }" v-bind:title="(game['playerStats'][9]['summonerName']+': '+game['playerStats'][9]['kills']).toString()+' / '+(game['playerStats'][9]['deaths']).toString()+' / '+(game['playerStats'][9]['assists']).toString()+'  '+(Math.round(game['playerStats'][9]['killDeathRatio'] * 100) / 100)+':1 KDA'"><img src="icon.png" width="16" height="16">{{  game['playerStats'][9]['summonerName']  }}</span>
          </div>
        </div>
      </div>
    </div>

    <divmodal name="progress-window">
      <p v-for="msg in progressMessages"> {{ msg }} </p>
    </divmodal>
    <divmodal name="error-window" class="plain" style="left:-1000">
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

  export default {
    name: 'app',
    data() {
      return {
        summonerName: 'BFY Meowington',
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
        this.errorMessage = '';
        this.progressMessages = [];
        this.games = [];
        this.progressMessages.splice(0, 0, 'Looking up champions...');
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
          let champions = JSON.parse(response[0].data)['data'];

          // Create champions lookup by champion ID
          for (let championName in champions){
            let championId = champions[championName]['id'];
            let championTitle = champions[championName]['title'];
            self.champions[championId] = {'name': championName, 'title': championTitle};
          }

          self.items = JSON.parse(response[1].data)['data'];
          self.items['0'] = {'name': '-', 'plaintext': '(n/a)'}; // Add in the name of the null item
          self.spells = JSON.parse(response[2].data)['data'];

          // Lookup summoner
          self.progressMessages.splice(0, 1, 'Looking up summoner...');
          return Axios.get(location.origin+'/lookupSummoner?summonerName='+self.summonerName)
        })

        // Found summoner
        .then(function(response) {
          self.progressMessages.splice(0, 1, self.progressMessages[0]+'found.', 'Looking up games list...');

          let responseObj = JSON.parse(response.data);
          let accountId = responseObj['accountId'];


          // Lookup games list
          return Axios.get(location.origin+'/lookupGames?accountId='+accountId);
        })

        // Found games list
        .then(function(response) {
          let responseObj = JSON.parse(response.data);
          let games = responseObj['matches'];
          console.assert(games instanceof Array, 'Expected an array of games but got a '+typeof games);
          let gamesLen = games.length;
          self.progressMessages.splice(1, 1, self.progressMessages[1]+'found.', 'Looking up '+gamesLen+' individual games...');

          let promises = [];
          let gamesFound = 0;
          for (let i=0; i<gamesLen; i++) {
            let gameId = games[i]['gameId'];

            // Lookup one individual game
            promises.push( Axios.get(location.origin+'/lookupGame?gameId='+gameId)
                           .then(function(response) {
                             gamesFound++;
                             self.progressMessages.splice(2, 1, 'Looking up '+gamesLen+' individual games - '+gamesFound+' found.');
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
            let statsString = response[i].data;
            stats.push(JSON.parse(statsString));
          }
          self.displayStats(self.summonerName, stats);

          self.$modal.hide('progress-window');
        })
        .catch(function (error) {
          self.$modal.hide('progress-window');
          self.errorMessage = error['message'];
          self.$modal.show('error-window');
        });   
      },

      displayStats(summonerName, stats) {
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
          for (let participantNo=0; participantNo<participantCount; participantNo++) {
            if (stats[gameNo]['participantIdentities'][participantNo]['player']['summonerName'].toUpperCase() === summonerName.toUpperCase()) {
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

        // participantNo indexes gameStats['participantIdentities']
        // participantIndexes indexes gameStats['participants']

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

  .large-text, .large-text input {
    font-size: 200%;
  }

  .small-text {
    font-size: 80%;
  }

  .tiny-text {
    font-size: 66%;
    display: inline-block;
    width: 80px;
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

  .quarter-box {
    float: left; 
    width: 24%; 
    min-width: 250px;
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
</style>
