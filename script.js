document.addEventListener("turbolinks:render", function(){
  console.log("working");
  //TODO: check the url
  //TODO: if movie get the info
  getRTFromImdbId();
})

function getRTFromImdbId() {
  var insertSelector = "div#huckster-desktop-wrapper";
  var labelHtml = 'Rotten Tomatoes:';

  if ($('table.probody').length > 0) {
    insertSelector = "table.probody";
  }

  if ($('#tn15').length > 0) {
    insertSelector = "div.info:first";
  }

  if ($('.plot_summary_wrapper').length > 0) {
    insertSelector = ".plot_summary_wrapper";
  }

  var rottenTomatoesResults = $('<div/>').
    attr('id', "rottenTomatoesResults").
    html("Checking Rotten Tomatoes... ");
    //append(spinnerGif);
  $(insertSelector).append(rottenTomatoesResults);

  var apiUrl = 'http://www.omdbapi.com/?tomatoes=true&i=tt'+getIMDBid();

  if(apiUrl != null)
  {
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
	var tomatoMeterScoreImage = '';
	if (response.tomatoMeter == 'N/A') {
		tomatoMeterScoreText = 'No Score Yet...';
		tomatoMeterScoreClass = ' noScore';
	} else {
		tomatoMeterScoreClass = '';
		tomatoMeterScoreText = response.tomatoMeter + '%';

		tomatoMeterScoreImage = $('<div/>').
			attr('class', 'rtIcon ' + response.tomatoImage).
			attr('title', response.tomatoImage + ' - ' + tomatoMeterScoreText);
	}

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
}

function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})/;
	id = regexImdbNum.exec(document.getElementsByTagName('html')[0].innerHTML);
	if(id == null)
		return null;
	return id[1];
}
