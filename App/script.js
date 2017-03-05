document.addEventListener("turbolinks:render", function(){
  console.log("working");
  //TODO: check the url
  //TODO: if movie get the info
  getRTFromImdbId();
});
document.addEventListener("pageload", function(){
  getRTFromImdbId();
})

function getRTFromImdbId() {
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
      console.log(response);
      response = JSON.parse(response);
      if (response.hasOwnProperty('Error')) {
        rottenTomatoesResults.html('Got error from OMDB: "' + response.Error + '"');
      } else {
        rottenTomatoesResults.html("");
        parseValidResponse(response);
      }
    });
  }
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
