//I'm lazy and don't want to find a proper way to pass this right now.
var tomatoeUrl = "";
//Jquery was being called before it was loaded so waiting till DOM content is done to bind the listener
document.addEventListener("DOMContentLoaded", function(){
  //Trakt uses turbolinks so we want to get render and load to cover the page being loaded directly
  //and also it being navigated to. Debounce to stop loading 2 panels
  $(document).on('turbolinks:render turbolinks:load', debounce(getRTFromImdbId, 500, true));
})

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

//Validates a movie url and tries to get the OMDB data and RT data
function getRTFromImdbId() {

  url = window.location.href;
  if(url.includes("shows") || url.includes("movies/trending") || url.includes("movies/popular")
      || url.includes("movies/watched") || url.includes("movies/collected")
      || url.includes("movies/anticipated") || url.includes("movies/anticipated")
      || url.includes("dashboard") || url.includes("calendars") || url.includes("discover")
      || url.includes("apps") || url.includes("vip") || url.includes("users")) {
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
  var apiKeyParam = "&apikey=2355ec92";

  if(apiParams != null)
  {
    var apiUrl = apiUri + apiParams + apiKeyParam;
    chrome.runtime.sendMessage({
      method: 'GET',
      action: 'xhttp',
      url: apiUrl,
    },parseOMDB);
  }
}

//Load data from omdb and use it to get the RT data
function parseOMDB(OMResponse) {
  var rottenTomatoesResults = $('#rottenTomatoesResults');
  OMResponse = JSON.parse(OMResponse);
  if (OMResponse.hasOwnProperty('Error')) {
    rottenTomatoesResults.html('My apologies OMDB has gone private. I am working on a fix, thank you for your patience.');
  } else {
    if(OMResponse.tomatoURL !== "N/A") {
      rottenTomatoesResults.html("");
      OMResponse.tomatoURL = OMResponse.tomatoURL.replace(/^http:\/\//i, 'https://');
      tomatoeUrl = OMResponse.tomatoURL;
      chrome.runtime.sendMessage({
        method: 'GET',
        action: 'ajax',
        url: OMResponse.tomatoURL,
      },formatResponse);
    } else {
      //TODO: find better check
      tomatoeUrl = OMResponse.tomatoeUrl;
      rottenTomatoesResults.html("");
      parseValidResponse(OMResponse);
    }
  }
}

//Extracts the data from the RT page
function formatResponse(RTresponse) {
  response = {};
  //console.log(tomatoeUrl);
  response.tomatoMeter = $(RTresponse).find('div.critic-score #tomato_meter_link span.meter-value span').html();
  let imageClassStr = $(RTresponse).find('div.critic-score #tomato_meter_link span.meter-tomato')[0].classList;
  if(imageClassStr.contains("certified_fresh")) {
    response.tomatoImage = "certified";
  } else if (imageClassStr.contains('rotten')) {
    response.tomatoImage = "rotten";
  } else if (imageClassStr.contains('fresh')) {
    response.tomatoImage = "fresh";
  }

  let averageRating = $(RTresponse).find('div#all-critics-numbers div#scoreStats').children()[0];
  $(averageRating).find('span').remove();
  response.tomatoRating = parseFloat($(averageRating).text());
  let reviewCount = $(RTresponse).find('div#all-critics-numbers div#scoreStats').children()[1];
  response.tomatoReviews = $($(reviewCount).find('span')[1]).text().trim();
  let freshCount = $(RTresponse).find('div#all-critics-numbers div#scoreStats').children()[2];
  response.tomatoFresh = $($(freshCount).find('span')[1]).text().trim();
  let rottenCount = $(RTresponse).find('div#all-critics-numbers div#scoreStats').children()[3];
  response.tomatoRotten = $($(rottenCount).find('span')[1]).text().trim();

  let consensus = $(RTresponse).find("div#all-critics-numbers p.critic_consensus");
  $(consensus).find('span').remove();
  response.tomatoConsensus = $(consensus).text().trim();

  let userMeter = $(RTresponse).find("div#scorePanel div.audience-score div.meter-value span");
  response.tomatoUserMeter = parseInt($(userMeter).text());

  let userRating = $(RTresponse).find('div#scorePanel div.audience-info').children()[0];
  $(userRating).find('span').remove();
  response.tomatoUserRating = parseFloat($(userRating).text());

  let userReviews = $(RTresponse).find('div#scorePanel div.audience-info').children()[1];
  $(userReviews).find('span').remove();
  response.tomatoUserReviews = $(userReviews).text().trim();

  parseValidResponse(response);
}

//Adds the data to the panel
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
    .attr('href', tomatoeUrl)
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

//gets the imdb number used for OMDB lookup
function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})/;
	id = regexImdbNum.exec(document.getElementsByTagName('html')[0].innerHTML);
	if(id == null)
		return null;
	return id[1];
}
