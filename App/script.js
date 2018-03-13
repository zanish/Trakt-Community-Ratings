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

	var rottenTomatoesResults = $('<div/>')
	.attr('id', "rottenTomatoesResults")
	.html("Checking Rotten Tomatoes... ");
//append(spinnerGif);
	$(insertSelector).prepend(rottenTomatoesResults);

	var apiUri = 'http://www.omdbapi.com/?tomatoes=true&i=tt';
	var apiParams = getIMDBid();
	var apiKeyParam = "&apikey=2355ec92";

	if(apiParams != null) {
		var apiUrl = apiUri + apiParams + apiKeyParam;
		chrome.runtime.sendMessage({
			method: 'GET',
			action: 'xhttp',
			url: apiUrl,
		}, parseOMDB);
	}
}

function buildTemplate(templateData) {
	//console.log(templateData);
	var html = Handlebars.templates.movie_score(templateData);
	$('#rottenTomatoesResults').html(html);
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
			},function(RTresponse) {
				var data = convertRTResponse(RTresponse);
				//console.log(data);
				buildTemplate(data);
			});
		} else {
			tomatoeUrl = OMResponse.tomatoeUrl;
			rottenTomatoesResults.html("");
			var data = parseValidResponse(OMResponse);
			buildTemplate(data);
		}
	}
}

//Extracts the data from the RT page
function convertRTResponse(RTresponse) {
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

	return parseValidResponse(response);
}

//Adds the data to the panel
function parseValidResponse(response) {
	var templateData = {};
	templateData.tomatoeUrl = tomatoeUrl;

	if (response.tomatoMeter == 'N/A') {
		templateData.criticScore = 'No Score Yet...';
	} else {
		templateData.criticScore = response.tomatoMeter + '%';

		if(response.tomatoImage === "certified")
			templateData.criticBadge = 'certFresh';
		else if(response.tomatoImage === 'fresh')
			templateData.criticBadge = 'fresh';
		else if(response.tomatoImage === 'rotten')
			templateData.criticBadge = 'rotten';
	}

	if(response.tomatoRating !== 'N/A') {
		templateData.avgCriticRating = "Average Rating: " + response.tomatoRating + "/10";
	}

	if(response.tomatoReviews !== 'N/A') {
		templateData.criticReviewCount = "Reviews Counted: " + response.tomatoReviews;
	}

	if(response.tomatoFresh !== 'N/A') {
		templateData.freshReviewCount = "Fresh: " + response.tomatoFresh;
	}

	if(response.tomatoRotten !== 'N/A') {
		templateData.rottenReviewCount = "Rotten: " + response.tomatoRotten;
	}

	if(response.tomatoConsensus !== 'N/A') {
		templateData.consensus = "Consensus: " + response.tomatoConsensus;
	}

	if(response.tomatoUserMeter !== 'N/A') {
		templateData.audienceScore = response.tomatoUserMeter + "%";
		if(response.tomatoUserRating > 3.5) {
			templateData.audiencePopcorn = "popcorn";
		} else {
			templateData.audiencePopcorn = "tipped";
		}
	}

	if(response.tomatoUserRating !== 'N/A') {
		templateData.avgUserRating = "Avg. User Rating: " + response.tomatoUserRating + "/5";
	}

	if(response.tomatoUserReviews !== 'N/A') {
		templateData.userReviewsCount = "User Reviews: " + response.tomatoUserReviews;
	}

	return templateData;
}

//gets the imdb number used for OMDB lookup
function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})/;
	id = regexImdbNum.exec(document.getElementsByTagName('html')[0].innerHTML);
	if(id == null)
		return null;
	return id[1];
}
