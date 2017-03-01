document.addEventListener("turbolinks:render", function(){
  console.log("working");
  //TODO: check the url
  //TODO: if movie get the info
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
        parseValidResponse(response);
      }
    });
  }
}

function parseValidResponse(response) {
	var rottenResults = $('#rottenTomatoesResults');

	// add tomato-meter score and icon
	var scorePanel = null;
  var scoreText = "";

	if (response.tomatoMeter == 'N/A') {
		scoreText = 'No Score Yet...';
	} else {
		scoreText = response.tomatoMeter + '%';

		scorePanel = $('<div/>')
			.attr('class', 'scorePanel')
      .attr('class', 'col-sm-16')
      .attr('class', 'col-xs-12');

    var tmeterPanel = $('<div/>')
      .attr('class', 'tmeterPanel');

    var scoreSpan = $('<span/>')
      .attr('class', "scoreSpan")
      .text(scoreText);

    var tomatoLink = $('<a/>')
      .attr('href', response.tomatoURL)
      .attr('class', 'tomatoLink')
      .append(scoreSpan);

    tmeterPanel.append(tomatoLink);
	}

  var statsPanel = $('<div/>')
    .attr('class', 'statsPanel');

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

  tmeterPanel.append(statsPanel);

    scorePanel.append(tmeterPanel);
    rottenResults.append(scorePanel);
/*
	var tomatoMeterScore = $('<span/>').
		attr('id', 'rottenTomatoesTomatoMeterScore').
		text(tomatoMeterScoreText);

	var tomatoMeter = $('<a/>').
		attr('href', response.tomatoURL).
		attr('id', 'rottenTomatoesTomatoMeterScore').
		addClass('floater' + tomatoMeterScoreClass).
		html('<p class="rt-credits">Rotten Tomatoes® Score</p>') .
		append(tomatoMeterScoreImage) .
		append(tomatoMeterScoreText);

	rottenResults.html(tomatoMeter);

	if (showAudience) {
		var audienceRatingImageClass = 'spilled';
		var audienceRatingText = 'Spilled';
		var audienceRatingLabel = 'Liked It';
		var audienceRatingText = '';

		if (response.tomatoUserMeter == 'N/A') {
			audienceRatingImageClass = 'wts';
			audienceRatingText = 'No Audience Rating Yet';
			audienceRatingLabel = 'Want To See It';
		} else {
			audienceRatingText = response.tomatoUserMeter + '%';

			var userRating = parseInt(response.tomatoUserMeter);
			if (userRating >= 60) {
				audienceRatingImageClass = 'upright';
			};
		}

		audienceScoreImage = $('<div/>').
			attr('class', 'rtIcon ' + audienceRatingImageClass).
			attr('title', audienceRatingLabel);

			rottenResults.append(
			$('<a/>').
				attr('href', response.tomatoURL).
				attr('id', 'rottenTomatoesAudience').
				addClass('floater').
				html('<p class="rt-credits">Audience</p>') .
				append(audienceScoreImage).
				append(audienceRatingText)
		);

	}

	if (showAverageRating) {
		averageRating = response.tomatoRating + '/10';
		if (response.tomatoRating == 'N/A') {
			averageRating = response.tomatoRating;
		};
		rottenResults.append(
			$('<p/>').
				attr('id', 'rottenTomatoesAverage').
				addClass('rottenClear').
				html('<b>Critics Average</b> : ' + averageRating)
		);
	}

	if (showAudienceAverageRating) {
		averageAudienceRating = response.tomatoUserRating + '/5';
		if (response.tomatoUserRating == 'N/A') {
			averageAudienceRating = response.tomatoUserRating;
		};
		rottenResults.append(
			$('<div/>').
				attr('id', 'rottenTomatoesAudienceAverage').
				addClass('rottenClear').
				html('<b>Audience Average</b> : ' + averageAudienceRating)
		);
	}

	if (showReviewCount) {
		reviewText = '<b>Reviews</b> : ' + response.tomatoReviews;
		if (showFreshReviewCount || showRottenReviewCount) {
			reviewText = reviewText + ' (';
			if (showFreshReviewCount) {
				reviewText = reviewText + response.tomatoFresh + '&nbsp;Fresh';
			}

			if (showRottenReviewCount) {
				if (showFreshReviewCount) {
					reviewText = reviewText + ', ';
				}
				reviewText = reviewText + response.tomatoRotten + '&nbsp;Rotten';
			}
			reviewText = reviewText + ')';
		}

		rottenResults.append(
			$('<p/>').
				attr('id', 'rottenTomatoesReviewCount').
				html(reviewText)
		);
	}

	if (showConsensus) {
		rottenResults.append(
			$('<div/>').
				attr('id', 'rottenTomatoesConsensus').
				addClass('rottenClear').
				html('<b>Consensus</b> : ' + response.tomatoConsensus)
		);
	}

	rottenResults.append(
		$('<div/>').
			addClass("rottenClear").
			html("&nbsp;")
	);
  */
}

function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})/;
	id = regexImdbNum.exec(document.getElementsByTagName('html')[0].innerHTML);
	if(id == null)
		return null;
	return id[1];
}
