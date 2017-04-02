document.addEventListener("turbolinks:render", function(){
  console.log("render");
  //TODO: check the url
  //TODO: if movie get the info
  getRTFromImdbId();
});
document.addEventListener("turbolinks:load", function(){
  console.log("load");
  getRTFromImdbId();
})

function getRTFromImdbId() {

  url = window.location.href;
  if(url.includes("shows") || url.includes("movies/trending") || url.includes("movies/popular")
      || url.includes("movies/watched") || url.includes("movies/collected")
      || url.includes("movies/anticipated") || url.includes("movies/anticipated")
      || url.includes("dashboard") || url.includes("calendars") || url.includes("discover")
      || url.includes("apps") || url.includes("vip") || url.includes("users")) {
        console.log("skipped");
        return;
      }


  var insertSelector = "div.affiliate-links";
  var labelHtml = 'Rotten Tomatoes:';

  var rottenTomatoesResults = $('<div/>').
    attr('id', "rottenTomatoesResults").
    html("Checking Rotten Tomatoes... ");
    //append(spinnerGif);
  $(insertSelector).prepend(rottenTomatoesResults);

  var apiUri = 'http://www.omdbapi.com/?tomatoes=true&i=tt';
  var apiParams = getIMDBid();

  if(apiUri != null)
  {
    var apiUrl = apiUri + apiParams;
    chrome.runtime.sendMessage({
      method: 'GET',
      action: 'xhttp',
      url: apiUrl,
    }, function(response){
      console.log("OMDB: " + response);
      response = JSON.parse(response);
      if (response.hasOwnProperty('Error')) {
        rottenTomatoesResults.html('Got error from OMDB: "' + response.Error + '"');
      } else {
        if(response.tomatoURL !== "N/A") {
          //TODO: make ajax call
          console.log("call RT");
          chrome.runtime.sendMessage({
            method: 'GET',
            action: 'ajax',
            url: response.tomatoURL,
          },function(response2) {
            console.log("in func");
            parseValidResponse(formatResponse(response2));
          });
          //TODO: format a response object
        }
        else {
          //TODO: find better check
          rottenTomatoesResults.html("");
          parseValidResponse(response);
        }
      }
    });
  }
  running = false;
}

function formatResponse(RTresponse) {
  console.log("RT: " + JSON.stringify(RTresponse, null, 4));
  response = {};
  return RTresponse;
}

function parseValidResponse(response) {
	var rottenResults = $('#rottenTomatoesResults');

	// add tomato-meter score and icon
  var scoreText = "";
  var statsPanel = $('<div/>')
    .attr('class', 'statsPanel');
  var criticPanel = $('<div/>')
    .attr('class', 'criticPanel');
  var tmeterPanel = $('<div/>')
    .attr('class', 'tmeterPanel');
  var scoreSpan = $('<span/>')
    .attr('class', "scoreSpan");
  var tomatoLink = $('<a/>')
    .attr('href', response.tomatoURL)
    .attr('class', 'tomatoLink');
  var scorePanel = $('<div/>')
    .attr('class', 'scorePanel')
    .attr('class', 'col-sm-16')
    .attr('class', 'col-xs-12');
  var numberPanel = $('<div/>')
    .attr('class', 'numberPanel');
  var audiencePanel = $('<div/>')
    .attr('class', 'audiencePanel');
  var audienceSpan = $('<span/>')
    .attr('class', 'scoreSpan');
  var audienceStats = $('<div/>')
    .attr('class', 'statsPanel');
  var scoreWrapperDiv = $('<div/>')
    .addClass('rtIcon');
  var iconDiv = $('<div/>')
    .addClass('rtIcon');
  var audienceWrapperDiv = $('<div/>')
    .addClass('rtIcon');
  var popcornDiv = $('<div/>')
    .addClass('rtIcon');

	if (response.tomatoMeter == 'N/A') {
		scoreText = 'No Score Yet...';
    scoreSpan.text(scoreText);
    tomatoLink.append(scoreSpan);
    scoreWrapperDiv.append(tomatoLink);
    numberPanel.append(scoreWrapperDiv);
	} else {
		scoreText = response.tomatoMeter + '%';

    if(response.tomatoImage === "certified")
      iconDiv.addClass('certFresh');
    else if(response.tomatoImage === 'fresh')
      iconDiv.addClass('fresh');
    else if(response.tomatoImage === 'rotten')
      iconDiv.addClass('rotten');

    scoreSpan.text(scoreText);
    tomatoLink.append(scoreSpan);

    scoreWrapperDiv.append(iconDiv);
    scoreWrapperDiv.append(tomatoLink);

    numberPanel.append(scoreWrapperDiv);
	}

  if(response.tomatoRating !== 'N/A') {
    var avgRating = $('<span/>')
      .attr('class', 'statsSpan')
      .text("Average Rating: " + response.tomatoRating + "/10");

    statsPanel.append($('<div/>').append(avgRating));
  }

  if(response.tomatoReviews !== 'N/A') {
    var numReviews = $('<span/>')
      .attr('class', 'statsSpan')
      .text("Reviews Counted: " + response.tomatoReviews);

    statsPanel.append($('<div/>').append(numReviews));
  }

  if(response.tomatoFresh !== 'N/A') {
    var numFresh = $('<span/>')
      .attr('class', 'tabbedStatsSpan')
      .text("Fresh: " + response.tomatoFresh);

    statsPanel.append($('<div/>').append(numFresh));
  }

  if(response.tomatoRotten !== 'N/A') {
    var numRotten = $('<span/>')
      .attr('class', 'tabbedStatsSpan')
      .text("Rotten: " + response.tomatoRotten);

    statsPanel.append($('<div/>').append(numRotten));
  }

  if(response.tomatoConsensus !== 'N/A') {
    var consensus = $('<span/>')
      .attr('class', 'consensus')
      .text("Consensus: " + response.tomatoConsensus);

    criticPanel.append(consensus);
  }

  if(response.tomatoUserMeter !== 'N/A') {
    audienceSpan.text(response.tomatoUserMeter + "%");

    if(response.tomatoUserRating > 3.5) {
      popcornDiv.addClass('popcorn');
    }
    else {
      popcornDiv.addClass('tipped');
    }

    audienceWrapperDiv.append(popcornDiv);
    audienceWrapperDiv.append(audienceSpan);
    audiencePanel.append(audienceWrapperDiv);
  }

  if(response.tomatoUserRating !== 'N/A') {
    var audienceRating = $('<span/>')
      .attr('class', 'statsSpan')
      .text("Avg. User Rating: " + response.tomatoUserRating + "/5");

    audienceStats.append($('<div/>').append(audienceRating));
  }

  if(response.tomatoUserReviews !== 'N/A') {
    var audienceReviews = $('<span/>')
      .attr('class', 'statsSpan')
      .text("User Reviews: " + response.tomatoUserReviews);

    audienceStats.append($('<div/>').append(audienceReviews));
  }

  audiencePanel.append(audienceStats);
  numberPanel.append(statsPanel);
  tmeterPanel.append(numberPanel);
  tmeterPanel.append(criticPanel);

  scorePanel.append(tmeterPanel);
  scorePanel.append(audiencePanel);
  rottenResults.append(scorePanel);
}

function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})/;
	id = regexImdbNum.exec(document.getElementsByTagName('html')[0].innerHTML);
	if(id == null)
		return null;
	return id[1];
}
